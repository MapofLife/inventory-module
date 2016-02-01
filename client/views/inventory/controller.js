var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl', ['$scope', function($scope) {
  //TODO: This needs to be changed based upon the root URL
  $scope.molAssetsUrl = 'http://localhost:8081';

  $scope.map = {
    /*
    center: { lat: 0, lng: 0, zoom: 8 },
    layers: {
        baselayers: {
            positron: {
                name: 'Positron',
                type: 'xyz',
                url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                layerOptions: {
                    subdomains: ['a', 'b', 'c'],
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    continuousWorld: false
                },
                errorTileUrl: '/app/img/blank_tile.png'
            }
        },
        overlays: {}
    },
    */
    defaults: {
      //scrollWheelZoom: false
    }
  }

}]);
