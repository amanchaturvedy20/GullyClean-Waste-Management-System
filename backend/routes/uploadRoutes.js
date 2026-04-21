const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary from the environment variables in .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart_city_waste_management',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => {
      // Allow the frontend to send a custom prefix in headers (like binId or taskId)
      // We use headers because Multer processes the file stream before the body sometimes
      const prefix = req.headers['x-upload-context'] ? `${req.headers['x-upload-context']}-` : '';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // Remove extension from originalname so Cloudinary doesn't double-append it
      const cleanName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
      return `${prefix}${cleanName}-${uniqueSuffix}`;
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Public/Private depending on usage
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  
  // Return the secure Cloudinary URL
  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path,
  });
});

module.exports = router;
