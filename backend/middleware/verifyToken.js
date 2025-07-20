const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

 const token = authHeader.split(" ")[1];
console.log("Decoded token before verification:", token);


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify with your secret
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to route/controller
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
