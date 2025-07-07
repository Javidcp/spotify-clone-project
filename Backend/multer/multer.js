const dotenv = require('dotenv');
dotenv.config();
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp3', 'wav', 'aac', 'm4a', 'mp4', 'mov', 'avi'],
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/aac',
    'video/mp4', 'video/quicktime'
  ];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"), false);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
