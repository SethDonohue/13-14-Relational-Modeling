'use strict';

const faker = require('faker');
const hoststarMock = require('./hoststar-mock');
const Planet = require('../../model/planet');

const planetMock = module.exports = {};

planetMock.create = () => {
  let mock = {};

  return hoststarMock.create()
    .then(hoststar => {
      mock.hoststar = hoststar;

      return new Planet({
        name: `KP-${faker.random.alphaNumeric(7)}`,
        content: faker.lorem.words(10),
        hoststar: hoststar._id,
      }).save();
    })
    .then(planet => {
      mock.planet = planet;
      return mock;
    });
};

planetMock.createMany = (howMany) => {
  let mock = {};

  return hoststarMock.create()
    .then(hoststar => {
      mock.hoststar = hoststar;
      return Promise.all(new Array(howMany)
        .fill(0)
        .map(() => {
          return new Planet({
            name: `KP-${faker.random.alphaNumeric(7)}`,
            content: faker.lorem.words(10),
            hoststar: hoststar._id,
          }).save();
        }));
    })
    .then(planets => {
      mock.planets = planets;
      return mock;
    });
};

planetMock.remove = () => Promise.all([
  Planet.remove({}),
  hoststarMock.remove(),
]);