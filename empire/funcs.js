//---------------------------------------------------------------------------
//           Empire_Md  
//---------------------------------------------------------------------------
//  @project_name : Empire_Md  
//  @author       : efeurhobobullish
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
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
    const d = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;
    const h = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
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

//monospace
function monospace(input) {
    const customFont = {
        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶',
        'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽',
        'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄',
        'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐',
        'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗',
        'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞',
        'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
        '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼',
        '7': '𝟽', '8': '𝟾', '9': '𝟿',
        ' ': ' ' // Preserve spaces
    };
    return input.split('').map(char => customFont[char] || char).join('');
}

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
    monospace
};
