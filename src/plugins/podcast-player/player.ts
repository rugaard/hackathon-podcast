class Player {
  /**
   * The Player instance.
   *
   * @var { HTMLAudioElement }
   */
  protected player: HTMLAudioElement;

  /**
   * PodcastPlayer constructor.
   *
   * @param player { HTMLAudioElement }
   */
  constructor() {
    this.player = new Audio;
  }

  public load = (url: string, autoPlay: boolean = false): this => {
    this.player.src = url;
    this.player.load();

    if (autoPlay) {
      const isReadyToPlay = setInterval(() => {
        if (this.player.readyState >= 2) {
          this.play();
          clearInterval(isReadyToPlay);
        }
      }, 100);
    }

    return this;
  }

  /**
   * Toggle play/pause.
   *
   * @returns { this }
   */
  public togglePlayPause = (): this => {
    !this.player.paused ? this.pause() : this.play();
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
   * Whether player is playing or not.
   *
   * @returns { boolean }
   */
  get isPlaying(): boolean {
    return !this.player.paused;
  }

  /**
   * Get time played.
   *
   * @returns { number }
   */
  get currentTime(): number {
    return this.player.currentTime || 0;
  }

  /**
   * Get time played in percentage.
   *
   * @returns { number }
   */
  get currentTimeInPercentage(): number {
    return this.currentTime * 100 / this.totalTime;
  }

  /**
   * Get remaining time.
   *
   * @returns { number }
   */
  get remainingTime(): number {
    return this.totalTime - this.currentTime;
  }

  /**
   * Get remaining time in percentage.
   *
   * @returns { number }
   */
  get remainingTimeInPercentage(): number {
    return 100 - this.currentTimeInPercentage
  }

  /**
   * Get total time.
   *
   * @returns { number }
   */
  get totalTime(): number {
    return this.player.duration || 0;
  }

  /**
   * Get underlaying player instance.
   *
   * @returns { HTMLAudioElement }
   */
  get instance(): HTMLAudioElement {
    return this.player;
  }
}

export { Player };
