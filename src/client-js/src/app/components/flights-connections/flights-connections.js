import Sockets from '../../core/sockets';

export default class FlightConnections extends HTMLElement {
  constructor(args) {
    super();
  }

  attachedCallback() {
    // Get HTML template
    const link = document.querySelector('link[component="flights-connections"]');
    // Cache tempate
    const template = link.import.querySelector('#connections-container');
    this.outerTemplate = document.importNode(template.content, true);
    // Set blank state
    this.state = {
      connections: [],
      additionalConnections: [],
      timestamp: null
    };
    // Bind handlers
    this.handleInitialResponse = this.handleInitialResponse.bind(this);
    // Get socket instance
    this.retrieveSocket();
  }

  detachedCallback() {
    this.state = null;
  }

  retrieveSocket() {
    const sockets = Sockets.retrieve();
    sockets.ready().then(() => {
      this.sockets = sockets;
      this.addDataListeners();
    });
  }

  addDataListeners() {
    // Listen for destination data dump
    this.sockets.get().on('data:all:connections', (response) => {
      this.handleInitialResponse(response, 'all');
    });
    // Listen for destination data dump
    this.sockets.get().on('data:add:connections', (response) => {
      this.handleInitialResponse(response, 'add');
    });
  }

  updated() {
    this.sockets.get().emit('done', {
      clientId: this.sockets.getClientId(),
      type: this.emit.type,
      count: {
        total: this.state.connections.length,
        current: this.emit.data.connections.length
      },
      timestamps: {
        emitted: this.emit.timestamp,
        beforeRender: this.state.timestamp,
        afterRender: new Date().getTime()
      }
    }, (str) => {
      console.log(str);
    });
  }

  handleInitialResponse(response, type) {
    // Append outer template
    this.appendChild(this.outerTemplate);
    // Cache item template
    this.itemTemplate = this.querySelector('#connections-item');
    // Store response
    this.emit = response;
    // Store response type
    this.emit.type = type;
    // Before update time
    this.state.timestamp = new Date().getTime();
    // Store data in state
    this.state.connections = response.data.connections.slice(0);
    // Render initial data dump to view
    this.renderAllConnections(this.state.connections);
  }

  handleNewResponse(response, type) {
    let index;
    // Store response
    this.emit = response;
    // Store response type
    this.emit.type = type;
    // Before update time
    this.state.timestamp = new Date().getTime();
    // Loop through each new result and add it state
    // We don't use forEach as it can be slower
    for (index = 0; index < response.data.connections.length; index++) {
      const connection = response.data.connections[index];
      this.state.connections.push(connection);
      // Add destination to temporary array containing only new data
      this.state.additionalConnections.push(connection);
    }
    // Render new data to view using temporary array
    this.renderAllConnections(this.state.additionalConnections);
    // Nullify temporary array
    this.state.additionalConnections = [];
  }

  renderAllConnections(data) {
    // Create fragment to hold DOM
    const fragment = document.createDocumentFragment();
    let index;
    // Loop through parsed data array
    // We don't use forEach as it can be slower
    for (index = 0; index < data.length; index++) {
      const connection = data[index];
      this.renderConnection(fragment, connection);
    }
    // Attach fragment to DOM
    this.itemTemplate.parentNode.appendChild(fragment);
    // Run update function
    this.updated();
    // Scroll to bottom of the page
    window.scrollTo(0,document.body.scrollHeight); 
  }

  renderConnection(fragment, connection) {
    // Clone a new list item
    const clonedTemplate = document.importNode(this.itemTemplate.content, true),
      dataPricePlaceholder = clonedTemplate.querySelector('#connection-price'),
      dataCurrencyPlaceholder = clonedTemplate.querySelector('#connection-currency'),
      dataDescPlaceholder = clonedTemplate.querySelector('#connection-desc'),
      dataTagPlaceholder = clonedTemplate.querySelector('#connection-tag');

    // Apply data
    dataPricePlaceholder.outerHTML = connection.price;
    dataCurrencyPlaceholder.outerHTML = connection.currency;
    dataDescPlaceholder.outerHTML = connection.desc;
    dataTagPlaceholder.style.backgroundColor = connection.airlineTag;

    // Append HTML to element
    fragment.appendChild(clonedTemplate);
  }
}
