const { MessageEmbed } = require("discord.js");
const Menu = require("../scripts/createPageNation.js");

module.exports = {
  name: "userinfo",
  description: "ユーザー情報を表示",
  async run(client, command, interaction) {
    const permList = [
      "ADD_REACTIONS", "MANAGE_MESSAGES"
    ]
    const permDesc = ["リアクションの追加", "メッセージの管理"];
    const premisePerm = require("../scripts/dispPremise").run(permList, permDesc, interaction);
    if (!premisePerm) return;
    
    const member = interaction.options.get("対象").member;

    var stat, nickname, createDate, joinDate;

    if (member.presence) {
      if (member.presence.status === "online") {
        stat = "オンライン";
      }
      if (member.presence.status === "idle") {
        stat = "退席中";
      }
      if (member.presence.status === "dnd") {
        stat = "取り込み中";
      }
    } else {
      stat = "オフライン"
    }

    nickname = member.nickname || "ㅤ";

    createDate = require("../scripts/getStringFromDate.js").run(member.user.createdAt);

    joinDate = require("../scripts/getStringFromDate").run(member.joinedAt);

    const permssion = require("../scripts/checkPermission").run(member);

    var roleList = member.roles.cache.map(role => "<@&" + role.id + ">");
    roleList.pop();

    if (!Object.keys(roleList).length) roleList = [
      "```diff\n- ロール無し```"
      ];

    const pages = [
      new MessageEmbed({
        title: `${member.user.tag} のユーザー情報`,
        thumbnail: { url: member.user.avatarURL() },
        color: "BLUE",
        fields: [
          { name: "ユーザーID", value: "```fix\n" + member.user.id + "```" },
          { name: "ニックネーム", value: "```fix\n" + nickname + "```" },
          { name: "BOT", value: "```fix\n" + member.user.bot + "```", inline: true },
          { name: "状態", value: "```fix\n" + stat + "```", inline: true },
          { name: "作成日時", value: "```fix\n" + createDate + "```" },
          { name: "参加日時", value: "```fix\n" + joinDate + "```" }
        ]
      }),
      new MessageEmbed({
        title: `${member.user.tag} のユーザー情報`,
        thumbnail: { url: member.user.avatarURL() },
        color: "BLUE",
        fields: [
          { name: "許可されている権限", value: "```diff\n" + permssion[0].join("\n") + "```" },
          { name: "拒否されている権限", value: "```diff\n" + permssion[1].join("\n") + "```" }
        ]
      }),
      new MessageEmbed({
        title: `${member.user.tag} のユーザー情報`,
        thumbnail: { url: member.user.avatarURL() },
        color: "BLUE",
        fields: [
          { name: "ロール", value: roleList.join("ㅤ")}
        ]
      })
    ];

    Menu.run(interaction, pages);
  }
}