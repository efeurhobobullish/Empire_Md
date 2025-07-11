const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('baileys-pro');

const events = require('./lib/command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, saveConfig, Catbox, monospace, ebinary, dbinary } = require('./lib/func');
const { sms, downloadMediaMessage } = require('./lib/msg');
const { Boom } = require ('@hapi/boom');
const fs = require('fs');
const P = require('pino');
const path = require('path');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const axios = require('axios');
const jimp = require('jimp');
const { File } = require('megajs');
const { exec } = require("child_process");
const mode = config.MODE;
const prefix = config.PREFIX;
const ownerNumber = [config.OWNER_NUMBER];
const ffmpeg = require('fluent-ffmpeg');
const { getChatBot } = require("./lib/database/chatbot");
const { getAntiLink } = require("./lib/database/antilink");
const { warndb } = require("./lib/database/warn");
const { getAntiTag } = require("./lib/database/antitag");
const Afk = require('./lib/database/afk'); 
const AntiFake = require("./lib/database/antifake");
const antiCallDB = require("./lib/database/anticall");
const { doReact, emojis } = require("./lib/autoreact");
const AutoReactDB = require("./lib/database/autoreact");
const Goodbye = require("./lib/database/goodbye");
const Welcome  = require("./lib/database/welcome");
const { OpenAI } = require("openai");



const afkNotified = new Set();
function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [
    h ? `${h}h` : null,
    m ? `${m}m` : null,
    s ? `${s}s` : null,
  ].filter(Boolean).join(' ') || '0s';
}


if (!fs.existsSync(__dirname + '/lib/auth_info_baileys/creds.json')) {  
  if(!config.SESSION_ID) return console.log('Add your session id to SESSION_ID in config.js !!');  
  const sessdata = config.SESSION_ID;  
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);  
  filer.download((err, data) => {  
      if(err) throw err;  
      fs.writeFile(__dirname + '/lib/auth_info_baileys/creds.json', data, () => {  
          console.log("");  
      });  
  });  
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
const connectDB = require('./lib/mongodb');
const db = await connectDB();
global.dbType = db.type;

if (db.type === 'mongo') {
   console.log('⏳ Syncing MongoDB Database!');
} else {
    console.log('⏳ Database syncing!');
  global.db = db.use;
}

  console.log("ℹ️ Connecting to WhatsApp!");

  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/lib/auth_info_baileys/');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    markOnlineOnConnect: false,
    defaultQueryTimeoutMs: 60000,
    fireInitQueries: true,
    msgRetryCounterCache: new Map(),
    auth: state,
    version
  });

conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        if (statusCode !== DisconnectReason.loggedOut) {
            connectToWA();
        } else {
            console.log('❌ Logged out from Empire_Md');
        }
    }

    if (connection === 'open') {
        console.log('✅ Whatsapp Login Successful!');

        const path = require('path');
        fs.readdirSync("./commands/").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() == ".js") {
                require("./commands/" + plugin);
            }
        });

        console.log('⬇️  Installing External Plugins.');
        console.log('✅  External Plugins Installed!');

        const events = require('./lib/command');
        const totalCommands = Array.isArray(events.commands) ? events.commands.length : 0;

        let up = `
  Empire_Md Connected

  Prefix  : [ ${prefix} ]
  Pluggins : ${totalCommands}
  Mode    : ${monospace(mode)}
  Database  : ${dbType.toUpperCase()}

 Subscribe To YouTube 
youtube.com/@only_one_empire`;

        console.log(up);
        conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, { text: up });
    }
});

conn.ev.on('creds.update', saveCreds)


