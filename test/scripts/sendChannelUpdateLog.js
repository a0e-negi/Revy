const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

function rateLimit(sec){
  var time = "オフ";
  if (!sec) return time;
  if (sec < 60){
    time = sec + "秒"
  }else if (sec >= 60 && sec < 3600){
    time = (sec / 60) + "分";
  } else {
    time = (sec / 3600) + "時間"
  }
  return time;
}

module.exports = {
  async run(ch){
    const fetchedLogs = await ch.guild.fetchAuditLogs({
      limit: 1,
    });
    const chLog = fetchedLogs.entries.first();
    if (chLog.action !== "CHANNEL_UPDATE") return;

    var { executor, target, changes } = chLog;

    const log = await db.get(ch.guild.id) || {}
    if (!log.guildLog) return;
    
    const logCh = ch.guild.channels.cache.get(log.guildLog);
    if (!logCh) return;

    var fieldList = []
    for (const i in changes){
      if (changes[i].key === "name"){
        fieldList.push(
          { 
            name: "名前",
            value: "```fix\n"+changes[i].old+" → "+changes[i].new+"```",
            inline: true
          }
        )
      }
      if (changes[i].key === "nsfw"){
        var oldNsfw, newNsfw;
        if (changes[i].old){
          oldNsfw = "✅";
        } else {
          oldNsfw = "❌";
        }
        if (changes[i].new){
          newNsfw = "✅";
        } else {
          newNsfw = "❌";
        }
        fieldList.push(
          { 
            name: "NSFW",
            value: "```fix\n"+oldNsfw+" → "+newNsfw+"```",
          }
        )
      }
      if (changes[i].key === "rate_limit_per_user"){
        const oldTime = rateLimit(changes[i].old);
        const newTime = rateLimit(changes[i].new);
        fieldList.push(
          { 
            name: "低速モード",
            value: "```fix\n"+oldTime+" → "+newTime+"```",
          }
        )
      }
    }

    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "チャンネル設定変更",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4dd.png"
      },
      description: `<@${executor.id}>が<#${ch.id}>の概要を変更しました`,
      fields: fieldList,
      color: "#8B008B",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});
  }
}