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
  if (!cropperImage.value) return
  
  // Destroy existing cropper if it exists
  if (cropper.value) {
    cropper.value.destroy()
  }
  
  // Initialize cropper with square aspect ratio
  cropper.value = new Cropper(cropperImage.value, {
    aspectRatio: 1, // Square aspect ratio
    viewMode: 1,    // Restrict the crop box to not exceed the size of the canvas
    guides: true,   // Show grid lines
    center: true,   // Show center indicator
    highlight: false,
    background: false,
    autoCropArea: 0.8, // Define default crop size (80% of the image)
    responsive: true,
    crop: function(event) {
      // Real-time crop box data updates
      console.log('Crop event:', event.detail)
    }
  })
}

/**
 * Apply cropping and resize to 200x200
 */
const cropImage = () => {
  if (!cropper.value) return
  
  // Get cropped canvas
  const canvas = cropper.value.getCroppedCanvas({
    width: 200,
    height: 200,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  })
  
  if (!canvas) return
  
  // Convert to data URL
  croppedImageData.value.dataUrl = canvas.toDataURL('image/png')
  
  // Create a new File object from the cropped image
  canvas.toBlob((blob) => {
    if (!blob) return
    
    // Create a new file from the blob with the original filename
    const croppedFile = new File(
      [blob], 
      croppedImageData.value.originalFile.name, 
      { type: 'image/png' }
    )
    
    // Emit crop complete event with the cropped file
    emit('crop-complete', croppedFile)
    
    // Hide the cropper
    imageUrl.value = null
  }, 'image/png')
}

/**
 * Cancel cropping and reset the component
 */
const cancelCrop = () => {
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
  
  imageUrl.value = null
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
  if (cropper.value) {
    cropper.value.destroy()
  }
  
  // Revoke object URL to prevent memory leaks
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
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