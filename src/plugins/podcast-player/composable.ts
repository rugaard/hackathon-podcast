import { inject } from 'vue';
import type { Player } from './player';
import type { Spreaker } from './spreaker';

export const podcastApiKey = Symbol.for('AllerPodcastApi');
export const podcastPlayerKey = Symbol.for('AllerPodcastPlayer');

export const usePodcastApi = (): Spreaker => {
  return inject<Spreaker>(podcastApiKey)!;
};

export const usePodcastPlayer = (): Player => {
  return inject<Player>(podcastPlayerKey)!;
};
