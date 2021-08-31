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
const DispEmbed = require("./dispMusicName");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  name: "createMusicPlayer",
  description: "再生パネルを作成",
  async run(interaction) {
    const voiceCh = interaction.member.voice.channel;
    if (!voiceCh) {
      const embed = new MessageEmbed({
        title: "コマンドを実行できませんでした",
        description: "この機能を使用するには、ボイスチャンネルに参加する必要があります。\nボイスチャンネルに参加してから再度お試しください。",
        color: "RED"
      });
      interaction.reply({ embeds: [embed] });
      return;
    }

    const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "🎵停止中🎵", stream_stat: "🎵停止中🎵", player: "" };
    if (!music.music_urls.length) {
      const embed = new MessageEmbed({
        title: "プレイヤーの作成に失敗しました",
        description: "プレイリストに楽曲が追加されていません。\nプレイリストに追加してから再度実行してください。",
        color: "RED"
      });
      interaction.reply({ embeds: [embed] });
      return;
    }

    const emojiList = [
      "⏮", "⏪", "▶️", "⏸", "⏩", "⏭", "⏹"
    ];
    const timeout = 120000;

    const panel = new MessageEmbed({
      title: music.stat,
      description: "```fix\n" + music.music_names[music.pos] + "```",
      color: "ORANGE",
      footer: { text: `プレイリスト ${music.pos + 1} / ${music.music_urls.length}` }
    });
    await interaction.reply({ embeds: [panel] });
    const player = await interaction.fetchReply();
    music.player = player.id;
    await musics.set(interaction.guild.id, music)

    for (const emoji of emojiList) await player.react(emoji);
    const filter = (reaction, user) => emojiList.includes(reaction.emoji.name);
    const reactionCollector = player.createReactionCollector({ filter, time: timeout });

    reactionCollector.on('collect', async (reaction, user) => {
      const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop_flag: false, pos: 0, stat: "🎵停止中🎵", stream_stat: "🎵停止中🎵", player: "" };
      if (reaction.message.id === music.player){
        reaction.users.remove(user.id);
        switch (reaction.emoji.name) {
          case emojiList[0]:
            music.pos = 0;
            await musics.set(interaction.guild.id, music);
            DispEmbed.run(interaction);
            break;
          case emojiList[1]:
            music.pos = music.pos > 0 ? --music.pos : music.pos;
            await musics.set(interaction.guild.id, music);
            DispEmbed.run(interaction);
            break;
          case emojiList[2]:
            music.stat = "🎵再生中🎵";
            await musics.set(interaction.guild.id, music);
            DispEmbed.run(interaction);
            break;
          case emojiList[3]:
            music.stat = "🎵停止中🎵";
            await musics.set(interaction.guild.id, music);
            DispEmbed.run(interaction);
            break;
          case emojiList[4]:
            if (!music.loop) {
              music.pos = music.pos + 1 < music.music_urls.length ? ++music.pos : music.pos;
            } else {
              music.pos = music.pos + 1 < music.music_urls.length ? ++music.pos : 0;
            }
            await musics.set(interaction.guild.id, music);
            DispEmbed.run(interaction);
            break;
          case emojiList[5]:
            music.pos = music.music_urls.length - 1;
            await musics.set(interaction.guild.id, music);
            DispEmbed.run(interaction);
            break;
          case emojiList[6]:
            player.reactions.removeAll();
            music.stat = "終了";
            await musics.set(interaction.guild.id, music);
            break;
          default:
            break;
        }

        require("./playMusic").run(interaction);
        if (music.stat === "終了") return;
      }
    });

    reactionCollector.on('end', async () => {
      const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop_flag: false, pos: 0, stat: "🎵停止中🎵", stream_stat: "🎵停止中🎵", player: "" };
      
      if (!player.deleted) {
        try {
          player.reactions.removeAll().catch(() => {});
        }
        catch {}
        
        if (player.id === music.player){
          music.player = "";
          await musics.set(interaction.guild.id, music);
        }
      }
    });
  }
}