const mongoose = require("mongoose");

const AntiLinkSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  mode: { type: String, default: "off" } // off | delete | kick | warn
});

const AntiLink = mongoose.model("antilink", AntiLinkSchema);

async function getAntiLink(id) {
  return await AntiLink.findOne({ id });
}

async function setAntiLink(id, mode) {
  let data = await AntiLink.findOne({ id });
  if (!data) {
    data = new AntiLink({ id, mode });
  } else {
    data.mode = mode;
  }
  await data.save();
  return data;
}

async function removeAntiLink(id) {
  return await AntiLink.deleteOne({ id });
}

module.exports = {
  AntiLink,
  getAntiLink,
  setAntiLink,
  removeAntiLink
};