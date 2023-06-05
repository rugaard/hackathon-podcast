import { inject } from 'vue';
import type { Player } from './player';

export const podcastPlayerKey = Symbol.for('AllerPodcastPlayer');

export default function (): Player {
  return inject<Player>(podcastPlayerKey)!;
};
