import { computed, ref, toRef, type ComputedRef, type Ref } from 'vue';
import EventEmitter from 'events';
import { useLocalStorage } from './localStorage';
import { Spreaker } from './spreaker';
import type { Episode, Show } from './types';

class Player {
  /**
   * Spreaker API client.
   *
   * @returns { SpreakerAPI }
   */
  protected readonly api: Spreaker;

  /**
   * Event emitter.
   *
   * @protected
   * @type { EventEmitter }
   */
  protected emitter: EventEmitter;

  /**
   * The Player instance.
   *
   * @var { HTMLAudioElement }
   */
  protected player: HTMLAudioElement;

  /**
   * Episode currently playing.
   *
   * @var { Ref<Episode|null> }
   */
  protected currentlyPlaying: Ref<Episode|null> = useLocalStorage('player.currently_playing', null);

  /**
   * Player episodes list.
   *
   * @var { Ref<PlayerEpisodesList|null> }
   */
  protected playerEpisodesList: Ref<PlayerEpisodesList|null> = useLocalStorage('player.episodes_list', null);

  /**
   * Player constructor.
   *
   * @param player { HTMLAudioElement }
   */
  constructor() {
    // Instantiate Spreaker API client.
    this.api = new Spreaker('Hackathon');

    // Create internal event emitter.
    this.emitter = new (EventEmitter as any)();

    // Create internal player instance.
    this.player = new Audio;

    // Player events and listeners.
    this.registerPlayerEvents().registerListenerEvents();

    // We have an episode in local storage,
    // let's use to preload the player.
    if (this.currentlyPlaying.value !== null) {
      this.load(this.currentlyPlaying.value);
    }
  }

  /**
   * Start episode.
   *
   * @param episodeId { number }
   * @returns { Promise<Episode> }
   */
  public playEpisode = async (episodeId: number): Promise<Episode> => {
    // Load episode and start playing.
    const episode = await this.api.episode(episodeId);
    this.loadAndPlay(episode);

    // Set episode as currently playing.
    this.currentlyPlaying.value = episode;

    if (this.playerEpisodesList.value?.show.id !== episode.show_id) {
      this.playerEpisodesList.value = {
        show: await this.api.show(episode.show_id),
        episodes: (await this.api.showEpisodes(episode.show_id)).items || []
      };
    }

    return episode;
  }

  /**
   * Load episode.
   *
   * @param episode { Episode }
   * @returns { this }
   */
  protected load = (episode: Episode): this => {
    this.player.src = episode.url;
    this.player.load();
    return this;
  }

  /**
   * Load episode and auto-play it.
   *
   * @param episode { Episode }
   * @returns { this }
   */
  protected loadAndPlay = (episode: Episode): this => {
    return this.load(episode).play();
  }

  /**
   * Toggle play/pause.
   *
   * @returns { this }
   */
  public togglePlayPause = (): this => {
    this.isPlaying.value ? this.pause() : this.play();
    return this;
  }

  /**
   * Start playing.
   *
   * @returns { this }
   */
  public play = (): this => {
    this.player.play();
    return this;
  }

  /**
   * Pause playing.
   *
   * @returns { this }
   */
  public pause = (): this => {
    this.player.pause();
    return this;
  }

  /**
   * Check a specific episode ID is currently playing.
   *
   * @param episodeId { number }
   * @returns { boolean }
   */
  public isEpisodePlaying = (episodeId: number): boolean => {
    return this.currentlyPlaying.value?.id === episodeId;
  }

  /**
   * Add event listener.
   *
   * @param event { string }
   * @param listener { (...args: any[]) }
   * @returns { this }
   */
  public on = (event: string, listener: (...args: any[]) => void): this => {
    this.emitter.addListener(event, listener);
    return this;
  }

