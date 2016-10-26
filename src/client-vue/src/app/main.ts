/// <reference path='../../../../typings/index.d.ts' />
import * as Vue from 'vue';
import FlightsDestinations from './components/flights-destinations/flights-destinations';
import Sockets from './core/sockets';

class App {
  private vue;
  private sockets;

  constructor() {
    // create new sockets instance
    this.sockets = Sockets.create('vue');

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
        FlightsDestinations
      }
    });
  }

  static create() {
    return new App();
  }
}

App.create();
