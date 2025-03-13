//---------------------------------------------------------------------------
//           EMPIRE-MD  
//---------------------------------------------------------------------------
//  @project_name : EMPIRE-MD  
//  @author       : efeurhobo  
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------

const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yts = require('yt-search');
const config = require('../../config');
const url = require('url');
const prefix = config.PREFIX;

//---------------------------------------------------------------------------
//            AUDIO COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "audio", 
    alias: ["play"],
    desc: "Download songs", 
    category: "downloader",
    react: "⏳",
    filename: __filename, 
  },
  async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
   try {
      if (!q) return reply("Send me url or title name");

      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;

      const response = await fetch(
        `https://giftedtech-ytdl-api.hf.space/api/yt?query=${encodeURIComponent(url)}`
      );
      const json = await response.json();
      
      if (!json.success) return reply("❌ Failed to fetch audio. Please try again.");

      const { title, audio_url } = json.result;

      await reply(`_Downloading ${title}_`);

      await conn.sendMessage(
        from,
        {
          audio: { url: audio_url },
          mimetype: "audio/mpeg",
        },
        { quoted: mek }
      );

      await m.react("✅");
    } catch (e) {
      console.error("Error in play command:", e);
      reply(`❌ Error: ${e.message}`);
    }
  });


//---------------------------------------------------------------------------
//            VIDEO COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "video",
    alias: ["mp4"],
    desc: "Download videos",
    category: "downloader",
    react: "⏳",
    filename: __filename, 
  },
  async(conn, mek, m, { from, quoted, q, reply }) => {
    try {
      if (!q) return reply("Send me a URL or video title.");

      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;

      const response = await fetch(
        `https://giftedtech-ytdl-api.hf.space/api/yt?query=${encodeURIComponent(url)}`
      );
      const json = await response.json();
      
      if (!json.success) return reply("❌ Failed to fetch audio. Please try again.");

      const { title, video_url } = json.result;

      await reply(`_Downloading ${title}_`);

      await conn.sendMessage(
        from,
        {
          audio: { url: video_url },
          mimetype: "video/mp4",
        },
        { quoted: mek }
      );

      await m.react("✅");
    } catch (e) {
      console.error("Error in play command:", e);
      reply(`❌ Error: ${e.message}`);
    }
  });

//---------------------------------------------------------------------------
//            TIKTOK COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "tiktok",
    desc: "Download a TikTok video without watermark.",
    react: "🎥",
    category: "downloader",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please provide the TikTok video URL.");

        const tiktokUrl = encodeURIComponent(q);
        const apiUrl = `https://api.nexoracle.com/downloader/tiktok-nowm?apikey=MepwBcqIM0jYN0okD&url=${tiktokUrl}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status !== 200 || !data.result) {
            return reply("Unable to fetch TikTok video. Please check the URL.");
        }

        const videoDetails = data.result;
        const videoUrl = videoDetails.url;
        const title = videoDetails.title;
        const authorName = videoDetails.author.nickname;
        const thumbnailUrl = videoDetails.thumbnail;

        const infoMessage = {
            image: { url: thumbnailUrl },
            caption: `