conn.ev.on('group-participants.update', async (update) => {
  if (!update || typeof update !== 'object') return;

  const groupId = update.id;
  const participants = update.participants || [];
  const action = update.action;

  if (action !== 'add' || !groupId || participants.length === 0) return;

  let groupMetadata, groupName = '', groupDescription = '', participantCount = 0;

  try {
    groupMetadata = await conn.groupMetadata(groupId);
    groupName = groupMetadata?.subject || 'Unknown Group';
    groupDescription = groupMetadata?.desc || 'No description available.';
    participantCount = groupMetadata?.participants?.length || 0;
  } catch (e) {
    console.error('❌ Error fetching group metadata (welcome):', e);
    return;
  }

  let groupData = null;
  try {
    if (global.dbType === 'mongo') {
      groupData = await Welcome.findOne({ groupId });
    } else {
      const welcomeDb = await global.db('welcome');
      groupData = welcomeDb.data[groupId] || null;
    }

    if (!groupData || groupData.enabled === false) return;
  } catch (err) {
    console.error('❌ Welcome DB error:', err);
    return;
  }

  for (const participant of participants) {
    const userJid = participant;
    const userNumber = userJid.split('@')[0];

    let ppUrl = 'https://files.catbox.moe/lps6ow.jpg';
    try {
      ppUrl = await conn.profilePictureUrl(userJid, 'image');
    } catch {}

    const message = groupData.message
      ?.replace('@user', `@${userNumber}`)
      .replace('@group', groupName)
      .replace('@count', participantCount)
      .replace('@pp', ppUrl);

    const defaultCaption = `🎉 *Welcome to ${groupName}!* 🎉\n\n👤 @${userNumber} joined the group!\n\n👥 *Total Members:* ${participantCount}\n📌 *Description:* ${groupDescription}`;

    await conn.sendMessage(groupId, {
      image: { url: ppUrl },
      caption: message || defaultCaption
    }, { mentions: [userJid] });
  }
});

conn.ev.on('group-participants.update', async (update) => {
  if (!update || typeof update !== 'object') return;

  const groupId = update.id;
  const participants = update.participants || [];
  const action = update.action;

  if (action !== 'remove' || !groupId || participants.length === 0) return;

  let groupMetadata, groupName = '', groupDescription = '', participantCount = 0;

  try {
    groupMetadata = await conn.groupMetadata(groupId);
    groupName = groupMetadata?.subject || 'Unknown Group';
    groupDescription = groupMetadata?.desc || 'No description available.';
    participantCount = groupMetadata?.participants?.length || 0;
  } catch (e) {
    console.error('❌ Error fetching group metadata (goodbye):', e);
    return;
  }

  let groupData = null;
  try {
    if (global.dbType === 'mongo') {
      groupData = await Goodbye.findOne({ groupId });
    } else {
      const goodbyeDb = await global.db('goodbye');
      groupData = goodbyeDb.data[groupId] || null;
    }

    if (!groupData || groupData.enabled === false) return;
  } catch (err) {
    console.error('❌ Goodbye DB error:', err);
    return;
  }

  for (const participant of participants) {
    const userJid = participant;
    const userNumber = userJid.split('@')[0];

    let ppUrl = 'https://files.catbox.moe/lps6ow.jpg';
    try {
      ppUrl = await conn.profilePictureUrl(userJid, 'image');
    } catch {}

    const message = groupData.message
      ?.replace('@user', `@${userNumber}`)
      .replace('@group', groupName)
      .replace('@count', participantCount)
      .replace('@pp', ppUrl);

    const defaultCaption = `😢 *Goodbye from ${groupName}!* 😢\n\n👤 @${userNumber} left the group.\n\n👥 *Total Members:* ${participantCount}\n📌 *Description:* ${groupDescription}`;

    await conn.sendMessage(groupId, {
      image: { url: ppUrl },
      caption: message || defaultCaption
    }, { mentions: [userJid] });
  }
});

