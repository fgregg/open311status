define([
  // Global application context.
  "app",

  // Third-party libraries.
  "backbone"
],

function(app, Backbone, Repo) {

  var Endpoint = app.module();

  Endpoint.Collection = Backbone.Collection.extend({
    url: function() {
      return "/api/status";
    },

    cache: false,

    parse: function(obj) {
      return obj.endpoints;
    },

    initialize: function(models, options) {
      this.fetch();
    }
  });

  Endpoint.Views.Item = Backbone.View.extend({
    template: "endpoint/item",

    tagName: "tr",

    serialize: function() {
      return { model: this.model };
    },

    afterRender: function() {
      this.servicesTooltip();
      this.responsesTooltip();
    },
    
    servicesTooltip: function() {
      var tooltip = "Server response: " + this.model.get('ping').services.response_time + 'ms';
      this.$(".services-info").tooltip({title: tooltip});    
    },
    
    responsesTooltip: function() {
      console.log(this.model.attributes);
      var tooltip = "Server response: " + this.model.get('ping').requests.response_time + 'ms';
      this.$(".requests-info").tooltip({title: tooltip});    
    },
    
  });

  Endpoint.Views.List = Backbone.View.extend({   
    template: "endpoint/list",

    serialize: function() {
      return { collection: this.collection };
    },

    beforeRender: function(manage) {
      this.collection.each(function(endpoint) {
        this.insertView("tbody", new Endpoint.Views.Item({
          model: endpoint
        }));
      }, this);
    },

    initialize: function() {
      this.collection.on("reset", this.render, this);
    }
  });

  return Endpoint;

});