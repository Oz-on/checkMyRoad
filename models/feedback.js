const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create FeedbackSchema
/*
It takes:
opinion about app (String)
rating of app (Number)
*/
const FeedbackSchema = new Schema({
  opinion: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: false
  }
})


//Create model feedback for storing feedback from users
const Feedback = mongoose.model('feedback', FeedbackSchema)

module.exports = Feedback
