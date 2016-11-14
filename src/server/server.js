"use strict";

var express = require('express');
var http = require('http');
var path = require('path');
var Sockets = require('./comp/sockets/sockets');
var config = require('./config');

var BASE_DIR = path.join(__dirname);

var Server = function () {
    function Server() {
        this.app = express();
        this.http = http.Server(this.app);
        this.config();
        this.port();
        this.sockets();
    }

    Server.bootstrap = function () {
        return new Server();
    };

    Server.prototype.config = function () {
        this.app.use(function (req, res, next) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            next();
        });
        this.app.use('/', express.static(path.join(BASE_DIR, config.PATH_WEB_DASH)));
        this.app.use('/angular2', express.static(path.join(BASE_DIR, config.PATH_WEB_ANGULAR2)));
        this.app.use('/react', express.static(path.join(BASE_DIR, config.PATH_WEB_REACT)));
        this.app.use('/angular', express.static(path.join(BASE_DIR, config.PATH_WEB_ANGULAR)));
        this.app.use('/vue', express.static(path.join(BASE_DIR, config.PATH_WEB_VUE)));
        this.app.use('/js', express.static(path.join(BASE_DIR, config.PATH_WEB_JS)));
        this.app.use('/common', express.static(path.join(BASE_DIR, config.PATH_WEB_COMMON)));
    };

    Server.prototype.port = function () {
        this.http.listen(config.SERVER_PORT, function () {
            console.log('listening on *:' + config.SERVER_PORT);
        });
    };
    Server.prototype.sockets = function () {
        new Sockets(this.http);
    };
    return Server;
}();
var server = Server.bootstrap();
module.exports = server.app;