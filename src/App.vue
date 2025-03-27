<!-- App.vue -->
<script setup>
import { ref } from 'vue'
import ImageCropper from './components/ImageCropper.vue'

// App state
const isProcessing = ref(false)
const originalFileSize = ref(0)
const webpDataUrl = ref('')
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
  originalFileSize.value = file.size
}

// Convert image to WebP
const convertToWebP = async (file) => {
  if (!file) {
    alert('Please select a JPG or PNG image.')
    return
  }

  if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
    alert('Only JPG and PNG files are supported.')
    return
  }

  isProcessing.value = true
  
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    
    const ctx = canvas.getContext('2d')
    
    // Create an image element
    const img = new Image()
    img.src = URL.createObjectURL(file)
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    
    // Draw the image
    ctx.drawImage(img, 0, 0, 200, 200)
    
    // Convert to WebP
    webpDataUrl.value = canvas.toDataURL('image/webp')
    
    // Clean up
    URL.revokeObjectURL(img.src)
  } catch (error) {
    console.error('Error converting image:', error)
    alert('Error converting image. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

// Copy to clipboard
const copyToClipboard = async () => {
  if (!webpDataUrl.value) {
    alert('Please convert an image first.')
    return
  }
  
  try {
    await navigator.clipboard.writeText(webpDataUrl.value)
    // You might want to add a toast notification here
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    alert('Error copying to clipboard. Please try again.')
  }
}

// Download WebP
const downloadWebP = () => {
  if (!webpDataUrl.value) {
    alert('Please convert an image first.')
    return
  }
  
  const link = document.createElement('a')
  link.href = webpDataUrl.value
  link.download = 'converted_image.webp'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="container fade-in">
    <h1>Image to WEBP Converter</h1>
    <div class="input-section">
      <ImageCropper
        @file-selected="handleFileSelect"
        @crop-complete="convertToWebP"
      />
      
      <div v-if="fileDetails.name" class="file-info">
        <span class="file-name">{{ fileDetails.name }}</span>
        <span class="file-size">{{ formatFileSize(fileDetails.size) }}</span>
      </div>
      
      <div v-if="isProcessing" class="progress-container">
        <div class="progress-bar"></div>
      </div>
    </div>
    
    <div v-if="webpDataUrl" class="output-container fade-in">
      <h3>Results</h3>
      <div class="preview-section">
        <div class="preview-box">
          <div class="preview-title">
            <span>WEBP Image Preview</span>
            <span class="dimension-label">200 × 200px</span>
          </div>
          <div class="preview-frame">
            <img :src="webpDataUrl" alt="WEBP image preview" />
          </div>
        </div>
      </div>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-title">Original Size</div>
          <div class="stat-value">{{ formatFileSize(originalFileSize) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">WEBP Size</div>
          <div class="stat-value">{{ formatFileSize(webpDataUrl.length * 3 / 4) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Savings</div>
          <div class="stat-value">{{ formatFileSize(originalFileSize - (webpDataUrl.length * 3 / 4)) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Reduction</div>
          <div class="stat-value" :class="{
            'savings-positive': originalFileSize > (webpDataUrl.length * 3 / 4),
            'savings-negative': originalFileSize <= (webpDataUrl.length * 3 / 4)
          }">
            {{ ((originalFileSize - (webpDataUrl.length * 3 / 4)) / originalFileSize * 100).toFixed(1) }}%
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button class="btn download-btn" @click="downloadWebP">Download WEBP</button>
      </div>
      
      <h3>Data URL</h3>
      <div class="code-box">
        <button class="copy-btn" @click="copyToClipboard">Copy</button>
        <pre>{{ webpDataUrl }}</pre>
      </div>
    </div>
  </div>
  
  <footer>
    Convert your images to WEBP format for better web performance and smaller file sizes
  </footer>
</template>

<style>
@import './assets/styles.css';
</style> 