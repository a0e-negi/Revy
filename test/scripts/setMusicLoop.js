const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  description: "ループ再生設定",
  async run(interaction){
    const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "停止中", stream_stat: "停止中", player: "" };

    var isLoop;
    if (!music.loop){
      isLoop = "通常再生";
    } else if (music.loop === "🔁"){
      isLoop = "全曲リピート";
    } else {
      isLoop = "一曲リピート";
    }

    const emojiList = [
      "➡️", "🔁", "🔂"
    ];
    const timeout = 120000;
    
    var embed;
    embed = new MessageEmbed({
      title: "リピート再生",
      description: "リピート再生を設定します。\n\n" + 
      "現在の設定：```fix\n" + isLoop + "```\n" +
      "➡️：通常再生\n🔁：全曲リピート\n🔂：一曲リピート",
      color: "RANDOM"
    });
    interaction.reply({ embeds: [embed] });
    const panel = await interaction.fetchReply();
    for (const emoji of emojiList) await panel.react(emoji);
    const reactionCollector = panel.createReactionCollector(
      (reaction, user) => emojiList.includes(reaction.emoji.name) && user.id === interaction.user.id,
      { time: timeout }
    );

    reactionCollector.on('collect', async (reaction, user) => {
      reaction.users.remove(user.id);
      switch (reaction.emoji.name) {
        case emojiList[0]:
          music.loop = false;
          isLoop = "通常再生";
          break;
        case emojiList[1]:
          music.loop = "🔁";
          isLoop = "全曲リピート";
          break;
        case emojiList[2]:
          music.loop = "🔂";
          isLoop = "一曲リピート";
          break;
        default:
          break;
      }
      await musics.set(interaction.guild.id, music);
      const embed = new MessageEmbed({
        title: "リピート再生を設定しました",
        description: "```yaml\n" + isLoop + "```",
        color: "GREEN"
      });
      panel.edit({ embeds: [embed] }).catch(() => {});
      panel.reactions.removeAll().catch(() => {});
    });

    reactionCollector.on('end', async () => {
      try {
        panel.reactions.removeAll().catch(() => {});
      } catch {}
    });
  }
}