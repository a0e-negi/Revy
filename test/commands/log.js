const { MessageActionRow, MessageButton,　MessageEmbed } = require("discord.js");
const Database = require("@replit/database")
const db = new Database();
var flag = false;

module.exports = {
  async run(client, command, interaction){
    const permList = [
      "MANAGE_CHANNELS", "VIEW_AUDIT_LOG"
    ]
    const permDesc = ["チャンネルの管理", "監査ログの表示"];
    const premise = require("../scripts/dispPremise").run(permList, permDesc, interaction);
    if (!premise) return;
    
    const log = (await db.get(interaction.guild.id)) || {}
    
    const embed = new MessageEmbed({
      title: "ログチャンネルを作成しますか？",
      description: "作成前に以下の点をご確認ください。\n" + 
      "・作成後にチャンネル名の変更は可能です。\n" +
      "・初期状態では管理者のみ閲覧できます。\n" +
      "・適切なロール設定がわからない場合、管理者権限を付与しておくことを推奨します。",
      color: "YELLOW",
    });
    const row = new MessageActionRow()
			.addComponents(new MessageButton()
			  .setCustomId("createLog")
			  .setLabel("作成")
			  .setStyle('SUCCESS')
		  )	.addComponents(new MessageButton()
			  .setCustomId("cansel")
			  .setLabel("キャンセル")
			  .setStyle('DANGER')
		  );

    interaction.reply({ embeds: [embed], components: [row] });
    const logMsg = await interaction.fetchReply();
    const filter = i => (i.customId === 'createLog' || i.customId === 'cansel') && i.user.id === interaction.user.id;
    const collector = logMsg.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async i=> {
      flag = true;
      if (i.customId === 'createLog'){
        const rogCategory = await interaction.guild.channels.create('📝サーバーログ', {
          type: 'GUILD_CATEGORY',
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ["VIEW_CHANNEL"],
            }
          ]
        });
        const entryLog = await interaction.guild.channels.create('入退室記録', {
          type: 'GUILD_TEXT',
          parent: rogCategory
        });
        const msgLog = await interaction.guild.channels.create('メッセージ記録', {
          type: 'GUILD_TEXT',
          parent: rogCategory
        });
        const memberLog = await interaction.guild.channels.create('メンバー記録', {
          type: 'GUILD_TEXT',
          parent: rogCategory
        });
        const guildLog = await interaction.guild.channels.create('サーバー記録', {
          type: 'GUILD_TEXT',
          parent: rogCategory
        });

        log.entryLog = entryLog.id;
        log.msgLog = msgLog.id;
        log.memberLog = memberLog.id;
        log.guildLog = guildLog.id;
        await db.set(interaction.guild.id, log);

        const embed = new MessageEmbed({
          title: "ログチャンネルを作成しました。",
          color: "GREEN"
        });
        interaction.editReply({ embeds: [embed], components: [] });
        return;
      }
      if (i.customId === 'cansel'){
        const embed = new MessageEmbed({
          title: "キャンセルしました。",
          color: "RED"
        })
        interaction.editReply({ embeds: [embed], components: [] });
        setTimeout(() => {
          if (!logMsg.deleted){
            interaction.deleteReply()
          }
        }, 5000);
        return;
      }
    });

    collector.on('end', async () => {
      if (!logMsg.deleted){
        if (flag) return;
        const embed = new MessageEmbed({
          title: "キャンセルしました。",
          color: "RED"
        })
        await interaction.editReply({ embeds: [embed], components: [] });
        setTimeout(() => {
          interaction.deleteReply();
        },5000);
      }
    });
  }
}