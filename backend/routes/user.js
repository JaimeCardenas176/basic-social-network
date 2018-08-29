'use strict'

var express = requires('express');
var UserController = requires('../controller/user');

var api = express.Router();

api.get('/home', UserController.home);
api.post('/register', UserController.save);

module.exports = api;