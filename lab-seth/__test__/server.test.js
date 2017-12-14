'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Hoststar = require('../model/hoststar');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/hoststars`;

const hoststarMockupCreator = () => {
  return new Hoststar({
    name: `K-123456`,
    numberOfPlanets: faker.random.number({ min: 0, max: 10 }),
    hdName: `HD-${faker.random.number({ min: 0, max: 10000 })}`,
    mass: faker.random.number({ min: 0, max: 1000000000 }),
    radius: faker.random.number({ min: 0, max: 1000 }),
    luminosity: faker.random.number({ min: -10, max: 10 }),
  }).save();
};

const hoststarMockupCreatorTwo = () => {
  return new Hoststar({
    name: `K-123455`,
    numberOfPlanets: faker.random.number({ min: 0, max: 10 }),
    hdName: `HD-${faker.random.number({ min: 0, max: 10000 })}`,
    mass: faker.random.number({ min: 0, max: 1000000000 }),
    radius: faker.random.number({ min: 0, max: 1000 }),
    luminosity: faker.random.number({ min: -10, max: 10 }),
  }).save();
};

describe('api/hoststars', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Hoststar.remove({}));

  describe('POST /api/hoststars', () => {
    test('should respond with a hoststar and a 200 status code if there is no error', () => {
      let hoststarToPost = {
        name: `K-123456`,
        numberOfPlanets: 5, //took out faker here as it was causing some tests to pass and some to fail depending on how long it took to generate a random number
        hdName: `HD-${faker.random.number({ min: 0, max: 10000 })}`,
        mass: faker.random.number({ min: 0, max: 1000000000 }),
        radius: faker.random.number({ min: 0, max: 1000 }),
        luminosity: faker.random.number({ min: -10, max: 10 }),
      };
      return superagent.post(`${apiURL}`)
        .send(hoststarToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(hoststarToPost.name);
          expect(response.body.numberOfPlanets).toEqual(hoststarToPost.numberOfPlanets);
        });
    });
    test('POST should respond with a 400 code if we send an incomplete hoststar', () => {
      let hoststarToPost = {
        name: '1234',
      };
      return superagent.post(`${apiURL}`)
        .send(hoststarToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    //TODO: ADD A POST TEST FOR 409(IF ANY KEYS ARE UNIQUE)
    // test('should respond with a hoststar and a 409 status code if any keys are duplicated', () => {
    //   let hoststarToPost = {
    //     name: `K-123486`,
    //     numberOfPlanets: 2, //took out faker here as it was causing some tests to pass and some to fail depending on how long it took to generate a random number
    //     hdName: `HD-${faker.random.number({ min: 0, max: 10000 })}`,
    //     mass: faker.random.number({ min: 0, max: 1000000000 }),
    //     radius: faker.random.number({ min: 0, max: 1000 }),
    //     luminosity: faker.random.number({ min: -10, max: 10 }),
    //   };
    //   return hoststarMockupCreator()
    //     .then(hoststar => {
    //       hoststarToPost = hoststar;
    //       return superagent.post(`${apiURL}`);
    //     })
    //     .send(hoststarToPost)
    //     .then(response => {
    //       expect(response.status).toEqual(200);
    //       expect(response.body._id).toBeTruthy();
    //     });
        // .then(hoststar => {
        //   hoststarToPost = hoststar;
        //   return superagent.post(`${apiURL}`);
        // })
        // .send(hoststarToPost)
        // .then(response => {
        //   expect(response.status).toEqual(409);
        // });
    // });   
  });

  describe('GET /api/hoststars', () => {
    test('should respond with a 200 status code if there is no error', () => {
      let hoststarToTest = null;

      return hoststarMockupCreator()
        .then(hoststar => {
          hoststarToTest = hoststar;
          return superagent.get(`${apiURL}/${hoststar._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(hoststarToTest._id.toString()); //MonogoDB needs items to be in strings
          expect(response.body.name).toEqual(hoststarToTest.name);
        });
    });
    test('GET should respond with a 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/fake`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/hoststars', () => {
    test('should respond with a 200 status code if there is no error', () => {
      let hoststarToTest = null;
      let hoststarToPut = {
        name: `K-123000`,
        numberOfPlanets: 3, //took out faker here as it was causing some tests to pass and some to fail depending on how long it took to generate a random number
        hdName: `HD-${faker.random.number({ min: 0, max: 10000 })}`,
        mass: faker.random.number({ min: 0, max: 1000000000 }),
        radius: faker.random.number({ min: 0, max: 1000 }),
        luminosity: faker.random.number({ min: -10, max: 10 }),
      };

      return hoststarMockupCreatorTwo()
        .then(hoststar => {
          hoststarToTest = hoststar;
          return superagent.put(`${apiURL}/${hoststar._id}`).send(hoststarToPut);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(hoststarToTest._id.toString()); //MonogoDB needs items to be in strings          
          expect(response.body.name).toEqual(hoststarToPut.name);
          expect(response.body.numberOfPlanets).toEqual(hoststarToPut.numberOfPlanets);
        });
    });

  //TODO: ADD A PUT TEST FOR 400


  //TODO: ADD A PUT TEST FOR 404


  //TODO: ADD A PUT TEST FOR 409(IF ANY KEYS ARE UNIQUE)


  });

  describe('DELETE /api/hoststars/:id', () => {
    test('should respond with a 204 status code if there is no error', () => {
      return hoststarMockupCreator()
        .then(hoststar => {
          return superagent.delete(`${apiURL}/${hoststar._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with a 404 status code if the id is incorrect', () => {
      
      return superagent.delete(`${apiURL}/fake`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});