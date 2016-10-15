'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var files = require('../../app/controllers/files.server.controller');

	// Files Routes
	app.route('/files')
		.get(files.list)
		.post(users.requiresLogin, files.create);

	app.route('/files/:fileId')
		.get(files.read)
		.put(users.requiresLogin, files.hasAuthorization, files.update)
		.delete(users.requiresLogin, files.hasAuthorization, files.delete);

	// Finish by binding the File middleware
	app.param('fileId', files.fileByID);
};
