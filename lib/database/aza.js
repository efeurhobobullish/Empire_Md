const mongoose = require('mongoose');

const AzadbSchema = new mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    bankname: { type: String, required: true }
});

const azadb = mongoose.model("azadb", AzadbSchema);
module.exports = { azadb };
