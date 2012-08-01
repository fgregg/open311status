var pingedAt = new Date();
var EVERYMIN = 10; // pings happen every X minutes

var async        = require('async');

var db           = require('./database.js')
  , Ping         = db.models.Ping
  , ServicesPing = db.models.ServicesPing
  , RequestsPing = db.models.RequestsPing
  , ping; // to hold this ping's ping

var Endpoints = require('./lib/endpoints')
  , endpoints = []
  , endpoint  = {};

for(var name in Endpoints) {
  endpoint = Endpoints[name];
  endpoint.name = name;
  endpoints.push(endpoint)
}

// round pingedAt to nearest EVERYMIN
var pingedAtRound = new Date(pingedAt.getFullYear(), pingedAt.getMonth(), pingedAt.getDate()
  , pingedAt.getHours(), ((Math.round(pingedAt.getMinutes()/EVERYMIN) * EVERYMIN) % 61));
 // we have to use % 61 to make sure that dates round up to the follow hour (a possible WTF)

var options = {
  createdAt: pingedAtRound
, everyMin: EVERYMIN
};

Ping.create({
  created_at   : pingedAtRound // every X minutes
, requested_at : pingedAt// true time of request
}).complete(function(err, ping) {
  options.ping_id = ping.id; // store in options to associate all further pings

  async.parallel({
    servicesPings: function(done) {
      ServicesPing.pingAll(endpoints, options, function(err, endpoints) {
        // console.log('Pinged /services method of', endpoints.length, 'endpoints in', (timer/1000) ,'seconds');
        done(null, {
          timer: new Date().getTime() - pingedAt.getTime()
        , endpoints: endpoints
        });
      });
    }
  , requestsPings: function(done) {
      RequestsPing.pingAll(endpoints, options, function(err, endpoints) {
        //console.log('Pinged /requests method of', endpoints.length, 'endpoints in', (timer/1000) ,'seconds');
        done(null, {
          timer: new Date().getTime() - pingedAt.getTime()
        , endpoints: endpoints
        });
      });
    }  
  }
  , function(err, results) {
      ping.servicesping_count = results.servicesPings.endpoints.length;
      ping.servicesping_timer = results.servicesPings.timer;
      ping.requestsping_count = results.requestsPings.endpoints.length;
      ping.requestsping_timer = results.requestsPings.timer;
      ping.save().success(function(ping){
        process.exit();
      });
    }
  );  
});

// Kill our process if goes too long
var MAXTIME = 300000; // 5 minutes
setTimeout(
  function(){ 
    console.log('Killed collector for running longer than', MAXTIME/1000, 'seconds!');
    process.exit();
  }
, MAXTIME); // kill var db   = require('./database.js')