var express         = require('express')
  , app             = module.exports = express.createServer()
  , io              = require('socket.io').listen(app);
  
var PORT = process.env.PORT || 3000;

/** Set up the Database **/
var db           = require('./database.js')
  , Ping         = db.models.Ping
  , ServicesPing = db.models.ServicesPing
  , RequestsPing = db.models.RequestsPing;


/** Express Configuration **/
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
  io.set('log level', 1); // reduce logging
});

/** Routes **/
app.get('/', require('./routes/index'));
app.get('/api/health', require('./routes/health'));
app.get('/api/status', require('./routes/status'));


// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  socket.emit('info', { hello: 'world' });
});

app.listen(PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});