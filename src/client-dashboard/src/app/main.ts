/// <reference path='../../../../typings/index.d.ts' />
import * as Vue from 'vue';
import Dashboard from './components/dashboard/dashboard';
import Connections from './components/connections/connections';
import Graph from './components/graph/graph';
import Sockets from './core/sockets';

class App {

  private vue;
  private sockets;

  constructor() {
    // create new sockets instance
    this.sockets = Sockets.create(null);
    // connect to sockets
    this.sockets.ready().then(() => {
      this.startVue();
    });
  }

  // initialize vue
  private startVue() {
    this.vue = new Vue({
      el: '#app',
      components: {
        Dashboard,
        Connections,
        Graph
    });
  }

  static create() {
    return new App();
  }
}

App.create();
