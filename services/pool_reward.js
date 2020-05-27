const cron = require("node-cron");
const BtcAccount = require('../models/BitcoinAccount');
const EthAccount = require('../models/EthereumAccount');
const btcUtils = require('./utils/btcUtils');
const ethUtils = require('./utils/ethUtils');
const httpClient = require('./httpClient');
const rewards = require('../models/Rewards');
const web3 = require('./web3');
const user = require('../models/User');

async function calcETHReward() {
    let ethAccountsData = await EthAccount.findAll({
        attributes: ['user_id', 'wallet_address', 'private_key']
    });

    for (let i = 0; i < 1; i++) {
        let ethAccountData = ethAccountsData[i].dataValues;
        console.log(ethAccountData.wallet_address);
        let balance = await web3.eth.getBalance(ethAccountData.wallet_address);
        balance = 1000
        if ( balance > 0 ) {
            let dailyReward = balance * 1 / 100;
            let rewardsData = await rewards.findOne({
                attributes: ['eth_reward'],
                where: {
                    user_id: ethAccountData.user_id
                }
            })
            let ethReward = rewardsData.dataValues.eth_reward;
            console.log(ethReward);
            rewardsData = await rewards.update({
                eth_reward: ethReward + dailyReward
            }, {
                where: {
                    user_id: ethAccountData.user_id
                }
            })

        }
    }
}

async function calcBTCReward() {
    let btcAccountsData = await BtcAccount.findAll({
        attributes: ['user_id', 'wallet_address', 'private_key']
    });

    for (let i = 0; i < 1; i++) {
        let btcAccountData = btcAccountsData[i].dataValues;
        console.log(btcAccountData.wallet_address);
        let btcWalletInfo = await btcUtils.getWalletInfo(btcAccountData.private_key);
        console.log(btcWalletInfo);
        let balance = btcWalletInfo.balance;
        balance = 1000
        if (balance > 0) {
            let dailyReward = balance * 1 / 100;
            let rewardsData = await rewards.findOne({
                attributes: ['btc_reward'],
                where: {
                    user_id: btcAccountData.user_id
                }
            })
            let btcReward = rewardsData.dataValues.btc_reward;
            console.log(btcReward);
            rewardsData = await rewards.update({
                btc_reward: btcReward + dailyReward
            }, {
                where: {
                    user_id: btcAccountData.user_id
                }
            })

        }
    }
}

async function calcReward() {
    let usersData = await user.findAll({
        attributes: ['id']
    });

    for (let i = 0; i < usersData.length; i++) {
        let userData = usersData[i]
        // console.log(userData.dataValues.id)
        let userId = userData.dataValues.id;

        let ethData = await EthAccount.findOne({
            attributes: ['wallet_address'],
            where: {
                user_id: userId
            }
        })

        let ethDailyReward = 0;
        if (ethData != null) {
            // console.log(ethData.dataValues.wallet_address);
            let balance = await web3.eth.getBalance(ethData.dataValues.wallet_address);
            balance = 1000
            ethDailyReward = balance * 1 / 100;
        }

        let btcData = await BtcAccount.findOne({
            attributes: ['private_key'],
            where: {
                user_id: userId
            }
        })

        let btcDailyReward = 0;
        if (btcData != null) {
            // console.log(btcData.dataValues.private_key);
            let btcWalletInfo = await btcUtils.getWalletInfo(btcData.dataValues.private_key);
            // console.log(btcWalletInfo);
            let balance = btcWalletInfo.balance;
            balance = 1000
            btcDailyReward = balance * 1 / 100;
        }

        let rewardsData = await rewards.findOne({
            attributes: ['eth_reward', 'btc_reward'],
            where: {
                user_id: userId
            }
        })

        if (rewardsData != null ) {
            let btcReward = rewardsData.dataValues.btc_reward;
            let ethReward = rewardsData.dataValues.eth_reward;
            // console.log(btcReward);
            // console.log(ethReward);
            rewardsData = await rewards.update({
                btc_reward: btcReward + btcDailyReward,
                eth_reward: ethReward + ethDailyReward
            }, {
                where: {
                    user_id: userId
                }
            })
        }
    }
    // for (let i = 0; i < 1; i++) {
    //     let btcAccountData = btcAccountsData[i].dataValues;
    //     console.log(btcAccountData.wallet_address);
    //     let btcWalletInfo = await btcUtils.getWalletInfo(btcAccountData.private_key);
    //     console.log(btcWalletInfo);
    //     let balance = btcWalletInfo.balance;
    //     balance = 1000
    //     if (balance > 0) {
    //         let dailyReward = balance * 1 / 100;
    //         let rewardsData = await rewards.findOne({
    //             attributes: ['btc_reward'],
    //             where: {
    //                 user_id: btcAccountData.user_id
    //             }
    //         })
    //         let btcReward = rewardsData.dataValues.btc_reward;
    //         console.log(btcReward);
    //         rewardsData = await rewards.update({
    //             btc_reward: btcReward + dailyReward
    //         }, {
    //             where: {
    //                 user_id: btcAccountData.user_id
    //             }
    //         })

    //     }
    // }
}

// calcETHReward();
// calcBTCReward();
// calcReward();
// exchangeERC2PASTA();
// exchangePASTA2ERC();
// exchangeTIAtoERC20();


// cron.schedule("*/5 * * * * *", function() {
//   console.log("---------------------");
//   console.log("Running Cron Job");

// });
