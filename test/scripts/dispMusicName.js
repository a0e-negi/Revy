const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  name: "dispMusicName",
  description: "楽曲名表示",
  async run(interaction){
    const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "🎵停止中🎵", stream_stat: "🎵停止中🎵", player: "" };
    
    if (Object.keys(music.player).length){
      const player = interaction.channel.messages.cache.get(music.player);
      const embed = new MessageEmbed({
        title: music.stat,
        description: "```fix\n" + music.music_names[music.pos] + "```",
        color: "ORANGE",
        footer: {
          text: `プレイリスト ${music.pos + 1} / ${music.music_urls.length}`
        }
      });
      player.edit({ embeds: [embed] });
    }
  }
}