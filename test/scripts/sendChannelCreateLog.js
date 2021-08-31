const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(ch){
    const fetchedLogs = await ch.guild.fetchAuditLogs({
      limit: 1,
    });
    const chLog = fetchedLogs.entries.first();
    if (chLog.action !== "CHANNEL_CREATE") return;

    var { executor, target } = chLog;

    const log = await db.get(ch.guild.id) || {}
    if (!log.guildLog) return;
    
    const logCh = ch.guild.channels.cache.get(log.guildLog);
    if (!logCh) return;

    var chType;
    const chTypeList = ["GUILD_TEXT", "GUILD_VOICE", "GUILD_CATEGORY", "GUILD_NEWS"];
    const chDescList = ["テキストチャンネル", "ボイスチャンネル", "カテゴリ", "アナウンスチャンネル"]
    for (const i in chTypeList){
      if (target.type === chTypeList[i]){
        chType = chDescList[i];
      }
    }

    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "チャンネル作成",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4d5.png"
      },
      description: `<@${executor.id}>が<#${target.id}>を作成しました。`,
      fields:[
        {
          name: `チャンネル種別`,
          value: "```fix\n" + chType + "```"
        }
      ],
      color: "#FA8072",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});
  }
}