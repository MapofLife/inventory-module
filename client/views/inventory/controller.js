var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http', 'MOLApi',
    function($scope, leafletData, $timeout, $window, $http, MOLApi) {
  $scope.option = {};

  $scope.map = {
    center: { lat: 0, lng: 0, zoom: 3 },
    events: { map: { enable: ['click'], logic: 'emit' } }
  };

  MOLApi('inventory/datasets').then(function(response) {
    $scope.data = response.data;
  });

  // TODO: Use component helper controller.js
  $scope.windowResize = function(size) {
    leafletData.getMap().then(function(map) {
      if (!size) {
        size = { 'h': window.innerHeight, 'w': window.innerWidth};
      }
      $timeout(function() {
        var selector = '.mol-inventory-map .leaflet-container',
            footer   = angular.element('footer').height(),
            top      = angular.element(selector).offset().top,
            height   = size.h - top - footer;
        angular.element(selector).css('height', height + 'px');
        map.invalidateSize();
      }, 300);
  });};

}]);
