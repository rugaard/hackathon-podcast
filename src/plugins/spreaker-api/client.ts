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
     * @returns { Promise<Response> }
     */
    public show = async (showId: number): Promise<Response> => {
        return this.request('GET', '/shows/' + showId);
    }

    /**
     * Get all episodes in a specific show.
     *
     * @param showId { number }
     * @returns { Promise<Response> }
     */
    public showEpisodes = async (showId: number): Promise<Response> => {
        return this.request('GET', '/shows/' + showId + '/episodes');
    }

    /**
     * Get a specific episode.
     *
     * @param episodeId { number }
     * @returns { Promise<Response> }
     */
    public episode = async (episodeId: number): Promise<Response> => {
        return this.request('GET', '/episodes/' + episodeId);
    }

    /**
     * Send request to API.
     *
     * @param method { string }
     * @param endpoint { string }
     * @returns { Promise<Response> }
     */
    protected request = async (method: string, endpoint: string): Promise<Response> => {
        return fetch(this.baseUrl + endpoint, {
            method: method,
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              //'User-Agent': 'Aller/' + this.brand
            }
        }).then((res) => res.json()).catch((error: any) => {
            throw error;
        })
    }
}

