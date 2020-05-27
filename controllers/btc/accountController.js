/**
 * -----------------------------------------------------------------------------
 * Accounts controller used to interact with Bitcoin accounts
 * METHODS:
 * # createAccount
 * # getEthBalance
 * # transfer
 *
 * @dated 12th May 2020
 * -----------------------------------------------------------------------------
 */

const utils = require('../../services/utils/btcUtils');
const BtcAccount = require('../../models/BitcoinAccount');

module.exports = {
    /**
     * Create an account on eth blockchain
     * @param  {} req
     * @param  {} res
     * @returns json
     */
    createAccount: async (req, res) => {
        try {
            BtcAccount.findOne({
                    where: {
                        user_id: req.decoded.id
                    }
                })
                .then(async (data) => {
                    if (data) {
                        res.status(400).json({
                            message: 'User already has Bitcoin account.'
                        });

                    } else {
                        let account = await utils.createAccount();
                        console.log(`Account was created addr: ${account.address}`);
                        console.log(`Account was redeem_code: ${account.redeem_code}`);

                        BtcAccount.create({
                            user_id: req.decoded.id,
                            wallet_address: account.address,
                            private_key: account.redeem_code
                        })

                        res.json({
                            success: true,
                            address: account.address,
                            privateKey: account.redeem_code
                        });
                    }
                })

        } catch (ex) {
            console.log(ex);
            res.status(400).json({
                message: ex.message
            });
        }
    },

    /**
     * Get btc account balance
     * @param  {} req
     * @param  {} res
     * @returns json
     */
    getBtcBalance: async (req, res) => {

        //Check validation of the Btc address

        try {
            BtcAccount.findOne({
                where: {
                    user_id: req.decoded.id
                }
            }).then(async (data) => {
                if (data) {
                    let walletInfo = await utils.getWalletInfo(data.private_key);
                    console.log(walletInfo);
                    res.json({
                        success: true,
                        address: walletInfo.address,
                        balance: walletInfo.balance
                    });
                }
            });
        } catch (ex) {
            console.log(ex);
            res.status(400).json({
                message: ex.message
            });
        }
    },

    /**
     * Transfer btc to another wallet
     * @param  {} req
     * @param  {} res
     * @returns json
     */
    transfer: async (req, res) => {
        console.log("Transfer BTC");
        try {
            BtcAccount.findOne({
                where: {
                    user_id: req.decoded.id
                }
            }).then(async (data) => {
                if (data) {
                    let toAddr = req.body.address;
                    let value = req.body.value;
                    let feeLevel = req.body.feeLevel;

                    let tranInfo = await utils.createTransaction(data.private_key, toAddr, value, feeLevel);
                    console.log(tranInfo);
                    res.json(tranInfo);
                }
            });
        } catch (ex) {
            console.log(ex);
            res.status(400).json({
                message: ex.message
            });
        }
    },
}
