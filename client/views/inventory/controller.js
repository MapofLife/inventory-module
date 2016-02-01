var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl', ['$scope', function($scope) {
  //TODO: This needs to be changes based upon the root URL
  $scope.molAssetsUrl = 'http://localhost:8081';  // Maybe probe for a destination url?

  
}]);
