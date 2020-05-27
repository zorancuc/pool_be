const Sequelize = require('sequelize');
const sequelize = require('../services/database');


module.exports = sequelize.define('Rewards', {

  id: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  eth_reward: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    allowNull: false,
  },
  btc_reward: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    allowNull: false,
  },
  deposited_at: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },

}, {
  freezeTableName: true,
  tableName: 'rewards'
});
