var _ = require('underscore');

var jobs = [];
var numbers = _.range(30);

numbers.forEach(function(number) {
  jobs.push({
    fn: function() {
      return Math.pow(number, 2);
    }
  });
});

console.log(jobs);
