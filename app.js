var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

require('dotenv').config();
// DB connection
require('./services/database');
require('./services/pool_reward');

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
var authController = require('./controllers/auth/authController');

const User = require('./models/User');
const jwt = require('jsonwebtoken');

const {
  JWT_PASSPHRASE: jwtSecret
} = process.env;



var index = require('./routes/index');

var app = express();

passport.use(
  "kakao-login",
  new KakaoStrategy({
      clientID: "69b9e7e81a0d8274fabba4161d383171",
      callbackURL: "http://192.168.0.3:3001/api/auth/loginKakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      try {
        User.findOne({
          where: {
            wallet_id: profile.id
          }
        }).then((data) => {
          if (data) {
            console.log(" ID '" + profile.id + "' is taken, use another one.");
            let payload = {
              wallet_id: profile.id
            };
            const token = jwt.sign(payload, jwtSecret, {
              expiresIn: '2d'
            });

            return done(null, {
              user: data,
              token: token,
              message: 'login successful.'
            });

          } else {
            return done(null, authController.userRegister(profile));
          }
        });
      } catch (ex) {
        return "";
      }

    }
  )
);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log(user.user);
  console.log(user.user.dataValues.wallet_id);
  done(null, user);
});
passport.deserializeUser(function (id, done) {
  console.log("deserialize");
  console.log(id);
  User.findById(id, function (err, user) {
    console.log(user);
    if (!err) done(null, user);
    else done(err, null);
  });
});

app.use(cors());
app.use('/', index);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

console.log("OKOKOKKKKKKKKKK");

module.exports = app;
