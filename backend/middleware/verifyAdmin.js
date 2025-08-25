// In middleware/verifyAdmin.js
const User = require('../models/user');

const verifyAdmin = async (req, res, next) => {
    try {
        // Log the user ID passed from the verifyToken middleware
        console.log("ADMIN CHECK: User ID from token:", req.user.id);

        const user = await User.findById(req.user.id);
        
        // Log the full user object fetched from the database
        console.log("ADMIN CHECK: User found in DB:", user);
        
        // Log the role to see its exact value
        console.log("ADMIN CHECK: User's role is:", `"${user.role}"`);

        if (user && user.role === 'admin') {
            console.log("ADMIN CHECK: Success! User is an admin.");
            next();
        } else {
            console.log("ADMIN CHECK: Failed! User is not an admin.");
            return res.status(403).json({ message: "Forbidden: Admin access required." });
        }
    } catch (error) {
        console.error("ADMIN CHECK: Error in verifyAdmin middleware", error);
        return res.status(500).json({ message: "Server error during admin verification." });
    }
};

module.exports = verifyAdmin;