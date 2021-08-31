const { MessageEmbed } = require("discord.js");
const { Fortunes } = require("../scripts/dbObjects");

module.exports = {
  name: "database",
  description: "データベースを操作",
  async run(client, command, interaction) {
    if (!require("../scripts/checkOwner").run(interaction)) return;

    const target = interaction.options.get("対象").value;
    const option = interaction.options.get("操作").value;

    if (target === "help"){
      const embed = new MessageEmbed({
        title: "DATABASE",
        description: "データベースを操作します。\n\n"+
          "使い方: "+
          "```fix\n/database 対象 操作```"+
          "対象：テーブル名を指定\n"+
          "操作：以下の操作を指定（ハイフンも付加）\n"+
          "```diff\n-clear：テーブルを削除```",
        color: "RANDOM"
      });
      interaction.reply({ embeds: [embed] });
      return;
    } 
    var execFlag = false;
    if (option === "clear") {
      if (target === "fortunes") {
        try{
          require("../scripts/dispSuccess").run(interaction);
          const fortune = await Fortunes.findAll();
          fortune.map(async db => await db.destroy());
        } catch { }
        return;
      }
    }
    if (!execFlag){
      return;
    }

    return;
  }
}