# Mongo Double Resource

This is a simple HTTP server which follows REST constraints, that allows users to input a url to GET, PUT, or DELETE a planet and a hoststar from a Mongo Database! It contains tests to make sure that the RESTful operations worked properly.

## Routes Explanation

### URL: /api/planet?id={**_id_**}  & /api/hoststar?id={**_id_**}

#### GET: 
  - If a valid **id** is given:
    - Server response: _object with that Item's properties as key:value pairs from the database and a 200 status code_
  - If **_NO id or an incorrect id_** is given:
    - Server response: 404 Error saying planet is not found.
#### POST: 
  - If valid **information** is given:
    - Server response: _stores the new Item in the database and sends a 200 status code_
  - If the **_id is incorrect, was not given, or the data given does not have the required types and minimum level_**:
    - Server response: _400 error_ stating that body and content are rquired.
#### PUT: 
  - If a valid **id** is given:
    - Server response: _stores the updated Item info in the database and sends a 200 status code_
  - If the **_id is incorrect, was not given, or the data given does not have the required types_**:
    - Server response: _400 error_ stating that body and content are rquired.
#### DELETE: 
  - If a valid **id** is given:
    - Server response: _deletes the planet from the database and sends a 204 status_
  - If the **_id is incorrect or was not given_**:
    - Server response: _404 error_ Item Not Found



## Build status

<!-- Build status of continus integration i.e. travis, appveyor etc. Ex.  -->
Status: Working


## Code style

js-standard-style

<!-- ## Screenshots

![Chat Room Example](https://raw.githubusercontent.com/SethDonohue/06-tcp-server/seth-lab/lab-seth/img/TCP-Chat-Server.png) -->

## Tech/framework used
- Eslint
- Node
- jest
- superagent
- dotenv
- Winston
- Faker
- Javascript /ES6
- express
- http-errors
- mongoose
- mongodb


#### Built with

VScode

## Features

- It uses Winston Logger to keep track of logs.
- GET, POST, PUT, DELETE routes for newly discovered exo-planets and hoststars
- Uses Faker to fake information for testing purposes

## Code Example

### Routes Example
```
planetRouter.post('/api/planets', jsonParser, (request,response, next) => {  
  if(!request.body.name || !request.body.content) {
    return next(httpErrors(400, 'body and content are required'));
  }

  return new Planet(request.body).save()
    .then(planet => response.json(planet)) //this sends a 200
    .catch(next);
});

planetRouter.get('/api/planets/:id', (request,response,next) => {
  return Planet.findById(request.params.id)
    .then(planet => {
      if(!planet){
        throw httpErrors(404, 'Planet not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(planet);
    }).catch(next);
});


hoststarRouter.delete('/api/hoststars/:id', (request, response, next) => {
  return Hoststar.findByIdAndRemove(request.params.id)
    .then(hoststar => {
      if (!hoststar) {
        throw httpErrors(404, 'hoststar not found');
      }
      logger.log('info', 'GET - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

hoststarRouter.put('/api/hoststars/:id', jsonParser, (request, response, next) => {
  let options = { runValidators: true, new: true };
  if (!request.body.name || !request.body.numberOfPlanets) {
    return next(httpErrors(400, 'Body and Name are required'));
  }

  return Hoststar.findByIdAndUpdate(request.params.id, request.body, options)
    .then(hoststar => {
      if (!hoststar) {
        throw httpErrors(404, 'hoststar not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(hoststar);
    }).catch(next);
});

```

## Installation
1. ) Get source code from github (https://github.com/SethDonohue/13-14-relational-modeling/tree/seth-lab-14)
2. ) In terminal navigate to 'lab-seth' folder and run following commands:
```
npm i
```

<!-- Provide step by step series of examples and explanations about how to get a development env running. -->

## API Reference

Docs in Progress

## Tests

- Confirms a 200 status code on a proper POST request
- Confirms a 400 status code when an improper POST request is made

- Confirms a 200 status code on a proper GET request
- Confirms a 400 status code when an improper GET request is made

- Confirms a 200 status code on a proper PUT request
- Confirms a 400 status code when an improper PUT request is made

- Confirms a 200 status code on a proper DELETE request
- Confirms a 400 status code when an improper DELETE request is made

#### To Run Tests, run these commands in terminal from lab-seth folder

- npm run dbon
- npm run test
  - this will populate the database with five examples first then run tests on on the routes

## Contribute

<!-- Let people know how they can contribute into your project. A contributing guideline will be a big plus. -->

## Credits

- Winston
- Node
- dotenv
- Faker
- suepragent
- jest
- uuid
- Classmates that helped me!
<!-- Give proper credits. This could be a link to any repo which inspired you to build this project, any blogposts or links to people who contrbuted in this project.

Anything else that seems useful -->

## License

#### MIT © Seth Donohue