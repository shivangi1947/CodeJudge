const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // ⭐ Add index for fast lookups by title
  },
  statement: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
    index: true // ⭐ Add index for filtering/sorting
  },
  tags: {
    type: [String],
    index: true // ⭐ Add index for filtering by tags
  },
  constraints: {
    type: String,
    required: true
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false, required: true }
  }],
  boilerplate: {
    type: String, // Just store the C++ code stub directly
    required: true,
    default: '#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}'
  },
  editorial: {
    type: String,
    default: ''
  },
  // --- Execution & Stats ---
  timeLimit: {
    type: Number, // in milliseconds
    required: true,
    default: 2000 
  },
  memoryLimit: {
    type: Number, // in kilobytes
    required: true,
    default: 256000 
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  successfulSubmissions: {
    type: Number,
    default: 0
  },
  // You could also add an author field
  // author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Problem', ProblemSchema);