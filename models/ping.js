// var request  = require('request')
//   , async    = require('async')
//   , parser   = require('xml2json')
//   , open311  = require('../lib/open311.js');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("pings", {
    servicesping_count  : DataTypes.INTEGER
  , servicesping_timer  : DataTypes.INTEGER // in milliseconds
  , requestsping_count  : DataTypes.INTEGER
  , requestsping_timer  : DataTypes.INTEGER // in milliseconds
  , created_at          : DataTypes.DATE // every X minutes
  , requested_at        : DataTypes.DATE // true time of request
  }, {
    underscored     : true
  , timestamps      : false
  , freezeTableName : true
  , omitNull        : true
  });
}