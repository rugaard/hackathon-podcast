import type { App } from 'vue';
import { spreakerKey } from './composable';
import { Spreaker } from '../podcast-player/spreaker';

/**
 * Register package with Vue.
 *
 * @param app { App }
 * @param brand { brand }
 * @returns void
 */
export default function install(app: App, brand: string): void {
  // Instantiate Spreaker API.
  const spreakerApi = new Spreaker(brand);

  // Provide Spreaker API instance.
  app.provide(spreakerKey, spreakerApi);
}
