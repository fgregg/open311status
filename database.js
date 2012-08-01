var Sequelize = require("sequelize")
  , url       = require('url');

var db = url.parse(process.env.PG_URL);

var options = {
    host: db.hostname || 'localhost'
  , port: db.port || 5432
  , dialect  : 'postgres'
  , omitNull : true
  }

if (process.env.NODE_ENV == 'production') {
  options.logging = false
}

var sequelize = new Sequelize(
  db.pathname.slice(1)              // database
, (db.auth.split(':'))[0]           // username
, (db.auth.split(':'))[1] || ''     // password
, options
);

/** Load the models **/
sequelize.models = {};

var Ping = sequelize.import(__dirname + "/models/ping.js");
sequelize.models.Ping = Ping;

var ServicesPing = sequelize.import(__dirname + "/models/servicesping.js");
sequelize.models.ServicesPing = ServicesPing;

var RequestsPing = sequelize.import(__dirname + "/models/requestsping.js");
sequelize.models.RequestsPing = RequestsPing;

// Relations
Ping.hasMany(ServicesPing, {as: 'Services', foreignKey: 'ping_id'})
    .hasMany(RequestsPing, {as: 'Requests', foreignKey: 'ping_id'});

// required to deal with this issue:
// https://github.com/sdepold/sequelize/issues/177
sequelize.sync();

module.exports = sequelize;