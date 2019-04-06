'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_token_api';

exports.createToken = (user) => {

	var payload = {
		//identificador del codumento
		sub: user._id,
		//fecha de creación del token
		iat: moment().unix(),
		//fecha de expiración del token
		exp: moment().add(30, 'days').unix()
	};

	return jwt.encode(payload, secret)
};