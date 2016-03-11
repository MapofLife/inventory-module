var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http', '$filter', 'MOLApi',
    function($scope, leafletData, $timeout, $window, $http, $filter, MOLApi) {

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
    MOLApi('inventory/datasets').then(function(response) {
      $scope.facets = response.data;
    });
  };

  $scope.inventoryQuery = function() {
    var params = {};
    $scope.choices.forEach(function(choice, c) {
      var terms = [];
      var rows = $filter('filterRows')($scope.rows, $scope.choices);
      if (choice) {
        $scope.rows.forEach(function(row) {
          var titles = [];
          var values = [];
          row[c].forEach(function(datum) {
            titles.push(datum.title);
            values.push(datum.value);
          });
          if (titles.join(', ') == choice) {
            terms = terms.concat(values);
          }
        });
        params[$scope.fields[c].value] = $filter('unique')(terms);
      }
    });
    if (Object.keys(params).length) {
      var url = 'http://dev.api-0-x.map-of-life.appspot.com/0.x/inventory/maps?';
      Object.keys(params).forEach(function(key) {
        url += key + '=' + params[key].join(',') + '&';
      });
      url += 'callback=JSON_CALLBACK';
      $http.jsonp(url).then(function(response) {
       console.log(response.data.tile_url);
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
      $scope.map.layers.overlays.xyz = undefined;
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
