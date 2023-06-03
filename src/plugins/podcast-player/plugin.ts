import type { App } from 'vue';
import { createPinia } from 'pinia';

/**
 * Register package with Vue.
 *
 * @param app { App }
 * @returns void
 */
export default function install(app: App): void {
  // Add pinia plugin to application.
  app.use(createPinia());
}
