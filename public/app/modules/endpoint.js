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
      // if (options) {
      //   this.city = options.city;
      // }
      this.fetch();
    }
  });

  Endpoint.Views.Item = Backbone.View.extend({
    template: "endpoint/item",

    tagName: "tr",

    serialize: function() {
      console.log(this.model);
      return { model: this.model };
    },

    events: {
      click: "changeEndpoint",
      "mouseenter .services-info" : "showServicesPop", 
      "mouseleave .services-info" : "hidePop",
      "mouseenter .requests-info" : "showRequestsPop", 
      "mouseleave .requests-info" : "hidePop"    
    },

    changeEndpoint: function(ev) {
      var city = this.model.get('name');

      app.router.go("city", city);
    },

    showServicesPop : function() {
      this.$(".services-info").popover({title: 'Hello', content: 'World'});    
      this.$(".services-info").popover('show');        
    },
    showRequestsPop : function() {
      this.$(".requests-info").popover({title: 'Hello', content: 'World'});    
      this.$(".requests-info").popover('show');        
    },
    hidePop : function() {
      this.$(".info").popover('hide');
      this.$(".info").popover('hide');   
    },

    initialize: function() {
      this.model.on("change", this.render, this);
    }
  });

  Endpoint.Views.List = Backbone.View.extend({
    template: "endpoint/list",

    serialize: function() {
      return { collection: this.collection };
    },

    render: function(manage) {
      this.collection.each(function(endpoint) {
        this.insertView("tbody", new Endpoint.Views.Item({
          model: endpoint
        }));
      }, this);

      return manage(this).render();
    },

    initialize: function() {
      this.collection.on("reset", this.render, this);

      this.collection.on("fetch", function() {
        this.$("ul").parent().html("<img src='/assets/img/spinner-gray.gif'>");
      }, this);
    }

  });

  return Endpoint;

});