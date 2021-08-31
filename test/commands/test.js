const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  async run(client, command, interaction) {
    interaction.reply("test");
    const channel = interaction.guild.channels.cache.get("878231219073064971")
    console.log(channel)
    const perm = channel.permissionOverwrites.cache
    console.log(perm)

  }
}