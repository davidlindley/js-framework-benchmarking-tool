import { IConnection } from "./connection.interface";
import Sockets from "../socket-service/socket.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ConnectionService {

  private timestamp: number;
  private socket;
  public connections: Array<IConnection> = [];
  public emit;
  private beforeUpdate;

  /**
   * Constructor.
   *
   * @class ConnectionService
   * @constructor
   * @param room string
   */
  constructor() {
    this.socket = Sockets.retrieve();
  }

  data = () => {
    return {
      connections: null
    }
  }

  updated(total) {
    let timestamps = {
      emitted: this.emit.timestamp,
      beforeRender: this.beforeUpdate,
      afterRender: new Date().getTime()
    }

    this.socket.get().emit('done', {
      clientId: this.socket.getClientId(),
      type: this.emit.type,
      count: {
        total: total,
        current: this.emit.data.connections.length
      },
      timestamps: timestamps
    });
  }

  created = () => {
    let socket = this.socket.sockets;
    return Observable.create((observer: any) => {
      socket.on('data:all:connections', (res) => {
        this.emit = res;
        this.emit.type = 'all';
        this.beforeUpdate = new Date().getTime();
        observer.next({
          action: "set",
          item: res
        });
      });

      socket.on('data:add:connections', (res) => {
        this.emit = res;
        this.emit.type = 'add';
        this.beforeUpdate = new Date().getTime();
        observer.next({
          action: "add",
          item: res
        });
      });

      socket.on('data:stream:connections', (res) => {
        this.emit = res;
        this.emit.type = 'stream';
        this.beforeUpdate = new Date().getTime();
        observer.next({
          action: "add",
          item: res
        });
      });

      socket.on('data:stream:connections:end', (res) => {
        this.emit = res;
      });
    });
  }
}
