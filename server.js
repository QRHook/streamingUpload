var environment = require('./env'),
	root = require ('./controllers/root'),
	server = exports;

server.run = function run (cb) {

	environment.initialize (function initialize (app) {

		environment.start(app, function () {

			app.get('/', root.index);

		});

	});

};

if(require.main === module) {

	server.run();

}
