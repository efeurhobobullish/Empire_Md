const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Welcome', welcomeSchema);
