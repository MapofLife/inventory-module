'use strict';

angular.module('mol.inventory', [
  'ui.router',
  'ui-leaflet',
  'angular-loading-bar',
  'angular.filter',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.bootstrap',
  'mol.facets',
  'mol.loading-indicator',
  'mol.inventory-controllers'
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = false;
    //cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
  }])
.config(['$httpProvider', '$locationProvider', '$sceDelegateProvider', '$urlRouterProvider', '$stateProvider',
            function($httpProvider, $locationProvider, $sceDelegateProvider, $urlRouterProvider, $stateProvider) {
  $httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http*://localhost**',
    'http*://*mol.org/**',
    'http*://api.mol.org/0.x/inventory/**',
  ]);
  $urlRouterProvider.otherwise("inventory/");
  $stateProvider
    .state(
      'inventory',
      {
         abstract: true,
         templateUrl: 'static/views/main.html',
         controller: 'inventoryCtrl',
      }
    )
    .state(
      'inventory.map',
      {
        title: "Dataset Inventory Map",
        views: {
          "" : { templateUrl: "static/views/map/main.html"}
        },
        url: '/map'
      }
    )
    .state(
      'inventory.table',
      {
        title: "Dataset Inventory Table",
        views: {
          "" : { templateUrl: "static/views/table/main.html"}
        },
        url: '/table'
      }
    );
      $locationProvider.html5Mode(true);
}]).factory('MOLApi', ['$http', function($http) {
		return function(service, params, method, canceller, loading) {
			loading = (typeof loading === undefined) ? false : loading;
			return $http({
				method: method || 'GET',
        url: 'https://api.mol.org/0.x/{0}'.format(service),
				//url: 'http://dev.api-0-x.map-of-life.appspot.com//0.x/{0}'.format(service),
				params: params,
				withCredentials: false,
				cache: true,
				timeout: canceller ? canceller.promise : undefined,
				ignoreLoadingBar: loading
			});
		};
	}
]);
