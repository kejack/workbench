'use strict';

// Files controller
angular.module('files').controller('FilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Files', 'TableSettings', 'FilesForm',
	function($scope, $stateParams, $location, Authentication, Files, TableSettings, FilesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Files);
		$scope.file = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = FilesForm.getFormFields(disabled);
		};


		// Create new File
		$scope.create = function() {
			var file = new Files($scope.file);

			// Redirect after save
			file.$save(function(response) {
				$location.path('files/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing File
		$scope.remove = function(file) {

			if ( file ) {
				file = Files.get({fileId:file._id}, function() {
					file.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.file.$remove(function() {
					$location.path('files');
				});
			}

		};

		// Update existing File
		$scope.update = function() {
			var file = $scope.file;

			file.$update(function() {
				$location.path('files/' + file._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewFile = function() {
			$scope.file = Files.get( {fileId: $stateParams.fileId} );
			$scope.setFormFields(true);
		};

		$scope.toEditFile = function() {
			$scope.file = Files.get( {fileId: $stateParams.fileId} );
			$scope.setFormFields(false);
		};

	}

]);
