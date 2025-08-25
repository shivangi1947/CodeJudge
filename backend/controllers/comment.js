// In controllers/comment.js
const Comment = require('../models/comment');
const User = require('../models/user'); // <-- Add this line

exports.getCommentsForProblem = async (req, res) => {
  try {
    const comments = await Comment.find({ problemId: req.params.problemId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { content } = req.body;

    // This line will now work correctly
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    const newComment = new Comment({
      content,
      problemId: req.params.problemId,
      userId: req.user.id,
      username: user.username
    });
    
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ message: 'Failed to post comment.' });
  }
};