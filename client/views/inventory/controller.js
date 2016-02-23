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
      $scope.fields.forEach(function(field, f) { $scope.choices[f] = ''; });
      $scope.filterOptions();
    });
  };

  $scope.filterOptions = function() {
    $scope.fields.forEach(function(field, f) { $scope.options[f] = []; });
    $scope.rows.filter(function(row) {
      return row.every(function(column, c) {
        return column.some(function(datum) {
          return !$scope.choices[c] || $scope.choices[c] == datum.title;
        });
      });
    }).forEach(function(row) {
      row.forEach(function(column, c) {
        var titles = [];
        column.forEach(function(datum) { titles.push(datum.title); });
        $scope.options[c].push(titles.join(', '));
      });
    });
    $scope.options.forEach(function(opts, i) {
      $scope.options[i] = $scope.options[i].sort().filter(function(option, j, self) {
        return self.indexOf(option) === j && option.trim();
      });
    });
    console.log($scope.options);
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
