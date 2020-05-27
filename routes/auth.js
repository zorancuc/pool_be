var express = require('express');
var router = express.Router();
const { validateBody, schemas } = require('../services/validator');
const { validateToken } = require('../services/middleware');
var authController = require('../controllers/auth/authController');
const passport = require('passport')

router.get('/loginKakao', passport.authenticate("kakao-login"), function (req, res) {});
router.get('/loginKakao/callback', passport.authenticate("kakao-login", {
        // successRedirect: "http://192.168.0.3:3000/",
        failureRedirect: "/login"
    }) , authController.callback);
router.post('/login', validateBody(schemas.auth.login), authController.login);
router.post('/register', validateBody(schemas.auth.register), authController.register);
router.get('/user', validateToken, authController.getAuth);

module.exports = router;
