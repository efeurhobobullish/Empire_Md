const mongoose = require("mongoose");

const AutoBioSchema = new mongoose.Schema({
    enabled: { type: Boolean, default: false },
    type: { type: String, default: "quote" },
    interval: { type: Number, default: 60000 }
});

const autobioDB = mongoose.model("autobioDB", AutoBioSchema);

module.exports = { autobioDB };
