const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const Feedback = require('../models/feedback');

// Save data in the database
router.post('/', verifyToken, function(req, res, next) {
  // Verify token
  const cert = fs.readFileSync('private.key');
  jwt.verify(req.token, cert, function(err, authData) {
    // If verification didn't go correct
    if (err) {
      // Send 403 - Forbidden status
      res.send({error: err.message}, 403);
    } else {
      // Create document based on Feedback model and save it in database
      Feedback.create(req.body).then(function(feedback) {
        // Send status 201 - OK
        res.sendStatus('201');
      }).catch(next);
    }
  })
});

// Format of verifyToken
// Authorization: Bearer <access_token>

// Verify token
function verifyToken(req, res, next) {
  //Get auth header value
  const bearerHeader = req.headers['authorization'];
  //Check if bearer is not undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    //Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;

    next();
  } else {
    // When bearer token is not set
    // Send 403 - Forbidden status
    res.sendStatus(403);
  }
}

module.exports = router;
