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

  describe('POST /api/hoststars', () => {
    test('This POST should return a 200 and a hoststar if there are no errors', () => {
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

    test('This POST should return a 409 due to a duplicate name', () => {
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

  //TODO: ADD 400 TEST
  //TODO: ADD 404 TEST

  });

  describe('GET /api/hoststars/:id', () => {
    test('This GET should respond with a 200 status and a hoststar if there are no errors', () => {
      let tempHoststarMock = null;

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

    //TODO: ADD 400 TEST
    //TODO: ADD 404 TEST
    //TODO: ADD 409 TEST

  });


  //TODO: ADD ENTIRE PUT TEST

  describe('PUT /api/hoststars/', () => {
    test('This PUT should respond with a 200 status if there are no errors', () => {

      return hoststarMock.create()
        .then(hoststar => {
          console.log(hoststar._id);
          return superagent.put(`${apiURL}/${hoststar._id}`)
            .send({ numberOfPlanets: 6 });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.numberOfPlanets).toEqual(6);
        });
    });
    //TODO: ADD 400 TEST
    // test('This PUT should')
      
    

  //TODO: ADD 404 TEST
  //TODO: ADD 409 TEST
  });




  //TODO: ADD ENTIRE DELETE TEST
  //TODO: ADD 200 TEST
  //TODO: ADD 400 TEST
  //TODO: ADD 404 TEST
  //TODO: ADD 409 TEST



});