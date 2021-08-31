const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "ban",
  description: 'メンバーをBANします',
  async run(client, command, interaction) {
    const permList = [
      "BAN_MEMBERS"
    ];
    const permDesc = [
      "メンバーをBAN"
    ]
    const premise = require("../scripts/dispPremise.js").run(permList, permDesc, interaction);
    if (!premise) return;
    const exec = require("../scripts/dispExecError.js").run(permList, permDesc, interaction);
    if (!exec) return;

    const option = interaction.options.get("対象");
    if (option.value === "help") {
      const embed = new MessageEmbed({
        title: "BAN",
        description: "メンバーをBANします。\n\n" +
          "使い方: " +
          "```fix\n/ban 対象```" +
          "対象：メンバーをメンションもしくはIDで指定",
        color: "RANDOM"
      });
      interaction.reply({ embeds: [embed] });
      return;
    }

    const member = require("../scripts/outputMember.js").run(option.value, interaction);
    if (!member) return;

    const roleHighest = require("../scripts/dispRoleHighest.js").run(member, interaction);
    if (!roleHighest) return;

    if (member.bannable) {
      const tag = member.user.tag
      member.ban();
      require("../scripts/dispSuccessBan.js").run(member.user.id, interaction);
    } else {

    }
    return;
  }
}