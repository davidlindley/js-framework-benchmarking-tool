var chalk = require('chalk');
var faker = require('faker');
var moment = require('moment');
var Promise = require('bluebird');
var Stream = require('./stream');
var SocketsDashboard = function () {
    function SocketsDashboard() {}
    SocketsDashboard.prototype.onConnection = function (clientSocket, cb) {
        var clientId = clientSocket.id;
        this.connDashboard = {
            id: clientId,
            socket: clientSocket
        };
        cb(clientId);
    };
    SocketsDashboard.prototype.refreshClient = function (connection, clientId) {
        var con = this.getConnectionByName(clientId)[0];
        if (con) {
            con.socket.emit('refresh');
        }
    };
    SocketsDashboard.prototype.getConnections = function (connection, cb) {
        var conn = this.getAllConnections().map(function (con) {
            return {
                id: con.id,
                name: con.name
            };
        });
        cb(conn);
    };
    SocketsDashboard.prototype.setDestinations = function (connection, directions, cb) {
        var _this = this;
        var sentCount = 0;
        var data = [];
        for (var i = 0; i < directions.count; i++) {
            data.push({
                id: i,
                from: faker.address.city(),
                to: faker.address.city(),
                popularity: faker.random.number()
            });
        }
        if (directions.action === 'set') {
            this.connections.forEach(function (connection) {
                sentCount++;
                connection.socket.emit('data:all:destinations', {
                    timestamp: new Date().getTime(),
                    data: {
                        destinations: data
                    }
                });
            });
        }
        if (directions.action === 'add') {
            this.connections.forEach(function (connection) {
                sentCount++;
                connection.socket.emit('data:add:destinations', {
                    timestamp: new Date().getTime(),
                    data: {
                        destinations: data
                    }
                });
            });
        }
        if (directions.action === 'stream') {
            if (directions.newStream) {
                console.log(chalk.bgYellow('----- stream progressive ------'));
                this.connections.forEach(function (connection) {
                    new Stream(directions, connection, JSON.parse(JSON.stringify(data)));
                });
            } else {
                console.log(chalk.bgYellow('----- stream default ------'));
                var streamTiming = 400;
                var ppe = parseInt(directions.pee || 1);
                var stream = function (bufferData) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            _this.connections.forEach(function (connection) {
                                sentCount++;
                                connection.socket.emit('data:stream:destinations', {
                                    timestamp: new Date().getTime(),
                                    data: {
                                        destinations: bufferData
                                    }
                                });
                            });
                            resolve();
                        }, streamTiming);
                    });
                };
                var next = function (data) {
                    if (!data.length) {
                        done();
                        return;
                    }
                    var bufferData = [];
                    for (var i = directions.ppe; i > 0; i--) {
                        bufferData.push(data.shift());
                    }
                    stream(bufferData).then(function () {
                        next(data);
                    });
                };
                var done = function () {
                    _this.connections.forEach(function (connection) {
                        sentCount++;
                        connection.socket.emit('data:stream:destinations:end', {
                            timestamp: new Date().getTime()
                        });
                    });
                };
                next(data);
            }
        }
    };
    SocketsDashboard.prototype.setConnections = function (connection, directions, cb) {
        var sentCount = 0;
        var data = [];
        for (var i = 0; i < directions.count; i++) {
            data.push({
                id: i,
                price: faker.commerce.price(),
                currency: faker.finance.currencySymbol(),
                distance: faker.random.number(),
                airlineTag: faker.commerce.color(),
                date: faker.date.future(),
                desc: faker.lorem.paragraphs()
            });
        }
        if (directions.action === 'set') {
            this.connections.forEach(function (connection) {
                sentCount++;
                connection.socket.emit('data:all:connections', {
                    timestamp: new Date().getTime(),
                    data: {
                        connections: data
                    }
                });
            });
        }
        if (directions.action === 'add') {
            this.connections.forEach(function (connection) {
                sentCount++;
                connection.socket.emit('data:add:connections', {
                    timestamp: new Date().getTime(),
                    data: {
                        connections: data
                    }
                });
            });
        }
        cb(sentCount);
    };
    return SocketsDashboard;
}();
module.exports = SocketsDashboard;