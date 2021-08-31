const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(oldMember, newMember){
    const fetchedLogs = await newMember.guild.fetchAuditLogs({
      limit: 1,
    });
    const memberLog = fetchedLogs.entries.first();
    if (memberLog.action !== "MEMBER_UPDATE") return;

    if (oldMember.nickname === newMember.nickname) return;

    var { executor, target } = memberLog;

    if (executor.id === target.id){
      target = "自身";
    } else {
      target = `<@${target.id}>`;
    }

    const log = await db.get(newMember.guild.id) || {}
    if (!log.memberLog) return;
    
    const logCh = newMember.guild.channels.cache.get(log.memberLog);
    if (!logCh) return;

    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "ニックネーム変更",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u270f.png"
      },
      description: `<@${executor.id}>が${target}のニックネームを変更しました。`,
      fields:[
        {
          name: `変更前`,
          value: "```fix\n" + (oldMember.nickname || oldMember.user.username) + "```"
        },
        {
          name: `変更後`,
          value: "```fix\n" + (newMember.nickname || newMember.user.username) + "```"
        },
      ],
      color: "#FF00FF",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});
  }
}