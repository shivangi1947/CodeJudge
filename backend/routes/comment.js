// In routes/comment.js
const express = require('express');
const router = express.Router();
const { getCommentsForProblem, postComment } = require('../controllers/comment');
const  verifyToken  = require('../middleware/verifyToken');

router.get('/:problemId', verifyToken, getCommentsForProblem);
router.post('/:problemId', verifyToken, postComment);

module.exports = router;