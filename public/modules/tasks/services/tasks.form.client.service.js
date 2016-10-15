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
