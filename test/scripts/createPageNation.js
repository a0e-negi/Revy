module.exports = {
  name: "createPageNation",
  description: "ページネーションを作成",
  async run(interaction, pages) {
    try {
      const emojiList = [
        "⏮", "◀️", "▶️", "⏭", "⏹"
      ];
      const timeout = 120000;
      let page = 0;
      interaction.reply({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)] });
      const curPage = await interaction.fetchReply();
      for (const emoji of emojiList) await curPage.react(emoji);
      const filter = (reaction) => emojiList.includes(reaction.emoji.name);
      const reactionCollector = curPage.createReactionCollector({ filter, time: timeout });
      reactionCollector.on('collect', (reaction, user) => {
        reaction.users.remove(user.id);
        if (user.id !== interaction.user.id) return;
        switch (reaction.emoji.name) {
          case emojiList[0]:
            page = 0;
            break;
          case emojiList[1]:
            page = page > 0 ? --page : pages.length - 1;
            break;
          case emojiList[2]:
            page = page + 1 < pages.length ? ++page : 0;
            break;
          case emojiList[3]:
            page = pages.length - 1;
            break;
          case emojiList[4]:
            curPage.reactions.removeAll();
            break;
          default:
            break;
        }
        curPage.edit({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)] });

      });
      reactionCollector.on('end', () => {
        if (!curPage.deleted) {
          try {
            curPage.reactions.removeAll();
          } catch (error) {
            console.log(error);
          }
        }
      });
      return curPage;
    } catch (error){ 
      console.log(error);
    }
  }
}