var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http',
    function($scope, leafletData, $timeout, $window, $http) {
  $scope.option = {};

  $scope.map = {
    center: { lat: 0, lng: 0, zoom: 3 },
    events: {
      map: {
        enable: ['click'],
        logic: 'emit'
      }
    }
  };

  $http.get('https://api.mol.org/0.x/inventory/datasets')
    .success(function(data) {
      console.log(data);
    });

  $scope.windowResize = function(size) {
    leafletData.getMap().then(function(map) {
      $timeout(function() {
        var selector = '.mol-inventory-map .leaflet-container',
            footer   = angular.element('footer').height(),
            top      = angular.element(selector).offset().top,
            height   = size.h - top - footer; // - 4;
        angular.element(selector).css('height', height + 'px');
        map.invalidateSize();
      }, 300);
  });};

  $scope.$on('leafletDirectiveMap.click', function(event) {
    console.log('click');
  });

  $scope.providers = [
    {id: 1, name: 'provider one'},
    {id: 2, name: 'provider two'},
    {id: 3, name: 'provider three'},
    {id: 4, name: 'provider four'},
    {id: 5, name: 'provider five'},
  ];

  $scope.types = [
    {id: 1, name: 'type one'},
    {id: 2, name: 'type two'},
    {id: 3, name: 'type three'},
    {id: 4, name: 'type four'},
    {id: 5, name: 'type five'},
  ];

  $scope.taxa = [
    {id: 1, name: 'taxon one'},
    {id: 2, name: 'taxon two'},
    {id: 3, name: 'taxon three'},
    {id: 4, name: 'taxon four'},
    {id: 5, name: 'taxon five'},
  ];

  $scope.regions = [
    {id: 1, name: 'region one'},
    {id: 2, name: 'region two'},
    {id: 3, name: 'region three'},
    {id: 4, name: 'region four'},
    {id: 5, name: 'region five'},
  ];

  $scope.temporalScopes = [
    {id: 1, name: 'temporal scope one'},
    {id: 2, name: 'temporal scope two'},
    {id: 3, name: 'temporal scope three'},
    {id: 4, name: 'temporal scope four'},
    {id: 5, name: 'temporal scope five'},
  ];

}]);
