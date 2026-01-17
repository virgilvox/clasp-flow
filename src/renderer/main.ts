import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Styles
import './assets/styles/base.css'
import './assets/styles/components.css'

// Create Vue app
const app = createApp(App)

// Plugins
app.use(createPinia())
app.use(router)

// Mount
app.mount('#app')
