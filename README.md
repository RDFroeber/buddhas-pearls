# Buddhas & Pearls

[![Dependency Status](https://david-dm.org/RDFroeber/buddhas-pearls.svg)](https://david-dm.org/RDFroeber/buddhas-pearls)
[![Build Status](https://travis-ci.org/RDFroeber/buddhas-pearls.svg?branch=master)](https://travis-ci.org/RDFroeber/buddhas-pearls)

Buddhas & Pearls is a jewelry boutique dedicated to crafting original and unique pieces.

## Features

* Passport authentication with third-party OAuth providers (Google+, Facebook, and Twitter)
* Built in admin portal for inventory management
* Simple product configuration UI including image uploads and a price management tool

## Coming Soon

* Stripe integration
* Angular implementation

## Installation

```
$  git clone https://github.com/RDFroeber/buddhas-pearls.git
$  cd buddhas-pearls/
$  npm install
$  npm install nodemon -g
$  mv config/authSample.js config/auth.js
$  npm start
```

## OAuth Authentication

In order to login via OAuth client IDs and keys are required. If you would like to login using OAuth, use the following steps:

* Rename `authSample.js` to `auth.js`
* You can now login using the Facebook API
* If you would like to login via Google+ or Twitter those credentials must be added

## Item Images

Item images are store in S3. If you would like to upload any images, use the following steps:

* Rename `authSample.js` to `auth.js`
* Update the accessKeyId and secretAccessKey
* Create an S3 bucket under your AWS account
* Replace the imagePath variable found in `routes/items` with your bucket URL
* You should now be able to upload images

## Tests

There are currently a few tests for the User and Order models. More tests will be added soon. To run the test suite, use the following command:

```
$  npm test
```

## Dependencies

This application relies on the following npm packages:

- [adaro](https://github.com/krakenjs/adaro): An express renderer for DustJs Templates
- [async](https://github.com/caolan/async): Higher-order functions and common patterns for asynchronous code
- [aws-sdk](https://github.com/aws/aws-sdk-js): AWS SDK for JavaScript
- [bcrypt](https://github.com/ncb000gt/node.bcrypt.js): A bcrypt library for NodeJS.
- [body-parser](https://github.com/expressjs/body-parser): Node.js body parsing middleware
- [connect-flash](https://github.com/jaredhanson/connect-flash): Flash message middleware for Connect.
- [cookie-parser](https://github.com/expressjs/cookie-parser): cookie parsing with signatures
- [debug](https://github.com/visionmedia/debug): small debugging utility
- [dustjs-helpers](https://github.com/linkedin/dustjs-helpers): Helpers for dustjs-linkedin package
- [dustjs-linkedin](https://github.com/linkedin/dustjs): Asynchronous templates for the browser and node.js ( LinkedIn fork )
- [express](https://github.com/strongloop/express): Fast, unopinionated, minimalist web framework
- [express-session](https://github.com/expressjs/session): Simple session middleware for Express
- [lusca](https://github.com/krakenjs/lusca): Application security for express.
- [mailgun-js](https://github.com/1lobby/mailgun-js): Simple Node.js helper module for Mailgun API
- [method-override](https://github.com/expressjs/method-override): Override HTTP verbs
- [moment](https://github.com/moment/moment): Parse, manipulate, and display dates.
- [mongoose](https://github.com/LearnBoost/mongoose): Mongoose MongoDB ODM
- [morgan](https://github.com/expressjs/morgan): http request logger middleware for node.js
- [multer](https://github.com/expressjs/multer): Middleware for handling `multipart/form-data`.
- [nodemon](https://github.com/remy/nodemon): Simple monitor script for use during development of a node.js app.
- [passport](https://github.com/jaredhanson/passport): Simple, unobtrusive authentication for Node.js.
- [passport-facebook](https://github.com/jaredhanson/passport-facebook): Facebook authentication strategy for Passport.
- [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth): Google (OAuth) authentication strategies for Passport.
- [passport-local](https://github.com/jaredhanson/passport-local): Local username and password authentication strategy for Passport.
- [passport-twitter](https://github.com/jaredhanson/passport-twitter): Twitter authentication strategy for Passport.
- [serve-favicon](https://github.com/expressjs/serve-favicon): favicon serving middleware with caching
- [underscore](https://github.com/jashkenas/underscore): JavaScript&#39;s functional programming helper library.
