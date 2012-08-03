var async        = require('async')
  , ce           = require('cloneextend');

require('datejs');

var db           = require('../database.js')
  , Ping         = db.models.Ping
  , ServicesPing = db.models.ServicesPing
  , RequestsPing = db.models.RequestsPing;

var Endpoints = require('../lib/endpoints');
// var defaultOptions = {
//   endDate: new Date()
// , startDate: (new Date()).addDays(-14) // go back 2 weeks
// }

module.exports = function(req, res) {
  var data;
  // Clone the master list of endpoints 
  // so we can append our additional data
  var endpoints = ce.clone(Endpoints);

  // find the most recent ping
  Ping.find({
    order: 'created_at DESC'
  }).complete(function(err, ping) {
    async.parallel({
      servicesPings: function(done) {
        ServicesPing.findAll({
          where: ['ping_id = ?', ping.id]
        , order: 'endpoint ASC'
        }).complete(done);
      }
    , requestsPings: function(done) {
        RequestsPing.findAll({
          where: ['ping_id = ?', ping.id]
        , order: 'endpoint ASC'
        }).complete(done);
      }
    }, function(err, results) {
      data = ping.values;
      data.endpoints = [];

      for (var name in endpoints) {
        endpoints[name].name = name;
        endpoints[name].ping = {};
        endpoints[name].ping.services = findEndpoint(name, results.servicesPings);
        endpoints[name].ping.requests = findEndpoint(name, results.requestsPings);
        data.endpoints.push(endpoints[name])
      }
      res.json(data);
    });
  });
}

function findEndpoint(endpoint, list) {
  var i;

  for(i = 0; i < list.length; i++) {
    if(list[i].endpoint === endpoint) {
      return list[i];
    }
  }
}