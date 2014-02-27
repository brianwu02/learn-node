var TwitterStream = require('./twitterEventStreaming');
var util = require('util');

var twitter = new TwitterStream({
    username: 'bwu01dev',
    password: 'lagsuckso929',
    track: 'JavaScript',
});

twitter.on('tweet', function(tweet) {
    utils.put(util.inspect(tweet));
});

twitter.on('error', function(e) {
    util.puts(e);
});

twitter.getTweets();
