const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dispRoleHighest",
  desscription: "対象より上のロールを持っているか確認",
  run(member, interaction){
    const bot = interaction.guild.me;
    const memberRole = member.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0;

    const botRole = member.roles.highest.comparePositionTo(bot.roles.highest) >= 0;
    
    if (botRole || memberRole) {
      const embed = new MessageEmbed({
        title: "コマンドの実行に失敗しました",
        description: "以下の可能性により実行できませんでした。\n"+
        "・対象に実行者もしくはボットと同等以上のロールが付与されている\n",
        color: "RED"
      })
      interaction.reply({ embeds: [embed] });
      return false;
    }
    return true;
  }
}