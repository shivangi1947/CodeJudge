const Problem = require("../models/problem");

// This function is now much cleaner!
exports.createProblem = async (req, res) => {
  try {
    // The data is already validated by the middleware. We can use it directly.
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (err) {
    // Handle potential database errors, e.g., a non-unique title
    if (err.code === 11000) {
      return res.status(409).json({ message: "A problem with this title already exists." });
    }
    console.error("❌ Error creating problem:", err);
    res.status(500).json({ message: "Failed to create problem", error: err.message });
  }
};

// --- Your other functions remain unchanged ---

exports.getAllProblems = async (req, res) => {
  try {
    const { search, difficulty, tags } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: tags.split(',').map(tag => tag.trim()) };

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalProblems = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      problems,
      currentPage: page,
      totalPages: Math.ceil(totalProblems / limit),
      totalProblems,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch problems!", error: err.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, 
      { new: true, runValidators: true } 
    );
    if (!updatedProblem) return res.status(404).json({ message: 'Problem not found' });
    res.status(200).json(updatedProblem);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Problem not found' });
    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
};