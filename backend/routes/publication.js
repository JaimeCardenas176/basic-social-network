'use strict'

var express = require('express');

var PublicationController = require('../controllers/publication');

var multipart = require('connect-multiparty');
var auth = require('../middlewares/auth');
var upload = multipart({uploadDir: './uploads/publications'});

var api = express.Router();	

api.get('/probando-pub', auth.ensureAuth, PublicationController.probando);
api.get('/publications/:page?' , auth.ensureAuth, PublicationController.getPublications);

api.post('/publication', auth.ensureAuth, PublicationController.savePublication);

module.exports = api;