var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

//user authentication with passport-local
passport.use(new LocalStrategy(User.authenticate())); // authenticate() method is used to authenticate it is provide by passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating token 

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

//jwt-strategy to extract the token and to verify user
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

//to verify user with passport-jwt strategy    
exports.verifyUser = passport.authenticate('jwt', {session: false});