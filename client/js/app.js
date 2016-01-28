var inventoryApp = angular.module('mol', [
  //mol components
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
  //3rd party components
  'ui.bootstrap',
  'ui.select',
  'ui.router',
  //'ui.checkbox',
  //'imageHelpers',
  //'ui-leaflet',
  'angularResizable',
  'ui-rangeSlider',
  'angular-loading-bar',
  //'percentage',
  //'km2',
  //'ngSanitize',
  'ngCookies'
]);

inventoryApp.config(['$httpProvider', '$locationProvider', '$sceDelegateProvider', '$urlRouterProvider', '$stateProvider',
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
