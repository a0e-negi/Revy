const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  name: "deleteMusicList",
  description: "プレイリストから削除",
  async run(delPos, interaction){
    const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "🎵停止中🎵", stream_stat: "🎵停止中🎵", player: "" };

    if (!music.music_urls.length ||
    music.music_urls.length < delPos ||
    delPos < 1) {
      const embed = new MessageEmbed({
        title: "削除に失敗しました",
        description: "該当するリストが存在しません。\nプレイリストを確認するには、\n```fix\n/music list```" +
          "を実行してください。",
        color: "RED"
      });
      interaction.reply({ embeds: [embed] });
      return;
    } else {
      music.music_urls.splice(delPos - 1, 1);
      const musicName = music.music_names.splice(delPos - 1, 1);
      await musics.set(interaction.guild.id, music);

      const embed = new MessageEmbed({
        title: "プレイリストから削除しました",
        description: "削除した楽曲：\n```fix\n" +
        musicName + "```",
        color: "GREEN"
      });
      interaction.reply({ embeds: [embed] });
      return;
    }
  }
}