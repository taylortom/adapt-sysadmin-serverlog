// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Backbone = require('backbone');
  var Origin = require('core/origin');
  var LogCollection = require('./collections/logCollection.js');
  var ServerLogView = require('./views/serverLogView.js');
  var ServerLogSidebarView = require('./views/serverLogSidebarView.js');

  var CLASSNAME = 'serverLog';
  var FEATURE_PERMISSIONS = ["*/*:create","*/*:read","*/*:update","*/*:delete"];

  Origin.on('origin:dataReady login:changed', function() {
    Origin.permissions.addRoute(CLASSNAME, FEATURE_PERMISSIONS);
  });

  Origin.on('systemInfoSidebar:postRender', function(view) {
    if (Origin.permissions.hasPermissions(FEATURE_PERMISSIONS)) {
      Origin.trigger('systemInfoSidebar:addButton', {
        name: CLASSNAME,
        title: Origin.l10n.t('app.serverlog'),
        event: CLASSNAME + ":open"
      });
    }
  });

  Origin.on(CLASSNAME + ':open', function() {
    // bypass the router, as we're not treating these as different pages
    Origin.trigger('location:title:update', { title: Origin.l10n.t('app.serverlog') });
    (new LogCollection()).fetch({
      success: function(logs) {
        Origin.contentPane.setView(ServerLogView, { model: new Backbone.Model({ logs: logs }) });
      }
    });
  });
});
