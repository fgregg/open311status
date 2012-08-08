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

    initialize: function(model, options) {
      this.model.on("change", this.render, this);
    },
    beforeRender: function(manage) {
      console.log('before render');
    },
    afterRender: function(manage) {
      console.log('after render');
      // jQuery Plugin
      // this.$(".services-info").tooltip({title: "hello world"});    
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
    afterRender: function() {
      console.log('after list render');
    },
    initialize: function() {
      this.collection.on("reset", this.render, this);
    },
  });

  return Endpoint;

});