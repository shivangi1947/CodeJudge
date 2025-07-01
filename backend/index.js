const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 5000;
const authRoutes = require('./routes/auth');
const protect = require('./middleware/auth');



// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // supports form-data (x-www-form-urlencoded)
app.use(cookieParser()); // 🔑 enables req.cookies
app.use('/api/auth', authRoutes);

connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to CodeJudge backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
