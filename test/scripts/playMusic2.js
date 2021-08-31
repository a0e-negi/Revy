const { MessageEmbed } = require("discord.js");
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const Keyv = require("keyv");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  async run(url, interaction) {
    try {
      if (!ytdl.validateURL(url)) {
        const embed = new MessageEmbed({
          title: "動画の取得に失敗しました",
          description: "動画が存在しない、もしくはURLの記述ミスの可能性があります。\nURLをお確かめの上、再度実行してください。",
          color: "RED"
        });
        interaction.reply({ embeds: [embed] });
        return;
      } else {
        channel = interaction.member.voice.channel;
        if (!channel) {
          const embed = new MessageEmbed({
            title: "コマンドを実行できませんでした",
            description: "この機能を使用するには、ボイスチャンネルに参加する必要があります。\nボイスチャンネルに参加してから再度お試しください。",
            color: "RED"
          });
          interaction.reply({ embeds: [embed] });
          return;
        }
        const embed1 = new MessageEmbed({
          title: "動画情報の取得中...",
          description: "動画情報を取得しています。しばらくお待ち下さい。",
          color: "YELLOW"
        });
        await interaction.reply({ embeds: [embed1] });
        const videoInfo = await ytdl.getInfo(url);
        musicName = videoInfo.videoDetails.title;
        const connection = joinVoiceChannel({
          guildId: interaction.guild.id,
          channelId: channel.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
          selfMute: false,
        });
        const stream = ytdl(url, { quality: 'highestaudio' });
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        const player = createAudioPlayer();
        player.play(resource);
        connection.subscribe(player);

        const embed2 = new MessageEmbed({
          title: "🎵再生中🎵",
          description: "```fix\n" + musicName + "```",
          color: "GREEN"
        });
        interaction.editReply({ embeds: [embed2] });

        player.on(AudioPlayerStatus.Idle, async () => {
          try {
            const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "停止中", stream_stat: "停止中", player: "" };

            if (!music.loop) {
              connection.destroy();
            } else {
              require("./playMusic2").run(url, interaction);
            }
          } catch { }
        });
        return;
      }
    } catch { }
  }
}