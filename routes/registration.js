const express = require('express');
const User = require('../models/user');

const router = express.Router();

//Handle Registration
router.post('/', function(req, res, next) {

  //Check that user with that email already exist
  User.findOne({email: req.body.email})
  .then(function(user) {
    //if user with taht email already exists
    if (user) {
      res.send("Email already taken", 200);
    }
    else {
      //Create user with specific email and password
      User.create(req.body).then(function(user) {
        res.send('OK', 201);
      }).catch(next);
    }
  })
});

module.exports = router;
