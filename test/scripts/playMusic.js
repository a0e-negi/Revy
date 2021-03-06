const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const DispEmbed = require("./dispMusicName");
const Keyv = require("keyv");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  async run(interaction) {
    const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "π΅π΅εζ­’δΈ­π΅π΅", stream_stat: "π΅π΅εζ­’δΈ­π΅π΅", player: "" };

    if (music.stat === "π΅π΅εζ­’δΈ­π΅π΅" && music.stream_stat === "π΅π΅εζ­’δΈ­π΅π΅") return;

    url = music.music_urls[music.pos];
    channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      guildId: interaction.guild.id,
      channelId: channel.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfMute: false,
    });
    if (music.stat === "η΅δΊ"){
      connection.destroy();
      await musics.delete(interaction.guild.id);
      return;
    }
    const media = ytdl(url, { quality: 'highestaudio' });
    const resource = createAudioResource(media, { inputType: StreamType.Arbitrary });
    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);


    if (music.stat === "π΅εζ­’δΈ­π΅" && music.stream_stat === "π΅εηδΈ­π΅"){
      player.stop()
      music.stream_stat = "π΅εζ­’δΈ­π΅";
      await musics.set(interaction.guild.id, music);
      return;
    }
    music.stream_stat = "π΅εηδΈ­π΅";
    await musics.set(interaction.guild.id, music);
  
    player.on(AudioPlayerStatus.Idle, async () => {
      const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "π΅εζ­’δΈ­π΅", stream_stat: "π΅εζ­’δΈ­π΅", player: "" };
      if (!music.loop){
        if (music.music_urls.length === music.pos + 1) {
          await musics.delete(interaction.guild.id);
          connection.destroy()
        } else {
          music.pos += 1;
          await musics.set(interaction.guild.id, music);
          DispEmbed.run(interaction);
          require("./playMusic").run(interaction)
        }
      } else {
        if (music.loop = "π"){
          music.pos = music.pos + 1 < music.music_urls.length ? ++music.pos : 0;
        }
        await musics.set(interaction.guild.id, music);
        DispEmbed.run(interaction);
        require("./playMusic").run(interaction)
      }
    });
  }
}