// Script for bootstrapping a couchDB for this application based on the config data
var couch = require('./lib/couch'),
	logger = require('./lib/logger'),
	bootstrapper = exports;

bootstrapper.setup = function setup (callback) {

	var stream = couch.bootstrap();

	stream.on('error', function (err) {

		callback(err);
		logger.log({bootstrap: false, err: err}, 'error');

	});

	stream.on('end', function () {

		callback();
		logger.log({bootstrap: true}, 'info');

	});

	return stream;
};

if(require.main === module) {

  bootstrapper.setup();
}
