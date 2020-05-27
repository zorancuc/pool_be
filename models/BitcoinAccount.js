const Sequelize = require('sequelize');
const sequelize = require('../services/database');


module.exports = sequelize.define('BitcoinAccount', {

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
    wallet_address: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false
    },
    private_key: {
        type: Sequelize.STRING(100),
        allowNull: false
    }

}, {
    freezeTableName: true,
    tableName: 'bitcoin_accounts'
});
