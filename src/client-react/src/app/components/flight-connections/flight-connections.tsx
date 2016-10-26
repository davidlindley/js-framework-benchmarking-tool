import * as React from 'react';
import Sockets from '../../core/sockets';

export default class FlightConnections extends React.Component {
  private sockets;
  private connections;
  private timestamp;
  private emit;

  state: any = {
    connections: []
  }

  constructor() {
    super();
  }

  componentWillMount() {
    let sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      this.sockets = sockets;
      this.sockets.get().on('data:all:connections', (res) => {
          this.emit = res;
          this.emit.type = 'all';
          this.timestamp = new Date().getTime();
          this.setState({
            connections: res.data.connections
          });
      });
      this.sockets.get().on('data:add:connections', (res) => {
          this.emit = res;
          this.emit.type = 'add';
          this.timestamp = new Date().getTime();
          res.data.connections.forEach((dest) => {
              this.state.connections.push(dest);
          });
          this.setState({
            connections: this.state.connections
          });
      });
      this.sockets.get().on('data:stream:connections', (res) => {
        this.emit = res;
        this.emit.type = 'stream';
        this.timestamp = new Date().getTime();
        res.data.connections.forEach((dest) => {
          this.state.connections.push(dest);
        });
        this.setState({
          connections: this.state.connections
        });
      });
      this.sockets.get().on('data:stream:connections:end', (res) => {
        this.emit = res;
      });
    });
  }

  componentDidUpdate() {
    if(this.state.connections.length) {
      this.sockets.get().emit('done', {
        clientId: this.sockets.getClientId(),
        type: this.emit.type,
        count: {
          total: this.state.connections.length,
          current: this.emit.data.connections.length
        },
        timestamps: {
          emitted: this.emit.timestamp,
          beforeRender: this.timestamp,
          afterRender: new Date().getTime()
        }
      }, (str) => console.log(str));
    }
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    return (
      <div className="panel panel-default" >
        <div className="panel-heading">
          Connections
        </div>
        <div className="panel-body">
          {this.state.connections.map((con, i) => (
            <div key={i}>
              <div>
                Airline tag
              </div>
              <p>Price {con.price} {con.currency}</p>
              <p>{con.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
