module.exports = {
  commands: [
    {
      name: "music",
      description: "音源を再生します",
      options: [
        {
          type: "SUB_COMMAND",
          name: "add",
          description: "楽曲をプレイリストに追加します。",
          options: [
            {
              type: "STRING",
              name: "リンク",
              description: "動画のURL（YouTube）を指定",
              required: true
            }
          ]
        },
        {
          type: "SUB_COMMAND",
          name: "delete",
          description: "楽曲をプレイリストから削除します。",
          options: [
            {
              type: "NUMBER",
              name: "リスト番号",
              description: "削除したいリスト番号を指定。",
              required: true
            }
          ]
        },
        {
          type: "SUB_COMMAND",
          name: "list",
          description: "プレイリストを表示します。"
        },
        {
          type: "SUB_COMMAND",
          name: "play",
          description: "楽曲を再生します。",
          options: [
            {
              type: "STRING",
              name: "リンク",
              description: "動画のURL（YouTube）を指定した場合、その曲のみ再生します。"
            }
          ]
        },
        {
          type: "SUB_COMMAND",
          name: "loop",
          description: "曲のリピート設定を行います。"
        }
      ]
    },
    {
      name: "log",
      description: "ログチャンネルを作成します。"
    },
    {
      name: "react",
      description: "メッセージにリアクションを付与・削除します。",
      options: [
        {
          type: "STRING",
          name: "操作",
          description: "付与：大量のリアクションを付与します。 ｜ 削除：すべてのリアクションを削除します。",
          required: true,
          choices: [
            {
              name: "付与",
              value: "add"
            },
            {
              name: "削除",
              value: "remove"
            }
          ]
        },
        {
          type: "STRING",
          name: "メッセージ",
          description: "付与したいメッセージのIDを指定。省略した場合、一つ上のメッセージに付与します。"
        }
      ]
    },
    {
      name: "clear",
      description: "メッセージを一括削除します。 2週間以上経過したメッセージは削除できません。",
      options: [
        {
          type: "NUMBER",
          name: "削除数",
          description: "削除数を1~99の範囲で指定。ユーザーを指定した場合、削除数が減少することがあります。",
          required: true
        },
        {
          type: "USER",
          name: "ユーザー",
          description: "指定したユーザーのメッセージのみ削除します。"
        }
      ]
    },
    {
      name: "vote",
      description: "投票を作成します。",
      options: [
        {
          type: "STRING",
          name: "テーマ",
          description: "投票のテーマを指定",
          required: true
        },
        {
          type: "STRING",
          name: "詳細",
          description: "投票の詳細を指定",
          required: true
        },
        {
          type: "NUMBER",
          name: "投票時間",
          description: "投票時間を指定",
          required: true
        }
      ]
    },
    {
      name: "embed",
      description: "embedメッセージを作成します。",
      options: [
        {
          type: "STRING",
          name: "タイトル",
          description: "タイトルを指定（省略可）",
        },
        {
          type: "STRING",
          name: "説明文",
          description: "説明文を指定（省略可） 改行するには、改行したい位置に\\n",
        },
        {
          type: "STRING",
          name: "色",
          description: "色を指定（省略可）",
          choices: [
            {
              name: "ランダム",
              value: "RANDOM"
            },
            {
              name: "赤",
              value: "RED"
            },
            {
              name: "青",
              value: "BLUE"
            },
            {
              name: "黄",
              value: "YELLOW"
            },
            {
              name: "緑",
              value: "GREEN"
            },
            {
              name: "オレンジ",
              value: "ORANGE"
            },
            {
              name: "ピンク",
              value: "#FFC0CB"
            },
            {
              name: "紫",
              value: "PURPLE"
            },
            {
              name: "白",
              value: "WHITE"
            },
            {
              name: "黒",
              value: "DEFAULT"
            }
          ]
        }
      ]
    },
    {
      name: "userinfo",
      description: "ユーザー情報を表示します。",
      options: [
        {
          type: "USER",
          name: "対象",
          description: "メンバーを指定",
          required: true
        }
      ]
    },
    {
      name: "serverinfo",
      description: "サーバー情報を表示します。",
    },
    {
      name: "ban",
      description: "メンバーをBANします。",
      options: [{
        type: "USER",
        name: "対象",
        description: "BANするメンバーを指定",
        required: true
      }]
    },
    {
      name: "database",
      description: "データベースを操作します。",
      options: [
        {
          type: "STRING",
          name: "対象",
          description: "操作するテーブルを指定",
          required: true,
          choices: [
            {
              name: "fortunes",
              value: "fortunes",
            },
            {
              name: "musics",
              value: "musics",
            }
          ]
        },
        {
          type: "STRING",
          name: "操作",
          description: "実行する操作を指定",
          required: true,
          choices: [
            {
              name: "clear",
              value: "clear",
            }
          ]
        }
      ]
    },
    {
      name: "top",
      description: "最初のメッセージへのリンクを作成します。",
    }
  ]
}