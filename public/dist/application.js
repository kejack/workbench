'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'workbench';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ngTable', 'ui.router','mwl.calendar', 'ui.bootstrap', 'ui.utils', 'formly', 'formlyBootstrap'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('categories', ['core']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('events', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('files', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('projects', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('tasks', ['core', 'ui.bootstrap']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the new module
angular.module('categories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'categories', 'List Categories', 'categories');
		Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'categories/create');
	}
]);

'use strict';

//Setting up route
angular.module('categories').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
		$stateProvider.
		state('listCategories', {
			url: '/categories',
			templateUrl: 'modules/categories/views/list-categories.client.view.html'
		}).
		state('createCategory', {
			url: '/categories/create',
			templateUrl: 'modules/categories/views/create-category.client.view.html'
		}).
		state('viewCategory', {
			url: '/categories/:categoryId',
			templateUrl: 'modules/categories/views/view-category.client.view.html'
		}).
		state('editCategory', {
			url: '/categories/:categoryId/edit',
			templateUrl: 'modules/categories/views/edit-category.client.view.html'
		});
	}
]);
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

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', { categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

(function() {
    'use strict';

    angular
        .module('categories')
        .factory('CategoriesForm', factory);

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Name:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

})();

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

angular.module('core')
  .directive('ngReallyClick', ['$modal',
    function($modal) {

      var ModalInstanceCtrl = ["$scope", "$modalInstance", function($scope, $modalInstance) {
        $scope.ok = function() {
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      }];

      return {
        restrict: 'A',
        scope: {
          ngReallyClick: '&'
        },
        link: function(scope, element, attrs) {

          element.bind('click', function() {
            var message = attrs.ngReallyMessage || 'Are you sure ?';

            var modalHtml = '<div class="modal-body">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

            var modalInstance = $modal.open({
              template: modalHtml,
              controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function() {
              scope.ngReallyClick();
            }, function() {
              //Modal dismissed
            });

          });

        }

      };

    }

  ]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
(function() {
    'use strict';

    angular
        .module('core')
        .factory('TableSettings', ['NgTableParams',

    function(NgTableParams) {

      var getData = function(Entity) {
        return function($defer, params) {
  				Entity.get(params.url(), function(response) {
  					params.total(response.total);
  					$defer.resolve(response.results);
  				});
  			};

      };

      var params = {
        page: 1,
        count: 5
      };

      var settings = {
        total: 0,
        counts: [5, 10, 15],
        filterDelay: 0,
      };





      var getParams = function(Entity) {
        var tableParams = new NgTableParams(params, settings);
        tableParams.settings({getData: getData(Entity)});
        return tableParams;
      };

      var service = {
        getParams: getParams
      };

      return service;

  }]);

})();

'use strict';

// Configuring the new module
angular.module('events').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Events', 'events', 'dropdown', '/events(/create)?');
		Menus.addSubMenuItem('topbar', 'events', 'List Events', 'events');
		Menus.addSubMenuItem('topbar', 'events', 'New Event', 'events/create');
	}
]);

'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Events state routing
		$stateProvider.
		state('listEvents', {
			url: '/events',
			templateUrl: 'modules/events/views/list-events.client.view.html'
		}).
		state('createEvent', {
			url: '/events/create',
			templateUrl: 'modules/events/views/create-event.client.view.html'
		}).
		state('viewEvent', {
			url: '/events/:eventId',
			templateUrl: 'modules/events/views/view-event.client.view.html'
		}).
		state('editEvent', {
			url: '/events/:eventId/edit',
			templateUrl: 'modules/events/views/edit-event.client.view.html'
		});
	}
]);
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

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('Events', ['$resource',
	function($resource) {
		return $resource('events/:eventId', { eventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';

    angular
        .module('events')
        .factory('EventsForm', factory);

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Name:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

})();

'use strict';

// Configuring the new module
angular.module('files').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Files', 'files', 'dropdown', '/files(/create)?');
		Menus.addSubMenuItem('topbar', 'files', 'List Files', 'files');
		Menus.addSubMenuItem('topbar', 'files', 'New File', 'files/create');
	}
]);

'use strict';

//Setting up route
angular.module('files').config(['$stateProvider',
	function($stateProvider) {
		// Files state routing
		$stateProvider.
		state('listFiles', {
			url: '/files',
			templateUrl: 'modules/files/views/list-files.client.view.html'
		}).
		state('createFile', {
			url: '/files/create',
			templateUrl: 'modules/files/views/create-file.client.view.html'
		}).
		state('viewFile', {
			url: '/files/:fileId',
			templateUrl: 'modules/files/views/view-file.client.view.html'
		}).
		state('editFile', {
			url: '/files/:fileId/edit',
			templateUrl: 'modules/files/views/edit-file.client.view.html'
		});
	}
]);
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

