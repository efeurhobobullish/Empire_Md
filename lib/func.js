const fs = require('fs');
const axios = require('axios');
const path = './config.env';
const FormData = require("form-data");



//Catbox image upload 
async function Catbox(filePath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error("❌ File not found."));
        }
        try {
            const form = new FormData();
            form.append("reqtype", "fileupload");
            form.append("fileToUpload", fs.createReadStream(filePath));

            axios({
                url: "https://catbox.moe/user/api.php",
                method: "POST",
                headers: { ...form.getHeaders() },
                data: form,
            })
            .then(response => {
                if (response.data.startsWith("https://")) {
                    resolve(response.data.trim());
                } else {
                    reject(new Error("❌ Upload failed."));
                }
            })
            .catch(err => {
                reject(new Error(String(err)));
            });
        } catch (err) {
            reject(new Error(String(err)));
        }
    });
}

// Fetch a buffer from a URL
const getBuffer = async (url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'get',
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (e) {
        console.error(e);
        return null;
    }
};

// Get admin participants from a group
const getGroupAdmins = (participants) => {
    const admins = [];
    for (let participant of participants) {
        if (participant.admin !== null) admins.push(participant.id);
    }
    return admins;
};

// Generate a random string with an extension
const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

function monospace(input) {
    return `\`\`\`${input}\`\`\``;
};

// Format large numbers with suffixes (e.g., K, M, B)
const h2k = (eco) => {
    const lyrik = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const ma = Math.floor(Math.log10(Math.abs(eco)) / 3);
    if (ma === 0) return eco.toString();
    const scale = Math.pow(10, ma * 3);
    const scaled = eco / scale;
    const formatted = scaled.toFixed(1).replace(/\.0$/, '');
    return formatted + lyrik[ma];
};

// Check if a string is a URL
const isUrl = (url) => {
    return url.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/
    );
};


// Convert a JavaScript object or array to a JSON string
const Json = (string) => {
    return JSON.stringify(string, null, 2);
};

// Function to calculate and format uptime
const runtime = (seconds) => {
    seconds = Math.floor(seconds);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days) parts.push(`${days} days`);
    if (hours) parts.push(`${hours} hours`);
    if (minutes) parts.push(`${minutes} minutes`);
    if (secs || parts.length === 0) parts.push(`${secs} seconds`);

    return parts.join(' ');
};

// Delay execution for a specified time
const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Fetch JSON from a URL
const fetchJson = async (url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        });
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};


// Save config settings
const saveConfig = (key, value) => {
    let configData = fs.existsSync(path) ? fs.readFileSync(path, 'utf8').split('\n') : [];
    let found = false;

    configData = configData.map(line => {
        if (line.startsWith(`${key}=`)) {
            found = true;
            return `${key}=${value}`;
        }
        return line;
    });

    if (!found) configData.push(`${key}=${value}`);

    fs.writeFileSync(path, configData.join('\n'), 'utf8');

    // Reload updated environment variables
    require('dotenv').config({ path });
};

const dBinary = async (str) => {
    try {
        const newBin = str.split(" ");
        const binCode = newBin.map(bin => String.fromCharCode(parseInt(bin, 2)));
        return binCode.join("");
    } catch (e) {
        console.error(e);
        return null;
    }
};

const eBinary = async (str = "") => {
    try {
        return str.split("").map(char => char.charCodeAt(0).toString(2)).join(" ");
    } catch (e) {
        console.error(e);
        return null;
    }
};


module.exports = { 
    getBuffer, 
    getGroupAdmins, 
    getRandom, 
    h2k, 
    isUrl, 
    Json, 
    runtime, 
    sleep, 
    fetchJson,
    saveConfig,
    Catbox,
    monospace,
    dBinary,
    eBinary,
};