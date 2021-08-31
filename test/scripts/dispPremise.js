const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dispPremise",
  description: "実行に前提として必要な権限を表示",
  run(permList, permDesc, interaction) {
    try {
      const bot = interaction.guild.me;

      var flag = false;
      for (let i = 0; i < permList.length; i++) {
        if (!bot.permissions.has(permList[i])) {
          flag = true
        }
      }

      if (flag) {
        const embed = new MessageEmbed({
          title: "コマンドの実行に失敗しました。",
          description: "以下の可能性により実行できませんでした。\n" +
            "・ボットの権限が不足している\n\n" +
            "実行には管理者権限もしくは以下の権限が必要です。\n" +
            "```fix\n" + permDesc.join("\n") + "```",
          color: "RED"
        });
        interaction.reply({ embeds: [embed] });
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}