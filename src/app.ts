import './sass/app.scss';
import './bootstrap';

// Vue
import { createApp } from 'vue';
import router from './router';

// Plugins
import PodcastPlayer from '@plugins/podcast-player';

// Application shell.
import App from './App.vue';

createApp(App)
  .use(router)
  .use(PodcastPlayer)
  .mount('#app');
