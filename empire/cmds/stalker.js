const axios = require('axios');
const fg = require('api-dylux');
const config = require('../../config');
const { cmd, commands } = require('../command');
const prefix = config.PREFIX;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, saveConfig, Catbox, monospace } = require('../funcs');

cmd({
    pattern: "gitstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "stalker",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) return reply("Please provide a GitHub username.");

        const username = args[0].trim();
        const apiUrl = `https://api.agatz.xyz/api/ghtstalk?name=${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data.result;

        const userInfo = {
            image: { url: data.avatar_url },
            caption: `
╭───「 𝚂𝚃𝙰𝙻𝙺𝙴𝚁 」───◆  
│ ∘ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${data.name || data.login}  
│ ∘ 𝙶𝚒𝚝𝙷𝚞𝚋 𝚄𝚁𝙻: ${data.html_url}  
│ ∘ 𝙱𝚒𝚘: ${data.bio || 'Not available'}  
│ ∘ 𝙻𝚘𝚌𝚊𝚝𝚒𝚘𝚗: ${data.location || 'Unknown'}  
│ ∘ 𝙿𝚞𝚋𝚕𝚒𝚌 𝚁𝚎𝚙𝚘𝚜: ${data.public_repos}  
│ ∘ 𝙵𝚘𝚕𝚕𝚘𝚠𝚎𝚛𝚜: ${data.followers} 
│ ∘ 𝙵𝚘𝚕𝚕𝚘𝚠𝚒𝚗𝚐: ${data.following}  
│ ∘ 𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝙳𝚊𝚝𝚎: ${new Date(data.created_at).toDateString()}  
│ ∘ 𝙿𝚞𝚋𝚕𝚒𝚌 𝙶𝚒𝚜𝚝𝚜: ${data.public_gists}  
╰───────────────────

${global.caption}`,
            contextInfo: {
                mentionedJid: [mek.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363337275149306@newsletter",
                    newsletterName: global.botname,
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, userInfo, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`Error fetching data 🤕: ${e.response?.data?.message || e.message}`);
    }
});

cmd({
    pattern: "tgstalker",
    desc: "Fetch detailed Telegram user profile including profile picture.",
    category: "stalker",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) return reply("Please provide a Telegram username.");

        const username = args[0].trim();
        const apiUrl = `https://api.nexoracle.com/stalking/telegram-user?apikey=MepwBcqIM0jYN0okD&user=${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data.result;

        const userInfo = {
            image: { url: data.photo },
            caption: `
╭──「 𝚂𝚃𝙰𝙻𝙺𝙴𝚁 」───◆  
│ ∘ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${data.name}  
│ ∘ 𝙱𝚒𝚘: ${data.bio || 'Not available'}  
│ ∘ 𝙷𝚊𝚗𝚍𝚕𝚎: @${data.username}  
╰────────────────

${global.caption}`,
            contextInfo: {
                mentionedJid: [mek.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363337275149306@newsletter",
                    newsletterName: global.botname,
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, userInfo, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`Error fetching data 🤕: ${e.response?.data?.message || e.message}`);
    }
});