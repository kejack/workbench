'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks', 'TableSettings', 'TasksForm', 'Users', 'Projects', 'Categories',
	function($scope, $stateParams, $location, Authentication, Tasks, TableSettings, TasksForm, Users, Projects, Categories ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Tasks);
		$scope.task = {};
		//$scope.userOptions = Users.query();
		//$scope.projectOptions = Projects.query();
		//$scope.categoryOptions = Categories.query();



		$scope.setFormFields = function(disabled ) {
			$scope.formFields = TasksForm.getFormFields(disabled, $scope.userOptions, $scope.projectOptions, $scope.categoryOptions);
		};


		// Create new Task
		$scope.create = function() {
			var task = new Tasks($scope.task);

			// Redirect after save
			task.$save(function(response) {
				$location.path('tasks/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Task
		$scope.remove = function(task) {

			if ( task ) {
				task = Tasks.get({taskId:task._id}, function() {
					task.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.task.$remove(function() {
					$location.path('tasks');
				});
			}

		};

		// Update existing Task
		$scope.update = function() {
			var task = $scope.task;

			task.$update(function() {
				$location.path('tasks/' + task._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewTask = function() {
			$scope.task = Tasks.get( {taskId: $stateParams.taskId} );
			$scope.setFormFields(true);
		};

		$scope.toEditTask = function() {
			$scope.task = Tasks.get( {taskId: $stateParams.taskId} );
			$scope.setFormFields(false);
		};

	}

]);
