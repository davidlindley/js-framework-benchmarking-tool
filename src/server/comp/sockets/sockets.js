var io = require('socket.io');
var path = require('path');
var uuid = require('uuid');
var moment = require('moment');
var faker = require('faker');
var chalk = require('chalk');
var SocketsClient = require('./clients');
var SocketsDashboard = require('./dashboard');
var Sockets = function () {
    function Sockets(http) {
        this.connections = [];
        this.connDashboard = null;
        this.io = io(http, null);
        this.io.on('connection', this.onNewConnection.bind(this));
        this.client = new SocketsClient();
        this.dashboard = new SocketsDashboard();
    }
    Sockets.prototype.addConnection = function (data) {
        var conExists = this.getConnectionByName(data.name);
        if (conExists.length) {
            this.removeConnectionByIndex(conExists[0].index);
        }
        this.connections.push(data);
    };
    Sockets.prototype.removeConnection = function (clientId) {
        var con = this.getConnection(clientId);
        if (typeof con !== 'undefined') {
            this.removeConnectionByIndex(con.index);
        }
    };
    Sockets.prototype.removeConnectionByIndex = function (index) {
        this.connections.splice(index, 1);
    };
    Sockets.prototype.getAllConnections = function () {
        return this.connections;
    };
    Sockets.prototype.getConnectionByName = function (name) {
        return this.connections.filter(function (con, i) {
            if (con.name === name) {
                con.index = i;
                return true;
            }
        });
    };
    Sockets.prototype.getConnection = function (clientId) {
        return this.connections.filter(function (con, i) {
            if (con.id === clientId) {
                con.index = i;
                return true;
            }
            return false;
        })[0];
    };
    Sockets.prototype.onNewConnection = function (connection) {
        connection.on('disconnect', this.client.onDisconnect.bind(this, connection));
        connection.on('handshake', this.client.onConnection.bind(this, connection));
        connection.on('done', this.client.onDone.bind(this, connection));

        connection.on('handshake-dashboard', this.dashboard.onConnection.bind(this, connection));
        connection.on('_getConnections', this.dashboard.getConnections.bind(this, connection));
        connection.on('_setDestinations', this.dashboard.setDestinations.bind(this, connection));
        connection.on('_setConnections', this.dashboard.setConnections.bind(this, connection));
        connection.on('_refreshClient', this.dashboard.refreshClient.bind(this, connection));
    };
    return Sockets;
}();
module.exports = Sockets;