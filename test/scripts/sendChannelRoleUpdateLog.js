const { MessageEmbed, Permissions } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

function permDiff(oldPerm, newPerm) {
  var diff = []
  for (let i in newPerm){
    const check = oldPerm.findIndex(j => j === newPerm[i]);
    if (check > -1) {
      oldPerm.splice(check, 1);
      newPerm.splice(i, 1);
      --i;
    }
  }
  return oldPerm.concat(newPerm);
}
function permCheck(allowList, denyList, chAllow, chDeny) {
  const permList = [
    'CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'USE_APPLICATION_COMMANDS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS'
  ];
  const nameList = [
    "招待を作成", "チャンネルの管理", "リアクションの追加", "チャンネルを見る", "メッセージを送信", "テキスト読み上げメッセージを送信する", "メッセージの管理", "埋め込みリンク", "ファイルを添付", "メッセージ履歴を読む", "＠everyone、＠here、全てのロールにメンション", "外部の絵文字を使用する", "権限の管理", "ウェブフックの管理", "Use Application Commands", "スレッドの管理", "Use Public Threads", "Use Private Threads", "外部のスタンプを使用する"
  ];
  var update = []
  for (let i in allowList) {
    const check = denyList.findIndex(j => j === allowList[i]);
    const check2 = chAllow.find(j => j === allowList[i]);
    const permName = nameList[permList.findIndex(perm => perm === allowList[i])];
    if (check > -1) {
      if (check2) {
        update.push(`${permName}：✅→❌`);
      } else {
        update.push(`${permName}：❌→✅`);
      }
      denyList.splice(check, 1);
    } else {
      if (check2) {
        update.push(`${permName}：✅→🔳`);
      } else {
        update.push(`${permName}：🔳→✅`);
      }
    }
  }
  for (let i in denyList) {
    const check = chDeny.find(j => j === denyList[i]);
    const permName = nameList[permList.findIndex(perm => perm === denyList[i])];
    if (check) {
      update.push(`${permName}：❌→🔳`);
    } else {
      update.push(`${permName}：🔳→❌`);
    }
  }
  return update;
}

module.exports = {
  async run(ch) {
    const fetchedLogs = await ch.guild.fetchAuditLogs({
      limit: 1,
    });
    const chLog = fetchedLogs.entries.first();
    if (chLog.action !== "CHANNEL_OVERWRITE_UPDATE") return;

    var { executor, target, extra, changes } = chLog;

    const log = await db.get(ch.guild.id) || {}
    if (!log.guildLog) return;

    const logCh = ch.guild.channels.cache.get(log.guildLog);
    if (!logCh) return;

    chAllow = new Permissions(ch.permissionOverwrites.cache.get(extra.id).allow.bitfield).toArray();
    chDeny = new Permissions(ch.permissionOverwrites.cache.get(extra.id).deny.bitfield).toArray();

    var allowList = [], denyList = [];
    for (let i in changes) {
      const oldPerm = new Permissions(BigInt(Number(changes[i].old))).toArray();
      const newPerm = new Permissions(BigInt(Number(changes[i].new))).toArray();
      if (changes[i].key === "allow") {
        allowList = permDiff(oldPerm, newPerm);
      }
      if (changes[i].key === "deny") {
        denyList = permDiff(oldPerm, newPerm);
      }
    }
    const update = permCheck(allowList, denyList, chAllow, chDeny);

    var name, title;
    const role = ch.guild.roles.cache.get(extra.id);
    console.log(role)
    if (!role) {
      title = "メンバー権限変更";
      const member = ch.guild.members.cache.get(extra.id);
      name = `<@${member.id}>`;
    } else {
      title = "ロール権限変更";
      if (role.id === ch.guild.id){
        name = `@everyone`;
      } else {
        name = `<@&${role.id}>`;
      }
    }
    
    const timeStamp = require("./getStringFromDate").run(new Date());
    const embed = new MessageEmbed({
      author: {
        name: "チャンネル設定変更",
        icon_url: "https://pic.sopili.net/pub/emoji/noto-emoji/png/128/emoji_u1f4dd.png"
      },
      description: `<@${executor.id}>が<#${ch.id}>の権限設定を変更しました`,
      fields: [
        {
          name: title , value: name + "\n" + update.join("\n")
        }
      ],
      color: "#8B008B",
      footer: {
        text: `${timeStamp}`
      }
    });
    logCh.send({ embeds: [embed] }).catch(() => {});
  }
}