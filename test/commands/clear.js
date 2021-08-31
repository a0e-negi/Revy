const { MessageEmbed } = require("discord.js");
module.exports = ({
  name: "clear",
  description: "一括削除",
  async run(client, command, interaction){
    const premise = require("../scripts/dispPremise").run(["MANAGE_MESSAGES"], ["メッセージの管理"], interaction);
    if (!premise) return;

    interaction.reply("削除中...");
    interaction.deleteReply();

    const deleteCount = await interaction.options.get("削除数").value;
    const deleteUser = await interaction.options.get("ユーザー");

    if (!deleteCount || deleteCount > 99){
      const embed = new MessageEmbed({
        title: "削除に失敗しました",
        description: "削除数は1~99の範囲で指定してください。",
        color: "RED"
      });
      const errorMsg = await interaction.channel.send({ embeds: [embed] });
      setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
      return;
    }
    
    const deleteMsg = await interaction.channel.messages.fetch({ limit: deleteCount });
    if(!deleteUser){
      interaction.channel.bulkDelete(deleteMsg, true)
    } else {
      const filter = deleteMsg.filter(msg => msg.author.id === deleteUser.user.id);
      interaction.channel.bulkDelete(filter, true);
    }

    return;
  }
})