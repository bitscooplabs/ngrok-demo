'use strict';

const httpErrors = require('http-errors');


module.exports = function(err, req, res, next) {
	let status = (err instanceof httpErrors.HttpError) ? err.status : 500;

	if (status === 500) {
		env.logger.error(err, req.meta);
	}

	res.status(status);
	res.json({
		message: err.message
	});
};
