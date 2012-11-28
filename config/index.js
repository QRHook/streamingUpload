var env = process.env.NODE_ENV || 'development',
	config = exports;

['couch', 'riak', 'www', 'rackspace'].forEach(function (filename) {
  try {
    config[filename] = require('./' + filename + '.' + env);
  } catch (_) {
    config[filename] = require('./' + filename);
  }
});
