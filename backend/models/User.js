const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  phone:  { type: String, required: true },
  role:   { type: String, enum: ['Admin', 'User'], default: 'User' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);