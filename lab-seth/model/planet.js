'use strict';

const mongoose = require('mongoose');
const Hoststar = require('./hoststar');
const httpErrors = require('http-errors');

const planetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
  },
  hoststar: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'hoststar',
  },
});

//------------------------ RELATIONSHIP MANAGEMENT ------------------------
planetSchema.pre('save', function(done){
  return Hoststar.findById(this.hoststar)
    .then(hoststarFound => {
      if(!hoststarFound)
        throw httpErrors(404, 'Hoststar not found');
      hoststarFound.planetNames.push(this._id);
      return hoststarFound.save();
    })
    .then(() => done()) //need to make a function to make sure we dont pass anything into the done() as the done() is expecting (error, args)
    .catch(done);
});

planetSchema.post('remove', (document, done) => {
  return Hoststar.findById(document.hoststar)
    .then(hoststarFound => {
      if (!hoststarFound)
        throw httpErrors(404, 'Hoststar not found');
      hoststarFound.planetNames = hoststarFound.planetNames.filter(planet => {
        return planet._id.toString() !== document._id.toString();
      });
      return hoststarFound.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('planet', planetSchema);