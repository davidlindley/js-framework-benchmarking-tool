import { IDestination } from "./destination.interface";
import Sockets from "../socket-service/socket.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class DestinationService {

  private timestamp: number;
  private socket;
  private beforeUpdate;

  public destinations: Array<IDestination> = [];
  public emit;

  /**
   * Constructor.
   *
   * @class DestinationService
   * @constructor
   * @param room string
   */
  constructor() {
    this.socket = Sockets.retrieve();
  }

  data = () => {
    return {
      destinations: null
    }
  }

  updated(total){
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
        current: this.emit.data.destinations.length
      },
      timestamps: timestamps
    });
  }

  created(): Observable<any> {
    let socket = this.socket.sockets;
    return Observable.create((observer: any) => {
      socket.on('data:all:destinations', (res) => {
        this.emit = res;
        this.emit.type = 'all';
        this.beforeUpdate = new Date().getTime();
        observer.next({
          action: "set",
          item: res
        });
      });

      socket.on('data:add:destinations', (res) => {
        this.emit = res;
        this.emit.type = 'add';
        this.beforeUpdate = new Date().getTime();
        observer.next({
          action: "add",
          item: res
        });
      });

      socket.on('data:stream:destinations', (res) => {
        this.emit = res;
        this.emit.type = 'stream';
        this.beforeUpdate = new Date().getTime();
        observer.next({
          action: "add",
          item: res
        });
      });

      socket.on('data:stream:destinations:end', (res) => {
        this.beforeUpdate = new Date().getTime();
        this.emit = res;
      });
    });
  }
}
