/**
 * Mail Router
 **/

var express = require('express'),
    mailRouter = express.Router(),
    Mailgun = require('mailgun-js'),
    apiCredentials = require('../config/auth').mailgunAPI,
    mailgun = new Mailgun(apiCredentials),
    fromEmail = 'Divorante LLC <Divorante@gmail.com>';

/**
 * Send Email Message
 **/

mailRouter.route('/submit/:toEmail')
  .get(function(req, res, next) {
    var data = {
      from: fromEmail,
      to: req.params.toEmail, 
      subject: 'Hello from Mailgun',
      html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' + req.params.toEmail + '">Click here to add your email address to a mailing list</a>'
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
      if(err) {
        console.log("got an error: ", err);
        return res.render('errors/' + err.status, { error : err});
      } else {
        console.log(body);
        //Here "submitted.jade" is the view file for this landing page 
        //We pass the variable "email" from the url parameter in an object rendered by Jade
        return res.render('submitted', {email : req.params.toEmail, title: 'Email Sent'});
      }
    });
  });

/**
 * Add Email to Mailing List
 **/

mailRouter.route('/validate/:toEmail')
  .get(function(req, res, next) {
    var members = [{
      address: req.params.toEmail
    }];
    // For the sake of this tutorial you need to create a mailing list on Mailgun.com/cp/lists and put its address below
    mailgun.lists('NAME@MAILINGLIST.COM').members().add({ members: members, subscribed: true }, function (err, body) {
      if(err) {
        console.log(err);
        return res.send("Error - check console");
      }
      else {
        console.log(body);
        return res.send("Added to mailing list");
      }
    });
  });

/**
 * Send an Invoice Attachment
 **/

mailRouter.route('/invoice/:toEmail')
  .get(function(req, res, next) {
    //Which file to send? I made an empty invoice.txt file in the root directory
    //We required the path module here..to find the full path to attach the file!
    var path = require("path");
    var fp = path.join(__dirname, '../invoice.txt');
    //Settings

    var data = {
      from: fromEmail,
      to: req.params.toEmail,
      subject: 'An invoice from your friendly hackers',
      text: 'A fake invoice should be attached, it is just an empty text file after all',
      attachment: fp
    };

    //Sending the email with attachment
    mailgun.messages().send(data, function (err, body) {
      if(err) {
        console.log(err);
        return res.render('errors/' + err.status, {title: 'Whoops!', error: error});
      } else {
        return res.send("Attachment is on its way");
        console.log("attachment sent", fp);
      }
    });
  });
 
module.exports = mailRouter;
