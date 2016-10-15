'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'TableSettings', 'ProjectsForm',
	function($scope, $stateParams, $location, Authentication, Projects, TableSettings, ProjectsForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Projects);
		$scope.project = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = ProjectsForm.getFormFields(disabled);
		};


		// Create new Project
		$scope.create = function() {
			var project = new Projects($scope.project);

			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project
		$scope.remove = function(project) {

			if ( project ) {
				project = Projects.get({projectId:project._id}, function() {
					project.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}

		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewProject = function() {
			$scope.project = Projects.get( {projectId: $stateParams.projectId} );
			$scope.setFormFields(true);
		};

		$scope.toEditProject = function() {
			$scope.project = Projects.get( {projectId: $stateParams.projectId} );
			$scope.setFormFields(false);
		};

	}

]);
