var redis = require('redis');
var client = redis.createClient();

client.on('error', function(err) {
  console.log('Error ' + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest1", "some value", redis.print);
