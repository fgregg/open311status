var sinon = require('sinon')
  , request = require('request')
  , fs = require('fs');

var db  = require('../database.js')
  , ServicesPing = db.models.ServicesPing;

describe('ServicesPing Model', function() {
  describe(".pingOne()", function() {
    var endpoint = {
      "name": "bloomington"
    , "endpoint": "https://bloomington.in.gov/crm/open311/v2/"
    };
    var options = { 
      createdAt: new Date() 
    , timeout: 10
    };
    
    var servicesPing;
    var stubSave;

    before( function(done) {
      // Stub the Model.create / save function
      stubSave = sinon.stub(ServicesPing, 'create');
      stubSave.returns({ success: function(callback){ callback({}) } });

      // Stub the URL request
      // sinon.stub(request, 'get', function(reqOptions, callback) {
      //   callback(null, { statusCode: 200 }, fs.readFileSync('./test/mocks/bloomington_services.json'));
      // });
      done();
    });

    afterEach(function(done) {
      // clean up our stubs
      stubSave.restore();
      done();
    });

    describe('Simple situation', function() {
      var servicesPing;

      before(function(done) {
        ServicesPing.pingOne(endpoint, options, function(err, ping) {
          console.log(stubSave);
          servicesPing = stubSave.args[0][0];
          done();
        });
      });

      it("should have the proper endpoint name", function(done) {
        servicesPing.endpoint.should.equal('bloomington');
        done();
      });
    });
  });
});