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
