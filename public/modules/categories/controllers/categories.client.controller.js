'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories', 'TableSettings', 'CategoriesForm',
	function($scope, $stateParams, $location, Authentication, Categories, TableSettings, CategoriesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Categories);
		$scope.category = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = CategoriesForm.getFormFields(disabled);
		};


		// Create new Category
		$scope.create = function() {
			var category = new Categories($scope.category);

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {

			if ( category ) {
				category = Categories.get({categoryId:category._id}, function() {
					category.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}

		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewCategory = function() {
			$scope.category = Categories.get( {categoryId: $stateParams.categoryId} );
			$scope.setFormFields(true);
		};

		$scope.toEditCategory = function() {
			$scope.category = Categories.get( {categoryId: $stateParams.categoryId} );
			$scope.setFormFields(false);
		};

	}

]);
