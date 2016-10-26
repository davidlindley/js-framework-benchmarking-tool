import angular from 'angular';
import Sockets from './core/sockets';
import flightDestinations from './directives/flight-destinations/flight-destinations';
import flightConnections from './directives/flight-connections/flight-connections';

/**
 * Register angular & components
 */
angular
  .module('socketsApp', [])
  .directive('flightDestinations', flightDestinations)
  .directive('flightConnections', flightConnections);

/**
 *  App
 */
class App {
  static create() {
      return new App();
  }

  constructor() {
    // create new sockets instance
    this.sockets = Sockets.create('ng1');
    // connect to sockets
    this.sockets.ready().then(() => {
      this.startAngular();
    });
  }

  // initialize angular app
  startAngular() {
    console.warn('start angular!');
    angular.bootstrap(document, ['socketsApp']);
  }
}

App.create();
