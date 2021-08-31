const { MessageEmbed } = require("discord.js");
const Premise = require("./checkPremise");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(member){
    const premise = ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_AUDIT_LOG"];
    if (!Premise.run(premise, member.guild)) return;
    
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
    });
    const banLog = fetchedLogs.entries.first();
    if (!banLog || banLog.action !== "MEMBER_BAN_ADD") return;
  
    const log = await db.get(member.guild.id);
    if (!log.entryLog) return;

    const logCh = member.guild.channels.cache.get(log.entryLog);
    if (!logCh) return;

    const { executor, target } = banLog;

    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "メンバーBAN",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f6ab.png"
      },
      description: `<@${executor.id}>が<@${target.id}>をBANしました。`,
      fields:[
        {
          name: `ID`,
          value: "```fix\n" + member.user.id + "```",
          inline: true
        },
        {
          name: `残り人数`,
          value: "```yaml\n" + member.guild.memberCount + "人```",
          inline: true
        }
      ],
      color: "RED",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});
  }
}