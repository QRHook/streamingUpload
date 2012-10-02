"use strict";

var request = require('request'),
	mime = require('mime'),
	utile = require('utile'),
	url = require('url'),
	async = utile.async,
	logger = require('./logger'),
	host = 'auth.api.rackspacecloud.com',
	pause = require('pause-stream'),
	config = require('../config').rackspace;

exports.addFile = function (container, name, stream, callback ) {

	var ps = new pause();
	stream.pipe(ps.pause());

	var authOptions = {
		uri: 'https://' + host + '/v1.0',
		headers: {
			'HOST': host,
			'X-AUTH-USER': config.auth.username,
			'X-AUTH-KEY': config.auth.apiKey
		}
	};

	var self = this;
	request(authOptions, function (err, res, body) {

		if(err) {

			logger.log(err, 'error');
			callback(err, null);

		} else {

			var statusCode = res.statusCode.toString();
			logger.log({'statusCode': statusCode}, 'info');

			/*
			 * May need to use username before container in url
			 */
			var rStream = request.put({
				url: res.headers['x-storage-url'] + '/' + container + '/' + name,
				headers: {
					'x-auth-token': res.headers['x-auth-token'],
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


		}

	});


};
