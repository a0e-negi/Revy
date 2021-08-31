const { MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(oldMsg, newMsg){
    if (!newMsg.guild || !newMsg.content || !newMsg.author) return;
    
    const log = await db.get(newMsg.guild.id) || {}
    if (!log.msgLog) return;
        
    const logCh = newMsg.guild.channels.cache.get(log.msgLog);
    if (!logCh) return;

    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "メッセージ編集",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f58a.png"
      },
      description: `<@${newMsg.author.id}>がメッセージを編集しました。\n→[メッセージへ飛ぶ](${newMsg.url})`,
      fields:[
        {
          name: `編集前`,
          value: oldMsg.content,
        },
        {
          name: `編集後`,
          value: newMsg.content,
        }
      ],
      color: "PURPLE",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});

  }
}