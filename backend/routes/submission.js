const express = require('express');
const router = express.Router();
const {
  getSubByUser,
  getSubByProblem,
  runCode,
  submitCode,
} = require('../controllers/submission');


router.get('/user/:userId', getSubByUser);
router.get('/problem/:problemId', getSubByProblem);
router.post('/run', runCode);
router.post('/submit',submitCode);

module.exports = router;
