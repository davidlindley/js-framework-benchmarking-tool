// var io = require('http://localhost:3000/socket.io/socket.io.js');
/// <reference path='../../../../../typings/index.d.ts' />
// import * as io from 'socket.io-client'
import Promise  = require('bluebird');
import $ = require('jquery');

export default class Sockets {

  static instance = null;
  private sockets;
  private clientId;
  private clientName;
  private readyPromise = null;
  private readyResolve = null;

  constructor(clientName) {
    this.clientName = clientName;
    this.connect();
  }

  /**
   * Create a new socket connection
   * @param clientName - a name of the client like (ng, vue, vanilla )
   * @returns {null}
   */
  static create(clientName?) {
    if (!Sockets.instance) {
      Sockets.instance = new Sockets(clientName);
    }
    return Sockets.instance;
  }

  /**
   * Retrive already created socket connection
   * @returns {null}
   */
  static retrieve() {
    if (!Sockets.instance) {
      console.warn('Sockets not yet created');
      return null;
    }
    return Sockets.instance;
  }

  /**
   * Return a promise solved when connection available
   * @returns {null}
   */
  public ready() {
    if (!this.readyPromise) {
      this.readyPromise = new Promise((resolve, defer) => {
        this.readyResolve = resolve;
      });
    }
    return this.readyPromise;
  }

  /**
   * Get client ID
   * @returns {any}
   */
  public getClientId() {
    return this.clientId;
  }

  /**
   * Connect to the server sockets
   * @return promise
   */
  public connect() {
    this.sockets = io();
    this.stateConnected(false);
    this.sockets.on('refresh', () => { location.reload(); });
    this.sockets.on('connect', () => {
      this.sockets.emit('handshake', { name: this.clientName }, (id) => {
        this.clientId = id;
        this.stateConnected(true);
        this.readyResolve();
      });
    });
    this.sockets.on('disconnect', () => {
      this.stateConnected(false);
    });
  }

  /**
   * Jquery thing for showing states as a overlay
   * @param connected
   */
  private stateConnected(connected) {
    let preloader = '<div class="cssload-container"> <div class="cssload-circle-1"> <div class="cssload-circle-2"> <div class="cssload-circle-3"> <div class="cssload-circle-4"> <div class="cssload-circle-5"> <div class="cssload-circle-6"> <div class="cssload-circle-7"> <div class="cssload-circle-8"></div></div></div></div ></div></div ></div></div></div>';
    if (!connected) {
      $('body').append('<div class="socket-disconnected">' +
          '<span class="text">Sockets disconnected, please wait...</span><span' +
          ' class="preloader">'+preloader+'</span></div>');
      return;
    }
    $('body').find('.socket-disconnected').remove();
  }

  /**
   * Get sockets directly
   * @returns {any}
   */
  public get() {
    return this.sockets;
  }
}

