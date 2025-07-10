const mongoose = require('mongoose');

const antiVVSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  enabled: { type: String, enum: ['on', 'dm'], default: 'off' }
});

module.exports = mongoose.model('AntiVV', antiVVSchema);
