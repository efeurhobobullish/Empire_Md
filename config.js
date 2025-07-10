const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });


module.exports = {
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
    ANTICALL: process.env.ANTICALL || "false",
    ANTICALL_MSG: process.env.ANTICALL_MSG || "",
    AUTO_LIKE_EMOJI: process.env.AUTO_LIKE_EMOJI || "",
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "false",
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
    AUTO_TYPING: process.env.AUTO_TYPING || "false",
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || "false",
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
    HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
    MODE: process.env.MODE || "private",
    MONGODB_URL: process.env.MONGODB_URL || "",
    OWNER_NAME: process.env.OWNER_NAME || "Empire Tech",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "2348078582627",
    PREFIX: process.env.PREFIX || ".",
    SUDO: process.env.SUDO || "",
    SESSION_ID: process.env.SESSION_ID || "fill ur session id",
    TIME_ZONE: process.env.TIME_ZONE || "Africa/Lagos"
};
