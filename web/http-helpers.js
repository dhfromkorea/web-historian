var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, reqUrl) {
  // asset urls
  if (reqUrl.indexOf('index.html') > -1) {
    // index.html - edge case
    filePath = archive.paths.siteAssets + reqUrl;
    return this.readFiles(filePath);
  } else {
    // check if there's content to serve
    if ( archive.isUrlInList(reqUrl) ) {
      filePath = archive.paths.archivedSites + reqUrl;
      return this.readFiles(filePath);
    } else {
      filePath = archive.paths.siteAssets + '/loading.html';
      return this.readFiles(filePath);
    }
  }
};

// As you progress, keep thinking about what helper functions you can put here!

exports.readFiles = function(filePath) {
  return fs.readFileSync(filePath);
};

