const { MessageEmbed } = require("discord.js");

module.exports = {
  async run(client, command, interaction) {
    const msgId = interaction.options.get("メッセージ");
    var msg;
    if (!msgId) {
      msg = await interaction.channel.messages.fetch({ before: interaction.id, limit: 1 })
      .then(messages => messages.first())
      .catch()
    } else {
      msg = await interaction.channel.messages.fetch(msgId.value)
      if (!msg) return;
    }

    const option = interaction.options.get("操作").value;
    if (option === "add"){
      const premisePerm = require("../scripts/dispPremise").run(["ADD_REACTIONS"], ["リアクションの追加"], interaction);
      if (!premisePerm) return;

      const embed = new MessageEmbed({
        title: "リアクション付与開始",
        color: "RANDOM"
      });
      interaction.reply({ embeds: [embed], ephemeral: true });

      const emojiList = ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥝", "🍅", "🫐", "🥭", "🥥", "🥞", "🍮"];
      for (let i in emojiList){
        msg.react(emojiList[i]).catch(() => {});
      }

      return;
    }
    if (option === "remove"){
      const premisePerm = require("../scripts/dispPremise").run(["MANAGE_MESSAGES"], ["メッセージの管理"], interaction);
      if (!premisePerm) return;

      const embed = new MessageEmbed({
        title: "リアクション削除完了",
        color: "RANDOM"
      });
      msg.reactions.removeAll().catch(() => {});
      interaction.reply({ embeds: [embed], ephemeral: true });
      
      return;
    }
  }
}