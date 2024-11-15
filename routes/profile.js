// routes/profile.js
const express = require('express');
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/profileController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, getUserProfile);

// Create or update user profile
router.put('/profile', authenticate, updateUserProfile);

// Delete user profile
router.delete('/profile', authenticate, deleteUserProfile);

module.exports = router;
