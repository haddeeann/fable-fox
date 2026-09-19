import './assets/main.css'
import './assets/themes/default.css'
import './assets/themes/riso.css'
import './assets/themes/newsprint.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vAutofocus from './directives/vAutofocus'
import piniaPluginRouter from 'pinia-plugin-router'
import App from './App.vue'
import router from './router'
import { markRaw } from 'vue'


const app = createApp(App)
const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
pinia.use(piniaPluginRouter(router))
app.use(pinia)
app.use(router)

app.directive('autofocus', vAutofocus)

app.mount('#app')
