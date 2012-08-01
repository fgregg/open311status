var request  = require('request')
  , async    = require('async')
  , parser   = require('xml2json')
  , open311  = require('../lib/open311.js');
require('datejs');


module.exports = function(sequelize, DataTypes) {
  return sequelize.define("requests_pings", {
    endpoint       : DataTypes.STRING
  , status_code    : DataTypes.INTEGER
  , response_time  : DataTypes.INTEGER
  , requests_count : DataTypes.INTEGER
  , created_at     : DataTypes.DATE // every X minutes
  , requested_at   : DataTypes.DATE // true time of request
  }, {
    underscored     : true
  , timestamps      : false
  , freezeTableName : true
  , omitNull        : true
  , classMethods: {
      pingOne: pingOne
    , pingAll: pingAll
    }
  });
}

var pingOne = function(endpoint, options, callback) {
  var self          = this
    , statusCode    = null
    , responseTime  = 0
    , requestsCount = 0
    , createdAt     = options.createdAt || new Date()
    , everyMin      = options.everyMin || 10;

  // Search previous HOUR
  var params = {
     start_date: new Date(createdAt - (everyMin * 60 * 1000)).toISOString()
   , end_date: createdAt.toISOString()
  };
  var url = open311.formatUrl(endpoint, 'requests', params);

  var reqOptions = {
    url: url
  , timeout: options.timeout || 30000 // wait 30 seconds or timeout
  };

  // start a timer
  var requestedAt = new Date();
  request.get(reqOptions, function (err, res, body) {
    responseTime = new Date().getTime() - requestedAt.getTime();
    if (!err) {
      statusCode = res.statusCode;
      if (res.statusCode == 200) {
        if (endpoint.format == 'xml') {
          try {
            var requestsBody= parser.toJson(body, {object: true});    
            if (requestsBody.service_requests.request) {
              // if no service requests, '.services' doesn't exist
              requestsCount = requestsBody.service_requests.request.length;
              serviceRequests = requestsBody.service_requests.request;
            }
          }
          catch(err) {
            console.log('Could not parse /requests.xml for ' + endpoint.name + ' (' + url + '); ' + err);
            //console.log(body);
          }
        }
        else { // format != XML, e.g. format == JSON
          try {
            var requestsBody = JSON.parse(body);
            requestsCount = requestsBody.length;
          }
          catch(err) {
            console.log('Could not parse /requests.json for ' + endpoint.name + ' (' + url + '); ' + err);
            //console.log(body);
          }
        }
      }
    }
    else {
      if (err.code == 'ETIMEDOUT') {
        statusCode = 0; // timed out the request
      }
    }
    // Save it
    self.create({
      ping_id        : options.ping_id || null
    , endpoint       : endpoint.name
    , status_code    : statusCode
    , response_time  : responseTime
    , requests_count : requestsCount
    , created_at     : createdAt
    , requested_at   : requestedAt
    }).success( function(servicesPing) {
      callback(null, servicesPing);
    })
  });
}

var pingAll = function(endpoints, options, callback) {
  var self = this;

  async.forEach(
    endpoints
  , function(endpoint, done) {
      setTimeout(
        function(){
          self.pingOne(endpoint, options, function(err, requestsPing){
            if (err) { console.log(err) };
            endpoint.requestsPing = requestsPing 
            done();
          });
        }
      , Math.floor( (Math.random() * 50)) // Choose a random 1-50ms delay to prevent overloading
      );
    }
  , function(err){
    callback(err, endpoints);
  })
}
