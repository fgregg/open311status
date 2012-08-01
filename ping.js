var pingedAt = new Date();

var async        = require('async');

var db           = require('./database.js')
  , ServicesPing = db.models.ServicesPing
  , RequestsPing = db.models.RequestsPing;  ;

var Endpoints = require('./lib/endpoints')
  , endpoints = []
  , endpoint  = {};

for(var name in Endpoints) {
  endpoint = Endpoints[name];
  endpoint.name = name;
  endpoints.push(endpoint)
}

var options = {
  createdAt: pingedAt
}

async.parallel({
    ServicesPing: function(done) {
      ServicesPing.pingAll(endpoints, options, function(err, endpoints) {
        var timer = new Date().getTime() - pingedAt.getTime();
        console.log('Pinged /services method of', endpoints.length, 'endpoints in', (timer/1000) ,'seconds');
        done();
      });
    }
  , RequestsPing: function(done) {
      RequestsPing.pingAll(endpoints, options, function(err, endpoints) {
        var timer = new Date().getTime() - pingedAt.getTime();
        console.log('Pinged /requests method of', endpoints.length, 'endpoints in', (timer/1000) ,'seconds');
        done();
      });
    }  
  }
, function(err) {
    // Done!
    process.exit();
  }
);





// Kill our process if goes too long
var MAXTIME = 120000; // 2 minutes
setTimeout(
  function(){ 
    console.log('Killed collector for running longer than', MAXTIME/1000, 'seconds!');
    process.exit();
  }
, MAXTIME); // kill var db   = require('./database.js')