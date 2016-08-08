
var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var parseArgs = require('minimist');
var app = express();

var jacocoUrl;
var listenerPort;
var args = process.argv.slice(2);
var startServer = false;

if(args.length == 1 && args[0] == '-h') {
  console.log('usage: nodejs server.js [jacocoURL] [listenerPort (optional)]');
  console.log();
  console.log('default values:');
  console.log('listenerPort: 8080');
} else if(args.length == 1) {
  jacocoUrl = args[0];
  listenerPort = 8080;
  startServer = true;
} else if(args.length == 2) {
  jacocoUrl = args[0];
  listenerPort = args[1];
  startServer = true;
} else {
  console.log('unrecongized syntax: use "-h" to list syntax');
}

if(startServer) {
  app.get('/', function(req, res) {
    request(jacocoUrl, function (error, response, body) {
      var data = [];
      if (!error) {
        var $ = cheerio.load(body);
        $('tfoot td.ctr2').each(function() {
          data.push($(this).text());
        });
      } else {
        console.log("encountered an error: " + error);
      }

      var coverage = data[0];
      coverage = coverage.substring(0, coverage.length - 1);
      var color = function(coverage) {
        if (coverage < 20) {
          return 'red'
        } else if (coverage < 80) {
          return 'yellow'
        } else {
          return 'brightgreen'
        }
      }(coverage)

      var badge = 'https://img.shields.io/badge/coverage-' + coverage.toString() + '%-' + color + '.svg';
      res.redirect(badge);
    });
  });

  app.listen(listenerPort)
  console.log('listening on localhost:' + listenerPort);
  exports = module.exports = app;
}

