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
