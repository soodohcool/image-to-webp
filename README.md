# Image to WEBP Converter

## Overview

A modern web-based tool that allows users to convert JPG and PNG images to the WEBP format, with the added capability of cropping images to a square aspect ratio and resizing to 200x200 pixels. Built with Vue 3 and Vite for optimal performance.

## Features

- 📤 Upload JPG or PNG images
- ✂️ Interactive image cropping with square aspect ratio
- 🔄 Automatic resizing to 200x200 pixels
- 🔄 Convert images to WEBP format
- 📊 Real-time file size comparison
- 👀 Image preview
- 📋 Copy WEBP data URL to clipboard
- 💾 Download converted WEBP image

## Technologies Used

- Vue 3 with Composition API
- Vite for build tooling
- Cropper.js for image cropping
- Modern CSS with CSS Variables
- File API for image processing

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/image-to-webp.git
cd image-to-webp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## How to Use

1. Click "Choose a JPG or PNG file" to select an image
2. Use the cropping tool to select the desired part of the image (maintains square aspect ratio)
3. Click "Apply Crop" to accept the crop or "Cancel" to reset
4. The cropped image will be automatically resized to 200x200 pixels
5. View the converted image preview and file size statistics
6. Download the WEBP image or copy its data URL

### Key Functionalities

- Supports image file types: JPEG and PNG
- Shows original and converted file sizes
- Calculates file size reduction percentage
- Provides a live preview of the converted image
- Simple, user-friendly interface

## Performance Benefits

WEBP is a modern image format that offers:
- Smaller file sizes
- Faster web page loading
- Maintained image quality
- Broad browser support

## Browser Compatibility

Works in all modern browsers that support:
- FileReader API
- Canvas toDataURL
- WebP format
- Vue 3

## Project Structure

```
image-to-webp/
├── src/
│   ├── components/
│   │   └── ImageCropper.vue
│   ├── assets/
│   │   └── styles.css
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Kenny G. Scott