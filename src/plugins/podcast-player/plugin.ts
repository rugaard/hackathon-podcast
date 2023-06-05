import type { App } from 'vue';
import { podcastPlayerKey } from './composable';
import { Player } from './player';

/**
 * Register package with Vue.
 *
 * @param app { App }
 * @returns void
 */
export default function install(app: App): void {
  app.provide<Player>(podcastPlayerKey, new Player);
}
