angular.module('mol.facets', [])
  .directive('molFacets', [function() {
    return {
      restrict: 'E',
      templateUrl: '/inventory/assets/views/mol-facets/partials/mol-facets.html',
      scope: {
        facets: '=',
        choices: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('facets', function() {
          scope.resetOptions();
        });
      },
      controller: ['$scope', function($scope) {
        $scope.resetOptions = function() {
          if ($scope.facets) {
            $scope.fields = $scope.facets.fields;
            $scope.rows = $scope.facets.rows;
            $scope.choices = [];
            $scope.options = [];
            $scope.values = [];
            $scope.fields.forEach(function(field, f) {
              $scope.options[f] = [];
              $scope.choices[f] = [];
              $scope.values[f] = {};
            });
            $scope.filterOptions();
          }
        };

        $scope.filterOptions = function(keep_facet_unchanged) {
          var unchanged = keep_facet_unchanged === undefined ? -1 : keep_facet_unchanged;
          var rows = $scope.filterRows();
          var option_keys = [];
          var option_values = [];
          $scope.fields.forEach(function(field, f) {
            option_keys[f] = {};
            option_values[f] = [];
          });
          rows.forEach(function(row) {
            row.forEach(function(column, c) {
              column.forEach(function(datum) {
                if (datum.value && datum.title && !option_keys[c][datum.value]) {
                  option_keys[c][datum.value] = 1;
                  option_values[c].push(datum);
                }
              });
            });
          });
          $scope.fields.forEach(function(field, f) {
            if (f != unchanged) {
              $scope.options[f] = option_values[f].sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
              });
            }
          });
        };

        $scope.filterRows = function() {
          console.log($scope.choices);
          return $scope.rows.filter(function(row) {
            return row.every(function(column, c) {
              if (!$scope.choices[c].length) { return true; }
              return column.some(function(datum) {
                return $scope.choices[c].some(function(choice) { return choice === datum.value });
              });
            });
          });
        };

        $scope.optionClicked = function(facet, selection) {
          if ($scope.values[facet][selection.value]) {
            $scope.choices[facet].push(selection.value);
          } else {
            $scope.choices[facet] = $scope.choices[facet].filter(function(choice) { return choice != selection.value; });
          }
          $scope.filterOptions(facet);
        };

      }]
    };
  }]);