conn.ev.on("messages.upsert", async ({ messages }) => {
  try {
    const m = messages[0];
    if (!m.message || !m.key.remoteJid || m.key.fromMe) return;

    const from = m.key.remoteJid;
    if (from === "status@broadcast") return;

    let data;

    if (global.dbType === "mongo") {
      data = await AutoReactDB.findOne({ id: "autoreact" });

    } else if (global.dbType === "json") {
      const db = await global.db("autoreact");
      await db.read();
      data = db.data || { id: "autoreact", enabled: false };
    }

    if (!data || !data.enabled) return;

    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    await doReact(emoji, m, conn);

  } catch (e) {
    console.error("AutoReact Error:", e);
  }
});

conn.ev.on("call", async (calls) => {
  try {
    const call = calls[0];
    const jid = call.from;

    let data;

    if (global.dbType === 'mongo') {
      data = await antiCallDB.findOne({ id: "anticall" });

    } else if (global.dbType === 'json') {
      const db = await global.db('anticall');
      await db.read(); // Ensure fresh data is loaded
      data = db.data || { id: "anticall", enabled: false };
    }

    if (!data || !data.enabled) return;

    if (call.status === "offer") {
      await conn.rejectCall(call.id, call.from, call.isGroup, call.participants);
      await conn.sendMessage(jid, {
        text: `🚫 Calls are not allowed.\nYour call was auto-declined.`
      });
    }

  } catch (e) {
    conn.sendMessage("status@broadcast", { text: `${e}` });
  }
});

conn.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0];
  if (!m.message || !m.key.remoteJid || m.key.remoteJid === "status@broadcast") return;

  const chat = m.key.remoteJid;
  const isGroup = chat.endsWith("@g.us");
  if (!isGroup) return;

  const sender = m.key.participant || m.key.remoteJid;
  const groupId = chat;

  let groupData;

  if (global.dbType === "mongo") {
    groupData = await AntiFake.findOne({ groupId });

  } else if (global.dbType === "json") {
    const db = await global.db('antifake');
    await db.read();
    groupData = db.data?.[groupId] || null;
  }

  if (!groupData || !groupData.enabled || !Array.isArray(groupData.deleteCodes)) return;

  const number = sender.split("@")[0];
  const shouldDelete = groupData.deleteCodes.some(code => number.startsWith(code));

  if (shouldDelete) {
    try {
      await conn.sendMessage(chat, {
        delete: {
          remoteJid: chat,
          fromMe: false,
          id: m.key.id,
          participant: sender,
        }
      });
    } catch (err) {
      console.error("❌ Failed to delete message:", err);
    }
  }
});

conn.ev.on("group-participants.update", async (update) => {
  try {
    const { id: groupId, participants, action } = update;
    if (action !== "add") return;

    let groupData;

    if (global.dbType === "mongo") {
      groupData = await AntiFake.findOne({ groupId });

    } else if (global.dbType === "json") {
      const db = await global.db('antifake');
      await db.read();
      groupData = db.data?.[groupId] || null;
    }

    if (!groupData || !groupData.enabled || !Array.isArray(groupData.kickCodes)) return;

    for (const participant of participants) {
      const number = participant.split("@")[0];
      if (!number || typeof number !== "string") continue;

      const shouldKick = groupData.kickCodes.some(code => number.startsWith(code));

      if (shouldKick) {
        await conn.sendMessage(groupId, {
          text: `🚫 +${number} is not allowed in this group and has been removed.`
        });
        await conn.groupParticipantsUpdate(groupId, [participant], "remove");
      }
    }

  } catch (err) {
    console.error("❌ Error in group-participants.update:", err);
  }
});

