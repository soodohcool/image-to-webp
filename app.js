/**
 * Main Vue application
 * 
 * Initializes Vue 3 app and registers components
 */

// Create Vue app
const app = Vue.createApp({
  setup() {
    const { ref } = Vue;
    
    // App state
    const isProcessing = ref(false);
    
    // Expose state to template
    return {
      isProcessing
    };
  }
});

// Register the image cropper component
app.component('image-cropper-component', ImageCropperComponent);

// Mount the app
app.mount('#app'); 