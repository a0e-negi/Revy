const { MessageEmbed } = require("discord.js");
const Menu = require("../scripts/createPageNation.js");

module.exports = {
  name: "serverinfo",
  description: "サーバー情報",
  async run(client, command, interaction) {
    const permList = [
      "ADD_REACTIONS", "MANAGE_MESSAGES"
    ]
    const permDesc = ["リアクションの追加", "メッセージの管理"];
    const premisePerm = require("../scripts/dispPremise").run(permList, permDesc, interaction);
    if (!premisePerm) return;

    const option = interaction.options.get("option");
    if (option && option.value === "help") {
      const embed = new MessageEmbed({
        title: "SERVERINFO",
        description: "サーバー情報を表示します。\n\n" +
          "使い方：" +
          "```fix\n/serverinfo```",
        color: "RANDOM"
      });
      interaction.reply({ embeds: [embed] });
      return;
    }

    const guild = interaction.guild;
    const createDate = require("../scripts/getStringFromDate").run(guild.createdAt);

    const owner = await guild.fetchOwner();

    var tier;
    var premiumTier = ["NONE", "TIER_1", "TIER_2", "TIER_3"];
    for (let i in premiumTier){
      if (guild.premiumTier === premiumTier[i]){
        tier = i;
      }
    }

    const verifyList = [
      "NONE", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"
    ];
    const verifyDesc = [
      "yaml\n無制限",
      "diff\n+ 低：メール認証がされているアカウントのみ",
      "fix\n中：Discordに登録してから5分以上経過したアカウントのみ",
      "cs\n# 高：このサーバーのメンバーとなってから10分以上経過したアカウントのみ",
      "diff\n- 最高：電話認証がされているアカウントのみ"
    ];
    var verifyLevel;
    for (let i = 0; i < verifyList.length; i++) {
      if (verifyList[i] === guild.verificationLevel) {
        verifyLevel = i;
        break;
      }
    }

    const stat = require("../scripts/getStatistics").run(interaction);

    const pages = [
      new MessageEmbed({
        title: `${guild.name} のサーバー情報`,
        thumbnail: { url: guild.iconURL() },
        color: "AQUA",
        fields: [
          { name: "サーバーID", value: "```fix\n" + guild.id + "```" },
          { name: "サーバー管理者", value: "```fix\n" + owner.user.tag + "```" },
          { name: "サーバーブースト", value: "```fix\nレベル" + tier + "```", inline: true },
          { name: "ブースト回数", value: "```fix\n" + guild.premiumSubscriptionCount + "```", inline: true },
          { name: "作成日時", value: "```fix\n" + createDate + "```" },
          { name: "認証レベル", value: "```" + verifyDesc[verifyLevel] + "```" }
        ]
      }),
      new MessageEmbed({
        title: `${guild.name} のサーバー情報`,
        thumbnail: { url: guild.iconURL() },
        color: "AQUA",
        fields: [
          { name: "メンバー数", value: "```fix\n" + stat.member + "```", inline: true },
          { name: "テキストチャンネル数", value: "```yaml\n" + stat.textCh + "```", inline: true },
          { name: "ㅤ", value: "ㅤ" },
          { name: "ユーザー数", value: "```fix\n" + stat.user + "```", inline: true },
          { name: "ボイスチャンネル数", value: "```yaml\n" + stat.voiceCh + "```", inline: true },
          { name: "ㅤ", value: "ㅤ" },
          { name: "ボット数", value: "```fix\n" + stat.bot + "```", inline: true },
          { name: "カテゴリー数", value: "```yaml\n" + stat.category + "```", inline: true }
        ]
      })
    ];

    Menu.run(interaction, pages);
  }
}