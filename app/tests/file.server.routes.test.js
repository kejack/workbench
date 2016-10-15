'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	File = mongoose.model('File'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, file;

/**
 * File routes tests
 */
describe('File CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new File
		user.save(function() {
			file = {
				name: 'File Name'
			};

			done();
		});
	});

	it('should be able to save File instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new File
				agent.post('/files')
					.send(file)
					.expect(200)
					.end(function(fileSaveErr, fileSaveRes) {
						// Handle File save error
						if (fileSaveErr) done(fileSaveErr);

						// Get a list of Files
						agent.get('/files')
							.end(function(filesGetErr, filesGetRes) {
								// Handle File save error
								if (filesGetErr) done(filesGetErr);

								// Get Files list
								var files = filesGetRes.body;

								// Set assertions
								(files[0].user._id).should.equal(userId);
								(files[0].name).should.match('File Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save File instance if not logged in', function(done) {
		agent.post('/files')
			.send(file)
			.expect(401)
			.end(function(fileSaveErr, fileSaveRes) {
				// Call the assertion callback
				done(fileSaveErr);
			});
	});

	it('should not be able to save File instance if no name is provided', function(done) {
		// Invalidate name field
		file.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new File
				agent.post('/files')
					.send(file)
					.expect(400)
					.end(function(fileSaveErr, fileSaveRes) {
						// Set message assertion
						(fileSaveRes.body.message).should.match('Please fill File name');
						
						// Handle File save error
						done(fileSaveErr);
					});
			});
	});

	it('should be able to update File instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new File
				agent.post('/files')
					.send(file)
					.expect(200)
					.end(function(fileSaveErr, fileSaveRes) {
						// Handle File save error
						if (fileSaveErr) done(fileSaveErr);

						// Update File name
						file.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing File
						agent.put('/files/' + fileSaveRes.body._id)
							.send(file)
							.expect(200)
							.end(function(fileUpdateErr, fileUpdateRes) {
								// Handle File update error
								if (fileUpdateErr) done(fileUpdateErr);

								// Set assertions
								(fileUpdateRes.body._id).should.equal(fileSaveRes.body._id);
								(fileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Files if not signed in', function(done) {
		// Create new File model instance
		var fileObj = new File(file);

		// Save the File
		fileObj.save(function() {
			// Request Files
			request(app).get('/files')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single File if not signed in', function(done) {
		// Create new File model instance
		var fileObj = new File(file);

		// Save the File
		fileObj.save(function() {
			request(app).get('/files/' + fileObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', file.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete File instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new File
				agent.post('/files')
					.send(file)
					.expect(200)
					.end(function(fileSaveErr, fileSaveRes) {
						// Handle File save error
						if (fileSaveErr) done(fileSaveErr);

						// Delete existing File
						agent.delete('/files/' + fileSaveRes.body._id)
							.send(file)
							.expect(200)
							.end(function(fileDeleteErr, fileDeleteRes) {
								// Handle File error error
								if (fileDeleteErr) done(fileDeleteErr);

								// Set assertions
								(fileDeleteRes.body._id).should.equal(fileSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete File instance if not signed in', function(done) {
		// Set File user 
		file.user = user;

		// Create new File model instance
		var fileObj = new File(file);

		// Save the File
		fileObj.save(function() {
			// Try deleting File
			request(app).delete('/files/' + fileObj._id)
			.expect(401)
			.end(function(fileDeleteErr, fileDeleteRes) {
				// Set message assertion
				(fileDeleteRes.body.message).should.match('User is not logged in');

				// Handle File error error
				done(fileDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			File.remove().exec(function(){
				done();
			});	
		});
	});
});
