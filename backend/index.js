const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 5000;
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const submissionRoutes = require('./routes/submission');
//const runRoutes = require('./routes/runRoutes');
//const protect = require('./middleware/auth');
//const verifyToken = require('./middleware/verifyToken');

connectDB();

// Middleware
app.use(cors({origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // supports form-data (x-www-form-urlencoded)
app.use(cookieParser()); //  enables req.cookies
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
//app.use('/api', runRoutes);  run aur submit ke ek hi routes hain



// Routes
app.get('/', (req, res) => {
  res.send('Welcome to CodeJudge backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
