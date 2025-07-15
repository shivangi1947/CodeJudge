const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address']
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

 
}, {
  timestamps: true // adds createdAt and updatedAt
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
