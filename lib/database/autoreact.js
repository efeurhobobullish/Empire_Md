const mongoose = require("mongoose");

const AutoReactSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
});

module.exports = mongoose.model("AutoReactDB", AutoReactSchema);