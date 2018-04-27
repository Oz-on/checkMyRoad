const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Create Location Schema
/*
It takes
type of a location(string)
array of coordinates (Array of numbers)
*/
const LocationSchema = new Schema({
  type: {
    type: String,
    required: false,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    required: [true, 'latitude and longitude is required']
  }
});

//Create Event Schema
/*
It takes
type of an event (String)
date of commiting the event (Date)
time of creation (required for expiration)
location of the event
*/
const EventSchema = new Schema({
  type: {
    type: String,
    required: [true, 'type of an event is required']
  },
  dateEvent: {
    type: Number,
    default: Date.now()
  },
  geometry: LocationSchema,
  createdAt: {
    type: Date,
    default: new Date(),
    expires: 3600
  }
});

//Add new index required for geometry calculation
EventSchema.index({geometry: "2dsphere"});


//Create a model
const Event = mongoose.model('event',EventSchema);

//Export a model
module.exports = Event;
