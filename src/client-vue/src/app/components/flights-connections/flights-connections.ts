/// <reference path='../../../../../../typings/index.d.ts' />
import Sockets from '../../core/sockets';

export default {
  template : require('./index.html'),

  created() {
    let sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      this.sockets = sockets;
      this.sockets.get().on('data:all:connections', (res) => {
        this.connections = res.data.connections;
        this.emit = res;
        this.emit.type = 'all';
        this.timestamp = new Date().getTime();
      });
      this.sockets.get().on('data:add:connections', (res) => {
        res.data.connections.forEach((con) => {
          this.connections.push(con);
        });
        this.emit = res;
        this.emit.type = 'add';
        this.timestamp = new Date().getTime();
      });
    });
  },

  updated() {
    this.sockets.get().emit('done', {
      clientId: this.sockets.getClientId(),
      type: this.emit.type,
      count: {
        total: this.connections.length,
        current: this.emit.data.connections.length
      },
      timestamps: {
        emitted: this.emit.timestamp,
        beforeRender: this.timestamp,
        afterRender: new Date().getTime()
      }
    }, (str) => console.log(str));
    window.scrollTo(0,document.body.scrollHeight);
  },

  data() {
    return {
      connections: null
    }
  }
}
