/* 
    Purpose of this file: 
    Configures passport.js to use JWT for authentication 
    JWT creates and verifies tokens then passport uses that token to handle auth
*/

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/user'); 
require('dotenv').config();

passport.use(new Strategy({
    //tells passport to get jwt from authorization header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET

    //runs when passport verifies a token
}, (jwtPayload, done) => {
    //finds user in the DB by the ID included in the JWT payload
    User.findById(jwtPayload.id, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        return done(null, false);
    });
}));

//middleware to initialize Passport.js
const initializePassport = (app) => {
    app.use(passport.initialize());
};

module.exports = initializePassport;
