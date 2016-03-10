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

module.filter('unique', function() {
  return function(values) {
    return values.sort().filter(function(value, j, self) {
      return self.indexOf(value) === j && value.trim();
    });
  };
});


// TODO: These two filters will get rolled into a directive

module.filter('filterRows', function() {
  return function(rows, choices) {
    return rows.filter(function(row) {
      return row.every(function(column, c) {
        return column.some(function(datum) {
          return !choices[c] || choices[c] == datum.title;
        });
      });
    });
  };
});

module.filter('getOptions', function() {
  return function(rows) {
    var options = [];
    rows[0].forEach(function(column, c) { options[c] = []; });
    rows.forEach(function(row) {
      row.forEach(function(column, c) {
        var titles = [];
        column.forEach(function(datum) { titles.push(datum.title); });
        options[c].push(titles.join(', '));
      });
    });
    return options;
  };
});
