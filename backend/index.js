const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 5000;
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const submissionRoutes = require('./routes/submission');
const runRoutes = require('./routes/runRoutes');
const protect = require('./middleware/auth');

connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // supports form-data (x-www-form-urlencoded)
app.use(cookieParser()); //  enables req.cookies
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api', runRoutes);



// Routes
app.get('/', (req, res) => {
  res.send('Welcome to CodeJudge backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
