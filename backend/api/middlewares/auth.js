'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_token_api';

//TODO Cambiar este método
module.exports.ensureAuth = (token) => {
	const decoded = new Promise((res, rej) => {
		if (!req.headers.authorization) {
			return res.status(404)
				.send({
					message: 'La petición no tiene la cabecera de autenticación'
				});
		}
		var token = req.headers.authorization.replace(/['"]+/g, '');

		try {
			var payload = jwt.decode(token, secret);
			if (payload === undefined || payload == null) {
				return res.status(404)
					.send({
						message: 'El token no es válido'
					});
			} else {
				if (payload.exp <= moment().unix()) {
					req.user = payload;
					next();
				}
			}
		} catch (ex) {
			return res.status(404)
				.send({
					message: 'El token no es válido'
				});
		}
		req.user = payload;
		next();
	});
};