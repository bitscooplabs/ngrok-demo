'use strict';

const onHeaders = require('on-headers');


module.exports = function(logger) {
	return function(req, res, next) {
		let start = new Date();

		logger.debug('Request received.', req.meta, {
			headers: req.headers,
			parameters: req.query
		});

		onHeaders(res, function() {
			let duration = new Date() - start;
			let location = res.get('location');

			if (location) {
				logger.debug('Response with status ' + res.statusCode + ' in ' + duration + ' ms. Location: ' + location, {
					id: req.meta.id
				});
			}
			else {
				logger.debug('Response with status ' + res.statusCode + ' in ' + duration + ' ms.', {
					id: req.meta.id
				});
			}
		});

		next();
	};
};
