const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  statement: {
    type: String,
    required: true
  },

  testCases: [
  {
    input: String,
    expectedOutput: String
  }
]
,
  constraints: {
    type: String,
    required: true
  },

  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  
  tags:
  {
    type:[String]
  }
  
}, 
{
  timestamps: true
});

module.exports = mongoose.model('Problem', ProblemSchema);
