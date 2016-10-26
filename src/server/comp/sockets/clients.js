var moment = require('moment');
var chalk = require('chalk');
var SocketsClient = function () {
    function SocketsClient() {}
    SocketsClient.prototype.onConnection = function (clientSocket, data, cb) {
        var clientId = clientSocket.id;
        this.addConnection({
            id: clientId,
            name: data.name,
            socket: clientSocket
        });
        cb(clientId);
    };
    SocketsClient.prototype.onDisconnect = function (clientSocket) {
        this.removeConnection(clientSocket.id);
    };

    SocketsClient.prototype.onDone = function (clientSocket, data, cb) {
        var client = this.getConnection(data.clientId);
        if (client) {
            var momentEmitted = moment(data.timestamps.emitted);
            var momentBeforeRender = moment(data.timestamps.beforeRender);
            var momentAfterRender = moment(data.timestamps.afterRender);
            var duration = client.name + " = sockets to render: " + momentAfterRender.diff(momentEmitted) + " ms, just render: " + momentAfterRender.diff(momentBeforeRender) + " ms";
            if (typeof cb === 'function') {
                cb(duration);
            }

            this.connDashboard.socket.emit('_done', {
                name: client.name,
                data: data
            });
        } else {
            cb('please do handshake again!');
        }
    };
    return SocketsClient;
}();
module.exports = SocketsClient;