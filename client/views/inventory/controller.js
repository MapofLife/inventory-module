var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http', '$filter', 'MOLApi',
    function($scope, leafletData, $timeout, $window, $http, $filter, MOLApi) {

  $scope.choices = {};
  $scope.ready = false;

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
    $scope.$watchCollection('choices', function() {
      $scope.inventoryQuery();
    });

    MOLApi('inventory/datasets').then(function(response) {
      $scope.facets = response.data;
      $scope.ready = true;
    });
  };

  $scope.inventoryQuery = function() {
    var url = 'http://dev.api-0-x.map-of-life.appspot.com/0.x/inventory/maps?';
    var yes = false;
    angular.forEach($scope.choices, function(options, facet) {
      if (options.length) {
        url += facet + '=' + options.join(',') + '&';
        yes = true;
      }
    });
    if (yes) {
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
    } else if ($scope.map.layers.overlays) {
      $scope.map.layers.overlays = {};
    }
  };

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
