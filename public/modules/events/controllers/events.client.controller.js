'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events', 'TableSettings', 'EventsForm',
	function($scope, $stateParams, $location, Authentication, Events, TableSettings, EventsForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Events);
		$scope.event = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = EventsForm.getFormFields(disabled);
		};


		// Create new Event
		$scope.create = function() {
			var event = new Events($scope.event);

			// Redirect after save
			event.$save(function(response) {
				$location.path('events/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Event
		$scope.remove = function(event) {

			if ( event ) {
				event = Events.get({eventId:event._id}, function() {
					event.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.event.$remove(function() {
					$location.path('events');
				});
			}

		};

		// Update existing Event
		$scope.update = function() {
			var event = $scope.event;

			event.$update(function() {
				$location.path('events/' + event._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewEvent = function() {
			$scope.event = Events.get( {eventId: $stateParams.eventId} );
			$scope.setFormFields(true);
		};

		$scope.toEditEvent = function() {
			$scope.event = Events.get( {eventId: $stateParams.eventId} );
			$scope.setFormFields(false);
		};

	}

]);
