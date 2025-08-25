const express = require('express');
const router = express.Router();
const  verifyToken  = require('../middleware/verifyToken');
const { register, login, logout, getUserById, getUserProfile } = require('../controllers/auth');

router.post('/register', register);//done
router.post('/login', login);//login
// router.get('/:userId', getUserById);//done. profile me kaam aayega
router.post('/logout', logout);//done

// router.get('/profile', verifyToken, getUserProfile);

router.get('/:userId', getUserById);

router.get('/me', verifyToken, async (req, res) => {
    try {
        // req.user.id is attached by the verifyToken middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user); // Send back the user data
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
