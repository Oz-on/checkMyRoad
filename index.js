const express = require('express');
const mongoose = require('mongoose');
const private = require('./private.js');

const production_connection = `mongodb://${private.userName}:${private.passwd}@ds137550.mlab.com:37550/todo`;
const dev_connection = `mongodb://localhost/roadevents`;
//set up express app
const app = express();
//connect to mongodb
mongoose.connect(production_connection).then(() => {
  mongoose.Promise = global.Promise;

  //parse incoming request with JSON payloads
  app.use(express.json({type: "application/json"}));

  //initialize route for registration
  app.use('/registration', require('./routes/registration'));

  //initialize route for login
  app.use('/login', require('./routes/login'));

  //initialize routes for api
  app.use('/api', require('./routes/api'));

  //initialize route for feedback
  app.use('/feedback', require('./routes/feedback'));

  //error handling middleware
  app.use(function(err, req, res, next) {
    res.status(422).send({error: err.message});
  });

}).catch((err)=> {
  throw err;
});


app.listen(process.env.PORT || 4000, function(){
  console.log('Listening on port 4000');
});
