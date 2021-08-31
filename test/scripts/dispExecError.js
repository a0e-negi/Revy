const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dispExecError",
  description: "実行に必要な権限を表示",
  run(permList, permDesc, interaction) {
    try {
      const member = interaction.member;

      var flag = false;
      for (let i = 0; i < permList.length; i++) {
        if (!member.permissions.has(permList[i])) {
          flag = true
        }
      }

      if (flag) {
        const embed = new MessageEmbed({
          title: "コマンドの実行に失敗しました。",
          description: "以下の可能性により実行できませんでした。\n" +
            "・実行者の権限が不足している\n\n" +
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