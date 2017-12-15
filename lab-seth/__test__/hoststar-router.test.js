'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const hoststarMock = require('./lib/hoststar-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/hoststars`;

describe('/api/hoststars', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(hoststarMock.remove);

  describe('POST /hoststars', () => {
    test('should return a 200 and a hoststar if there are no errors', () => {
      return superagent.post(apiURL)
        .send({
          name: 'K-1234',
          numberOfPlanets: 3,
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.numberOfPlanets).toEqual(3);
        });
    });

    test('should return a 409 due to a duplicate name', () => {
      return hoststarMock.create()
        .then(hoststar => {
          return superagent.post(apiURL)
            .send({
              name: hoststar.name,
              numberOfPlanets: 4,
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe('GET /hoststars/:id', () => {
    test('Should respond with a 200 status and a hoststar if there are no error', () => {
      let tempHoststarMock;

      return hoststarMock.create()
        .then(hoststar => {
          tempHoststarMock = hoststar;
          return superagent.get(`${apiURL}/${hoststar.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(JSON.stringify(response.body.numberOfPlanets))
            .toEqual(JSON.stringify(tempHoststarMock.numberOfPlanets));
        });
    });
  });
});