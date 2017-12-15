'use strict';

const faker = require('faker');
const mongoose = require('mongoose');

const hoststarSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  numberOfPlanets: {
    type: Number,
    default: faker.random.number({ min: 0, max: 10 }),
  },
  hdName: {
    type: String,
    minlength: 3,
    default: `HD-${faker.random.number({ min: 0, max: 10000 })}`,
  },
  mass: {
    type: Number,
    default: faker.random.number({ min: 0, max: 1000000000 }),
  },
  radius: {
    type: Number,
    default: faker.random.number({ min: 0, max: 1000 }),
  },
  luminosity: {
    type: Number,
    default: faker.random.number({ min: -10, max: 10 }),
  },
  planetNames: [{
    type: mongoose.Schema.Types.ObjectId, //needs to be an array to that planet id's can be pushed into here from planets.js model
    required: true,
    ref: 'planet'}],
},{
  usePushEach: true,
});

module.exports = mongoose.model('hoststar', hoststarSchema);