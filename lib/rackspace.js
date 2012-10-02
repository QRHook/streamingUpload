"use strict";

var request = require('request'),
	mime = require('mime'),
	utile = require('utile'),
	url = require('url'),
	async = utile.async,
	logger = require('./logger'),
	host = 'auth.api.rackspacecloud.com',
	pause = require('pause-stream'),
	config = require('../config').rackspace,
	authenticated = false,
	storageUrl,
	authToken,
	cdnUrl;

var failCodes = {
	400: "Bad Request",
	401: "Unauthorized",
	403: "Resize not allowed",
	404: "Item not found",
	409: "Build in progress",
	413: "Over Limit",
	415: "Bad Media Type",
	500: "Fault",
	503: "Service Unavailable"
};

var successCodes = {
	200: "OK",
  202: "Accepted",
  203: "Non-authoritative information",
  204: "No content"
};

function authenticate (callback) {

	var authOptions = {
		uri: 'https://' + host + '/v1.0',
		headers: {
			'HOST': host,
			'X-AUTH-USER': config.auth.username,
			'X-AUTH-KEY': config.auth.apiKey
		}
	};

	request(authOptions, function (err, res, body) {

		if(err) {

			logger.log(err, 'error');
			callback(err, null);

		}

		var statusCode = res.statusCode.toString();
		if (Object.keys(failCodes).indexOf(statusCode) !== -1) {

			err = new Error('Rackspace Error (' + statusCode + '): ' + failCodes[statusCode]);

			logger.log({'error': err}, 'error');
			logger.log(res, 'error');

			callback(err, null);

		}

		authenticated = true;
		storageUrl = res.headers['x-storage-url'];
		cdnUrl = res.headers['x-cdn-management-url'];
		authToken = res.headers['x-auth-token'];
		callback(null, res);

	});

}

exports.addFile = function (container, name, stream, callback ) {

	var ps = new pause();
	stream.pipe(ps.pause());

	authenticate(function (err, res) {

		if(err) {

			callback(err, null);

		}

		var rStream = request.put({
			url: storageUrl + '/' + container + '/' + name,
			headers: {
				'x-auth-token': authToken,
				'Transfer-Encoding': 'chunked'
			}
		});

		ps.pipe(rStream);
		ps.resume();

		ps.on('error', function (exception) {

			logger.log(exception, 'error');
			callback(exception, null);

		});


		ps.on('end', function () {

			logger.log({'status': 'Success!'}, 'info');
			callback(null, 'Success');

		});

	});

};

function enableCDN (callback) {



}

exports.createContainer = function (name, cdnEnabled, callback) {

	authenticate(function (err, res) {

		if(err) {

			callback(err, null);

		}

		request.put({
			url: storageUrl + '/' + name,
			headers: {
				'x-auth-token': authToken
			}
		}, function (err, res, body) {

			if(err) {

				logger.log(err, 'error');
				callback(err, null);

			}

			var statusCode = res.statusCode.toString();
			if (Object.keys(failCodes).indexOf(statusCode) !== -1) {

				err = new Error('Rackspace Error (' + statusCode + '): ' + failCodes[statusCode]);

				logger.log({'error': err}, 'error');
				logger.log(res, 'error');

				callback(err, null);

			}

			callback(null, res);

		});

	});

};


if(require.main === module) {

	exports.createContainer('newContainer', false, function (err, res) {

		if(!err) {

			console.log(res);

		}

	});

}
