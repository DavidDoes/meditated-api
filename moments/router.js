const express = require('express');
const router = express.Router();

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
  console.log(req.user);
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
  const requiredFields = ['minutes', 'time', 'location', 'date'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    //figure out to do item later
    const message = `Request path id (${req.params.id}) and request body id ``(${
      req.body.id
    }) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating Moment with id \`${req.params.id}\``);

  const updatedItem = {
    id: req.params.id,
    Moment: req.body.Moment,
    company: req.body.company,
    stage: req.body.stage,
    status: req.body.status,
    date: req.body.date,
    comp: req.body.comp,
    pros: req.body.pros,
    cons: req.body.cons,
    notes: req.body.notes,
    userId: req.user.id
  };

  Moment.findByIdAndUpdate(req.body.id, updatedItem, { new: true })
    .then(updatedItem => {
      console.log(updatedItem);
      res.status(201).json(updatedItem.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'ughhhhhhhh no no' });
    });
});

// === DELETE Moment ===
router.delete('/:id', jwtAuth, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    const err = new Error('You do not have permission to delete this item.');
    err.status = 400;
    return next(err);
  }

  Moment.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success, my friend!' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'ughhhhhhhh no no' });
    });
});

module.exports = { router };
