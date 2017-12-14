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
    name: {
      type: String,
      default: `K-${faker.random.number({ min: 0, max: 10000 })}`,
      required: true,
      unique: true,
    },
    numberOfPlanets: {
      type: Number,
      required: true,
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
        content: 'words',
      };
      return superagent.post(`${apiURL}`)
        .send(hoststarToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();

          expect(response.body.name).toEqual(hoststarToPost.name);
        });
    });
    test('POST should respond with a 400 code if we send an incomplete hoststar', () => {
      let hoststarToPost = {
        name: 'words',
      };
      return superagent.post(`${apiURL}`)
        .send(hoststarToPost)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.status);
          expect(response.status).toEqual(400);
        });
    });

    //TODO: ADD A POST TEST FOR 409(IF ANY KEYS ARE UNIQUE)
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

          expect(response.body._id).toEqual(hoststarToTest._id.toString());

          expect(response.body.name).toEqual(hoststarToTest.name);
          expect(response.body.content).toEqual(hoststarToTest.content);          
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

  //TODO: ADD A PUT TEST FOR 200
  //TODO: ADD A PUT TEST FOR 400
  //TODO: ADD A PUT TEST FOR 404
  //TODO: ADD A PUT TEST FOR 409(IF ANY KEYS ARE UNIQUE)


  describe('DELETE /api/hoststars/:id', () => {
    test('should respond with a 204 status code if there is no error', () => {
      return hoststarMockupCreator()
        .then(hoststar => {
          return superagent.delete(`${apiURL}/${hoststar._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with a 404 status code if the id is incorrect', () => {
      
      return superagent.delete(`${apiURL}/fake`)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.status);
          expect(response.status).toEqual(404);
        });
    });
  });
});