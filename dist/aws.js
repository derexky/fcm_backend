"use strict";

var http = require('http');
var app = require('./app');
var Config = {
  port: 3000
};
var server = http.createServer(app.callback());
server.listen(Config.port, function () {
  console.log("Server start on port ".concat(Config.port, "..."));
});