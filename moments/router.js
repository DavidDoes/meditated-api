const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Moment } = require('./models');

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

// === GET all user's moments
router.get('/', jwtAuth, (req, res) => {
  Moment.find({ userId: req.user.id })
    .then(moments => {
      res.status(201).json(moments.map(moment => moment.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    });
});

// === POST new Moment ===
router.post('/', jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ['minutes', 'time', 'location', 'date', 'mental', 'environmental'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Moment.create({
    minutes: req.body.minutes,
    time: req.body.time,
    location: req.body.location,
    date: req.body.date,
    mental: req.body.mental,
    environmental: req.body.environmental,
    userId: req.user.id
  }).then(Moment => {
    return res.status(201).json(Moment.serialize());
  });
});

// === PUT modify Moment ===
router.put('/:id', jwtAuth, jsonParser, (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    console.log(req.body.length);
    const field = req.body.length[i];
    if (field in req.body) {
      updatedItem.push(field);
    }
  }

  // client-side, populate edit form with values
  // already there, so as to not overwrite unedited
  // values with `null`

  const { id } = req.params;

  if (!req.user.id === req.body.userId) {
    const err = new Error('You do not have permission to modify this Challenge.');
    error.status = 400;
    return next(err);
  }

  const updatedItem = {
    id: req.params.id,
    minutes: req.body.minutes,
    time: req.body.time,
    location: req.body.location,
    date: req.body.date,
    mental: req.body.mental,
    environmental: req.body.environmental,
    userId: req.user.id
  };

  Moment.findByIdAndUpdate(req.params.id, updatedItem, { new: true })
    .then(updatedItem => {
      res.status(201).json(updatedItem.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    });
});

// === DELETE Moment ===
router.delete('/:id', (req, res, next) => {
  Moment.findByIdAndDelete(req.params.id).then(() => {
    return res.status(200).json({
      message: 'Moment deleted successfully'
    });
  });
});

module.exports = { router };
