var module = angular.module('mol.inventory');

module.filter('trustUrl', function($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});

module.filter('unsafe', function($sce) {
  return function(str) {
    return $sce.trustAsHtml(str);
  };
});
