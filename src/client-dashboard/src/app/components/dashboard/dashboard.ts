/// <reference path='../../../../../../typings/index.d.ts' />
import * as Vue from 'vue';
import Sockets from '../../core/sockets';

Vue.component('dashboard', {
  template : require('./dashboard.html'),
  data() {
    return {
      destCount   : 10,
      destTiming  : 200,
      destPPE     : 1,
      conCount    : 10
    }
  },
  created() {
    let sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      this.sockets = sockets.get();
    });
  },
  methods : {
    destinationsSet: function() {
      this.sockets.emit('_setDestinations', {
        action : 'set',
        count : this.destCount
      }, (res) => {
        console.warn(`emit sent to ${res} clients`);
      });
    },
    destinationsAdd : function() {
      this.sockets.emit('_setDestinations', {
        action : 'add',
        count : this.destCount
      }, (res) => {
        console.warn(`emit sent to ${res} clients`);
      });
    },
    destinationsUpdate : function() {
      this.sockets.emit('_setDestinations', {
        action : 'update',
        count : this.destCount
      }, (res) => {
        console.warn(`emit sent to ${res} clients`);
      });
    },
    destinationsStream : function(newStream) {
      this.sockets.emit('_setDestinations', {
        action : 'stream',
        count : this.destCount
        , newStream : newStream, timing : this.destTiming, ppe : this.destPPE}, (res) => {
        console.warn(`emit sent to ${res} clients`);
      });
    },
    connectionsSet: function() {
      this.sockets.emit('_setConnections', {
        action : 'set',
        count : this.conCount
      }, (res) => {
        console.warn(`emit sent to ${res} clients`);
      });
    },
    connectionsAdd : function() {
      this.sockets.emit('_setConnections', {
        action : 'add',
        count : this.conCount
      }, (res) => {
        console.warn(`emit sent to ${res} clients`);
      });
    },
    connectionsUpdate : function() {
      this.sockets.emit('_setConnections', {
        action : 'update',
        count : this.conCount
      }, (res) => {
        console.warn(`emit sent to ${res} clients`);
      });
    }
  }
});
