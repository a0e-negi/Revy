const { MessageEmbed } = require("discord.js");
const Menu = require("../scripts/createPageNation");

module.exports = {
  name: "music",
  description: "音楽を再生します",
  async run(client, command, interaction) {
    const permList = [
      "CONNECT", "SPEAK", "ADD_REACTIONS", "MANAGE_MESSAGES"
    ];
    const permDesc = ["接続", "発言", "リアクションの追加", "メッセージの管理"];
    const premisePerm = require("../scripts/dispPremise").run(permList, permDesc, interaction);
    if (!premisePerm) return;

    const option = interaction.options.getSubcommand();
    if (option === "add") {
      const url = interaction.options.get("リンク");
      require("../scripts/addMusicList").run(url.value, interaction);
      return;
    }
    if (option === "delete") {
      const deletePos = interaction.options.get("リスト番号").value;
      require("../scripts/deleteMusicList").run(deletePos, interaction);
      return;
    }
    if (option === "list") {
      require("../scripts/dispMusicList").run(interaction);
      return;
    }
    if (option === "play") {
      const url = interaction.options.get("リンク");
      if (!url){
        require("../scripts/createMusicPlayer").run(interaction);
      } else {
        require("../scripts/playMusic2").run(url.value, interaction);
      }
      return;
    } 
    if (option === "loop") {
      require("../scripts/setMusicLoop").run(interaction);
      return;
    } 
  }
}