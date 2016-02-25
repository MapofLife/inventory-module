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
      $scope.rows = response.data.rows;
      $scope.fields = response.data.fields;
      $scope.fields.forEach(function(field, f) {
        $scope.options[f] = [];
        $scope.choices[f] = '';
      });
      $scope.filterOptions();
    });
  };

  $scope.filterOptions = function() {
    var rows = $filter('filterRows')($scope.rows, $scope.choices);
    $scope.options = $filter('getOptions')(rows);
    $scope.options.forEach(function(opts, i) {
      $scope.options[i] = $filter('unique')($scope.options[i]);
    });
    $scope.inventoryQuery();
  };

  $scope.inventoryQuery = function() {
    var params = {};
    $scope.choices.forEach(function(choice, c) {
      var terms = [];
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
      MOLApi('inventory/maps', params, 'POST').then(function(response) {
        console.log(response);
      });
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
