var util = require('util');
var http = require('http');
var events = require('events');
/* We're extending the prototype of our Twitter object that we created
 * and adding a method to start the stream of tweeets coming in.
 * We set up an object detailing the host, port, path, and method
 * as well as custom headers notably 'keep-alive' and 'Basic Auth'.
 * This is passed to an http.request() call and we then write our
 * tracking data and end the connection.
 *
 * The Twitter API dictates that a tweet object will end on the two
 * characters '\r' and '\n'. so we walk the JSON string as they come
 * in and seperate them out. if JSON is sucessfully pulled out, we 
 * emit a 'tweet' event and pass it the parsed JSON data. otherwise,
 * error.
 */
var TwitterStream = function(opts) {
    this.username = opts.username;
    this.password = opts.password;
    this.track = opts.track;
    this.data = '';
};

TwitterStream.prototype = new events.EventEmitter();
module.exports = TwitterStream;

TwitterStream.prototype.getTweets = function() {
    var opts = {
        host: 'stream.twitter.com',
        port: 80,
        path: '/1/statuses/filter.json?track=' + this.track,
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'User-Agent': 'Example Twitter Streaming Client',
            'Authorization': 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64'),
        },
    },
    self = this;
    
    this.connection = http.request(opts, function(response) {
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
            self.data += chunk.toString('utf8');

            var index, json;

            while((index = self.data.indexOf('\r\n')) > -1) {
                json = self.data.slice(0, index);
                self.data = self.data.slice(index + 2);
                if (json.length > 0) {
                    try {
                        self.emit('tweet', JSON.parse(json));
                    } catch (e) {
                        self.emit('error', e);
                    }
                }
            }
        });
    });
    
    this.connection.write('?track=' + this.track);
    this.connection.end();
};
