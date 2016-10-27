/// <reference path='../../../../../../typings/index.d.ts' />
import * as React from 'react';
import Sockets from '../../core/sockets';
import FlightConnections from '../flight-connections/flight-connections';

export default class FlightDestinations extends React.Component {

  private sockets;
  private destinations;
  private timestamp;
  private emit;

  state: any = {
    destinations: []
  }

  constructor() {
    super();
  }

  componentWillMount() {
    let sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      this.sockets = sockets;
      this.sockets.get().on('data:all:destinations', (res) => {
        this.emit = res;
        this.emit.type = 'all';
        this.timestamp = new Date().getTime();
        this.setState({
          destinations: res.data.destinations
        });
      });
      this.sockets.get().on('data:add:destinations', (res) => {
        this.emit = res;
        this.emit.type = 'add';
        this.timestamp = new Date().getTime();
        res.data.destinations.forEach((dest) => {
          this.state.destinations.push(dest);
        });
        this.setState({destinations: this.state.destinations});
      });
      this.sockets.get().on('data:stream:destinations', (res) => {
        this.emit = res;
        this.emit.type = 'stream';
        this.timestamp = new Date().getTime();
        res.data.destinations.forEach((dest) => {
          this.state.destinations.push(dest);
        });
        this.setState({
          destinations: this.state.destinations
        });
      });
      this.sockets.get().on('data:stream:destinations:end', (res) => {
        this.emit = res;
      });
    });
  }

  componentDidUpdate() {
    if(this.state.destinations.length) {
      this.sockets.get().emit('done', {
        clientId: this.sockets.getClientId(),
        type: this.emit.type,
        count: {
          total: this.state.destinations.length,
          current: this.emit.data.destinations.length
        },
        timestamps: {
          emitted: this.emit.timestamp,
          beforeRender: this.timestamp,
          afterRender: new Date().getTime()
        }
      });
    }
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    return (
      <div>
        {this.state.destinations.map((dest, i) => (
          <div className="panel panel-default" key={i}>
            <div className="panel-heading">
              Destination
            </div>
            <div className="panel-body">
              <p>{dest.from} - {dest.to}</p>
              <p>{dest.popularity}</p>
              <FlightConnections />
            </div>
          </div>
        ))}
        <div className="panel panel-default panel-react">
          <div className="panel-heading">
            Stats
          </div>
          <div className="panel-body">
            Destinations: {this.state.destinations.length}
          </div>
        </div>
      </div>
    )
  }
}
