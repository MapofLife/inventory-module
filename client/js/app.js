var module = angular.module('mol', [
  'ui.select',
  'ui.router',
  'ui-leaflet',
  'angular-loading-bar',
  'ngResource',
  'ngSanitize',
  'ngCookies',
  'mol.inventory-controllers'
]);

module.config(['$httpProvider', '$locationProvider', '$sceDelegateProvider', '$urlRouterProvider', '$stateProvider',
            function($httpProvider, $locationProvider, $sceDelegateProvider, $urlRouterProvider, $stateProvider) {
  $httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http*://localhost**',
    'http*://*mol.org/**',
    'http*://api.mol.org/0.x/inventory/**'
  ]);
  $urlRouterProvider.otherwise("/inventory/");
  $stateProvider.state('inventory', {
        templateUrl: '/inventory/assets/views/inventory/main.html',
        controller: 'inventoryCtrl',
        url: '/inventory/',
  });
}]);

module.filter('trustUrl', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});

// TODO Combine with controller logic
module.filter('inventoryChoices', function() {
  return function(rows, i) {
    var choices = {};
    angular.forEach(rows, function(row, j) {
      var titles = [], values = [], key = '', value = '';
      angular.forEach(row[i], function(cell, k) {
        titles.push(cell.title);
        values.push(cell.value);
      });
      key = titles.join(', ');
      value = values.join(', ');
      if ( key && value ) {
        choices[key] = value;
      }
    });
    return Object.keys(choices).sort();
  };
});

module.directive('molWindowResize', function ($window) {
  return function (scope, element, attr) {
    var func = attr.molWindowResize;
    scope.$watch(function () {
      return {
        'h': window.innerHeight,
        'w': window.innerWidth
      };},
      function(newValue, oldValue) {
        scope[func](newValue, oldValue);
      }, true);
      angular.element($window).bind('resize', function () {
        scope.$apply();
      });
    };
});

module.factory('MOLApi', ['$http', function($http) {
		return function(service, params, canceller, loading) {
			loading = (typeof loading === undefined) ? false : loading;
			return $http({
				method:'GET',
				url: 'https://api.mol.org/0.x/{0}'.format(service),
				params: params,
				withCredentials: false,
				cache: true,
				timeout: (canceller) ? canceller.promise : undefined,
				ignoreLoadingBar: loading
			});
		};
	}
]);
