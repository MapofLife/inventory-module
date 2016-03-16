var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http', '$filter', 'MOLApi',
    function($scope, leafletData, $timeout, $window, $http, $filter, MOLApi) {

  $scope.choices = {};


  $scope.map = {
    center: { lat: 0, lng: 0, zoom: 3 },
    events: { map: { enable: ['click'], logic: 'emit' } },
    layers: {
      baselayers: {
        xyz: {
          name: 'OpenStreetMap (XYZ)',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          type: 'xyz'
        }
      }
    }
  };

  $scope.initialize = function() {
    $scope.$watch('choices', function() {
      $scope.inventoryQuery();
    },true);

    MOLApi('inventory/datasets').then(function(response) {
      $scope.facets = response.data;
    });
  };

  $scope.inventoryQuery = function() {
    var params = {};
    angular.forEach(
      $scope.choices,
      function(options, facet) {
        angular.forEach(
          options,
          function(value, option) {
              if(value) {
                  if(!params[facet]) {
                    params[facet] = []
                  }
                  params[facet].push(option)
              }
          }
          );
      });
    if (Object.keys(params).length) {
      var url = 'http://api.mol.org/0.x/inventory/maps?';
      Object.keys(params).forEach(function(key) {
        url += key + '=' + params[key].join(',') + '&';
      });
      url += 'callback=JSON_CALLBACK';
      $http.jsonp(url).then(function(response) {
       $scope.map.layers.overlays = {
         xyz: {
           name: 'Datasets',
           visible: true,
           url:  response.data.tile_url,
           type: 'xyz',
           doRefresh: true
         }
       };
      });
    } else {
      $scope.map.layers.overlays = {};
    }
  };
  $scope.initialize();
}]);
