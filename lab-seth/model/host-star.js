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
});

module.exports = mongoose.model('hoststar', hoststarSchema);