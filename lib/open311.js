var querystring = require('querystring');

exports.formatUrl = function formatUrl(endpoint, method, params) {
  var url    = ''
    , format = endpoint.format || 'json';
  
  params = params || {};
  
  if(endpoint.jurisdiction) {
    params.jurisdiction_id = endpoint.jurisdiction;
  }
  
  // add a trailing slash
  if (endpoint.endpoint.slice(-1) !== '/') {
    url = endpoint.endpoint + '/';
  }
  else {
    url = endpoint.endpoint;
  }
  
  url =  url + method + "." + format;
  
  if (!isEmpty(params)) {
    url += "?" + querystring.stringify(params);
  }
  
  return url;
};

var isEmpty = function(obj) {
  var p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
        return false;
    }
  }
  return true;
};