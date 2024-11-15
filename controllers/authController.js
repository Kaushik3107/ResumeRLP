const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ fullName, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      msg: 'User registered successfully',
      token,  // Send the JWT token
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      msg: 'User logged in successfully',
      token,  // Send the JWT token
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Handle OAuth callbacks
exports.oauthCallback = (req, res) => {
  const token = generateToken(req.user);
  res.json({ msg: `User logged in with ${req.authType} successfully`, token });
};
