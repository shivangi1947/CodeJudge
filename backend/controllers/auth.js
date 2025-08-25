const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({ username, email, password: hashedPassword });

        res
        .status(201)
        .json(
                {
                  message: 'User registered successfully',
                  user: 
                  {
                    id: user._id,
                    username: user.username,
                    email: user.email
                  },
                }
             )  

  } 
  
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};


// In controllers/auth.js

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate the JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Set the token as a secure, httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Crucial: Prevents JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict', // Helps prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
    });

    // The token is no longer sent in the response body
    res.status(200).json({
    message: "Login successful",
    userId: user._id,
    isAdmin: user.role === 'admin' // e.g., true or false
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password'); // remove password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Add this new function to your controllers/auth.js file

exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id is added by the verifyToken middleware
    const user = await User.findById(req.user.id).select('-password'); // .select('-password') excludes the password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
