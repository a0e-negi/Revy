const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dispSuccess",
  description: "成功表示",
  run(interaction){
    const embed = new MessageEmbed({
      title: "コマンドの実行に成功しました！",
      description: "実行者: <@"+interaction.user.id+">\n"+
      "実行したコマンド:\n"+
      "```fix\n"+interaction.commandName+"```",
      color: "GREEN"
    });
    interaction.reply({ embeds: [embed] });
  }
}