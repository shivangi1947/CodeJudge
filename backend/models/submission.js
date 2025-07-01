const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  language: {
    type: String,
    enum: ['C++', 'Java', 'Python', 'JavaScript'],
    required: true
  },

  code: {
    type: String,
    required: true
  },

  verdict: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending'],
    default: 'Pending'
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // includes createdAt & updatedAt
});

module.exports = mongoose.model('Submission', SubmissionSchema);
