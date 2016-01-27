//'use strict';

var inventoryApp = angular.module('inventoryApp', [
  //'mol.filters',
  //'mol.services',
  //'mol.auth',
]);

inventoryApp.config(['$httpProvider', '$locationProvider', '$sceDelegateProvider',
            function($httpProvider, $locationProvider, $sceDelegateProvider) {
  //$httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);
  console.log('here');
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http*://localhost**',
    'http*://*mol.org/**'
  ]);
}]);
