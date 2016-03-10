window.module = angular.module('mol.inventory', [
  'ui.router',
  'ui-leaflet',
  'angular-loading-bar',
  'ngResource',
  'ngSanitize',
  'ngCookies',
  'ui.bootstrap',
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
    'http*://api.mol.org/0.x/inventory/**',
    'http*://dev.api-0-x.map-of-life.appspot.com//0.x/inventory/**'
  ]);
  $urlRouterProvider.otherwise("/inventory/");
  $stateProvider.state('inventory', {
        templateUrl: '/inventory/assets/views/inventory/main.html',
        controller: 'inventoryCtrl',
        url: '/inventory/',
  });
}]);

module.directive('molFacet', [function() {
  return {
    restrict: 'E',
    templateUrl: '/inventory/assets/views/inventory/mol-facet.html',
    scope: {
      headers: '=',  // Change to '<' when we go to Angular v1.5
      rows:    '=',  // Change to '<' when we go to Angular v1.5
      choices: '='   // Keep as '='
    },
    link: function(scope, element, attrs) {
      scope.$watch('headers', function(newVal, oldVal) {
        scope.resetOptions();
      });
    },
    controller: ['$scope', '$filter', function($scope, $filter) {
      $scope.options = [];

      $scope.resetOptions = function() {
        if ($scope.headers) {
          $scope.headers.forEach(function(header, h) {
            $scope.options[h] = [];
            if ($scope.choices) {
              $scope.choices[h] = '';
              $scope.filterOptions();
            }
          });
        }
      };

      $scope.filterOptions = function() {
        var rows = $scope.filterRows($scope.rows, $scope.choices);
        $scope.options = $scope.getOptions(rows);
        $scope.options.forEach(function(opts, i) {
          $scope.options[i] = $filter('unique')($scope.options[i]);
        });
      };

      $scope.filterRows = function(rows, choices) {
        return rows.filter(function(row) {
          return row.every(function(column, c) {
            return column.some(function(datum) {
              return !choices[c] || choices[c] == datum.title;
            });
          });
        });
      };

      $scope.getOptions = function(rows) {
        var options = [];
        rows[0].forEach(function(column, c) { options[c] = []; });
        rows.forEach(function(row) {
          row.forEach(function(column, c) {
            var titles = [];
            column.forEach(function(datum) { titles.push(datum.title); });
            options[c].push(titles.join(', '));
          });
        });
        return options;
      };

    }]
  };
}]);

module.directive('molWindowResize', function($window) {
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
      angular.element($window).bind('resize', function() {
        scope.$apply();
      });
    };
});

module.factory('MOLApi', ['$http', function($http) {
		return function(service, params, method, canceller, loading) {
			loading = (typeof loading === undefined) ? false : loading;
			return $http({
				method: method || 'GET',
        url: 'https://api.mol.org/0.x/{0}'.format(service),
				url: 'http://dev.api-0-x.map-of-life.appspot.com//0.x/{0}'.format(service),
				params: params,
				withCredentials: false,
				cache: true,
				timeout: canceller ? canceller.promise : undefined,
				ignoreLoadingBar: loading
			});
		};
	}
]);
