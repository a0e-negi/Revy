const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(oldMember, newMember){
    if (oldMember._roles === newMember._roles) return;

    const fetchedLogs = await newMember.guild.fetchAuditLogs({
      limit: 1,
    });
    const memberLog = fetchedLogs.entries.first();
    if (memberLog.action !== "MEMBER_ROLE_UPDATE") return;

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

    const oldRole = [], newRole = [];
    for (const i in oldMember._roles){
      oldRole.push(`<@&${oldMember._roles[i]}>`)
    }
    for (const i in newMember._roles){
      newRole.push(`<@&${newMember._roles[i]}>`)
    }
    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "ロール変更",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f3f7.png"
      },
      description: `<@${executor.id}>が${target}のロールを変更しました。`,
      fields:[
        {
          name: `変更前`,
          value:( oldRole.join("ㅤ") || "```yaml\nロールなし```")
        },
        {
          name: `変更後`,
          value: (newRole.join("ㅤ") || "```yaml\nロールなし```")
        },
      ],
      color: "#00FFFF",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});
  }
}