var request  = require('request')
  , async    = require('async')
  , parser   = require('xml2json')
  , open311  = require('../lib/open311.js');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("services_pings", {
    endpoint       : DataTypes.STRING
  , status_code    : DataTypes.INTEGER
  , response_time  : DataTypes.INTEGER
  , services_count : DataTypes.INTEGER
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
  var self            = this
    , url             = open311.formatUrl(endpoint, 'services')
    , statusCode      = null
    , responseTime    = 0
    , servicesCount   = 0
    , createdAt       = options.createdAt || new Date()
    , serviceRequests = [];

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
            var servicesBody = parser.toJson(body, {object: true});
            servicesCount = servicesBody.services.service.length;
          }
          catch(err) {
            console.log('Could not parse Services XML for ' + endpoint.name + ' (' + url + '); ' + err);
            //console.log(body);
          }
        }
        else { // format != XML, e.g. format == JSON
          try {
            var servicesBody = JSON.parse(body);
            servicesCount = servicesBody.length;
          }
          catch(err) {
            console.log('Could not parse Services JSON for ' + endpoint.name + ' (' + url + '); ' + err);
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
    , services_count : servicesCount
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
          self.pingOne(endpoint, options, function(err, servicesPing){
            if (err) { console.log(err) };
            endpoint.servicesPing = servicesPing 
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
