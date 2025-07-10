const mongoose = require("mongoose");

const AfkSchema = new mongoose.Schema({
  id: { type: String, required: true },
  reason: { type: String, default: 'I am AFK' },
  time: { type: Number, default: 0 },
}, { timestamps: true });

const Afk = mongoose.model("Afk", AfkSchema);

module.exports = Afk;
