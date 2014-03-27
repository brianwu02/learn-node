var events = require('events');
var util = require('util');

LDJClient = function(stream) {
  events.EventEmitter.call(this);

  var self = this;
  buffer = '';
  stream.on('data', function(data) {
    buffer += data;
    var boundary = buffer.indexOf('\n');
    while (boundary !== -1) {
      var input = buffer.substr(0, boundary);
      buffer = buffer.substr(boundary + 1);
      self.emit('message', JSON.parse(input));
      boundary = buffer.indexOf('\n');
    }
  });
};

util.inherits(LDJClient, events.EventEmitter);

exports.LDJClient = LDJClient;
exports.connect = function(stream) {
  return new LDJClient(stream);
};

