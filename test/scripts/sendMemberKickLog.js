const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(member){
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
    });
    const kickLog = fetchedLogs.entries.first();
    if (!kickLog || kickLog.action !== "MEMBER_KICK") return;
  
    const log = await db.get(member.guild.id);
    if (!log.entryLog) return;

    const logCh = member.guild.channels.cache.get(log.entryLog);
    if (!logCh) return;

    const { executor, target } = kickLog;

    const joinTime = require("./getStringFromDate").run(member.joinedAt);
    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "メンバー追放",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4e4.png"
      },
      description: `<@${executor.id}>が<@${target.id}>を追放しました。`,
      fields:[
        {
          name: `参加日時`,
          value: "```fix\n" + joinTime + "```",
          inline: true
        },
        {
          name: `残り人数`,
          value: "```yaml\n" + member.guild.memberCount + "人```",
          inline: true
        }
      ],
      color: "YELLOW",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});

  }
}