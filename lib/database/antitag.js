const mongoose = require("mongoose");

const AntiTagSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  mode: { type: String, default: "off" } // "off", "delete", "warn", "kick"
});

const antitagdb = mongoose.model("antitagdb", AntiTagSchema);

async function getAntiTag(groupId) {
  return await antitagdb.findOne({ groupId });
}

async function setAntiTag(groupId, mode) {
  let data = await antitagdb.findOne({ groupId });
  if (!data) {
    data = new antitagdb({ groupId, mode });
  } else {
    data.mode = mode;
  }
  await data.save();
  return data;
}

module.exports = { antitagdb, getAntiTag, setAntiTag };