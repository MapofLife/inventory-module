var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http', '$filter', 'MOLApi',
    function($scope, leafletData, $timeout, $window, $http, $filter, MOLApi) {
  $scope.fields  = [];
  $scope.rows    = [];
  $scope.choices = [];
  $scope.options = [];

  $scope.map = {
    center: { lat: 0, lng: 0, zoom: 3 },
    events: { map: { enable: ['click'], logic: 'emit' } }
  };

  $scope.initialize = function() {
    MOLApi('inventory/datasets').then(function(response) {
      $scope.fields = response.data.fields;
      $scope.rows = response.data.rows;
      console.log($scope.rows);
    });
  };

  // TODO: Use component helper
  $scope.windowResize = function(size) {
    leafletData.getMap().then(function(map) {
      $timeout(function() {
        var selector = '.mol-inventory-map .leaflet-container',
            footer   = angular.element('footer').height(),
            top      = angular.element(selector).offset().top,
            height   = size.h - top - footer;
        angular.element(selector).css('height', height + 'px');
        map.invalidateSize();
      }, 300);
  });};

  $scope.initialize();

}]);
