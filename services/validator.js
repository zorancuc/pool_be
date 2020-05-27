const Joi = require('joi');

module.exports = {

    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error);
            }

            if (!req.value) { req['value'] = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {

        /** Auth routes */
        auth: {

            login: Joi.object().keys({
                email: Joi.string().required(),
                password: Joi.string().required()
            }),

            register: Joi.object().keys({
                password: Joi.string().required(),
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                email: Joi.string().email().required()
            }),

        },

        eth: {

            account: {
                getTokenBalance: Joi.object().keys({
                    token_address: Joi.string().required(),
                    wallet_address: Joi.string().required()
                }),

                transfer: Joi.object().keys({
                    address: Joi.string().required(),
                    value: Joi.number().required()
                }),

                transferToken: Joi.object().keys({
                    token_address: Joi.string().required(),
                    wallet_address: Joi.string().required(),
                    private_key: Joi.string().required(),
                    value: Joi.number().required()
                }),

            },

            trx: {

            },

        },

        btc: {

            account: {

                transfer: Joi.object().keys({
                    address: Joi.string().required(),
                    private_key: Joi.string().required(),
                    value: Joi.number().required()
                }),
            },

            trx: {

            },

        },

        bridge: {

            tokenExchange: Joi.object().keys({
                pastaToken: Joi.string().required(),
                erc20token: Joi.string().required(),
                amount: Joi.number().required()
            }),

        }

    }
}
