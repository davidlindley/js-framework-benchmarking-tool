const moment = require('moment');
const chalk = require('chalk');

class SocketsClient{

    protected addConnection;
    protected getConnection;
    protected connDashboard;
    protected removeConnection;

    constructor() {}

    protected onConnection(clientSocket, data, cb) {
        let clientId = clientSocket.id; //uuid.v4();
        this.addConnection({
            id          : clientId,
            name        : data.name,
            socket      : clientSocket
        });
        cb(clientId);
    }

    protected onDisconnect(clientSocket) {
        this.removeConnection(clientSocket.id);
    }

    /**
     * WHen client done,
     * data: timestamps [ emitted, beforeRender, afterRender ]
     * cb : return duration
     * What next ?
     * - pass over to the dashboard
     * @param clientSocket
     * @param data
     * @param cb
     */
    protected onDone(clientSocket, data, cb?) {
        let client = this.getConnection(data.clientId);
        if(client) {
            let momentEmitted = moment(data.timestamps.emitted);
            let momentBeforeRender = moment(data.timestamps.beforeRender);
            let momentAfterRender = moment(data.timestamps.afterRender);
            let duration = `${client.name} = sockets to render: ${momentAfterRender.diff(momentEmitted)} ms, just render: ${momentAfterRender.diff(momentBeforeRender)} ms`;
            if(typeof cb === 'function') {
                cb(duration);
            }
            // pass to the dashboard
            this.connDashboard.socket.emit('_done', {
                name    : client.name,
                data    : data
            })
        }else{
            cb('please do handshake again!');
        }
    }
}


module.exports = SocketsClient;