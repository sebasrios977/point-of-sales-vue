import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { plugin, defaultConfig } from '@formkit/vue';
import config from '../formkit.config';

import App from './App.vue';
import '@/assets/main.css';
import router from './router';

// Firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firebase'


const app = createApp(App)

app.use(createPinia())
app.use(plugin, defaultConfig(config));
app.use(router)

// Firebase
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})

app.mount('#app')
