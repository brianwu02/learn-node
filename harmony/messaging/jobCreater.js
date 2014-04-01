var _ = require('underscore');
var async = require('async');

var jobs = [];
var numbers = _.range(1000);

var seriesJobs = [];
var seriesNumbers = _.range(30);

/*  builds function from numbers range which when executed returns the square root.
 *  pushes each function on to jobs queue
 *  execute all functions in parallel
 */


seriesNumbers.forEach(function(data) {
  seriesJobs.push(function() {
    return Math.pow(data, 2);
  });
});

seriesJobs.forEach(function(fn) {
  console.log(fn());
});


numbers.forEach(function(data) {
  jobs.push(function(callback) {
    callback(null, Math.pow(data, 2));
  });
});


async.parallel(jobs, function(err, results) {
  if (err) {
    console.log(err);
  }
  console.log(results);
});

