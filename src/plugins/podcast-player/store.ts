import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { Player } from './player';
import { Spreaker } from './spreaker';

export const usePodcastPlayer = defineStore('podcastPlayer', () => {
  // Spreaker API.
  const spreaker = new Spreaker('Hackathon');

  // Create Podcast player instance.
  const podcastPlayer = new Player;

  /**
   * Get podcast player instance.
   *
   * @returns { Player }
   */
  const player = computed<Player>((): Player => podcastPlayer);

  const currentlyPlaying = computed((): any => {
    return {};
  })

  /**
   * Get played episodes details from local storage.
   *
   * @returns { any }
   */
  const playedEpisodes = computed((): any => {

  });

  /**
   * Start episode.
   *
   * @param episodeId { number }
   * @returns { Promise<void> }
   */
  const startEpisode = async (episodeId: number): Promise<void> => {
    const episode = await spreaker.episode(episodeId);
    console.log('Episode', episode);

    const show = await spreaker.show(episode.show_id);
    console.log('Show', show);

    const showEpisodes = await spreaker.showEpisodes(episode.show_id);
    console.log('Show episodes', showEpisodes);
  }

  return {
    player,
    currentlyPlaying,
    playedEpisodes,
    startEpisode,
  };
});
