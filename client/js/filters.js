angular.module('mol.inventory')
  .filter('trustUrl', function($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  })
  .filter('unsafe', function($sce) {
    return function(str) {
      return $sce.trustAsHtml(str);
    };
  });
