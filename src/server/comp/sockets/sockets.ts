const io    = require('socket.io');
const path  = require('path');
const uuid  = require('uuid');
const moment= require('moment');
const faker = require('faker');
const chalk = require('chalk');
const SocketsClient = require('./clients');
const SocketsDashboard = require('./dashboard');

class Sockets {

    private io;
    private connections = [];
    private connDashboard = null;
    private client;
    private dashboard;

    constructor(http) {
        this.io = io(http, null);
        this.io.on('connection', this.onNewConnection.bind(this));
        this.client = new SocketsClient();
        this.dashboard = new SocketsDashboard();
    }

    protected addConnection(data){
        let conExists = this.getConnectionByName(data.name);
        if(conExists.length){
            this.removeConnectionByIndex(conExists[0].index)
        }
        this.connections.push(data);
    }

    protected removeConnection(clientId) {
        let con = this.getConnection(clientId);
        if(typeof con !== 'undefined') {
            this.removeConnectionByIndex(con.index);
        }
    }

    protected removeConnectionByIndex(index) {
        this.connections.splice(index, 1)
    }

    protected getAllConnections() {
        return this.connections;
    }

    protected getConnectionByName(name) {
        return this.connections.filter((con, i) => {
            if(con.name === name){
                con.index = i;
                return true;
            }
        })
    }

    protected getConnection(clientId) {
        return this.connections.filter((con, i) => {
            if(con.id === clientId){
                con.index = i;
                return true;
            }
            return false;
        })[0];
    }

    private onNewConnection(connection){
        // // client emits/ons
        connection.on('disconnect',             this.client.onDisconnect.bind(this, connection));
        connection.on('handshake',              this.client.onConnection.bind(this, connection));
        connection.on('done',                   this.client.onDone.bind(this, connection));

        // // dashboard emits/ons
        connection.on('handshake-dashboard',    this.dashboard.onConnection.bind(this, connection));
        connection.on('_getConnections',        this.dashboard.getConnections.bind(this, connection));
        connection.on('_setDestinations',       this.dashboard.setDestinations.bind(this, connection));
        connection.on('_setConnections',        this.dashboard.setConnections.bind(this, connection));
        connection.on('_refreshClient',         this.dashboard.refreshClient.bind(this, connection));
    }





}

module.exports = Sockets;
