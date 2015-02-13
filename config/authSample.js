/**
 * Sample OAuth Credentials
 **/
'use strict';

module.exports = {

  facebookAuth : {
    'clientID'       : '0000000000000000000000',
    'clientSecret'   : '000000000000000000000000000000',
    'callbackURL'    : 'http://localhost:3000/auth/facebook/callback'
  },
  twitterAuth : {
    'consumerKey'    : '0000000000000000000000',
    'consumerSecret' : '00000000000000000000000000000000000000000000',
    'callbackURL'    : 'http://localhost:8080/auth/twitter/callback'
  },
  googleAuth : {
    'clientID'       : '00000000000000000000000000000000000000000000.apps.googleusercontent.com',
    'clientSecret'   : '0000000000000000000000',
    'callbackURL'    : 'http://localhost:3000/auth/google/callback'
  },
  mailgunAPI : {
    'apiKey'         : 'key-0000000000000000000000', 
    'domain'         : 'sandbox0000000000000000000000.mailgun.org'
  },
  AWS : {
    'accessKeyId'    : 'AAAAAAAAAAAAAAAAAAA', 
    'secretAccessKey': 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  }
  
};