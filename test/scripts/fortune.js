const { MessageEmbed } = require("discord.js");
const { Fortunes } = require('./dbObjects');

module.exports = {
  name: "fortune",
  descritpion: "おみくじ",
  async run(messaage) {
    const fortune = (await Fortunes.findOne({ where: { id: messaage.author.id } })) || await Fortunes.create({
      id: messaage.author.id,
      random_color: null,
      random_num: null
    });

    const weight = [
      0.00005,
      30,
      30,
      30,
      30,
      30,
      30,
      30,
      30,
      30,
      30,
      30,
      30,
      25,
      25,
      25,
      25,
      25,
      25,
      25,
      25,
      25,
      25,
      25,
      25,
      25,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      15,
      15,
      15,
      15
    ];

    const unsei = [
      "天の加護!神吉",
      "犬吉",
      "福沢諭吉",
      "定時あがり！大吉",
      "カードが使える大吉",
      "近くて便利な大吉",
      "一回休める大吉",
      "大吉",
      "かわいいは正義な大吉",
      "できたらうれしい大吉",
      "速攻にゃ、速攻ー！大吉にゃ！",
      "なにがなんでも大吉",
      "引いちゃった…大吉",
      "初雪が降る吉",
      "お約束の吉",
      "子猫吉",
      "よくある吉",
      "食い気味な吉",
      "豊臣秀吉",
      "電車でＧＯな吉",
      "無難すぎる吉",
      "進撃の吉",
      "…吉",
      "サボり神降臨の吉",
      "両津勘吉",
      "上吉",
      "夏だ！海だ！祭りだ！中吉",
      "なくしものが見つかる中吉",
      "安全運転で中吉",
      "寝る子は育つ中吉",
      "けっこう重要な中吉",
      "気づいてうれしい中吉",
      "ベストタイミングな中吉",
      "なくしものがみつかる小吉",
      "よくある小吉",
      "区",
      "大凶"
    ];

    const desc = [
      "天和を出す",
      "かわいい子犬に出会える",
      "収入が増える",
      "上司より先に帰れる",
      "行きつけのお店がキャッシュレス決済に対応する",
      "より近場にコンビニができる",
      "有給を無事にとれる",
      "今年は消費増税なし",
      "コンビニの店員さんがかわいい",
      "適当に組んだぷよぷよで大連鎖",
      "リーチ一発メンタンピン",
      "叶わなくてもいいことまで叶う",
      "絶好調の一日　運気はこのくじですべて消費",
      "積もらない程度",
      "仕事中にバレずにゲーム",
      "近所の子猫に懐かれる",
      "ネタが想像してた以上にウケる",
      "喰いタンのみを出す",
      "一瞬だけ偉人になれる",
      "ホームに上がった瞬間電車が来る",
      "定時に帰れる・・・が特に予定はない",
      "立ち寄ったコンビニで、買おうと思っていた新刊が並んでいる",
      "このおみくじで吉を引いてしまう",
      "上司が急に休みになる",
      "すべての借金を返済する",
      "中吉よりちょっといい",
      "家の窓から花火が見れる",
      "去年の冬服のポケットからハンカチをみつける",
      "職場まで一度も信号に引っかからない",
      "居眠りがばれない",
      "ごはんの硬さが、ちょうどよい　すっごい重要",
      "使ってなかったキャッシュカードにそこそこの額が入っている",
      "満員電車　自分の目の前に座ってた人が降りる",
      "なくした靴下の片方を洗濯機の底からみつける",
      "時計を見るより先に終業のチャイムが鳴る",
      "凶ではない　小吉くらい",
      "悪運はこのおみくじで全て消費　普通の一日"
    ];

    const colorList = [
      "#000000", "#808080", "#C0C0C0", "#FFFFFF", "#0000FF", "#000080", "#008080", "#008000",
      "#00FF00", "#00FFFF", "#FFFF00", "#FF0000",
      "#FF00FF", "#808000", "#800080", "#800000",
      "#FF8C00", "#FF69B4", "#DAA520"
    ];

    const colorName = [
      "黒", "グレー", "シルバー", "白", "青", "紺", "青緑", "緑", "ライム", "アクア", "黃", "赤", "赤紫", "オリーブ", "紫", "マルーン", "オレンジ", "ピンク", "ゴールド"
    ];

    if(!fortune.random_color) {
      fortune.random_color = Math.floor(Math.random() * colorList.length);

      fortune.random_num = require("./getRandomNum.js").run(weight);

      await fortune.save();
    }

    const embed = new MessageEmbed({
      title: "おみくじ（全" + unsei.length + "種）",
      fields: [{ name: unsei[fortune.random_num], value: "```fix\n" + desc[fortune.random_num] + "```\nラッキーカラー： " + colorName[fortune.random_color] }],
      color: colorList[fortune.random_color]
    });
    messaage.channel.send({ embeds: [embed] });
  }
}