╭────「 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 」──────◆  
│   
│ ∘ 𝚃𝚒𝚝𝚕𝚎: ${title}  
│ ∘ 𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗: ${videoDetails.duration}s  
│ ∘ 𝙰𝚞𝚝𝚑𝚘𝚛: ${authorName}  
│───────────────────────  
│ ∘ 𝙳𝚒𝚛𝚎𝚌𝚝 𝚃𝚒𝚔𝚃𝚘𝚔 𝙻𝚒𝚗𝚔: ${q}  
│───────────────────────  
│ ${global.caption}  
╰───────────────────────`,
            contextInfo: {
                mentionedJid: [mek.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363337275149306@newsletter',
                    newsletterName: global.botname,
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, infoMessage, { quoted: mek });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            fileName: `${title}.mp4`,
            mimetype: 'video/mp4',
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: title,
                    body: global.caption,
                    thumbnailUrl: thumbnailUrl,
                    sourceUrl: global.channelUrl,
                    mediaType: 2, // video
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await m.react("✅");
    } catch (e) {
        console.error("Error in tiktok download command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
//---------------------------------------------------------------------------
//         GOGGLE DRIVE COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "gdrive",
    desc: "Download Google Drive Files",
    category: "downloader",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, pushname, command, args, q, reply }) => {
    try {
        if (!q) {
            return reply("Please send me the Google Drive link.");
        }

        const url = q.trim();
        const apiUrl = `https://api.nexoracle.com/downloader/gdrive?apikey=ae1fa2a45a76baba7d&url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.result || !response.data.result.downloadUrl) {
            return reply("Sorry, I couldn't fetch the file. Make sure the link is valid.");
        }

        const fileData = response.data.result;

        const infoMessage = {
            caption: `
╭─────「 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 」────◆  
│   
│ ∘ 𝙵𝚒𝚕𝚎 𝙽𝚊𝚖𝚎: ${fileData.fileName}  
│ ∘ 𝙼𝙸𝙼𝙴 𝚃𝚢𝚙𝚎: ${fileData.mimetype}  
│ ∘ 𝚂𝚒𝚣𝚎: ${fileData.size}  
│──────────────────────
│ ⦿ 𝙶𝚘𝚘𝚐𝚕𝚎 𝙳𝚛𝚒𝚟𝚎 𝙻𝚒𝚗𝚔: ${url}  
│──────────────────────
│ ${global.caption}  
╰──────────────────────`,
            contextInfo: {
                mentionedJid: [mek.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363337275149306@newsletter',
                    newsletterName: global.botname,
                    serverMessageId: 143
                }
            }
        };

        await conn.sendMessage(from, infoMessage, { quoted: mek });

        await conn.sendMessage(from, {
            document: { url: fileData.downloadUrl },
            mimetype: fileData.mimetype,
            fileName: fileData.fileName,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: fileData.fileName,
                    body: global.caption,
                    thumbnailUrl: fileData.thumbnailUrl || global.defaultThumbnail,
                    sourceUrl: global.channelUrl,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await m.react("✅");
    } catch (e) {
        console.error("Error in gdrive download command:", e);
        reply(`❌ Error: ${e.message || e.response?.data?.error || e}`);
    }
});
//---------------------------------------------------------------------------
//            PINTEREST COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "pinterest",
    desc: "Download media from Pinterest.",
    category: "downloader",
    filename: __filename,
}, async (conn, mek, m, { args, pushname,reply }) => {
    try {
        const pinterestUrl = args[0];
        if (!pinterestUrl) {
            return reply("Please provide the Pinterest media URL.");
        }

        const response = await axios.get(`https://api.giftedtech.web.id/api/download/pinterestdl?apikey=_0x5aff35,_0x1876stqr&url=${encodeURIComponent(pinterestUrl)}`);
        const downloadUrl = response.data.result.url;

        if (!downloadUrl) {
            return reply("❌ Unable to fetch the Pinterest media. Please check the URL and try again.");
        }

        await conn.sendMessage(m.from, {
            image: { url: downloadUrl },
            caption: global.caption
        });
        await m.react("✅");
    } catch (err) {
        console.error("Error fetching Pinterest media URL:", err);
        return reply("❌ Unable to fetch Pinterest media. Pl ease try again later.");
    }
});
//---------------------------------------------------------------------------
//            GITCLONE COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "gitclone",
    desc: "Clone a GitHub repository.",
    category: "downloader",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        const repoUrl = args[0];
        if (!repoUrl) {
            return reply("Please provide the GitHub repository URL.");
        }

        // Send the API request to fetch the download URL for the GitHub repository
        const response = await axios.get(`https://api.giftedtech.my.id/api/download/gitclone?apikey=gifted&url=${encodeURIComponent(repoUrl)}`);
        const result = response.data.result;

        if (!result || !result.url) {
            return reply("❌ Unable to fetch the GitHub repository. Please check the URL and try again.");
        }

        const downloadUrl = result.url;

        // Send the repository ZIP file to the user
        await conn.sendMessage(m.from, {
            document: { url: downloadUrl },
            fileName: "repository.zip",
            mimetype: "application/zip",
            caption: "GitHub Repository Download",
        });
        await m.react("✅");
    } catch (err) {
        console.error("Error fetching GitHub repository URL:", err);
        return reply("❌ Unable to fetch GitHub repository. Please try again later.");
    }
});
//---------------------------------------------------------------------------
//            FACEBOOK COMMANDS
//---------------------------------------------------------------------------
cmd({
  pattern: "facebook",
  alias: "fbdl",
  react: "🚀",
  category: "downloader",
  desc: "Fetches Facebook video download link.",
  use: "<url>",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, pushname, q, reply }) => {
  try {
    if (!q) {
      return reply(`Example:\n*${config.PREFIX}facebook <url>*`);
    }

    const apiUrl = `https://api.nexoracle.com/downloader/facebook?apikey=MepwBcqIM0jYN0okD&url=${encodeURIComponent(q)}`;
    const result = await axios.get(apiUrl);

    if (!result.data) {
      return reply(`*Something went wrong. Please try again later.*`);
    }

    const data = result.data.result;

    const infoMessage = {
      video: { url: data.sd },
      caption: `
╭───「 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 」────◆
│  
│ ∘ 𝚃𝚒𝚝𝚕𝚎: ${data.title}  
│ ∘ 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${data.desc}  
│─────────────────────
│ ∘ 𝙳𝚒𝚛𝚎𝚌𝚝 𝚅𝚒𝚍𝚎𝚘 𝙻𝚒𝚗𝚔: ${data.sd}  
╰─────────────────────`,
      fileName: "facebook_video.mp4",
      mimetype: "video/mp4"
    };

    await conn.sendMessage(from, infoMessage, { quoted });

  } catch (e) {
    return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
  }
});
//---------------------------------------------------------------------------
//            APK COMMANDS
//---------------------------------------------------------------------------
cmd({
    pattern: "apk",
    desc: "Fetches and downloads APK file.",
    category: "downloader",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, pushname, q, reply }) => {
    try {
        if (!q) {
            return reply(`*Please provide a query, ${pushname}!*`);
        }

        const apiUrl = `https://api.nexoracle.com/downloader/apk?apikey=MepwBcqIM0jYN0okD&q=${encodeURIComponent(q)}`;
        const result = await axios.get(apiUrl);

        if (!result.data) {
            return reply(`*Something went wrong. Please try again later.*`);
        }

        const data = result.data.result;
        const apkUrl = data.dllink;
        const fileName = `${data.name}.apk`;
        const filePath = path.join(__dirname, fileName);

        const response = await axios({
            url: apkUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', async () => {
            await conn.sendMessage(
                from,
                {
                    document: { url: filePath },
                    caption: `
╭──「 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 」───◆
│  
│ ∘ 𝙰𝚙𝚙 𝙽𝚊𝚖𝚎: ${data.name}  
│ ∘ 𝚂𝚒𝚣𝚎: ${data.size}  
│ ∘ 𝚀𝚞𝚎𝚛𝚢: ${q}  
│────────────────
│ ${global.caption}  
╰────────────────`,
                    fileName: fileName,
                    mimetype: "application/vnd.android.package-archive"
                },
                { quoted: mek }
            );

            fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
            throw err;
        });

    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});
