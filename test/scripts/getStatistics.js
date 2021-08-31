module.exports = {
  name: "getStatistics",
  description: "統計取得",
  run(interaction){
    const stat = {}

    const guild = interaction.guild;
    stat.member = guild.memberCount;
    const members = guild.members.cache;
    stat.user = members.filter(member => 
    member.user.bot === false).size;
    stat.bot = members.filter(member => 
    member.user.bot === true).size;
    stat.online = members.filter(member => {
      try {
        member.presence.status !== "offline";
      } catch { }
    }).size;
    const channels = guild.channels.cache;
    stat.textCh = channels.filter(ch => ch.type === "GUILD_TEXT").size;
    stat.voiceCh = channels.filter(ch => ch.type === "GUILD_VOICE").size;
    stat.category = channels.filter(ch => ch.type === "GUILD_CATEGORY").size;

    return stat;
  }
}