var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl', ['$scope', function($scope) {
  //TODO: This needs to be changed based upon the root URL
  $scope.molAssetsUrl = 'http://localhost:8081';
}]);
