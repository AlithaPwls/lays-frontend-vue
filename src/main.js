import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import '../styles/configurator.css'
import '../styles/designs.css'
import '../styles/auth.css'

createApp(App)
  .use(router)
  .mount('#app')