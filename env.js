"use strict";

var flatiron = require('flatiron'),
	config = require('./config/'),
	path = require('path'),
	logger = require('./lib/logger'),
	version = require('./middleware/version'),
	log = require('./middleware/log'),
	socket = require('./binarySocket'),
	bootstrapper = require('./bootstrapper'),
	app = flatiron.app,
	environment	= exports;

environment.initialize = function initialize (callback) {
	app.use(flatiron.plugins.http, {
		//before: [ version ],
		after: [ log ],
		onError: function notFound (err) {
			this.res.writeHead(404, { 'Content-Type': 'application/json' });
      this.res.json({
				error: 'app:route:not_found',
				reason: 'No such route',
				statusCcode : 404
			});
		}
	});

	app.use(flatiron.plugins.ecstatic);
	app.static(__dirname + '/public');

	app.get = app.router.get;
	app.put = app.router.put;
	app.post = app.router.post;
	app['delete'] = app.router['delete'];

	callback(app);

};

environment.start = function start(app, cb) {

	bootstrapper.setup(function () {

		app.start(config.www.port, function () {

			logger.log({'blackTemplate': 'change this shit', 'status': 'ok', 'port': config.www.port}, 'info');

			if(cb) { cb(); }

		});

		socket.start(app.server, function() {

			logger.log({'sock': 'server is strapped', 'status': 'winning'}, 'info');

		});

	});

};
