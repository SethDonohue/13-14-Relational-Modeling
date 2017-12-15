'use strict';

const faker = require('faker');
const Hoststar = require('../../model/hoststar');

const hoststarMock = module.exports = {};

hoststarMock.create = () => {
  return new Hoststar({
    name: `K-${faker.random.alphaNumeric(10)}`,
    numberOfPlanets: faker.random.number(1),
  }).save();
};

hoststarMock.createMany = (howMany) => {
  return Promise.all(new Array(howMany).fill(0)
    .map(() => hoststarMock.create()));
};

hoststarMock.remove = () => Hoststar.remove({});