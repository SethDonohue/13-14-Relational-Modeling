'use strict';

const faker = require('faker');
const mongoose = require('mongoose');
const planetSchema = require('./planet');

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
  // planetNames: {
  //   type: planetSchema.types.objectid,
  //   required: true,
  //   unique: true,
  // },
});

module.exports = mongoose.model('hoststar', hoststarSchema);