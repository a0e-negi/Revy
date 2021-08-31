const Http = require("http");
const { Client, Intents } = require('discord.js');
const fetch = require('node-fetch');
const Keyv = require("keyv");
const musics = new Keyv("sqlite://music.sqlite", {
  table: "musics"
});

const client = new Client({ restTimeOffset: 0, intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_VOICE_STATES"], partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"], properties: { $browser: "Discord iOS" } });

const Premise = require("./scripts/checkPremise");
const premise = ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_AUDIT_LOG"];

// Http.createServer(function(req, res) {
//   if (req.method == "POST") {
//     var data = "";
//     req.on("data", function(chunk) {
//       data += chunk;
//     });
//     req.on("end", function() {
//       if (!data) {
//         res.end("No post data");
//         return;
//       }
//       var dataObject = querystring.parse(data);
//       console.log("post:" + dataObject.type);
//       if (dataObject.type == "wake") {
//         console.log("Woke up in post");
//         res.end();
//         return;
//       }
//       res.end();
//     });
//   } else if (req.method == "GET") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("start\n");
//   }
// }).listen(3000);

client.once('ready',async () => {
  await musics.clear();
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (!Premise.run(["SEND_MESSAGES"], interaction.guild)) return;
  if (!Premise.run(["EMBED_LINKS"], interaction.guild)) {
    interaction.reply("実行に最低限必要な権限が不足しています。\n```diff\n- 埋め込みリンク```");
    return;
  }
  
  const { commandName } = interaction;
  try {
    require(`./commands/${commandName}.js`).run(client, commandName, interaction);
  } catch (err){
    console.log(err)
    require("./scripts/dispNotFoundCommand.js").run(interaction);
  }
});

client.on('messageCreate', async message => {
  if (!message.guild || message.author.bot) return;
  if (!Premise.run(["SEND_MESSAGES", "EMBED_LINKS"], message.guild)) return;

  if (message.content === "にゃーん") {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send({ files: [file] });
    return;
	}

  if (message.content === "おみくじ"){
    require("./scripts/fortune").run(message);
    return
  }
});

client.on('channelCreate', async ch => {
  if (!ch.guild) return;
  if (!Premise.run(premise, ch.guild)) return;

  require("./scripts/sendChannelCreateLog").run(ch);
});

client.on('channelDelete', async ch => {
  if (!ch.guild) return;
  if (!Premise.run(premise, ch.guild)) return;

  require("./scripts/sendChannelDeleteLog").run(ch);
});

client.on('channelUpdate', async ch => {
  if (!ch.guild) return;
  if (!Premise.run(premise, ch.guild)) return;

  require("./scripts/sendChannelUpdateLog").run(ch);
  require("./scripts/sendChannelRoleUpdateLog").run(ch);
  require("./scripts/sendChannelRoleAddLog").run(ch);
  require("./scripts/sendChannelRoleDeleteLog").run(ch)
});

client.on('guildBanAdd', async ban => {
  if (!ban.guid) return;
  
  require("./scripts/sendMemberBanLog.js").run(ban);

  if (!Premise.run(["MANAGE_MESSAGES"], ban.guild)) return;

  const user = ban.user;
  const fetchedLogs = await ban.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});
  const ch = ban.guild.channels.cache;
  const channels = ch.filter(ch => ch.type === "GUILD_TEXT");
  Promise.all(channels.map(async ch => {
    try {
      const msgs = await ch.messages.fetch({ limit: 99 });
      const filter = msgs.filter(msg => msg.author.id === user.id);
      ch.bulkDelete(filter, true);
    } catch { }
  }));
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot || !reaction.message.guildId) return;
  const bot = client.guilds.cache.get(reaction.message.guildId);
  if (!Premise.run(premise, bot)) return;

  const reactionList = ["🇯🇵", "🇺🇸", "🇺🇲", "🇮🇹", "🇫🇷", "🇨🇳", "🇰🇷", "🇷🇺", "🇪🇸", "🇩🇪", "🇲🇾"]
  for (var i in reactionList) {
    if (reaction.emoji.name === reactionList[i]) {
      require("./scripts/translate").run(reaction, user);
    }
  }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (!newMember.guild) return;
  if (!Premise.run(premise, newMember.guild)) return;
  
  require("./scripts/sendNicknameUpdate").run(oldMember, newMember);
  require("./scripts/sendMemberRoleUpdate").run(oldMember, newMember);
});

client.on('messageUpdate', (oldMsg, newMsg) => {
  if (!newMsg.guild) return;
  if (!Premise.run(premise, newMsg.guild)) return;
  
  require("./scripts/sendMessageUpdateLog").run(oldMsg, newMsg);
});

client.on('messageDelete', message => {
  if (!message.guild) return;
  if (!Premise.run(premise, message.guild)) return;
  
  require("./scripts/sendMessageDeleteLog").run(message);
});

client.on('guildMemberAdd', member => {
  if (!member.guild) return;
  if (!Premise.run(premise, member.guild)) return;
  
	require("./scripts/sendMemberAddLog").run(member);
});

client.on('guildMemberRemove', member => {
  if (!member.guild) return;
  if (!Premise.run(premise, member.guild)) return;
  
  require("./scripts/sendMemberKickLog").run(member);
	require("./scripts/sendMemberRemoveLog").run(member);
});

client.login(process.env.TOKEN);