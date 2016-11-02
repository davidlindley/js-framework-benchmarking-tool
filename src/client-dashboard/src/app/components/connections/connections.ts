/// <reference path='../../../../../../typings/index.d.ts' />
import * as Vue from 'vue';
import Sockets from '../../core/sockets';

Vue.component('connections', {
  template : require('./connections.html'),
  created() {
    /**
     * Get all connections to sockets ( except dashboard con )
     * update in real time
     */
    var getConnections = (sockets) => {
      sockets.emit('_getConnections', (data) => {
        this.connections = data;
        getConnections(sockets);
      });
    }
    var sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      getConnections(sockets.get());
    });
  },
  data() {
    return {
      connectionsPossible: [
        {
          id  : 'vue',
          label : 'vue',
          url : 'http://localhost:3000/vue'
        },
        {
          id : 'react',
          label : 'react',
          url : 'http://localhost:3000/react'
        },
        {
          id : 'js',
          label : 'vanilla',
          url : 'http://localhost:3000/js'
        },
        {
          id : 'ng1',
          label : 'angular1',
          url : 'http://localhost:3000/angular'
        },
        {
          id : 'ng',
          label : 'angular2',
          url : 'http://localhost:3000/angular2'
        }
      ],
      connections: null
    }
  },
  methods : {
    refreshClient : function(clientId) {
      var sockets = Sockets.retrieve();
      sockets.ready().then(() => {
          sockets.get().emit('_refreshClient', clientId);
      });
    },
    openClient : function(url) {
      window.open(url, '_blank');
    },
    isConnected : function(conId) {
      let isCon = false;
      if (!this.connections) {
        return isCon;
      }
      this.connections.forEach((con) => {
        if (con.name === conId) {
          isCon = true;
        }
      });
      return isCon;
    }
  }
});
