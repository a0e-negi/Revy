const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(ch){
    const fetchedLogs = await ch.guild.fetchAuditLogs({
      limit: 1,
    });
    const chLog = fetchedLogs.entries.first();
    if (chLog.action !== "CHANNEL_OVERWRITE_CREATE") return;

    var { executor, target, changes } = chLog;
    const log = await db.get(ch.guild.id) || {}
    if (!log.guildLog) return;
    
    const logCh = ch.guild.channels.cache.get(log.guildLog);
    if (!logCh) return;
    
    var title = "ロール追加";
    var addedRole = `<@&${changes[0].new}>`;
    if (changes[1].new){
      title = "メンバー追加";
      addedRole = `<@${changes[0].new}>`;
    }
    const timeStamp = require("./getStringFromDate").run(new Date());

    const embed = new MessageEmbed({
      author: {
        name: "チャンネル設定変更",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4dd.png"
      },
      description: `<@${executor.id}>が<#${ch.id}>の権限設定を変更しました`,
      fields: [
        {
          name: title, value: addedRole
        }
      ],
      color: "#8B008B",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});
  }
}