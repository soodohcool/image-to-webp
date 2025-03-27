<!-- WebPConverter.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  file: {
    type: File,
    required: true
  }
})

const emit = defineEmits(['conversion-complete'])

const isProcessing = ref(false)
const webpDataUrl = ref('')
const originalFileSize = ref(0)
const currentObjectUrl = ref(null)

// Convert image to WebP
const convertToWebP = async () => {
  if (!props.file) {
    console.warn('No file provided')
    return
  }

  if (!(props.file.type === 'image/jpeg' || props.file.type === 'image/png')) {
    console.warn('Invalid file type')
    return
  }

  isProcessing.value = true
  
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    
    const ctx = canvas.getContext('2d')
    // Enable image smoothing
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Create an image element
    const img = new Image()
    // Store the object URL for cleanup
    currentObjectUrl.value = URL.createObjectURL(props.file)
    img.src = currentObjectUrl.value
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    
    // Draw the image maintaining aspect ratio
    ctx.drawImage(img, 0, 0, 200, 200)
    
    // Convert to WebP with high quality
    webpDataUrl.value = canvas.toDataURL('image/webp', 0.9)
    
    // Emit completion event
    emit('conversion-complete', webpDataUrl.value)
  } catch (error) {
    console.error('Error converting image:', error)
    webpDataUrl.value = ''
  } finally {
    isProcessing.value = false
  }
}

// Watch for file changes to update original file size and clear previous data
watch(() => props.file, (newFile) => {
  if (newFile) {
    originalFileSize.value = newFile.size
    // Clear previous WebP data
    webpDataUrl.value = ''
    // Clear previous object URL
    if (currentObjectUrl.value) {
      URL.revokeObjectURL(currentObjectUrl.value)
      currentObjectUrl.value = null
    }
    // Start new conversion
    convertToWebP()
  }
}, { immediate: true })

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

// Computed properties for statistics
const webpSize = computed(() => {
  if (!webpDataUrl.value) return 0
  return Math.round((webpDataUrl.value.length * 3) / 4) - 
    (webpDataUrl.value.endsWith('==') ? 2 : (webpDataUrl.value.endsWith('=') ? 1 : 0))
})

const sizeDifference = computed(() => originalFileSize.value - webpSize.value)
const percentReduction = computed(() => 
  ((sizeDifference.value / originalFileSize.value) * 100).toFixed(1)
)

const isSavingsPositive = computed(() => sizeDifference.value > 0)

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

// Cleanup when component is unmounted
onUnmounted(() => {
  if (currentObjectUrl.value) {
    URL.revokeObjectURL(currentObjectUrl.value)
    currentObjectUrl.value = null
  }
  webpDataUrl.value = ''
})
</script>

<template>
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
        <div class="stat-value">{{ formatFileSize(webpSize) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Savings</div>
        <div class="stat-value">{{ formatFileSize(Math.abs(sizeDifference)) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Reduction</div>
        <div class="stat-value" :class="{
          'savings-positive': isSavingsPositive,
          'savings-negative': !isSavingsPositive
        }">
          {{ isSavingsPositive ? '' : '-' }}{{ Math.abs(percentReduction) }}%
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
</template> 