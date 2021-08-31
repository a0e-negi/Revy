const { MessageEmbed } = require("discord.js");
const Ytdl = require('ytdl-core');
const Keyv = require("keyv");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  name: "addMusicList",
  description: "プレイリストに追加",
  async run(url, interaction) {
    const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "停止中", stream_stat: "停止中", player: null };

    if (!Ytdl.validateURL(url)) {
      const embed = new MessageEmbed({
        title: "動画の取得に失敗しました",
        description: "動画が存在しない、もしくはURLの記述ミスの可能性があります。\nURLをお確かめの上、再度実行してください。",
        color: "RED"
      });
      interaction.reply({ embeds: [embed] }).catch(() => {});
      return;
    } else {
      const embed1 = new MessageEmbed({
        title: "動画情報の取得中...",
        description: "動画情報を取得しています。しばらくお待ち下さい。",
        color: "YELLOW"
      });
      await interaction.reply({ embeds: [embed1] }).catch(() => {});
      const videoInfo = await Ytdl.getInfo(url);
      music.music_urls.push(url);
      music.music_names.push(videoInfo.videoDetails.title);
      await musics.set(interaction.guild.id, music);
      const time = require("./getHms").run(videoInfo.videoDetails.lengthSeconds - 1);
      const embed2 = new MessageEmbed({
        title: "楽曲をプレイリストに追加しました",
        fields: [
          { name: "動画名：", value: "```fix\n" + music.music_names[music.music_names.length - 1] + "```" },
          { name: "再生時間：", value: "```yaml\n" + time + "```" }
        ],
        color: "GREEN"
      });
      interaction.editReply({ embeds: [embed2] }).catch(() => {});
      return;
    }
  }
}