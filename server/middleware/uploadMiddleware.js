const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create base uploads directory if it doesn't exist
const baseUploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Create complaints uploads directory
const complaintsUploadDir = path.join(baseUploadDir, 'complaints');
if (!fs.existsSync(complaintsUploadDir)) {
  fs.mkdirSync(complaintsUploadDir, { recursive: true });
}

// Create profile photos uploads directory
const profileUploadDir = path.join(baseUploadDir, 'profiles');
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

// Create message images uploads directory
const messageUploadDir = path.join(baseUploadDir, 'messages');
if (!fs.existsSync(messageUploadDir)) {
  fs.mkdirSync(messageUploadDir, { recursive: true });
}

// Create community posts uploads directory
const communityPostsUploadDir = path.join(baseUploadDir, 'community-posts');
if (!fs.existsSync(communityPostsUploadDir)) {
  fs.mkdirSync(communityPostsUploadDir, { recursive: true });
}

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG files are allowed'));
  }
};

// Complaints storage configuration
const complaintsStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, complaintsUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Profile photo storage configuration
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `profile-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Message image storage configuration
const messageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, messageUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `message-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Community post image storage configuration
const communityPostStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, communityPostsUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `community-post-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Create multer instances
const complaintsUpload = multer({
  storage: complaintsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: fileFilter,
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: fileFilter,
});

const messageUpload = multer({
  storage: messageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: fileFilter,
});

const communityPostUpload = multer({
  storage: communityPostStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: fileFilter,
});

// Middleware for uploading complaint images
const uploadComplaintImage = (req, res, next) => {
  complaintsUpload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

// Middleware for uploading profile photos
const uploadProfilePhoto = (req, res, next) => {
  profileUpload.single('profilePhoto')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

// Middleware for uploading message images
const uploadMessageImage = (req, res, next) => {
  messageUpload.single('messageImage')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

// Middleware for uploading community post images
const uploadCommunityPostImage = (req, res, next) => {
  communityPostUpload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

module.exports = {
  uploadComplaintImage,
  uploadProfilePhoto,
  uploadMessageImage,
  uploadCommunityPostImage
};