  /**
   * Remove event listener.
   *
   * @param event { string }
   * @param listener { (...args: any[]) }
   * @returns { this }
   */
  public off = (event: string, listener: (...args: any[]) => void): this => {
    this.emitter.removeListener(event, listener);
    return this;
  }

  /**
   * Register player event listeners.
   *
   * @returns { this }
   */
  private registerListenerEvents = (): this => {
    return this.on('load', () => this.isPlayable.value = false)
        .on('playable', () => this.isPlayable.value = true)
        .on('pause', () => this.isPlaying.value = false)
        .on('play', () => this.isPlaying.value = true)
        .on('metadata', (self: this) => this.totalTime.value = self.player.duration || 0)
        .on('time', (self: this) => this.timePlayed.value = self.player.currentTime || 0);
  }

  /**
   * Register custom player events.
   *
   * @returns { this }
   */
  private registerPlayerEvents = (): this => {
    this.player.addEventListener('loadstart', (event: Event) => this.emitter.emit('load', this, event));
    this.player.addEventListener('loadedmetadata', (event: Event) => this.emitter.emit('metadata', this, event));
    this.player.addEventListener('canplay', (event: Event) => this.emitter.emit('playable', this, event));
    this.player.addEventListener('error', (event: Event) => this.emitter.emit('error', this, event));
    this.player.addEventListener('ended', (event: Event) => this.emitter.emit('complete', this, event));
    this.player.addEventListener('pause', (event: Event) => this.emitter.emit('pause', this, event));
    this.player.addEventListener('play', (event: Event) => this.emitter.emit('play', this, event));
    this.player.addEventListener('seeking', (event: Event) => this.emitter.emit('seek', this, event));
    this.player.addEventListener('seeked', (event: Event) => this.emitter.emit('seek-end', this, event));
    this.player.addEventListener('timeupdate', (event: Event) => this.emitter.emit('time', this, event));
    this.player.addEventListener('volumechange', (event: Event) => this.emitter.emit('volume', this, event));
    return this;
  }

  /**
   * Whether player is paused or not.
   *
   * @var { Ref<boolean> }
   */
  public isPlayable: Ref<boolean> = ref<boolean>(false);

  /**
   * Whether player is paused or not.
   *
   * @var { Ref<boolean> }
   */
  public isPlaying: Ref<boolean> = ref<boolean>(false);

  /**
   * Episode currently playing.
   *
   * @var { ComputedRef<Episode|null> }
   */
  public episode = computed<Episode|null>((): Episode|null => {
    return this.currentlyPlaying.value;
  });

  /**
   * Currently playing show's list of episodes.
   *
   * @var { ComputedRef<PlayerEpisodesList|null> }
   */
  public showEpisodes = computed<PlayerEpisodesList|null>((): PlayerEpisodesList|null => {
    return this.playerEpisodesList.value;
  });

  /**
   * Time played of current episode.
   *
   * @var { Ref<number> }
   */
  public timePlayed: Ref<number> = ref<number>(0);

  /**
   * Time played (in percentage) of current episode.
   *
   * @var { ComputedRef<number> }
   */
  public timePlayedInPercentage: ComputedRef<number> = computed<number>((): number => {
    return (this.timePlayed.value * 100 / this.totalTime.value) || 0;
  });

  /**
   * Get remaining time.
   *
   * @returns { ComputedRef<number> }
   */
  public remainingTime: ComputedRef<number> = computed<number>((): number => {
    return this.totalTime.value - this.timePlayed.value;
  })

  /**
   * Get remaining time in percentage.
   *
   * @returns { ComputedRef<number> }
   */
  public remainingTimeInPercentage: ComputedRef<number> = computed<number>((): number => {
    return 100 - this.timePlayedInPercentage.value
  });

  /**
   * Total time of episode.
   *
   * @var { Ref<number> }
   */
  public totalTime: Ref<number> = ref<number>(0);
}

export type PlayerEpisodesList = {
  show: Partial<Show>,
  episodes: Partial<Episode>[]
}

export { Player };
