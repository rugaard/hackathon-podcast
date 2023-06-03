export class Spreaker
{
    /**
     * API base URL.
     *
     * @readonly
     * @protected
     * @var { string }
     */
    protected readonly baseUrl: string = 'https:/api.spreaker.com/v2';

    /**
     * Spreaker constructor.
     *
     * @param brand { string }
     */
    constructor(protected readonly brand: string) {
      //
    }

    /**
     * Get a specific show.
     *
     * @param showId { number }
     * @returns { Promise<Show> }
     */
    public show = async (showId: number): Promise<Show> => {
        const data = (await this.request('GET', '/shows/' + showId))['show'];
        return {
          id: data.show_id,
          title: data.title,
          language: data.language,
          description: {
            text: data.description,
            html: data.description_html || data.description || undefined,
          },
          image: {
            url: data.image_url,
            original: data.image_original_url
          },
          itunes_url: data.itunes_url || undefined,
          author_id: data.author_id,
          author_name: data.author_name || undefined,
          author: {
            id: data.author.user_id,
            fullname: data.author.fullname,
            username: data.author.username,
            description: data.author.description,
            image: {
              url: data.author.image_url,
              original: data.author.image_original_url
            },
            type: data.author.kind,
            plan: data.author.plan
          },
          owner_name: data.owner_name,
          copyright: data.copyright,
          last_episode_at: data.last_episode_at || undefined,
          is_explicit: data.explicit
        };
    }

    /**
     * Get all episodes in a specific show.
     *
     * @param showId { number }
     * @returns { Promise<ShowEpisodes> }
     */
    public showEpisodes = async (showId: number): Promise<ShowEpisodes> => {
      const data = await this.request('GET', '/shows/' + showId + '/episodes');
      return {
        items: data.items.map((episode: any): Partial<Episode> => {
          return {
            id: episode.episode_id,
            title: episode.title,
            show_id: episode.show_id,
            duration: episode.duration,
            image: {
              url: episode.image_url,
              original: episode.image_original_url
            },
            download: {
              enabled: episode.download_enabled || undefined,
              url: episode.download_url || undefined
            },
            waveform_url: episode.waveform_url || null,
            is_explicit: episode.explicit,
            published_at: episode.published_at
          }
        }),
        next_page_url: data.next_url || null
      }
    }

    /**
     * Get a specific episode.
     *
     * @param episodeId { number }
     * @returns { Promise<Episode> }
     */
    public episode = async (episodeId: number): Promise<Episode> => {
      const data = (await this.request('GET', '/episodes/' + episodeId))['episode'];
      return {
        id: data.episode_id,
        type: data.type,
        status: data.encoding_status,
        show_id: data.show_id,
        show: {
          id: data.show.show_id,
          title: data.show.title,
          image: {
            url: data.show.image_url,
            original: data.show.image_original_url
          }
        },
        season: {
          type: data.season_type || undefined,
          no: data.season_number || undefined
        },
        episode_no: data.episode_number,
        title: data.title,
        description: {
          text: data.description,
          html: data.description_html || data.description || undefined
        },
        duration: data.duration,
        url: data.playback_url,
        image: {
          url: data.image_url,
          original: data.image_original_url
        },
        download: {
          enabled: data.download_enabled || undefined,
          url: data.download_url || undefined
        },
        waveform_url: data.waveform_url || null,
        media: {
          id: data.media_id || null,
          url: data.media_url || null
        },
        count: {
          play: data.plays_count,
          ondemand: data.plays_ondemand_count,
          live: data.plays_live_count,
          downloads: data.downloads_count,
          likes: data.likes_count,
          messages: data.messages_count
        },
        author_id: data.author_id,
        author: {
          id: data.author.user_id,
          fullname: data.author.fullname,
          image: {
            url: data.author.image_url,
            original: data.author.image_original_url
          }
        },
        tags: data.tags || [],
        transcript: data.transcript_url === null ? undefined : {
          type: data.transcript_type || undefined,
          url: data.transscript_url || undefined
        },
        is_explicit: data.explicit,
        published_at: data.published_at
      };
    }

    /**
     * Send request to API.
     *
     * @param method { string }
     * @param endpoint { string }
     * @returns { Promise<any> }
     */
    protected request = async (method: string, endpoint: string): Promise<any> => {
        return fetch(this.baseUrl + endpoint, {
            method: method,
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              //'User-Agent': 'Aller/' + this.brand
            }
        }).then(async (response: Response) => {
          // Request error handling.
          if (!response.ok) {
            throw Error(`Request failed with code [${response.status}]. Message: ${response.statusText}`);
          }

          // Decode the response.
          return response.json();
        }).then((data) => {
          // Response error handling.
          if (data.response.error) {
            throw Error(`Request failed with code [${data.response.error.code}]. Message: ${data.response.error.messages.join(' and ')}`);
          }

          // Return data without root key.
          return data.response;
        }).catch((error: any) => {
            throw error;
        })
    }
}

type Episode = {
  id: number
  type: string
  status: string
  show_id: number
  show: Partial<Show>
  season: Season
  episode_no: number
  title: string
  description: Description
  duration: number
  url: string
  image: Image,
  download: {
    enabled?: boolean|undefined
    url?: string|undefined
  }
  waveform_url: string|null
  media: {
    id: number|null
    url: string|null
  },
  count: {
    play: number
    ondemand: number
    live: number
    downloads: number
    likes: number
    messages: number
  }
  tags: string[],
  author_id: number
  author: Partial<Author>
  is_explicit: boolean
  transcript?: Transcript
  published_at: string
}

type Show = {
  id: number
  title: string
  language: string
  description: Description
  image: Image
  itunes_url: string
  author_id: number
  author_name: string
  author: Partial<Author>
  owner_name: string
  copyright: string
  last_episode_at: string
  is_explicit: boolean
}

type ShowEpisodes = {
  items: Partial<Episode>[],
  next_page_url?: string|null
}

type Season = {
  type: string
  no: string
}

type Author = {
  id: number
  username: string
  fullname: string
  description: string
  image: Image
  type: string
  plan: string
}

type Image = {
  url: string
  original: string
}

type Description = {
  text: string
  html: string
}

type Transcript = {
  type: string
  url: string
}

