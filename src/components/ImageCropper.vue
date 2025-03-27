<!-- ImageCropper.vue -->
<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const emit = defineEmits(['file-selected', 'crop-complete'])

// Component state
const imageUrl = ref(null)
const cropperImage = ref(null)
const cropper = ref(null)
const croppedImageData = ref({
  dataUrl: null,
  width: 200,
  height: 200,
  originalFile: null
})

/**
 * Handle file upload event
 * @param {Event} event - The file input change event
 */
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Store original file for later use
  croppedImageData.value.originalFile = file
  
  // Create preview URL
  imageUrl.value = URL.createObjectURL(file)
  
  // Emit file selected event
  emit('file-selected', file)
}

/**
 * Initialize the cropper when the image is loaded
 */
const initCropper = () => {
  if (!cropperImage.value) {
    console.warn('Cropper image element not found')
    return
  }
  
  // Destroy existing cropper if it exists
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
  
  try {
    // Initialize cropper with square aspect ratio
    cropper.value = new window.Cropper(cropperImage.value, {
      aspectRatio: 1, // Square aspect ratio
      viewMode: 1,    // Restrict the crop box to not exceed the size of the canvas
      guides: true,   // Show grid lines
      center: true,   // Show center indicator
      highlight: false,
      background: false,
      autoCropArea: 0.8, // Define default crop size (80% of the image)
      responsive: true,
      restore: false, // Don't restore the cropped area after initialization
      modal: true,    // Show the black modal above the image
      ready() {
        console.log('Cropper is ready')
        // Set initial crop box size to 80% of the image
        const containerData = cropper.value.getContainerData()
        const cropBoxSize = Math.min(containerData.width, containerData.height) * 0.8
        cropper.value.setCropBoxData({
          width: cropBoxSize,
          height: cropBoxSize,
          left: (containerData.width - cropBoxSize) / 2,
          top: (containerData.height - cropBoxSize) / 2
        })
      }
    })
  } catch (error) {
    console.error('Error initializing cropper:', error)
  }
}

/**
 * Apply cropping and resize to 200x200
 */
const cropImage = () => {
  if (!cropper.value) {
    console.warn('Cropper not initialized')
    return
  }
  
  try {
    // Get the cropped canvas directly from cropper
    // This will give us just the cropped portion at its original size
    const croppedCanvas = cropper.value.getCroppedCanvas()
    
    if (!croppedCanvas) {
      console.warn('Failed to get cropped canvas')
      return
    }
    
    // Create a new canvas for the resized image
    const resizedCanvas = document.createElement('canvas')
    resizedCanvas.width = 200
    resizedCanvas.height = 200
    
    const ctx = resizedCanvas.getContext('2d')
    // Enable image smoothing
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Draw the cropped image onto the resized canvas
    ctx.drawImage(croppedCanvas, 0, 0, 200, 200)
    
    // Convert to data URL
    croppedImageData.value.dataUrl = resizedCanvas.toDataURL('image/png', 1.0)
    
    // Create a new File object from the resized image
    resizedCanvas.toBlob((blob) => {
      if (!blob) {
        console.warn('Failed to create blob from canvas')
        return
      }
      
      // Create a new file from the blob with the original filename
      const croppedFile = new File(
        [blob], 
        croppedImageData.value.originalFile.name.replace(/\.[^/.]+$/, '') + '_cropped.png', 
        { type: 'image/png' }
      )
      
      // Emit crop complete event with the cropped file
      emit('crop-complete', croppedFile)
      
      // Hide the cropper
      imageUrl.value = null
    }, 'image/png', 1.0) // Use maximum quality
  } catch (error) {
    console.error('Error during cropping:', error)
  }
}

/**
 * Cancel cropping and reset the component
 */
const cancelCrop = () => {
  cleanupResources()
}

/**
 * Clean up all resources and reset state
 */
const cleanupResources = () => {
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
  
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
    imageUrl.value = null
  }
  
  croppedImageData.value = {
    dataUrl: null,
    width: 200,
    height: 200,
    originalFile: null
  }
}

// Watch for image URL changes to initialize the cropper
watch(imageUrl, (newValue) => {
  if (newValue) {
    // Use nextTick to ensure the DOM is updated
    nextTick(() => {
      initCropper()
    })
  }
})

// Clean up resources when component is unmounted
onUnmounted(() => {
  cleanupResources()
})

// Attach file upload listener when component is mounted
onMounted(() => {
  const fileInput = document.getElementById('upload')
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload)
  }
})
</script>

<template>
  <div class="file-input-container">
    <label class="file-input-label" for="upload">
      <span>Choose a JPG or PNG file</span>
    </label>
    <input 
      accept="image/jpeg, image/png" 
      class="file-input" 
      id="upload" 
      type="file" 
    />
  </div>

  <div v-if="imageUrl" class="cropper-container">
    <h3>Crop Your Image</h3>
    <div class="cropper-wrapper">
      <img ref="cropperImage" :src="imageUrl" alt="Upload for cropping" />
    </div>
    <div class="button-group" style="margin-top: 1rem;">
      <button class="btn crop-btn" @click="cropImage">Apply Crop</button>
      <button class="btn cancel-btn" @click="cancelCrop">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.cropper-wrapper {
  max-width: 100%;
  height: 400px;
  margin: 0 auto;
}

.cropper-wrapper img {
  max-width: 100%;
  height: auto;
}
</style> 