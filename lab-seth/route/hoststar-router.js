'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Hoststar = require('../model/hoststar');
const httpErrors = require('http-errors');

const hoststarRouter = module.exports = new Router();

hoststarRouter.post('/api/hoststars', jsonParser, (request,response, next) => {  
  if (!request.body.name || !request.body.numberOfPlanets) {
    return next(httpErrors(400, 'Body and Name are required'));
  }

  return new Hoststar(request.body).save()
    .then(hoststar => response.json(hoststar))
    .catch(next);
});

hoststarRouter.get('/api/hoststars/:id', (request,response,next) => {
  return Hoststar.findById(request.params.id)
    .then(hoststar => {
      if(!hoststar){
        throw httpErrors(404, 'Hoststar not found');
      }
      return response.json(hoststar);
    }).catch(next);
});

hoststarRouter.delete('/api/hoststars/:id', (request, response, next) => {
  return Hoststar.findByIdAndRemove(request.params.id)
    .then(hoststar => {
      if (!hoststar) {
        throw httpErrors(404, 'Hoststar not found');
      }
      return response.sendStatus(204);
    }).catch(next);
});

hoststarRouter.put('/api/hoststars/:id', jsonParser, (request, response, next) => {
  let options = { runValidators: true, new: true };
  
  return Hoststar.findByIdAndUpdate(request.params.id, request.body, options)
    .then(hoststar => {
      if (!hoststar) {
        throw httpErrors(404, 'Hoststar not found');
      }
      return response.json(hoststar);
    }).catch(next);
});