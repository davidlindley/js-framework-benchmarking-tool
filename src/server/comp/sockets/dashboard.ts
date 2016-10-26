const chalk = require('chalk');
const faker = require('faker');
const moment = require('moment');
const Promise = require('bluebird');
const Stream = require('./stream');

class SocketsDashboard{

    protected getAllConnections;
    protected getConnectionByName;
    protected connections;
    protected connDashboard;

    constructor() {}

    protected onConnection(clientSocket, cb) {
        let clientId = clientSocket.id;
        this.connDashboard = {
            id : clientId,
            socket : clientSocket
        }
        cb(clientId);
    }

    protected refreshClient(connection, clientId) {
        let con = this.getConnectionByName(clientId)[0];
        if(con) {
            con.socket.emit('refresh');
        }
    }

    protected getConnections(connection, cb) {
        let conn = this.getAllConnections().map((con) => {
            return {
                id  : con.id,
                name : con.name
            }
        })
        cb(conn);
    }

    protected setDestinations(connection, directions, cb) {
        let sentCount = 0;
        let data = [];

        for(let i = 0; i < directions.count; i++ ) {
            data.push({
                id      : i,
                from    : faker.address.city(),
                to      : faker.address.city(),
                popularity : faker.random.number()
            })
        }

        if(directions.action === 'set'){
            this.connections.forEach((connection) => {
                sentCount++;
                connection.socket.emit('data:all:destinations', {
                    timestamp : new Date().getTime(),
                    data : {
                        destinations: data
                    }
                })
            })
        }

        if(directions.action === 'add'){
            this.connections.forEach((connection) => {
                sentCount++;
                connection.socket.emit('data:add:destinations', {
                    timestamp : new Date().getTime(),
                    data : {
                        destinations: data
                    }
                })
            })
        }

        if(directions.action === 'stream') {


            if(directions.newStream) {
                console.log(chalk.bgYellow('----- stream progressive ------'));
                this.connections.forEach((connection) => {
                    new Stream(directions, connection, JSON.parse(JSON.stringify(data)));
                });
            }else{
                console.log(chalk.bgYellow('----- stream default ------'));
                var streamTiming = 400; //(directions.timing || 400);
                var ppe = parseInt((directions.pee || 1));
                var stream = (bufferData) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            this.connections.forEach((connection) => {
                                sentCount++;
                                connection.socket.emit('data:stream:destinations', {
                                    timestamp : new Date().getTime(),
                                    data : {
                                        destinations: bufferData
                                    }
                                })
                            })
                            resolve();
                        }, streamTiming);
                    })
                }

                var next = (data) => {
                    if(!data.length) {done(); return;}
                    let bufferData = [];
                    for(let i = directions.ppe; i > 0; i--){
                        bufferData.push(data.shift());
                    }
                    stream(bufferData).then(() => {
                        next(data);
                    })
                }

                var done = () => {
                    this.connections.forEach((connection) => {
                        sentCount++;
                        connection.socket.emit('data:stream:destinations:end', {
                            timestamp : new Date().getTime()
                        })
                    })
                }

                next(data);
            }

        }

        // cb(sentCount);
    }



    protected setConnections(connection, directions, cb) {
        let sentCount = 0;
        let data = [];

        for(let i = 0; i < directions.count; i++ ) {
            data.push({
                id      : i,
                price   : faker.commerce.price(),
                currency : faker.finance.currencySymbol(),
                distance : faker.random.number(),
                airlineTag : faker.commerce.color(),
                date    : faker.date.future(),
                desc    : faker.lorem.paragraphs()
            })
        }

        if(directions.action === 'set'){
            this.connections.forEach((connection) => {
                sentCount++;
                connection.socket.emit('data:all:connections', {
                    timestamp : new Date().getTime(),
                    data : {
                        connections: data
                    }
                })
            })
        }

        if(directions.action === 'add'){
            this.connections.forEach((connection) => {
                sentCount++;
                connection.socket.emit('data:add:connections', {
                    timestamp : new Date().getTime(),
                    data : {
                        connections: data
                    }
                })
            })
        }

        cb(sentCount);
    }
}


module.exports = SocketsDashboard;
