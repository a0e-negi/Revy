module.exports = {
  name: "checkPermission",
  description: "権限を調べる",
  run(member) {
    const permList = [
      "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS_AND_STICKERS", "USE_APPLICATION_COMMANDS", "MANAGE_THREADS", "USE_PUBLIC_THREADS", "USE_PRIVATE_THREADS", "USE_EXTERNAL_STICKERS"
    ];
    const permDesc = [
      "招待を作成", "メンバーをキック", "メンバーをBAN", "チャンネルの管理", "サーバー管理", "リアクションの追加", "監査ログの表示", "優先スピーカー", "WEBカメラ", "テキストチャンネルの閲覧＆ボイスチャンネルの表示", "メッセージを送信", "TTSメッセージを送信", "メッセージの管理", "埋め込みリンク", "ファイルを添付", "メッセージ履歴を読む", "＠everyone、＠here、全てへのメンション", "外部の絵文字を使用する", "接続", "発言", "メンバーをミュート", "メンバーのスピーカーをミュート", "メンバーを移動", "音声検出を使用", "ニックネームの変更", "ニックネームの管理", "ロールの管理", "ウェブフックの管理", "絵文字・スタンプの管理", "Use Application Commands", "スレッドの管理", "Use Public Threads", "Use Private Threads", "外部のスタンプを使用する"
    ];

    var allowList = [], deniedList = [];

    if (member.permissions.has("ADMINISTRATOR")) {
      allowList = ["+ 管理者"];
    } else {
      for (let i = 0; i < permList.length; i++) {
        if (member.permissions.has(permList[i])) {
          allowList.push("+ "+permDesc[i]);
        } else {
          deniedList.push("- "+permDesc[i]);
        }
      }
    }
    if (!allowList.length) allowList = ["+ 権限無し"];
    if (!deniedList.length) deniedList = ["- 権限無し"];

    return [allowList, deniedList];
  }
} 