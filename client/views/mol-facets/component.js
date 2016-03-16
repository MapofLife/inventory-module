angular.module('mol.facets', [])
  .directive('molFacets', [function() {
    return {
      restrict: 'E',
      templateUrl: 'static/views/mol-facets/partials/mol-facets.html',
      scope: {
        facets: '=',
        choices: '='
      },
      controller: ['$scope', function($scope) {
        $scope.getColumn = function(col) {
          return function(row) {
            return row[col];
          }
        }
      }]
    };
  }]);
