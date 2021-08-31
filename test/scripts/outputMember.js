const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "outputMember",
  description: 'メンションからIDへ変換',
  run(memberObject, interaction) {
    try {
      var id;
      if (memberObject.startsWith("<@!")) {
        id = memberObject.slice(3, 21);
      } else {
        id = memberObject;
      }
      const member = interaction.guild.members.cache.get(id);
      if (!member) {
        const embed = new MessageEmbed({
          title: "メンバーの取得に失敗しました",
          description: "メンバーが存在しない可能性があります。\n" +
            "メンションで指定する際は、以下の権限が必要です。\n" +
            "```fix\n＠everyone、＠here、全てへのメンション```",
          color: "RED"
        });
        interaction.reply({ embeds: [embed] });
        return;
      }
      return member;
    } catch (error) {
      console.log(error);
    }
  }
}