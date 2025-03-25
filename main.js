
    let originalFileSize = 0;
    let webpDataUrl = '';
    
    // Update file details when a file is selected
    document.getElementById('upload').addEventListener('change', function(e) {
      const file = e.target.files[0];
      const fileDetails = document.getElementById('file-details');
      const fileName = document.getElementById('file-name');
      const fileSize = document.getElementById('file-size');
      
      if (file) {
        fileDetails.style.display = 'flex';
        fileName.textContent = file.name;
        originalFileSize = file.size;
        
        // Format file size
        fileSize.textContent = formatFileSize(file.size);
      } else {
        fileDetails.style.display = 'none';
      }
    });
    
    function formatFileSize(size) {
      if (size < 1024) {
        return size + ' bytes';
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB';
      } else {
        return (size / (1024 * 1024)).toFixed(2) + ' MB';
      }
    }
    
    function convertToWebP() {
      const uploadInput = document.getElementById('upload');
      const output = document.getElementById('output');
      const outputContainer = document.getElementById('output-container');
      const progressContainer = document.getElementById('progress-container');
      const progressBar = document.getElementById('progress-bar');

      if (!uploadInput.files.length) {
        alert('Please select a JPG or PNG image.');
        return;
      }

      const file = uploadInput.files[0];
      if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
        alert('Only JPG and PNG files are supported.');
        return;
      }

      // Show progress
      progressContainer.style.display = 'block';
      progressBar.style.width = '10%';
      
      // Show "Converting..." text
      output.textContent = "Converting...";
      
      // Simulate progress
      let progress = 10;
      const progressInterval = setInterval(() => {
        if (progress < 90) {
          progress += 5;
          progressBar.style.width = progress + '%';
        }
      }, 100);

      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          // Complete the progress bar
          clearInterval(progressInterval);
          progressBar.style.width = '100%';
          
          setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            webpDataUrl = canvas.toDataURL('image/webp');
            
            // Update WebP preview image
            document.getElementById('webp-preview').src = webpDataUrl;
            document.getElementById('webp-dimensions').textContent = img.width + ' × ' + img.height + 'px';
            
            output.textContent = webpDataUrl;
            outputContainer.style.display = 'block';
            
            // Calculate file sizes
            const webpSize = Math.round((webpDataUrl.length * 3) / 4) - (webpDataUrl.endsWith('==') ? 2 : (webpDataUrl.endsWith('=') ? 1 : 0));
            
            const sizeDifference = originalFileSize - webpSize;
            const percentReduction = ((sizeDifference / originalFileSize) * 100).toFixed(1);
            
            // Update stats
            document.getElementById('original-size').textContent = formatFileSize(originalFileSize);
            document.getElementById('webp-size').textContent = formatFileSize(webpSize);
            document.getElementById('savings-size').textContent = formatFileSize(Math.abs(sizeDifference));
            
            const savingsPercent = document.getElementById('savings-percent');
            savingsPercent.classList.remove('savings-positive', 'savings-negative');
            
            if (sizeDifference > 0) {
              savingsPercent.textContent = percentReduction + '%';
              savingsPercent.classList.add('savings-positive');
            } else {
              savingsPercent.textContent = '-' + Math.abs(percentReduction) + '%';
              savingsPercent.classList.add('savings-negative');
            }
          }, 500);
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    }
    
    function copyToClipboard() {
      const output = document.getElementById('output');
      const successMessage = document.getElementById('success-message');
      
      // Create a temporary textarea element to copy the text
      const textarea = document.createElement('textarea');
      textarea.value = output.textContent;
      document.body.appendChild(textarea);
      
      // Select and copy the text
      textarea.select();
      document.execCommand('copy');
      
      // Remove the temporary textarea
      document.body.removeChild(textarea);
      
      // Show success message
      successMessage.classList.add('show');
      
      // Hide success message after 2 seconds
      setTimeout(function() {
        successMessage.classList.remove('show');
      }, 2000);
    }
    
    function downloadWebP() {
      if (!webpDataUrl) {
        alert('Please convert an image first.');
        return;
      }
      
      const link = document.createElement('a');
      link.href = webpDataUrl;
      link.download = 'converted_image.webp';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  