const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
var flag = false;

function convertEm(str) {
  return str.replace(/[0-9]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
}

module.exports = {
  name: "vote",
  description: "投票を作成",
  async run(client, command, interaction){
    const permList = [
      "ADD_REACTIONS", "MANAGE_MESSAGES"
    ]
    const permDesc = ["リアクションの追加", "メッセージの管理"];
    const premise = require("../scripts/dispPremise").run(permList, permDesc, interaction);
    if (!premise) return;

    var voteFlag = false;

    const embed = new MessageEmbed({
      title: "絵文字を指定",
      description: "投票に使用したい絵文字をリアクションしてください\n" + 
      "作成ボタンを押すことで投票を作成できます。\n" +
      "```diff\n- サーバー絵文字は使用できません```",
      color: "PURPLE"
    });
    const row = new MessageActionRow()
			.addComponents(new MessageButton()
			  .setCustomId("create")
			  .setLabel("作成")
			  .setStyle('SUCCESS')
		  );
    await interaction.reply({ embeds: [embed], components: [row] });
    const vote = await interaction.fetchReply();
    const filter = i => i.customId === 'create' && i.user.id === interaction.user.id;
    const collector = vote.createMessageComponentCollector({ filter, time: 120000 });

    collector.on('collect', async i=> {
      if (i.customId !== 'create') return;
      const emojiMsg = await interaction.fetchReply();
      var emojiList = [];
      const emojiFilter = emojiMsg.reactions.cache.filter(react => !react.emoji.id)
      emojiFilter.map(react => emojiList.push(react.emoji.name));
      await emojiMsg.reactions.removeAll();

      if (!emojiList.length){
        const embed = new MessageEmbed({
          title: "投票の作成に失敗しました。",
          description: "絵文字は１つ以上指定してください。",
          color: "RED",
        });
        interaction.editReply({ embeds: [embed], components: [] });
        return
      }
      
      flag = true;
      const theme = interaction.options.get("テーマ").value;
      const desc = interaction.options.get("詳細").value;
      const time = interaction.options.get("投票時間").value;

      const detail = desc.replace(/\\n/g, "\n");
      var timeMsg;
      if (!time){
        timeMsg = "期限：なし";
      } else {
        timeMsg = "期限：" + String(time) + "分";
      }

      const embed = new MessageEmbed({
        author: {
          name: interaction.user.tag,
          icon_url: interaction.user.avatarURL()
        },
        thumbnail: {
          url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4ca.png"
        },
        title: "📊" + theme,
        description: detail + "\n\n複数投票することはできません。",
        color: "RANDOM",
        footer: { text: timeMsg + "・作成者：" + interaction.user.tag }
      });
      emojiMsg.edit({ embeds: [embed], components: [] });
      voteFlag = true;
      const vote = await interaction.fetchReply();
      for (const emoji of emojiList) await vote.react(emoji);
      if (!time) return;

      const reactionCollector = vote.createReactionCollector({time: time * 60000 });

      reactionCollector.on('collect',async (reaction, user) => {
        if(!emojiList.includes(reaction.emoji.name)) return reaction.users.remove(user.id);
        const vote = await interaction.fetchReply();
        const reactUser = await Promise.all(vote.reactions.cache.map(async react => {
          return await react.users.fetch()
        }));
        var userCount = 0;
        for (const users in reactUser){
          const emoji = reactUser[users].find(u => u.id === user.id);
          if(emoji) ++userCount;
        }
        if (userCount > 1){
          reaction.users.remove(user.id);
        }
      });

      reactionCollector.on('end', async () => {
        if (!vote.deleted) {
          const vote = await interaction.fetchReply();
          var reactCount = [], reactName = [], reactTotal = 0;
          vote.reactions.cache.map(react => {
            reactName.push(react.emoji.name);
            reactCount.push(react.emoji.reaction.count - 1);
          });
          for (let i in reactCount){
            reactTotal += reactCount[i];
          }
          var resultMsg = []
          for (let i in reactCount){
            const ratio = Math.round((reactCount[i] / reactTotal * 1000)) / 10 || 0;
            resultMsg.push(`${reactName[i]}　${convertEm(String(reactCount[i]))}票（${ratio}％）`);
          }
          vote.reactions.removeAll();
          const embed = new MessageEmbed({
            author: {
              name: interaction.user.tag,
              icon_url: interaction.user.avatarURL()
            },
            thumbnail: {
              url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4ca.png"
            },
            title: "投票結果",
            description: "📊" + theme + "\n\n" +
            resultMsg.join("\n"),
            color: "RANDOM"
          });
          interaction.editReply({ embeds: [embed] });
        }
      });
    });

    collector.on('end', async ()=> {
      if (!vote.deleted && !voteFlag){
        interaction.deleteReply();
      }
    });
  }
}