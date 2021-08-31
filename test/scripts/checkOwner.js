const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "checkOwner",
  description: 'ボット管理者かチェック',
  run(interaction) {
    if (interaction.user.id !== "576665809376641026"){
      const embed = new MessageEmbed({
        title: "コマンドの実行に失敗しました",
        description: "この機能はボット管理者のみ使用できます。",
        color: "RED"
      });
      message.channel.send({ embeds: [embed] });
      return false;
    }
    return true;
  }
}