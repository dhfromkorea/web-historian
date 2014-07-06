// eventually, you'll have some code here that uses the code in `archive-helpers.js` to actually download the urls you want to download.

var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

exports.routineFetcher = function() {
  archive.readListOfUrls(function(urlArr) {
    _.each(urlArr, function(url) {
      if (!archive.isURLArchived(url)) {
        archive.downloadUrls(url);
      }
    });
  });
};

exports.adhocFetcher = function(url) {
  if (!archive.isUrlInList(url)) {
    archive.downloadUrls(url);
  }
};

// POST comes in
// check if the url exists in the sites.txt
// and if it exsits in the archive
// if yes
// redirect to /www.google.com
// if no:
// serve loading html
// append the url to the sites.txt
// trigger the html fetcher
// wait for html fetcher to come back with the content*
// when the fetcher is done scraping, redirect to /requested-url


// html fetcher
// runs every x minutes by default (cron job)
// can be triggered by POST request
// 1) read list of Urls
// 2) check if there's an archived version of it for every url
// 3) if not, download urls
// making a GET request
// write the res.buffer to sites directory with the url being the filename