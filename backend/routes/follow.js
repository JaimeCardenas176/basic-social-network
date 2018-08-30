'use strict'

var express = require('express');

//controller
var FollowController = require('../controllers/follow');

//middlewares
var auth = require('../middlewares/auth');

//Router
var api = express.Router();

//rutes
api.get('/pruebas-follow', auth.ensureAuth, FollowController.prueba);
api.get('/following/:id?/:page?', auth.ensureAuth, FollowController.listFollowingUsers);
api.get('/followed/:id?/:page?', auth.ensureAuth, FollowController.listFollowedUsers);
api.get('/get-my-follows/:followed?', auth.ensureAuth, FollowController.getMyFollows);

api.post('/follow', auth.ensureAuth, FollowController.saveFollow);

api.delete('/follow/:id', auth.ensureAuth, FollowController.deleteFollow);

module.exports = api;
