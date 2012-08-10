define([
  // Application.
  "app",

  // Modules.
  "modules/endpoint",
],

function(app, Endpoint) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      // Use the main layout.
      app.useLayout("main").render();
    },

    initialize: function() {
      app.useLayout("main");

      // Set up the users.
      this.endpoints = new Endpoint.Collection();
            
      app.layout.setViews({
        "#navbar": new Backbone.View({
          template: 'navbar/navbar'
        }),
        "#status": new Endpoint.Views.Meta({
          collection: this.endpoints
        }),
        "#endpoints": new Endpoint.Views.List({
          collection: this.endpoints
        }),
      });
    }

  });

  return Router;

});
