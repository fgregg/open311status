var db           = require('../database.js')
  , Ping         = db.models.Ping;
  // , ServicesPing = db.models.ServicesPing
  // , RequestsPing = db.models.RequestsPing;

require('datejs');

var defaultOptions = {
  endDate: new Date()
, startDate: new Date(this.endDate - (14 * 24 * 60 *60 * 1000)) // go back 2 weeks
}

module.exports = function(req, res) {
  Ping.findAll({
    where: ['created_at > ? AND created_at < ?', defaultOptions.startDate, defaultOptions.endDate]
  , order: 'created_at DESC'
  }).complete(function(err, pings) {
    if (err) { console.log(err) }
    res.json(pings);
  })
}