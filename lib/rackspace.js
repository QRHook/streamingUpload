"use strict";

var cloudfiles = require('cloudfiles'),
	config = require('../config/').rackspace,
	utile = require('utile'),
	async = utile.async,
	logger = require('./logger'),
	rackspace = exports;

var client = cloudfiles.createClient(config),
	containers = ['Hook Logos', 'Static Assets', 'Sikuli', 'Videos', 'Movies'];

/*
 * Create Rackspace Cloudfiles containers based on the array
 */
rackspace.create = function () {

	client.setAuth(function () {

		async.forEach(containers, function (container, callback) {

			client.createContainer(container, function (err, cont) {

				if(!err && cont) {

					logger.log({'container': cont}, 'info');

					callback(null);

				} else {

					callback(err);

				}

			});

		}, function (err) {

			if(err) {

				logger.log({'err': err}, 'info');

				process.exit(1);

			} else {

				logger.log({'Status': 'Success'}, 'info');

				process.exit(0);

			}

		});

	});

};



if(require.main === module) {

	rackspace.create();

}
