<!-- App.vue -->
<script setup>
import { ref } from 'vue'
import ImageCropper from './components/ImageCropper.vue'
import WebPConverter from './components/WebPConverter.vue'

// App state
const selectedFile = ref(null)
const fileDetails = ref({
  name: '',
  size: 0
})

// Format file size helper
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' bytes'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}

// Handle file selection
const handleFileSelect = (file) => {
  if (!file) return
  
  fileDetails.value = {
    name: file.name,
    size: file.size
  }
  selectedFile.value = file
}

// Handle crop completion
const handleCropComplete = (croppedFile) => {
  selectedFile.value = croppedFile
}
</script>

<template>
  <div class="container fade-in">
    <h1>Image to WEBP Converter</h1>
    <div class="input-section">
      <ImageCropper
        @file-selected="handleFileSelect"
        @crop-complete="handleCropComplete"
      />
      
      <div v-if="fileDetails.name" class="file-info">
        <span class="file-name">{{ fileDetails.name }}</span>
        <span class="file-size">{{ formatFileSize(fileDetails.size) }}</span>
      </div>
    </div>
    
    <WebPConverter
      v-if="selectedFile"
      :file="selectedFile"
    />
  </div>
  
  <footer>
    Convert your images to WEBP format for better web performance and smaller file sizes
  </footer>
</template>

<style>
@import './assets/styles.css';
</style> 