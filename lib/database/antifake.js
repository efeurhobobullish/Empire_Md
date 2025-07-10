const mongoose = require("mongoose");

const AntiFakeSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  deleteCodes: { type: [String], default: [] },
  kickCodes: { type: [String], default: [] },
  enabled: { type: Boolean, default: false }
});

module.exports = mongoose.model("AntiFake", AntiFakeSchema);