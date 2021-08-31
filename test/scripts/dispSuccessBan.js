const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dispSuccessBan",
  description: "Ban成功表示",
  run(memberTag, interaction){
    const embed = new MessageEmbed({
      title: "対象のBANに成功しました！",
      description: "実行者：<@"+interaction.user.id+">\n"+
      "対象：<@" + memberTag+">\n",
      color: "GREEN"
    });
    interaction.reply({ embeds: [embed] });
  }
}