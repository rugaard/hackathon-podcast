import './sass/app.scss';
import './bootstrap';

// Vue
import { createApp } from 'vue';
import router from './router';

// Plugins
import Spreaker from '@plugins/spreaker-api';

// Application shell.
import App from './App.vue';

createApp(App).use(router).use(Spreaker, 'Hackathon').mount('#app');
