const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const Menu = require("./createPageNation.js");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

module.exports = {
  name: "dispMusicList",
  description: "プレイリスト表示",
  async run(interaction){
    const music = (await musics.get(interaction.guild.id)) || { music_urls: [], music_names: [], loop: false, pos: 0, stat: "停止中", stream_stat: "停止中", player: "" };
    
    const emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    var nameList1 = [], nameList2 = [];
    for (let i in music.music_names){
      if (i < 5){
        if (i%2) {
          nameList1.push(emoji[i] + "\n```fix\n" + music.music_names[i] + "```");
        } else {
          nameList1.push(emoji[i] + "\n```yaml\n" + music.music_names[i] + "```");
        }
      } else{
        if (i%2) {
          nameList2.push(emoji[i] + "\n```fix\n" + music.music_names[i] + "```");
        } else {
          nameList2.push(emoji[i] + "\n```yaml\n" + music.music_names[i] + "```");
        }
      }
    }

    if (!nameList2.length){
      const embed = new MessageEmbed({
        title: "プレイリスト",
        description: nameList1.join("\n"),
        color: "ORANGE"
      });
      interaction.reply({ embeds: [embed] });
      return;
    } else{
      const pages = [
        new MessageEmbed({
          title: "プレイリスト",
          description: nameList1.join("\n"),
          color: "ORANGE"
        }),
        new MessageEmbed({
          title: "プレイリスト",
          description: nameList2.join("\n"),
          color: "ORANGE"
        })
      ];
      Menu.run(interaction, pages);
      return;
    }
  }
}