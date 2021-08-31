const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(message){
    if (!message.guild || !message.content || !message.author) return;
    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: 'MESSAGE_DELETE',
    });
    
    const deletionLog = fetchedLogs.entries.first();
    const log = await db.get(message.guild.id) || {}
    if (!log.msgLog) return;
    
    var { executor, target } = deletionLog;
    
    if (message.author.id === executor.id) {
      executer = message.author;
      target = message.author;
    } 

    const logCh = message.guild.channels.cache.get(log.msgLog);
    if (!logCh) return;

    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "メッセージ削除",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f5d1.png"
      },
      description: `<@${executor.id}>がメッセージを削除しました。`,
      fields:[
        {
          name: `チャンネル`,
          value: `<#${message.channel.id}>`,
          inline: true
        },
        {
          name: `対象`,
          value: `<@${target.id}>`,
          inline: true
        },
        {
          name: "ㅤ",
          value: message.content
        }
      ],
      color: "ORANGE",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});

  }
}