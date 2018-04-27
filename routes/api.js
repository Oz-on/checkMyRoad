const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs');

const private = require('../private.js');
const Event = require('../models/event');

const cert = fs.readFileSync('private.key');

// Get all the events from database
router.get('/', function(req, res, next){
  Event.find({}).then(function(events) {
    // Transform response that will be good prepared for Android app
    res.send(transformResponse(events));
  }).catch(next);
});

// Save event in the database
router.post('/', verifyToken, function(req, res, next) {
  jwt.verify(req.token, cert, function(err, authData) {
    // If verification didn't go correct
    if (err) {
      // Send 403 - Forbidden status
      res.send({error: err.message}, 403);
    } else {
      //add dateEvent when user add event to the database
      req.body.dateEvent = Date.now();
      req.body.createdAt = Date.now();
      //Cumulate events with the same type and closly placed
      cumulateEvents(req.body);

      // Create Event based on model using body from request
      Event.create(req.body).then(function(event) {
        res.send(transformResponse(event));
      }).catch(next);
    }
  });
});

// Format of verifyToken
// Authorization: Bearer <access_token>

// Check that token was included in a header
// and pass token to the next middleware
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is not undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    next();
  } else {
    // When bearer token is not set
    // Send 403 - Forbidden status
    res.sendStatus(403);
  }
}

// Function that takes response and tranform it into specyfic Format
// Which is easy accesible from Android app
function transformResponse(events) {
  let eventsStore = {
    EventObj: []
  };
  if (Array.isArray(events)) {
    events.forEach(function(event) {
      eventsStore.EventObj.push(event);
    });
  } else {
    eventsStore.EventObj.push(events);
  }
  return eventsStore;
}

// Function that takes event from user and check wheather similar event already exists
// In close area
function cumulateEvents(newEvent, next) {
  // Array that contain coordinates
  const coordsArray = [newEvent.geometry.coordinates[0], newEvent.geometry.coordinates[1]];
  // Find all events with the same type like the given one
  // that are in range of 50 meters close
  Event.find({type:newEvent.type}).find({
    geometry:
      { $near:
          {
            $geometry: {
              type: "Point",
              coordinates: coordsArray
            },
            $maxDistance: 20
          }
      }
  }).then(function(closeEvents) {
    // If there are closly placed events
    // with the same type
    if (closeEvents.length > 0) {
      // Reduce them because, they are probably the same event
      // Sent by many users
      reduceEvents(closeEvents, next);
    }

  }).catch(next);
}

//Function that removes events from db given in the array
function reduceEvents(events, next) {
  for (let event in events) {
    Event.findByIdAndRemove({_id: events[event]._id}).catch(next);
  }
}

module.exports = router;
