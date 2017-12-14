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
    content  : 'words',
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
          // console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();

          expect(response.body.name).toEqual(hoststarToPost.name);
          expect(response.body.content).toEqual(hoststarToPost.content);
        });
    });
    test('should respond with a 400 code if we send an incomplete hoststar', () => {
      let hoststarToPost = {
        content: 'words',
      };
      return superagent.post(`${apiURL}`)
        .send(hoststarToPost)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.status);
          expect(response.status).toEqual(400);
        });
    });
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
    test('should respond with a 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/fake`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

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