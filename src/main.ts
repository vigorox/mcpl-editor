import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from '@/i18n/i18n';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import '@/assets/css/app.css';

createApp(App)
  .use(i18n)
  .use(Quasar, quasarUserOptions)
  .use(router)
  .mount('#app');
