/// <reference path='../../../../typings/index.d.ts' />
import * as React       from 'react';
import * as ReactDOM    from 'react-dom';
import Sockets from './core/sockets';
import FlightDestinations from './components/flight-destinations/flight-destinations';

/**
 * React app class
 */
class ReactApp extends React.Component {
  render() {
    return(
      <div>
        <FlightDestinations></FlightDestinations>
      </div>
    );
  }
}

/**
 * Main app class
 */
class App {

  private react;
  private sockets;

  constructor() {
    // create new sockets instance
    this.sockets = Sockets.create('react');

    // connect to sockets
    this.sockets.ready().then(() => {
      this.startReact();
    });
  }

  // initialize react
  private startReact() {
    ReactDOM.render(
      <ReactApp compiler='TypeScript' framework='React' />,
      document.getElementById('app')
    );
  }

  static create() {
    return new App();
  }
}

App.create();
