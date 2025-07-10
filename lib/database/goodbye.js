const mongoose = require('mongoose');

const goodbyeSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Goodbye', goodbyeSchema);