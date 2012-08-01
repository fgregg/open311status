var Endpoints = require('../lib/endpoints');

module.exports = function(req, res) {
  res.json(Endpoints);
}