/// <reference path='../../../../../../typings/index.d.ts' />
import * as Vue from 'vue';
import Sockets from '../../core/sockets';
import FlightsConnections from '../flights-connections/flights-connections';

export default {
  template : require('./index.html'),

  components: {
    FlightsConnections
  },

  created() {
    let sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      this.sockets = sockets;
      this.sockets.get().on('data:all:destinations', (res) => {
        this.destinations = res.data.destinations;
        this.emit = res;
        this.emit.type = 'all';
        this.timestamp = new Date().getTime();
      });
      this.sockets.get().on('data:add:destinations', (res) => {
        res.data.destinations.forEach((dest) => {
          this.destinations.push(dest);
        })
        this.emit = res;
        this.emit.type = 'add';
        this.timestamp = new Date().getTime();
      });
      this.sockets.get().on('data:stream:destinations', (res) => {
        res.data.destinations.forEach((dest) => {
          this.destinations.push(dest);
        })
        this.emit = res;
        this.emit.type = 'stream';
        this.timestamp = new Date().getTime();
      });
      this.sockets.get().on('data:stream:destinations:end', (res) => {
        this.emit = res;
      });
    });
  },

  updated() {
    this.sockets.get().emit('done', {
      clientId: this.sockets.getClientId(),
      type: this.emit.type,
      count: {
        total: this.destinations.length,
        current: this.emit.data.destinations.length
      },
      timestamps: {
        emitted: this.emit.timestamp,
        beforeRender: this.timestamp,
        afterRender: new Date().getTime()
      }
    });
    window.scrollTo(0,document.body.scrollHeight);
  },

  data() {
    return {
      destinations: []
    }
  }
};
