import Sockets from './core/sockets';
import FlightDestinations from './components/flights-destinations/flights-destinations';
import FlightConnections from './components/flights-connections/flights-connections';

class App {
  constructor(args) {
    // To do: Change naming to 'vanilla' rather than 'js'
    this.sockets = Sockets.create('js');
    this.sockets.ready().then(() => {
      this.startVanilla();
    });
  }

  startVanilla() {
    // Register our two components
    document.registerElement('flights-destinations', FlightDestinations);
    document.registerElement('flights-connections', FlightConnections);
  }
}

new App();
