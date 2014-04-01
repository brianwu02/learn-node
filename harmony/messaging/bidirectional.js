/*  TODO:
 *  ---WORKFLOW---
 *  Master process will creates a (30) series of jobs and push on to a job queue.
 *  job: return the square of the number.
 *  
 *
 *  ---DESIGN---
 *  MASTER process should:
 *      - Create a PUSH socket and bind it to an IPC endpoint - this socket
 *      will for sending jobs to the worker.
 *      
 *      - Create a PULL socket and bind to a different IPC endpoint - this socket
 *      will recieve messages from workers
 *      
 *      -Keep a count of ready workers, initialized to 0.
 *
 *      - LISTEN for messages on the PULL socket, and
 *          -If the message is a READY message, increment the ready counter, or
 *          -If the message is a result message, output it to the console.
 *
 *      - Spin up three worker processes
 *
 *      - When ready counter === 3, send 30 job messages out through PUSH socket.
 *
 *  WORKER process should:
 *      -Create a PULL socket and connect it to the master's PUSH endpoint.
 *      
 *      -Create a PUSH socket and connect it to the master's PULL endpoint.
 *
 *      -Listen for messages on the PULL socket, and
 *          -treat this as a job and respond by sending a result message out 
 *          on to the PUSH socket.
 *
 *      - send a READY message out on the PUSH socket.
 *
 *  Result messages should include processID of worker. 
 */
var cluster = require('cluster');
var fs = require('fs');
var zmq = require('zmq');
var _ = require('underscore');
var async = require('async');

if (cluster.isMaster) {
  // the job queue.
  var jobs = [];

  // create a series of numbers to be squared.
  var numbers = _.range(30);

  var jobSent = false;

  // initialize ready count that tracks workers.
  var workerReady = 0;
  // create a PUSH socket and bind to IPC endpoint. 
  masterPushSocket = zmq.socket('push').bind('ipc://masterPushSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });

  // create a PULL socket and bind to an IPC endpoint.
  masterPullSocket = zmq.socket('pull').bind('ipc://masterPullSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });

  // listen for messages on PULL socket
  masterPullSocket.on('message', function(data) {
    var msg = JSON.parse(data);
    //console.log('got a READY status from: ' + msg.pid);
    
    if (msg.status == 'READY') {
      workerReady += 1;
      console.log('workerReady Count: ' + workerReady);

      if (workerReady == 3) {
        console.log('All Subscribers are connected, Ready for work.');
        numbers.forEach(function(number) {
          masterPushSocket.send(JSON.stringify({
            job: number 
          }));
        });
      }

    } else if ( msg.status == 'RESULT') {
      console.log('pid: ' + msg.pid + ' sent result: ' + msg.result);
    }
  });

  // spin up three worker processes.
  for (var i = 0; i < 3; i++) {
    cluster.fork();
  }

} else {
  //Create a PULL socket and connect it to the master's PUSH endpoint.
  var workerPullSocket = zmq.socket('pull').connect('ipc://masterPushSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });

  //Create a PUSH socket and connect it to the master's PULL endpoint.
  var workerPushSocket = zmq.socket('push').connect('ipc://masterPullSocket.ipc', function(err) {
    if (err) {
      console.log(err.message);
    }
  });

  //Listen for messages on the PULL socket, and treat this as a job and respond by sending a result message out on to the PUSH socket.
  workerPullSocket.on('message', function(data) {
    // parse the message
    var msg = JSON.parse(data);

    workerPushSocket.send(JSON.stringify({
      status: 'RESULT',
      result: Math.pow(msg.job, 2),
      pid: process.pid
    }));
  });

  // send a READY message to master process
  workerPushSocket.send(JSON.stringify({
    status: 'READY',
    pid: process.pid
  }));


}
