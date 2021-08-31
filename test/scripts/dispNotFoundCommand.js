const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dispNotFound",
  description: '未定義コマンドメッセージ',
  run(interaction) {
    try {
      const embed = new MessageEmbed({
        title: "コマンドが見つかりませんでした",
        description: "コマンドが存在しないか、タイプミスの可能性があります。\n\n"+
        "ヘルプを見るには"+
        "```fix\n/help```"+
        "を実行してください。",
        color: "RED"
      });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  }
}