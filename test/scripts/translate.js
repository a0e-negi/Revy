const { MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: "translate",
  description: "翻訳",
  async run(reaction, user) {
    try {
      const message = reaction.message;
      var language;
      if (!message.attachments.size) {
        if (reaction.emoji.name === "🇯🇵") {
          language = "ja";
        }
        if (reaction.emoji.name === "🇺🇸" || reaction.emoji.name === "🇺🇲") {
          language = "en";
        }
        if (reaction.emoji.name === "🇮🇹") {
          language = "it";
        }
        if (reaction.emoji.name === "🇫🇷") {
          language = "fr";
        }
        if (reaction.emoji.name === "🇨🇳") {
          language = "zh-CN";
        }
        if (reaction.emoji.name === "🇰🇷") {
          language = "ko";
        }
        if (reaction.emoji.name === "🇷🇺") {
          language = "ru";
        }
        if (reaction.emoji.name === "🇪🇸") {
          language = "es";
        }
        if (reaction.emoji.name === "🇩🇪") {
          language = "de";
        }
        if (reaction.emoji.name === "🇲🇾") {
          language = "ms";
        }
      }

      const result = await translate(message.content, { to: language });
      const embed = new MessageEmbed({
        author: { name: user.username, icon_url: user.avatarURL() },
        fields: [
          { name: result.text, value: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ"}
        ],
        color: "RANDOM",
        footer: {
          icon_url: message.guild.me.user.displayAvatarURL(),
          text: `${result.from.language.iso} → ${language}`
        },
      });
      message.channel.send({ embeds: [embed] });
    } catch {}
  }
}