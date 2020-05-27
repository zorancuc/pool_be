var express = require('express');
var router = express.Router();
const { validateToken } = require('../services/middleware');

const eth = {
    'v1': require('./eth/v1')
};

const btc = {
    'v1': require('./btc/v1')
}

const bridge = {
    'v1': require('./bridge/v1')
};

/* GET home page. */
// router.get('/', (req, res) => res.send("Futurepia Microservice REST API is working"));
router.get('/', function(req, res) {
    res.sendFile(path.join(process.cwd() + '/public/index.html'));
});

router.use('/api/auth', require('./auth'));
// router.use('/api/bridge/v1', validateToken, bridge['v1']);
router.use('/api/eth/v1', validateToken, eth['v1']);
// router.use('/api/eth/v1', eth['v1']);
router.use('/api/btc/v1', validateToken, btc['v1']);
// router.use('/api/btc/v1', btc['v1']);

module.exports = router;
