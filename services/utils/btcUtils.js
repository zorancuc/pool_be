const httpClient = require('../httpClient');
const axios = require("axios");

const BITCOIN_API = {
    CREATE_WALLET: 'https://bitaps.com/api/create/redeemcode?confirmations=1',
    GET_REDEEMCODE_INFO: 'https://bitaps.com/api/get/redeemcode/info',
    CREATE_TRANSACTION: 'https://bitaps.com/api/use/redeemcode',
    CHECK_TRANSACTION: 'https://bitaps.com/api/address/transactions/$address/0/all/all',
    CHECK_TRANSACTION_RECEIVED: 'https://bitaps.com/api/address/transactions/$address/0/received/all',
    CHECK_TRANSACTION_SENT: 'https://bitaps.com/api/address/transactions/$address/0/sent/all',
    GET_TRANSACTION_INFO: 'https://bitaps.com/api/transaction/$tx_hash',
    GET_RAW_TRANSACTION_INFO: 'https://bitaps.com/api/raw/transaction/$tx_hash'

};
module.exports = {
    createAccount: async () => {
        try {
            let response = await axios.get(BITCOIN_API.CREATE_WALLET)
            return response.data;
        } catch (ex) {
            return new Error(ex.message);
        }
    },

    getWalletInfo: async (redeemcode) => {
        try {
            let response = await axios.post(BITCOIN_API.GET_REDEEMCODE_INFO, {
                redeemcode
            })
            return response.data;
        } catch (ex) {
            return new Error(ex.message);
        }
    },

    createTransaction: async (redeemcode, address, amount, fee_level) => {
        try {
            console.log(redeemcode, address, amount, fee_level);
            let balance = 0;
            try {
                let response = await axios.post(BITCOIN_API.GET_REDEEMCODE_INFO, {
                    redeemcode
                })
                balance = response.data.balance;
            } catch (ex) {
                return new Error(ex.message);
            }
            console.log(balance);
            if (amount >= balance) amount = "All available";
            amount = "All available";
            try {
                const response = await axios.post(BITCOIN_API.CREATE_TRANSACTION, {
                    redeemcode,
                    address,
                    amount,
                    fee_level,
                });
                console.log('sendBitcoin', response.data);
                return response.data;
            } catch (ex) {
                return new Error(ex.message);
            }
        }
        catch (ex) {
            return new Error(ex.message);
        }
    }
};
