const Sequelize = require('sequelize');
const fortuneDB = new Sequelize('sqlite://fortune.sqlite');
const musicDB = new Sequelize('sqlite://music.sqlite');
const Fortunes = require('../models/fortune.js')(fortuneDB, Sequelize.DataTypes);
const Musics = require('../models/music.js')(musicDB, Sequelize.DataTypes);

module.exports = { Fortunes, Musics };