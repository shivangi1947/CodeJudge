const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Get the token from the cookies sent by the browser
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;