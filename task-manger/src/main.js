import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './style.css'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('InfiniteLoading', InfiniteLoading)
app.mount('#app')