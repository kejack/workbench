'use strict';

(function() {
	// Files Controller Spec
	describe('Files Controller Tests', function() {
		// Initialize global variables
		var FilesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Files controller.
			FilesController = $controller('FilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one File object fetched from XHR', inject(function(Files) {
			// Create sample File using the Files service
			var sampleFile = new Files({
				name: 'New File'
			});

			// Create a sample Files array that includes the new File
			var sampleFiles = [sampleFile];

			// Set GET response
			$httpBackend.expectGET('files').respond(sampleFiles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.files).toEqualData(sampleFiles);
		}));

		it('$scope.findOne() should create an array with one File object fetched from XHR using a fileId URL parameter', inject(function(Files) {
			// Define a sample File object
			var sampleFile = new Files({
				name: 'New File'
			});

			// Set the URL parameter
			$stateParams.fileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/files\/([0-9a-fA-F]{24})$/).respond(sampleFile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.file).toEqualData(sampleFile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Files) {
			// Create a sample File object
			var sampleFilePostData = new Files({
				name: 'New File'
			});

			// Create a sample File response
			var sampleFileResponse = new Files({
				_id: '525cf20451979dea2c000001',
				name: 'New File'
			});

			// Fixture mock form input values
			scope.name = 'New File';

			// Set POST response
			$httpBackend.expectPOST('files', sampleFilePostData).respond(sampleFileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the File was created
			expect($location.path()).toBe('/files/' + sampleFileResponse._id);
		}));

		it('$scope.update() should update a valid File', inject(function(Files) {
			// Define a sample File put data
			var sampleFilePutData = new Files({
				_id: '525cf20451979dea2c000001',
				name: 'New File'
			});

			// Mock File in scope
			scope.file = sampleFilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/files\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/files/' + sampleFilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fileId and remove the File from the scope', inject(function(Files) {
			// Create new File object
			var sampleFile = new Files({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Files array and include the File
			scope.files = [sampleFile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/files\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.files.length).toBe(0);
		}));
	});
}());