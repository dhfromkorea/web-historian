var fs = require('fs');
var path = require('path');
var request = require('request');
var httpRequest = require('http-request');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets': path.join(__dirname, '../web/public'),
  'archivedSites': path.join(__dirname, '../archives/sites'),
  'list': path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(iterator) {
  var urls = fs.readFileSync(this.paths.list);
  urls = urls.toString().split("\n");
  iterator(urls);
};

exports.isUrlInList = function(reqAsset) {
  var result = false;
  reqAsset = reqAsset.slice(1);
  this.readListOfUrls(function(urlArr) {
    if (urlArr.indexOf(reqAsset) > -1) {
      result = true;
    }
  });
  return result;
};

exports.addUrlToList = function(url) {
  url = url.slice(1) + "\n";
  fs.appendFile(this.paths.list, url, function(err) {
    if (err) {
      throw err;
    }
  });
};

exports.isURLArchived = function(url) {
  //deprecated
  // var filePath = this.paths.archivedSites + url;
  //  var result;
  //  fs.existsSync(filePath, function(exist) {
  //    result = exist;
  //  });
  //  return result;
};

exports.downloadUrls = function(url) {
  if (url.slice(0) === '/') {
    url = url.slice(1);
  }
  var filePath = this.paths.archivedSites + '/' + url;
  httpRequest.get(url, function(err, res) {
    if (!err) {
      var body = '';
      body = res.buffer.toString();
      fs.writeFile(filePath, body, function(err) {
        if (err) {
          throw err;
        }
      });
    }else{
      throw err;
    }
  });
};