const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('user');

passport.serializeUser((user, done) => {
  done(null, user.id); //this is the MongoDB document id
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
      done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('access token: ', accessToken);
      console.log('refresh token: ', refreshToken);
      //console.log('profile: ', profile);
      console.log('profile.id: ', profile.id);
      console.log('profile.displayName: ', profile.displayName);
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        if (existingUser) {
          // found the user already in the user collection
          existingUser.loginCount = existingUser.loginCount ? existingUser.loginCount+1 : 1;
          existingUser.lastLogin = new Date();
          existingUser
            .save()
            .then(user => done(null, user));
        } else {
          // this is a new user so need to add to the user collection
          new User({
            googleID: profile.id,
            displayName: profile.displayName,
            loginCount: 1,
            lastLogin: new Date()
          })
          .save()
          .then(user => done(null, user));
        }
      });
    }
  )
);