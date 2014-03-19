#!/usr/bin/env node

var dgram = require('dgram');

var host = process.argv[2];
var port = parseInt(process.argv[3], 10);
var client = dgram.createSocket('udp4');

process.stdin.resume();

process.stdin.on('data', function(data) {
    client.send(data, 0, data.length, port, host);
});

client.on('message', function(message) {
    console.log('got message back: ', message.toString());
});

console.log('start typing to send msg to %s:%s', host, port);


