const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Create User Schema
/*
It takes
user's login (String)
user's email (String)
user's password (String)
*/
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email field is required']
  },
  "password": {
    type: String,
    required: [true, 'password field is required']
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
