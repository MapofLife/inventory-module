var module = angular.module('mol', [
  //'mol.filters',
  //'mol.services',
  //'mol.auth',
  //'mol.species-search',
  //'mol.species-images',
  //'mol.species-list',
  //'mol.species-wiki',
  //'mol.species-detail',
  //'mol.consensus-map',
  //'mol.point-filters',
  //'mol.species-list-service',
  //'mol.taxa-counts',
  //'mol.location-map',
  //'mol.loading-indicator',
  //'mol.consensus-map',
  //'mol.region-selector',
  //'mol.region-model-ctrl',
  'ui.select',
  'ui.router',
  'ui-leaflet',
  //'ui.checkbox',
  //'imageHelpers',
  //'leaflet-directive',
  //'angularResizable',
  //'nvd3',
  //'ui-rangeSlider',
  'angular-loading-bar',
  //'pageslide-directive',
  //'percentage',
  //'km2',
  'ngSanitize',
  'ngCookies',
  'mol.inventory-controllers'
]);

module.config(['$httpProvider', '$locationProvider', '$sceDelegateProvider', '$urlRouterProvider', '$stateProvider',
            function($httpProvider, $locationProvider, $sceDelegateProvider, $urlRouterProvider, $stateProvider) {
  //$httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http*://localhost**',
    'http*://*mol.org/**'
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

module.directive('molWindowResize', function ($window) {
  return function (scope, element, attr) {
    var func = attr.molWindowResize;
    scope.$watch(function () {
      return {
        'h': window.innerHeight,
        'w': window.innerWidth
      };},
      function (newValue, oldValue) {
        scope[func](newValue, oldValue);
      }, true);
      angular.element($window).bind('resize', function () {
        scope.$apply();
      });
    };
});
