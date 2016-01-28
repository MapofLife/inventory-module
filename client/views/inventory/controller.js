var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl', ['$scope', function($scope) {
  $scope.remoteUrl = 'http://localhost:8081';
}]);
