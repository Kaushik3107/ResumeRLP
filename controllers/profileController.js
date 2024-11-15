// controllers/profileController.js
const User = require('../models/User');
const path = require('path');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Folder where files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Filename to prevent overwrites
//   }
// });

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Only allow specific formats
  },
});

const upload = multer({ storage }).single('profilePicture');

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only JPEG, JPG, and PNG files are allowed!'));
//     }
//   }
// }).single('profilePicture'); // The key for profile picture in form-data

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Create or update user profile
// exports.updateUserProfile = async (req, res) => {
//   const { fullName, email, phone, profilePicture } = req.body;

//   const profileFields = {
//     fullName: fullName || '',
//     email: email || '',
//     phone: phone || '',
//     profilePicture: profilePicture || '',
//   };

//   try {
//     let user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     // Update user profile
//     user = await User.findByIdAndUpdate(req.user.id, { $set: profileFields }, { new: true }).select('-password');
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// };

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { fullName, email, phone } = req.body;
    const profilePicture = req.file ? req.file.path : undefined;

    try {
      const updatedFields = { fullName, email, phone };
      if (profilePicture) updatedFields.profilePicture = profilePicture;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updatedFields },
        { new: true }
      );

      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });
};

// Delete user profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: 'User profile deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
