module.exports = (sequelize, DataTypes) => {
	return sequelize.define('fortunes', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      random_color: DataTypes.STRING,
      random_num: DataTypes.INTEGER,
    }, {});
}