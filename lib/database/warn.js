const mongoose = require('mongoose');

const WarnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  group: { type: String, required: true },
  reason: { type: String, default: "No reason provided" },
  warnedby: { type: String, default: "" },
  warnCount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const warndb = mongoose.model("warndb", WarnSchema);
module.exports = { warndb };