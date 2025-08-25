const express = require('express');
const router = express.Router();
const { getUserStats , getAllUsers} = require('../controllers/user');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Add the new admin-only route
// router.get('/', verifyToken, getAllUsers);
// Route to get all stats for a user's profile
router.get('/:userId/stats', getUserStats);


// ADMIN-ONLY ROUTE: Route for admins to get a list of all users
router.get('/', verifyToken, verifyAdmin, getAllUsers);


module.exports = router;