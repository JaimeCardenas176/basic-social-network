'use strict'

var express = require('express');

var PublicationController = require('../controllers/publication');

var multipart = require('connect-multiparty');
var auth = require('../middlewares/auth');
var upload = multipart({uploadDir: './uploads/publications'});

var api = express.Router();	

api.get('/probando-pub', auth.ensureAuth, PublicationController.probando);
api.get('/publications/:page?' , auth.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id' , auth.ensureAuth, PublicationController.getPublication);
api.get('/publication/get-image/:imageFile', PublicationController.getImgFile);

api.post('/publication', auth.ensureAuth, PublicationController.savePublication);
api.post('/upload-image-pub', [auth.ensureAuth, upload], PublicationController.uploadImg);

api.delete('/publication/:id', auth.ensureAuth, PublicationController.deletePublication);

module.exports = api;