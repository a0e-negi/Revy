const { Client, ClientApplication, Intents } = require("discord.js");
const commands = require("./commandList").commands;

async function register(client, commands, guildID) {
  if (guildID == null) {
    client.application.commands.set(commands);
    console.log("グローバルコマンド登録成功！");
    return;
  }
  const guild = await client.guilds.fetch(guildID);
  guild.commands.set(commands);
  console.log("ギルドコマンド登録成功！");
  return;
}
const client = new Client({ intents: 0 });

client.token = process.env.TOKEN;
async function main() {
  client.application = new ClientApplication(client, {});
  await client.application.fetch();
  // await register(client, commands, "753286664163426356");
  await remove(client, "753286664163426356");
}
main().catch(err => console.error(err));

async function remove(client, guildID) {
  if (guildID == null) {
    client.application.commands.set([]);
    console.log("グローバルコマンド削除成功！");
    return;

  }
  const guild = await client.guilds.fetch(guildID);
  guild.commands.set([]);
  console.log("ギルドコマンド削除成功！");
  return;
}
