'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'workbench';
	var applicationModuleVendorDependencies = [
		'ngResource',
		'ngCookies',
		'ngAnimate',
		'ngTouch',
		'ngSanitize',
		'ngTable',
		'ui.router',
		//'mwl.calendar',
		'ui.bootstrap',
		'ui.utils',
		'formly',
		'formlyBootstrap'
	];

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
