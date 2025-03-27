/**
 * Image Cropper Component
 * 
 * A Vue 3 component that allows users to:
 * - Preview uploaded images
 * - Crop them with a square aspect ratio
 * - Resize to 200x200 pixels
 * - Provide the cropped image for conversion to WebP
 */

const ImageCropperComponent = {
  template: '#image-cropper-template',
  
  setup() {
    const { ref, onMounted, onUnmounted, reactive, watch } = Vue;
    
    // Reactive state
    const imageUrl = ref(null);
    const cropperImage = ref(null);
    const cropper = ref(null);
    const croppedImageData = reactive({
      dataUrl: null,
      width: 200,
      height: 200,
      originalFile: null
    });
    
    /**
     * Handle file upload event from the main app
     * @param {Event} event - The file input change event
     */
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Store original file for later use
      croppedImageData.originalFile = file;
      
      // Create preview URL
      imageUrl.value = URL.createObjectURL(file);
    };
    
    /**
     * Initialize the cropper when the image is loaded
     */
    const initCropper = () => {
      if (!cropperImage.value) return;
      
      // Destroy existing cropper if it exists
      if (cropper.value) {
        cropper.value.destroy();
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
          console.log('Crop event:', event.detail);
        }
      });
    };
    
    /**
     * Apply cropping and resize to 200x200
     */
    const cropImage = () => {
      if (!cropper.value) return;
      
      // Get cropped canvas
      const canvas = cropper.value.getCroppedCanvas({
        width: 200,
        height: 200,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });
      
      if (!canvas) return;
      
      // Convert to data URL
      croppedImageData.dataUrl = canvas.toDataURL('image/png');
      
      // Create a new File object from the cropped image
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        // Create a new file from the blob with the original filename
        const croppedFile = new File(
          [blob], 
          croppedImageData.originalFile.name, 
          { type: 'image/png' }
        );
        
        // Update the file input with the new cropped file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedFile);
        
        const fileInput = document.getElementById('upload');
        fileInput.files = dataTransfer.files;
        
        // Trigger change event to update file details
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        
        // Hide the cropper
        imageUrl.value = null;
        
        // Show the cropped image in the preview
        document.getElementById('webp-preview').src = croppedImageData.dataUrl;
      }, 'image/png');
    };
    
    /**
     * Cancel cropping and reset the component
     */
    const cancelCrop = () => {
      if (cropper.value) {
        cropper.value.destroy();
        cropper.value = null;
      }
      
      imageUrl.value = null;
    };
    
    // Watch for image URL changes to initialize the cropper
    watch(imageUrl, (newValue) => {
      if (newValue) {
        // Use nextTick to ensure the DOM is updated
        Vue.nextTick(() => {
          initCropper();
        });
      }
    });
    
    // Clean up resources when component is unmounted
    onUnmounted(() => {
      if (cropper.value) {
        cropper.value.destroy();
      }
      
      // Revoke object URL to prevent memory leaks
      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
      }
    });
    
    // Attach file upload listener when component is mounted
    onMounted(() => {
      const fileInput = document.getElementById('upload');
      if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
      }
    });
    
    return {
      imageUrl,
      cropperImage,
      cropImage,
      cancelCrop
    };
  }
}; 