'use strict';

//Files service used to communicate Files REST endpoints
angular.module('files').factory('Files', ['$resource',
	function($resource) {
		return $resource('files/:fileId', { fileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';

    angular
        .module('files')
        .factory('FilesForm', factory);

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Name:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

})();

'use strict';

// Configuring the new module
angular.module('projects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
		Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects');
		Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create');
	}
]);

'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
	function($stateProvider) {
		// Projects state routing
		$stateProvider.
		state('listProjects', {
			url: '/projects',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).
		state('createProject', {
			url: '/projects/create',
			templateUrl: 'modules/projects/views/create-project.client.view.html'
		}).
		state('viewProject', {
			url: '/projects/:projectId',
			templateUrl: 'modules/projects/views/view-project.client.view.html'
		}).
		state('editProject', {
			url: '/projects/:projectId/edit',
			templateUrl: 'modules/projects/views/edit-project.client.view.html'
		});
	}
]);
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

'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

(function() {
    'use strict';

    angular
        .module('projects')
        .factory('ProjectsForm', factory);

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Name:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

})();

'use strict';

// Configuring the new module
angular.module('tasks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tasks', 'tasks', 'dropdown', '/tasks(/create)?');
		Menus.addSubMenuItem('topbar', 'tasks', 'List Tasks', 'tasks');
		Menus.addSubMenuItem('topbar', 'tasks', 'New Task', 'tasks/create');
	}
]);

'use strict';

//Setting up route
angular.module('tasks').config(['$stateProvider',
	function($stateProvider) {
		// Tasks state routing
		$stateProvider.
		state('listTasks', {
			url: '/tasks',
			templateUrl: 'modules/tasks/views/list-tasks.client.view.html'
		}).
		state('createTask', {
			url: '/tasks/create',
			templateUrl: 'modules/tasks/views/create-task.client.view.html'
		}).
		state('viewTask', {
			url: '/tasks/:taskId',
			templateUrl: 'modules/tasks/views/view-task.client.view.html'
		}).
		state('editTask', {
			url: '/tasks/:taskId/edit',
			templateUrl: 'modules/tasks/views/edit-task.client.view.html'
		});
	}
]);
'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks', 'TableSettings', 'TasksForm', 'Users', 'Projects', 'Categories',
	function($scope, $stateParams, $location, Authentication, Tasks, TableSettings, TasksForm, Users, Projects, Categories ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Tasks);
		$scope.task = {};
		$scope.userOptions = Users.query();
		$scope.projectOptions = Projects.query();
		$scope.categoryOptions = Categories.query();



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

'use strict';

//Tasks service used to communicate Tasks REST endpoints
angular.module('tasks').factory('Tasks', ['$resource',
	function($resource) {
		return $resource('tasks/:taskId', { taskId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

(function() {
    'use strict';

    angular
        .module('tasks')
        .factory('TasksForm', factory);

    function factory() {

      var getFormFields = function(disabled, userOptions, projectOptions, categoryOptions) {

        var fields = [
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Name:',
  						disabled: disabled
  			    }
  				},
	        {
		        key: 'description',
		        type: 'textarea',
		        templateOptions: {
			        label: 'Description:',
			        disabled: disabled
		        }
	        },
	        {
		        key: 'assignee',    // ng-model name, saved in formData
		        type: 'select', // field
		        templateOptions: {
			        label: 'Aassignee',
			        //multiple: true,
			        labelProp: 'displayName',
			        valueProp: '_id',
			        options: userOptions,
			        disabled: disabled
		        }

	        },
	        {
		        key: 'watcher',    // ng-model name, saved in formData
		        type: 'select', // field
		        templateOptions: {
			        label: 'Watcher',
			        //multiple: true,
			        labelProp: 'displayName',
			        valueProp: '_id',
			        options: userOptions,
			        disabled: disabled
		        }

	        },
	        {
		        key: 'project',    // ng-model name, saved in formData
		        type: 'select', // field
		        templateOptions: {
			        label: 'Project',
			        //multiple: true,
			        labelProp: 'name',
			        valueProp: '_id',
			        options: projectOptions,
			        disabled: disabled
		        }

	        },
	        {
		        key: 'category',    // ng-model name, saved in formData
		        type: 'select', // field
		        templateOptions: {
			        label: 'Category',
			        //multiple: true,
			        labelProp: 'name',
			        valueProp: '_id',
			        options: categoryOptions,
			        disabled: disabled
		        }

	        }

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

})();

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
