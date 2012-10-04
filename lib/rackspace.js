"use strict";

var request = require('request'),
	mime = require('mime'),
	utile = require('utile'),
	url = require('url'),
	async = utile.async,
	logger = require('./logger'),
	host = 'auth.api.rackspacecloud.com',
	config = require('../config').rackspace,
	info = {},
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

	if(!authenticated) {

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
			info.storageUrl = res.headers['x-storage-url'];
			info.cdnUrl = res.headers['x-cdn-management-url'];
			info.authToken = res.headers['x-auth-token'];
			callback(null, res);

		});

	} else {

		callback(null, info);

	}

}

exports.addFile = function (container, name, ps, callback ) {

	authenticate(function (err, response) {

		if(err) {

			callback(err, null);

		}

		logger.log({'container': container, 'newName': name}, 'info');

		var rStream = request.put({
			url: info.storageUrl + '/' + container + '/' + name,
			headers: {
				'x-auth-token': info.authToken,
				'Transfer-Encoding': 'chunked'
			}
		});

		ps.pipe(rStream).pipe(process.stdout);
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

function enableCDN (name, callback) {

	request.put({
		url: info.cdnUrl + '/' + name,
		headers: {
			'x-auth-token': info.authToken,
			'x-ttl': 43200,
			'x-log-retention': true
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

}

exports.createContainer = function (name, cdnEnabled, callback) {

	authenticate(function (err, response) {

		if(err) {

			callback(err, null);

		}

		request.put({
			url: info.storageUrl + '/' + name,
			headers: {
				'x-auth-token': info.authToken
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

			if(cdnEnabled) {

				enableCDN(name, callback);

			} else {

				callback(null, res);

			}

		});

	});

};

/*
 * Assumes CDN Container
 */
exports.getContainerUrls = function (name, callback) {

	authenticate(function (err, response) {

		if(err) {

			callback(err, null);

		}

		request.put({
			url: info.cdnUrl + '/' + name,
			headers: {
				'x-auth-token': info.authToken
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

			callback(null, {
				streamingUrl: res.headers['x-cdn-streaming-uri'],
				sslUrl: res.headers['x-cdn-ssl-uri'],
				url: res.headers['x-cdn-uri']
			});

		});

	});

};

if(require.main === module) {

	// exports.getContainerUrls('png', function (err, res) {

	// 	logger.log(res, 'info');

	// });

	// var lotsOfTypes = ['css', 'javascript', 'html', 'mpeg', 'mp4', 'ogg', 'quicktime', 'webm',
	// 'x-matroska', 'x-ms-wmv', 'x-flv', 'gif', 'jpeg', 'png', 'svg+xml', 'tiff', 'vnd.wave',
	// 'vnd.rn-realaudio', 'vorbis', 'pdf'];

	//async.forEach(lotsOfTypes, function (type, callback) {

	var type = 'qt';

	exports.createContainer(type, true, function (err, res) {

		if(err) {

			logger.log({err: err}, 'error');
			process.exit(1);

		}

		logger.log({'status': 'Success!'}, 'info');
		process.exit(0);

	});


// });, function (err) {

// 	if(err) {

		// logger.log({err: err}, 'error');
		// process.exit(1);

// 	}

	// logger.log({'status': 'Success!'}, 'info');
	// process.exit(0);

//	});


}
