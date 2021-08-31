const { MessageEmbed } = require("discord.js");

module.exports = {
  run(client, command, interaction) {
    interaction.channel.messages.fetch({ after: '0', limit: 1 })
      .then(messages => messages.first())
      .then(m => interaction.reply(
        {
          embeds: [{
            color: "RANDOM",
            title: "最初に飛ぶ",
            url: m.url,
          }]
        }
      ))
      .catch(console.error)
  }
}