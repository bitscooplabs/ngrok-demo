'use strict';


module.exports = function(req, res, next) {
	res.status(404);
	res.json({
		message: 'Resource not found.'
	});
};
