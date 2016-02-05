var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http',
    function($scope, leafletData, $timeout, $window, $http) {
  $scope.option = {};

  $scope.map = {
    center: { lat: 0, lng: 0, zoom: 3 },
    events: { map: { enable: ['click'], logic: 'emit' } }
  };

  $http.get('https://api.mol.org/0.x/inventory/datasets', { withCredentials: false })
    .then(function(response) {
      $scope.fields = response.data.fields;
      angular.forEach(response.data.rows, function(row, i) {
        console.log(row);
        angular.forEach(row, function(cell, j) {
          console.log(cell);
        });
      });
    }, function(response) {
      console.log('error', response);
    });

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

}]);
