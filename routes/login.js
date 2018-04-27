const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/user');

const router = express.Router();

//Handle POST request
router.post('/', function(req, res, next) {

  User.findOne({email: req.body.email}).then(function(user) {
    //if user with given email exists
    if (user) {
      //if password match
      if (user.password === req.body.password) {
        //Generate token
        const cert = fs.readFileSync('private.key');
        jwt.sign({
          email: req.body.email,
          passwd: req.body.password
        },
        cert,
        function(err, token) {
          //If error, send message
          if (err) {
            res.send({error: err.message}, 500);
          }
          else {
            //If everything is ok, send response with token
            const answer = "OK: " + token;
            res.send(answer, 200);
          }
        });

      } else {
        res.send("Invalid password", 200);
      }
    } else {
      res.send("Email is not correct", 200);
    }
  })
})

module.exports = router;
