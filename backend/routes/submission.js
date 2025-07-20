const express = require('express');
const router = express.Router();
const {
  getSubByUser,
  getSubByProblem,
  runCode,
  submitCode,
} = require('../controllers/submission');


router.get('/user/:userId',getSubByUser); // user ka submission for all question
router.get('/user/:userId/problem/:problemId', getSubByProblem); //ek problem me ek user ke kitne submission hue hain
router.post('/run',runCode); // run me compiler ko code send hoga
router.post('/submit',submitCode);  // submit me compiler ko code denge
//all tested finally
module.exports = router;
