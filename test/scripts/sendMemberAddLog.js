const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(member){
    const log = await db.get(member.guild.id) || {}
    if (!log.entryLog) return;
    
    const logCh = member.guild.channels.cache.get(log.entryLog);
    if (!logCh) return;

    const createdAt = require("./getStringFromDate").run(member.user.createdAt);
    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "入室",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4e5.png"
      },
      description: `<@${member.user.id}>が入室しました。`,
      fields:[
        {
          name: `作成日時`,
          value: "```fix\n" + createdAt + "```",
          inline: true
        },
        {
          name: `残り人数`,
          value: "```yaml\n" + member.guild.memberCount + "人```",
          inline: true
        }
      ],
      color: "GREEN",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});

  }
}