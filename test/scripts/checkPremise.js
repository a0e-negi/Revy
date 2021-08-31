const { MessageEmbed } = require("discord.js");

module.exports = {
  run(permList, guild) {
    try {
      const bot = guild.me;

      var flag = true;
      for (let i = 0; i < permList.length; i++) {
        if (!bot.permissions.has(permList[i])) {
          flag = false;
        }
      }
      return flag;
    } catch { }
  }
}