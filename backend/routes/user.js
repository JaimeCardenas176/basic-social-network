'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var auth = require('../middlewares/auth');

var api = express.Router();


api.get('/home', auth.ensureAuth, UserController.home);
api.get('/user/:id', auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', auth.ensureAuth, UserController.listUsers);


api.post('/register', UserController.save);
api.post('/login', UserController.login);

api.put('/update-user/:id', auth.ensureAuth, UserController.updateUser);

module.exports = api;