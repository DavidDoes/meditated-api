'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MomentSchema = mongoose.Schema({
  minutes: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  mental: { type: String, required: true },
  environmental: { type: String, required: true },
  userId: { type: String, required: true }
});

// research date and time

MomentSchema.methods.serialize = function() {
  return {
    id: this._id,
    minutes: this.minutes,
    date: this.date,
    time: this.time,
    location: this.location,
    mental: this.mental,
    environmental: this.environmental,
    userId: this.userId
  };
};

const Moment = mongoose.model('Moment', MomentSchema);

module.exports = { Moment };
