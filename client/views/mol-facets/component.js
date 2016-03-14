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
            $scope.choices = {};
            $scope.options = [];
            $scope.values = [];
            $scope.fields.forEach(function(field, f) {
              $scope.options[f] = [];
              $scope.values[f] = {};
              $scope.choices[field.value] = [];
            });
            $scope.filterOptions();
          }
        };

        $scope.filterOptions = function() {
          $scope.fields.forEach(function(field, f) {
            var options = $scope.allValues($scope.rows, f);
            options = $scope.sortObjects(options, 'value');
            options = $scope.filterDuplicates(options, 'value');
            $scope.options[f] = options;
          });
        }

        $scope.allValues = function(rows, column) {
          var all = [];
          rows.forEach(function(row) {
            row[column].forEach(function(datum) { all.push(datum); });
          });
          return all;
        };

        $scope.sortObjects = function(objects, field) {
          return objects.sort(function(a, b) {
            return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
          });
        };

        $scope.filterDuplicates = function(objects, field) {
          var seen = {},
              unique = [];
          objects.forEach(function(obj) {
            if (! seen[obj[field]]) {
              seen[obj[field]] = 1;
              unique.push(obj);
            }
          });
          return unique;
        };

        /*
        $scope.filterRows = function() {
          return $scope.rows.filter(function(row) {
            return row.every(function(column, c) {
              if (!$scope.choices[c].length) { return true; }
              return column.some(function(datum) {
                return $scope.choices[c].some(function(choice) { return choice === datum.value });
              });
            });
          });
        };
        */

        $scope.optionClicked = function(facet, selection) {
          var column = $scope.fields[facet].value;
          if ($scope.values[facet][selection.value]) {
            // Force a trigger of a $watchCollection event for consumer
            $scope.choices[column] = $scope.choices[column].concat(selection.value);
          } else {
            $scope.choices[column] = $scope.choices[column].filter(function(choice) { return choice != selection.value; });
          }
          // $scope.filterOptions(facet);
        };

        $scope.clearClicked = function(event, facet) {
          var column = $scope.fields[facet].value;
          $scope.choices[column] = [];
          $scope.values[facet] = {};
          event.preventDefault();
          event.stopPropagation();
        };

      }]
    };
  }]);
