import type { App } from 'vue';
import { podcastPlayerKey, podcastApiKey } from './composable';
import { Player } from './player';
import { Spreaker } from './spreaker';

/**
 * Register package with Vue.
 *
 * @param app { App }
 * @param brand { string }
 * @returns void
 */
export default function install(app: App, brand: string): void {
  app.provide<Spreaker>(podcastApiKey, new Spreaker(brand));
  app.provide<Player>(podcastPlayerKey, new Player(brand));
}
