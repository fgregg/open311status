var db           = require('../database.js')
  , Ping         = db.models.Ping;
  // , ServicesPing = db.models.ServicesPing
  // , RequestsPing = db.models.RequestsPing;

require('datejs');

var options = {
  endDate: new Date()
, startDate: (new Date()).addDays(-14) // go back 2 weeks
}

module.exports = function(req, res) {
  Ping.findAll({
    where: ['created_at > ? AND created_at < ?', options.startDate, options.endDate]
  , order: 'created_at DESC'
  }).complete(function(err, pings) {
    if (err) { console.log(err) }
    res.json(pings);
  })
}