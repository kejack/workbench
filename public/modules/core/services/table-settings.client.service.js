(function() {
  'use strict';

  angular
    .module('core')
    .factory('TableSettings', factory);

  factory.$inject = ['NgTableParams'];

  function factory(NgTableParams) {

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

    /* jshint ignore:start */
    var tableParams = new NgTableParams(params, settings);
    /* jshint ignore:end */

    var getParams = function(Entity) {
      var tableParams = new NgTableParams(params, settings);
      tableParams.settings(
        {getData: function($defer, params) {
          Entity.get(params.url(), function(response) {
            params.total(response.total);
            $defer.resolve(response.results);
          });
        }
      });
      return tableParams;
    };

    var service = {
      getParams: getParams
    };

    return service;

  }

})();
