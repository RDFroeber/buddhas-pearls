/**
 * Passport Configuration
 **/

var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = require('../models/User'),
    configAuth = require('./auth');

module.exports = function(passport) {

  /**
   * Serialization
   **/

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Local Authentication
   **/

  passport.use('localSignup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    if(email) {
      var email = email.toLowerCase();
    }

    if (!req.user) {
      User.findOne({'local.email':  email}, function(err, user) {
        if(err) {
          return done(err);
        } else if(req.body.password !== req.body.confirmation) {
          return done(null, false, {message: 'Your passwords do not match.'});
        } else if(user) {
          return done(null, false, {message: 'This email address is already registered.'});
        } else {

          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if(err) {
              return done(err);
            } else {
              return done(null, newUser);
            }
          });
        }
      });
    // If the user is logged in but has no local account...
    } else if(!req.user.local.email) {
      // Check if the email used to connect a local account is being used by another user
      User.findOne({'local.email' :  email}, function (err, user) {
        if(err) {
          return done(err);
        }
        
        if(user) {
          return done(null, false, {message: 'That email is already taken.'});
        } else {

          var user = req.user;
          user.local.email = email;
          user.local.password = user.generateHash(password);

          user.save(function (err) {
            if (err) {
              return done(err);
            } else {
              return done(null,user);
            }
          });
        }
      });

    } else {
      // Already logged in
      return done(null, req.user);
    }
  }));

  passport.use('localLogin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    if(email) {
      var email = email.toLowerCase();
    }

    process.nextTick(function() {
      User.findOne({'local.email' :  email}, function(err, user) {
        if (err) {
          return done(err);
        } else if (user && !user.validPassword(password)) {
          return done(null, false, {message: 'Oops! Wrong password.'});
        } else if (!user) {
          User.findOne({'google.email':  email}, function(err, user){
            if(user){
              return done(null, false, {message: 'This email address is associated with a Google+ login.'});
            } else {
              User.findOne({'facebook.email' :  email}, function(err, user){
                if(user){
                  return done(null, false, {message: 'This email address is associated with a Facebook login.'});
                } else {
                  User.findOne({'twitter.email':  email}, function(err, user){
                    if(user){
                      return done(null, false, {message: 'This email address is associated with a Twitter login.'});
                    } else {
                      return done(null, false, {message: 'There is no account associated that email address.'});
                    }
                  });
                }
              });
            }
          });
        } else {
          return done(null, user);
        }
      });
    });
  }));


  /**
   * Google Authentication
   **/

  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done) {
      process.nextTick(function() {
        if(!req.user) {
          User.findOne({'google.id' : profile.id}, function(err, user) {
            if(err) {
              return done(err);
            } else if(user){
              // If user id but no token (user was linked at one point and then removed)
              if(!user.google.token) {
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                  if(err) {
                    return done(err);
                  } else {
                    return done(null, user);
                  }                      
                });
              } else {
                return done(null, user);
              }
            } else {
              // User deos not exist... create an account
              var newUser  = new User();
              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.google.name  = profile.displayName;
              newUser.google.email = (profile.emails[0].value || '').toLowerCase();

              newUser.save(function(err) {
                if(err) {
                  return done(err);
                } else {
                  return done(null, newUser);
                } 
              });
            }
          });
        } else {
          // User exists and is logged in... link accounts
          var user  = req.user;
          user.google.id = profile.id;
          user.google.token = token;
          user.google.name  = profile.displayName;
          user.google.email = (profile.emails[0].value || '').toLowerCase();

          user.save(function (err) {
            if(err) {
              return done(err);
            } else {
              return done(null, user);
            } 
          });
        }
      });
  }));

  /**
   * Facebook Authentication
   **/

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    passReqToCallback: true 
  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if(!req.user) {
        User.findOne({'facebook.id' : profile.id}, function (err, user) {
          if(err) {
            return done(err);
          } else if(user) {
            // If user id but no token (user was linked at one point and then removed)
            if(!user.facebook.token) {
              user.facebook.token = token;
              user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              user.facebook.email = (profile.emails[0].value || '').toLowerCase();

              user.save(function(err) {
                if(err) {
                  return done(err);
                } else {
                  return done(null, user);
                }
              });
            } else {
              return done(null, user);
            }
          } else {
            // User deos not exist... create an account
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

            newUser.save(function(err) {
              if(err) {
                return done(err);
              } else {
                return done(null, newUser);
              }
            });
          }
        });
      } else {
        // User exists and is logged in... link accounts
        var user = req.user;
        user.facebook.id = profile.id;
        user.facebook.token = token;
        user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = (profile.emails[0].value || '').toLowerCase();

        user.save(function(err) {
          if(err) {
            return done(err);
          } else {
            return done(null, user);
          }
        });
      }
    });
  }));

  /**
   * Twitter Authentication
   **/

  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    passReqToCallback: true
  }, function (req, token, tokenSecret, profile, done) {
    process.nextTick(function() {
      if(!req.user) {
        User.findOne({'twitter.id' : profile.id}, function(err, user) {
          if(err) {
            return done(err);
          } else if(user) {
            // If user id but no token (user was linked at one point and then removed)
            if(!user.twitter.token) {
              user.twitter.token = token;
              user.twitter.username = profile.username;
              user.twitter.displayName = profile.displayName;

              user.save(function(err) {
                if(err) {
                  return done(err);
                } else {
                  return done(null, user);
                }
              });
            } else {
              return done(null, user);
            }
          } else {
            // User deos not exist... create an account
            var newUser = new User();
            newUser.twitter.id = profile.id;
            newUser.twitter.token = token;
            newUser.twitter.username = profile.username;
            newUser.twitter.displayName = profile.displayName;

            newUser.save(function(err) {
              if(err) {
                return done(err);
              } else {
                return done(null, newUser);
              }
            });
          }
        });
      } else {
        // User exists and is logged in... link accounts
        var user = req.user;
        user.twitter.id = profile.id;
        user.twitter.token = token;
        user.twitter.username = profile.username;
        user.twitter.displayName = profile.displayName;

        user.save(function(err) {
          if(err) {
            return done(err);
          } else {
            return done(null, user);
          }
        });
      }
    });
  }));

};
