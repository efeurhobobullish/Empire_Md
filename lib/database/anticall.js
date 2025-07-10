const mongoose = require("mongoose");

const antiCallSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false }
});

module.exports = mongoose.model("antiCallDB", antiCallSchema);