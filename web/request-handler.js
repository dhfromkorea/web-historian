var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var qs = require('querystring');
var fetcher = require('../workers/htmlfetcher');

// require more modules/folders here!

exports.handleRequest = function(req, res) {
  var requestAsset;
  var loadedAsset;
  if (req.method === 'GET') {
    requestAsset = (req.url === '/' ? '/index.html' : req.url);
    loadedAsset = httpHelpers.serveAssets(res, requestAsset);
    if (loadedAsset.toString().indexOf('loading') === -1) {
      // archived pages exist or index.html
      res.writeHead(200, httpHelpers.headers);
      res.end(loadedAsset);
    } else {
      // doesn't exist
      res.writeHead(404, httpHelpers.headers);
      res.end('nothing is here: 404');
    }
    return;
  }
  if (req.method === 'POST') {
    // message parser - should be wrapped in funciton later
    res.writeHead(200, httpHelpers.headers);
    var body = '';
    var requestedUrl;
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      requestedUrl = qs.parse(body).url;
      requestAsset = '/' + requestedUrl;
      loadedAsset = httpHelpers.serveAssets(res, requestAsset);
      if (loadedAsset.toString().indexOf('loading') === -1) {
        res.writeHead(200, httpHelpers.headers);
        res.end(loadedAsset);
      } else {
        // httpHelpers.headers['location'] = '/loading.html';
        res.writeHead(302, httpHelpers.headers);
        archive.addUrlToList(requestAsset);
        fetcher.adhocFetcher(requestAsset);
        // trigger http fetcher
        res.end(loadedAsset);
      }
    });
    return;
  }
};

// post handler
// exports.handlePost = function(req) {
//   var body = '';
//   var requestedUrl;
//   req.on('data', function(data) {
//     body += data;
//   });
//   req.on('end', function() {
//     requestedUrl = qs.parse(body).url;
//   });
//   return requestedUrl;
// };