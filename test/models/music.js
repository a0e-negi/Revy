module.exports = (sequelize, DataTypes) => {
	return sequelize.define('musics', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      music_urls: DataTypes.ARRAY(DataTypes.STRING),
      music_names: DataTypes.ARRAY(DataTypes.STRING),
      loop: DataTypes.BOOLEAN,
      pos: DataTypes.INTEGER,
      stat: DataTypes.STRING,
      stream_stat: DataTypes.STRING,
      player: DataTypes.ARRAY(DataTypes.STRING)
    }, {});
}