conn.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0];
  if (!m.message) return;

  const sender = m.key.participant || m.key.remoteJid;
  const chat = m.key.remoteJid;
  const fromMe = m.key.fromMe;

  const reply = (text) => conn.sendMessage(chat, { text }, { quoted: m });

  // ─── Auto un-AFK when YOU send a message ─────────────────────────────
  if (fromMe) {
    let senderAfk;

    if (global.dbType === 'mongo') {
      senderAfk = await Afk.findOne({ id: sender });
    } else if (global.dbType === 'json') {
      const db = await global.db('afk');
      await db.read();
      senderAfk = db.data?.[sender];
    }

    if (senderAfk) {
      if (global.dbType === 'mongo') {
        await Afk.deleteOne({ id: sender });
      } else {
        const db = await global.db('afk');
        delete db.data[sender];
        await db.write();
      }

      await reply(`✅ Welcome back! You were AFK for ${clockString(Date.now() - senderAfk.time)}.\nReason: ${senderAfk.reason}`);
    }
  }

  // ─── Notify if mentioned or replied user is AFK ─────────────────────
  const mentionUser = [
    ...new Set([
      ...(m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []),
      ...(m.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ? [m.message.extendedTextMessage.contextInfo.participant]
        : []),
    ]),
  ];

  for (let jid of mentionUser) {
    const key = `${chat}:${jid}`;
    if (afkNotified.has(key)) continue;

    let userAfk;

    if (global.dbType === 'mongo') {
      userAfk = await Afk.findOne({ id: jid });
    } else if (global.dbType === 'json') {
      const db = await global.db('afk');
      await db.read();
      userAfk = db.data?.[jid];
    }

    if (!userAfk) continue;

    await reply(`⚠️ That user is currently AFK${userAfk.reason ? `: ${userAfk.reason}` : ""}.\n⏱️ Since: ${clockString(Date.now() - userAfk.time)} ago.`);

    afkNotified.add(key);
    setTimeout(() => afkNotified.delete(key), 3 * 1000); // reset after 30s
  }
});

conn.ev.on("messages.upsert", async ({ messages }) => {
  try {
    const m = messages[0];
    if (!m.message || m.key.fromMe || !m.key.remoteJid.endsWith("@g.us")) return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const msgText = m.message.conversation || m.message.extendedTextMessage?.text || "";

    if (sender === conn.user.id.split(":")[0] + "@s.whatsapp.net") return;
    if (!msgText) return;

    let data;
    if (global.dbType === "mongo") {
      data = await chatBotDB.findOne({ id: from });
    } else if (global.dbType === "json") {
      const db = await global.db("chatbot");
      await db.read();
      data = db.data?.[from] || { id: from, enabled: false };
    }

    if (!data || !data.enabled) return;

    const aiResponse = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Empire_Md, a powerful AI built by Empire Tech. Answer in a helpful and precise manner."
        },
        {
          role: "user",
          content: msgText
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      }
    });

    const replyText = aiResponse.data.choices?.[0]?.message?.content || "🤖 No response.";
    await conn.sendMessage(from, {
      text: replyText,
      mentions: [sender]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage("status@broadcast", { text: `Empire_Md error: ${e.message}` });
  }
});
  

