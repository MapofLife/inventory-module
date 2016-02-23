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
      $scope.fields.forEach(function(field, f) {
        $scope.options[f] = [];
        $scope.choices[f] = '';
      });
      response.data.rows.forEach(function(row, r) {
        var new_row = { filters: [], titles: [], values: [], row: row };
        $scope.fields.forEach(function(field, f) {
          new_row.titles[f] = [];
          new_row.values[f] = [];
          row[f].forEach(function(cell, c) {
            new_row.titles[f].push(cell.title);
            new_row.values[f].push(cell.value);
          });
          new_row.filters[f] = new_row.titles[f].join(', ');
          $scope.rows.push(new_row);
        });
      });
      $scope.filterOptions();
    });
  };

  $scope.filterOptions = function() {
    var options = [];
    $scope.fields.forEach(function(field, f) { options[f] = []; });
    $scope.rows.filter(function(row, r) {
      var keep = true;
      row.filters.forEach(function(filter, f) {
        keep = keep && (!$scope.choices[f] || $scope.choices[f] == filter);
      });
      return keep;
    }).forEach(function(row, r) {
      row.filters.forEach(function(filter, f) {
        options[f].push(filter);
      });
    });
    options.forEach(function(opts, i) {
      $scope.options[i] = options[i].sort().filter(function(option, j, self) {
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
