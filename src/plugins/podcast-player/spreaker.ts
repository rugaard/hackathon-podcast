import type { Episode, Show, ShowEpisodes } from './types';

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
     * @param parameters { { [key: string]: string } }
     * @returns { Promise<Show> }
     */
    public show = async (showId: number, parameters?: { [key: string]: string }): Promise<Show> => {
        const data = (await this.request('GET', '/shows/' + showId, parameters))['show'];
        if (!data) {
          throw Error('No show returned');
        }

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
     * @param parameters { { [key: string]: string } }
     * @returns { Promise<ShowEpisodes> }
     */
    public showEpisodes = async (showId: number, parameters?: { [key: string]: string }): Promise<ShowEpisodes> => {
      const data = await this.request('GET', '/shows/' + showId + '/episodes', parameters);
      if (!data) {
        throw Error('No show episodes returned');
      }

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
        last_id: data.next_url ? (new URL(data.next_url).searchParams.get('last_id') || null) : null
      }
    }

    /**
     * Get a specific episode.
     *
     * @param episodeId { number }
     * @param parameters { { [key: string]: string } }
     * @returns { Promise<Episode> }
     */
    public episode = async (episodeId: number, parameters?: { [key: string]: string }): Promise<Episode> => {
      const data = (await this.request('GET', '/episodes/' + episodeId, parameters))['episode'];
      if (!data) {
        throw Error('No episodes returned');
      }

      return {
        id: data.episode_id,
        type: data.type,
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
          type: data.season_episode_type || undefined,
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
     * @param parameters { { [key: string]: string } }
     * @returns { Promise<any> }
     */
    protected request = async (method: string, endpoint: string, parameters?: { [key: string]: string }): Promise<any> => {
        return fetch(this.baseUrl + endpoint + (parameters ? '?' + new URLSearchParams(parameters).toString() : ''), {
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

