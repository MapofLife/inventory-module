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

  $scope.clearFacet = function(facet) {
    delete $scope.choices[facet];
  }

  $scope.getColumn = function(col) {
    return function(row) {
      try {return row[col]} catch(e){};
    }
  }

  /*
   * Checks a dataset in the table to see if it passes all
   * select selected facet filters
   */
  $scope.applyFilters = function(choices, col, fields) {
    return function(dataset) {
        var pass=0,i=0,c=0;
        //If filters have been made...
        if(Object.keys(choices).reduce(function(prev,cur){return +(Object.keys(choices[cur]).reduce(function(p,c){return +((choices[cur][c]===true)?1:0)+p;},0))+prev},0)) {
          //Go through each facet type to see if the dataset passes the filter
          for(i=0;i<dataset.length;i++) {
            for(c=0;c<dataset[i].length;c++) {
              if(col==i) {
                pass |= (1 << (i));
                break;
              } else {
                if(choices[fields[i].value]) {
                  if(choices[fields[i].value][dataset[i][c].value]===true) {
                     pass |= (1 << (i)); //toggle that bit on
                     break;
                  }
                } else {
                  pass |= (1 << (i));
                  break;
                }
             }
            }
          }
        } else {
          pass = parseInt('1'.repeat(dataset.length),2);
        }
        return (parseInt('1'.repeat(dataset.length),2)===pass);
    }
  }


  $scope.initialize();
}]);
