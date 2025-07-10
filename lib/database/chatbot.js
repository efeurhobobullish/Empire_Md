const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false }
});

const ChatBotDB = mongoose.model("ChatBotDB", chatbotSchema);
module.exports = { ChatBotDB };

// Helper Functions
async function setChatBot(groupId, status) {
  let data = await ChatBotDB.findOne({ groupId });
  if (!data) {
    data = new ChatBotDB({ groupId, enabled: status });
  } else {
    data.enabled = status;
  }
  await data.save();
  return data;
}

async function getChatBot(groupId) {
  return await ChatBotDB.findOne({ groupId });
}

module.exports = { setChatBot, getChatBot };