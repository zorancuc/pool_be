var express = require('express');
var router = express.Router();
const {
    validateBody,
    schemas
} = require('../../../services/validator');
var accountController = require('../../../controllers/btc/accountController');

router.post('/create', accountController.createAccount);
router.post('/balance', accountController.getBtcBalance);
router.post('/transfer', accountController.transfer);

module.exports = router;
