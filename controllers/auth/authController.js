/**
* -----------------------------------------------------------------------------
* Accounts controller used to interact with Bitcoin accounts
* METHODS:
* # login
* # register
* # logout
*
* @dated 28th November 2019
* -----------------------------------------------------------------------------
*/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const User = require('../../models/User');
const ethUtils = require('../../services/utils/ethUtils');
const btcUtils = require('../../services/utils/btcUtils');
const BitcoinAccount = require('../../models/BitcoinAccount');
const EthAccount = require('../../models/EthereumAccount');
const ExchangeBalance = require('../../models/ExchangeBalance');
const Rewards = require('../../models/Rewards');

const {
    JWT_PASSPHRASE: jwtSecret
} = process.env;


module.exports = {
    // loginKakao: ,

    userRegister: async (profile) => {
        let ethResponse = await ethUtils.createAccount();
        let btcResponse = await btcUtils.createAccount();
        console.log(btcResponse.address);
        console.log(btcResponse.redeem_code);
        // Save user to DB
        let user = await User.create({
            email: "",
            password: "",
            first_name: profile.username,
            last_name: "",
            wallet_id: profile.id,
        });
        // Save btc account to DB
        let btc = await BitcoinAccount.create({
            user_id: user.id,
            wallet_address: btcResponse.address,
            private_key: btcResponse.redeem_code,
        });
        // Save eth account to DB
        let ethereum = await EthAccount.create({
            user_id: user.id,
            wallet_address: ethResponse.address,
            private_key: ethResponse.privateKey,
        });
        // Init Balance to DB
        let balance = await ExchangeBalance.create({
            user_id: user.id,
            eth_balance: 0,
            pia_balance: 0,
        });

        let rewards = await Rewards.create({
            user_id: user.id,
            eth_reward: 0,
            btc_reward: 0,
            deposited_at: new Date(),
        });

        res = {
            status: true,
            user: user,
            btc: btc.address,
            ethereum: ethereum.address,
            balance: balance,
            rewards: rewards,
            message: "User created successfully!",
        }

        console.log(res)

        return res;
    },

    callback: async (req, res) => {
        console.log(req.session.passport);
        res.redirect('/');
    },

    login: async (req, res) => {

        try {
            const { email, password } = req.body;

            User.findOne({ where: { email: email }}).then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password).then(match => {
                        if (match) {
                            // Create a token
                            let payload = { id: user.id, email: user.email };
                            const token = jwt.sign(payload, jwtSecret, { expiresIn: '2d' });

                            res.json({
                                status: true,
                                user: user,
                                token: token,
                                message: 'login successful.'
                            });

                        } else {
                            res.status(401).json({ message: 'Invalid credentials.' });
                        }

                    }).catch(err => {
                        res.status(500).json({ message: err.message });
                    });

                } else {
                    res.status(401).json({
                        message: "Invalid credentials."
                    });
                }

            });

        } catch (ex) {
            res.status(400).json({
                message: ex.message
            })
        }

    },

    /**
    * Create new user
    * @param  {} req
    * @param  {} res
    * @returns json
    */
    register: async (req, res) => {
        console.log(req.body);
        try {
            // User.findOne({ where: { wallet_id: req.body.wallet_id }}).then((data) => {
            //     if (data) {
            //         res.status(400).json({
            //             message: "Wallet ID '" + req.body.wallet_id + "' is taken, use another one."
            //         })
            //     }
            // });

            User.findOne({ where: { email: req.body.email }}).then((data) => {
                if (data) {
                    res.status(400).json({
                        message: "User already present with email '" + req.body.email + "'."
                    });
                }
            });

            let ethResponse = await ethUtils.createAccount();
            let btcResponse = await btcUtils.createAccount();
            console.log(btcResponse.address);
            console.log(btcResponse.redeem_code);
            // Save user to DB
            let userInfo = req.body;
            userInfo.wallet_id = userInfo.email;
            let user = await User.create(userInfo)
            // Save btc account to DB
            let btc = await BitcoinAccount.create({
                user_id : user.id,
                wallet_address: btcResponse.address,
                private_key: btcResponse.redeem_code
            });
            // Save eth account to DB
            let ethereum = await EthAccount.create({
                user_id : user.id,
                wallet_address: ethResponse.address,
                private_key: ethResponse.privateKey
            })
            // Init Balance to DB
            let balance = await ExchangeBalance.create({
                user_id : user.id,
                eth_balance: 0,
                pia_balance: 0
            })

            let rewards = await Rewards.create({
                user_id: user.id,
                eth_reward: 0,
                btc_reward: 0,
                deposited_at: new Date()
            })

            res.json({
                status: true,
                user: user,
                btc: btcResponse.address,
                ethereum: ethResponse.address,
                balance: balance,
                rewards: rewards,
                message: 'User created successfully!'
            })

        } catch (ex) {
            res.status(400).json({ message: ex.message })
        }

    },

    /**
    * @param  {} req
    * @param  {} res
    * @returns json
    */
    getAuth: async (req, res) => {
        try {
            if (req.decoded) {
                User.findOne({ where: { id: req.decoded.id } })
                .then(user => {
                    console.log(user);
                    if (user) {
                        res.json({ user: user });
                    } else {
                        res.status(400).json({ message: 'User not found.' });
                    }
                })
                .catch(err => {
                    res.status(400).json({ message: err.message });
                });

            } else {
                res.status(400).json({ message: 'Token Error.' });
            }
        } catch (ex) {
            res.status(400).json({ message: ex.message });
        }
    },
}
