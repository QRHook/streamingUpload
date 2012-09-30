var version = require('../package.json').version;

module.exports = function version (req, res, next) {

	res.setHeader('x-api-version', version);
	next();

};
