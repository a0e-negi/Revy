const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "embed",
  description: 'Embed作成',
  async run(client, command, interaction) {
    const embedOption = {};
    title = interaction.options.get("タイトル");
    desc = interaction.options.get("説明文");
    color = interaction.options.get("色");
    
    if (title) {
      embedOption.title = title.value;
    }
    if (desc) {
      embedOption.desc = desc.value.replace(/\\n/g, "\n");
    }
    if (color) {
      embedOption.color = color.value;
    }

    const embed = new MessageEmbed({
      title: embedOption.title || "タイトル無し",
      description: embedOption.desc || "内容無し",
      color: embedOption.color || "GREY",
      footer: { text: `作成者|${interaction.user.tag}` }
    });
    interaction.reply({ embeds: [embed] });
  }
}