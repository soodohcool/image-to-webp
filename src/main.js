import { createApp } from 'vue'
import App from './App.vue'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

// Make Cropper available globally
window.Cropper = Cropper

// Create and mount the Vue application
const app = createApp(App)
app.mount('#app') 