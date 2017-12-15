'use strict';

require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const planetMock = require('./lib/planet-mock');
const hoststarMock = require('./lib/hoststar-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/planets`;

describe('/api/planets', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(planetMock.remove);

  describe('POST /api/planets', () => {
    test('This POST should respond with a planet and 200 status if no error', () => {
      let tempHoststarMock = null;
      return hoststarMock.create()
        .then(mock => {
          tempHoststarMock = mock;

          let planetToPost = {
            name: `KP-${faker.random.number(10)}-${
              faker.random.alphaNumeric(10)}`,
            content: 'CONTENT_FILLER',
            hoststar: mock._id,
          };
          return superagent.post(apiURL)
            .send(planetToPost)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
              
              expect(response.body.name).toEqual(planetToPost.name);
              expect(response.body.content).toEqual(planetToPost.content);
              expect(response.body.hoststar).toEqual(tempHoststarMock._id.toString());
            });
        });
    });

    test('This POST should respond with a 404 if the hoststar id is not input', () => {
      return superagent.post(apiURL)
        .send({
          name: `KP-${faker.random.number(10)}-${
            faker.random.alphaNumeric(10)}`,
          content: 'CONTENT_FILLER',
          hoststar: 'FALSE_ID',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('This POST should respond with a 400 code if we send an incomplete planet', () => {
      let planetToPost = {
        content: 'CONTENT_FILLER',
      };
      return superagent.post(`${apiURL}`)
        .send(planetToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/planets/:id', () => {
    test('This GET should respond with 200 status code if there is no error', () => {
      let tempMock = null;

      return planetMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/${mock.planet._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(tempMock.planet._id.toString());
          expect(response.body.hoststar).toBeTruthy();
          expect(response.body.name).toEqual(tempMock.planet.name);
          expect(response.body.content).toEqual(tempMock.planet.content);
          
          expect(response.body.hoststar._id).toEqual(tempMock.hoststar._id.toString());
          expect(response.body.hoststar.name).toEqual(tempMock.hoststar.name);
        });
    });

    test('This GET should respond with 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/FALSE_ID`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/planets', () => {
    test('This PUT should update planet and respond with 200 if there are no errors', () => {

      let planetToUpdate = null;

      return planetMock.create()
        .then(mock => {
          planetToUpdate = mock.planet;
          return superagent.put(`${apiURL}/${mock.planet._id}`)
            .send({ name: 'KP-123asd' });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('KP-123asd');
          expect(response.body.content).toEqual(planetToUpdate.content);
        });
    });
    
    test('This PUT should respond with 404 if the id is incorrect', () => {

      return planetMock.create()
        .then(() => {
          return superagent.put(`${apiURL}/FALSE_ID`)
            .send({ name: 'KP-123asd' });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/planets/:id', () => {
    test('This DELETE should respond with a 204 if there are no errors', () => {
      return planetMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/${mock.planet._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('This DELETE should respond with a 404 if the id is invalid', () => {
      return superagent.delete(`${apiURL}/FALSE_ID`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});