conn.ev.on("messages.upsert", async ({ messages }) => {
  try {
    const m = messages[0];
    if (!m.message || m.key.fromMe || !m.key.remoteJid.endsWith("@g.us")) return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const mentions = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length === 0) return;

    // Retrieve group anti-tag settings
    let groupData;
    if (global.dbType === "mongo") {
      groupData = await AntiTag.findOne({ groupId: from });
    } else {
      const db = await global.db("antitag");
      await db.read();
      groupData = db.data[from];
    }

    if (!groupData || groupData.mode === "off") return;

    // Delete the original message
    await conn.sendMessage(from, { delete: m.key });

    switch (groupData.mode) {
      case "delete":
        return;

      case "kick":
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        return conn.sendMessage(from, {
          text: `🚫 @${sender.split("@")[0]} was removed for tagging users.`,
          mentions: [sender]
        });

      case "warn": {
  let userWarn;

  if (global.dbType === "mongo") {
    userWarn = await warndb.findOne({ id: sender, group: from });
    if (!userWarn) {
      userWarn = new warndb({
        id: sender,
        group: from,
        warnedby: conn.user.id,
        warnCount: 1
      });
    } else {
      userWarn.warnCount += 1;
      userWarn.warnedby = conn.user.id;
    }
  } else {
    const db = await global.db("warn");
    db.data ||= {};
    db.data.users ||= [];

    userWarn = db.data.users.find(x => x.id === sender && x.group === from);
    if (!userWarn) {
      userWarn = {
        id: sender,
        group: from,
        warnedby: conn.user.id,
        warnCount: 1,
        reason: "Tagging",
        date: Date.now()
      };
      db.data.users.push(userWarn);
    } else {
      userWarn.warnCount += 1;
      userWarn.warnedby = conn.user.id;
      userWarn.reason = "Tagging";
      userWarn.date = Date.now();
    }
  }

  if (userWarn.warnCount >= 3) {
    await conn.groupParticipantsUpdate(from, [sender], "remove");
    await conn.sendMessage(from, {
      text: `❌ @${sender.split("@")[0]} removed after 3 tag warnings.`,
      mentions: [sender]
    });

    if (global.dbType === "mongo") {
      await warndb.deleteOne({ id: sender, group: from });
    } else {
      const db = await global.db("warn");
      db.data.users = db.data.users.filter(x => !(x.id === sender && x.group === from));
      await db.write();
    }
  } else {
    if (global.dbType === "mongo") {
      await userWarn.save();
    } else {
      const db = await global.db("warn");
      await db.write();
    }

    await conn.sendMessage(from, {
      text: `⚠️ @${sender.split("@")[0]} warned (${userWarn.warnCount}/3) for tagging.`,
      mentions: [sender]
    });
  }
  return;
      }
    }
  } catch (e) {
    console.error(e);
  }
});


conn.ev.on("messages.upsert", async ({ messages }) => {
  try {
    const m = messages[0];
    if (!m.message || m.key.fromMe || !m.key.remoteJid.endsWith("@g.us")) return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const msgText = m.message.conversation || m.message.extendedTextMessage?.text || "";

    // Skip if it's not a URL
    if (!isUrl(msgText)) return;

    // Get antilink settings from DB
    let groupData;
    if (global.dbType === "mongo") {
      groupData = await AntiLink.findOne({ groupId: from });
    } else {
      const db = await global.db("antilink");
      await db.read();
      groupData = db.data[from];
    }

    if (!groupData || groupData.mode === "off") return;

    // Delete the message
    await conn.sendMessage(from, { delete: m.key });

    // Notify user
    await conn.sendMessage(from, {
      text: `🚫 @${sender.split("@")[0]} links are not allowed here.`,
      mentions: [sender]
    });

    // Take action based on mode
    switch (groupData.mode) {
      case "delete":
        return;

      case "kick":
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        return conn.sendMessage(from, {
          text: `🚫 @${sender.split("@")[0]} was removed for posting a link.`,
          mentions: [sender]
        });

      case "warn":
        if (global.dbType === "mongo") {
          let user = await warndb.findOne({ id: sender, group: from });
          if (!user) {
            user = new warndb({
              id: sender,
              group: from,
              warnedby: conn.user.id,
              warnCount: 1
            });
          } else {
            user.warnCount += 1;
            user.warnedby = conn.user.id;
          }

          if (user.warnCount >= 3) {
            await conn.groupParticipantsUpdate(from, [sender], "remove");
            await conn.sendMessage(from, {
              text: `❌ @${sender.split("@")[0]} has been removed after 3 link warnings.`,
              mentions: [sender]
            });
            await warndb.deleteOne({ id: sender, group: from });
          } else {
            await user.save();
            await conn.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]} warned (${user.warnCount}/3) for link.`,
              mentions: [sender]
            });
          }
        } else {
          const db = await global.db("warn");
          db.data ||= {};
          db.data.users ||= [];

          let user = db.data.users.find(x => x.id === sender && x.group === from);
          if (!user) {
            user = {
              id: sender,
              group: from,
              warnedby: conn.user.id,
              warnCount: 1,
              reason: "Posted a link",
              date: Date.now()
            };
            db.data.users.push(user);
          } else {
            user.warnCount += 1;
            user.warnedby = conn.user.id;
            user.reason = "Posted a link";
            user.date = Date.now();
          }

          if (user.warnCount >= 3) {
            await conn.groupParticipantsUpdate(from, [sender], "remove");
            await conn.sendMessage(from, {
              text: `❌ @${sender.split("@")[0]} has been removed after 3 link warnings.`,
              mentions: [sender]
            });
            db.data.users = db.data.users.filter(x => !(x.id === sender && x.group === from));
            await db.write();
          } else {
            await db.write();
            await conn.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]} warned (${user.warnCount}/3) for link.`,
              mentions: [sender]
            });
          }
        }
        return;
    }
  } catch (e) {
    console.error("Antilink Error:", e);
  }
});


conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0]
    if (mek.key && mek.key.remoteJid === "status@broadcast") {
    try {

        if (config.AUTO_VIEW_STATUS === "true" && mek.key) {
            await conn.readMessages([mek.key]);
        }
        // Auto like status
        if (config.AUTO_LIKE_STATUS === "true") {
            let emojiToUse;

            if (config.AUTO_LIKE_EMOJI === 'random') {
                const randomIndex = Math.floor(Math.random() * emojis.length);
                emojiToUse = emojis[randomIndex];
            } else {
                emojiToUse = config.AUTO_LIKE_EMOJI || "🙂";
            }

            if (mek.key.remoteJid && mek.key.participant) {
                await conn.sendMessage(
                    mek.key.remoteJid,
                    { react: { key: mek.key, text: emojiToUse } },
                    { statusJidList: [mek.key.participant] }
                );
            }
        }
    } catch (error) {
        console.error("Error processing status actions:", error);
    }
}

const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body =
  (type === 'conversation') ? mek.message.conversation :
  (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
  (type === 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption :
  (type === 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption :
  (type === 'buttonsResponseMessage') ? mek.message.buttonsResponseMessage.selectedButtonId :
  (type === 'templateButtonReplyMessage') ? mek.message.templateButtonReplyMessage.selectedId :
  '';
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || '𝖤𝗆𝗉𝗂𝗋𝖾 𝖳𝖾𝖼𝗁'
const isMe = botNumber.includes(senderNumber)
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
let groupMetadata = null;
let groupName = '';
let participants = [];

if (isGroup) {
    try {
        groupMetadata = await conn.groupMetadata(from);
        groupName = groupMetadata.subject || '';
        participants = groupMetadata.participants || [];
    } catch (e) {
        console.error('❌ Error fetching group metadata:', e.message);
    }
}
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}



if (body.startsWith("$") && isOwner) {
  try {
    if (!q) return reply("Provide a valid command!");

    let result = await eval(q);
    if (typeof result !== "string") result = require("util").inspect(result);

    reply(`${result}`);
  } catch (e) {
    reply(`${e.message}`);
  }
}

if (body.startsWith(">") && isOwner) {
  try {
    if (!q) return reply(" Provide a valid command to run");

    exec(q, (err, stdout, stderr) => {
      if (err) return reply(`${err.message}`);
      if (stderr) return reply(`${stderr}`);
      reply(`${stdout}`);
    });
  } catch (e) {
    reply(`${e.message}`);
  }
}





conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
              let mime = '';
              let res = await axios.head(url)
              mime = res.headers['content-type']
              if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
              }
              let type = mime.split("/")[0] + "Message"
              if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
              }
            }


//===================WORKTYPE===============================
if(!isOwner && config.MODE === "private") return
if(!isOwner && isGroup && config.MODE === "inbox") return
if(!isOwner && isGroup && config.MODE === "groups") return
//==================================================

const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
if (cmd) {
if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

try {
cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PLUGIN ERROR] " + e);
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})
}
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/lib/assets/empire.html");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);
