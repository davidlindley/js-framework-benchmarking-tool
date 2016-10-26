import Sockets from '../../core/sockets';

export default class FlightDestinations extends HTMLElement {
  constructor(args) {
    super();
  }

  attachedCallback() {
    // Get HTML template
    const link = document.querySelector('link[component="flights-destinations"]');
    // Header template
    this.templateCounter = link.import.querySelector('#template-counter');
    // Body tempate
    this.templateItem = link.import.querySelector('#template-item');
    // Set blank state
    this.state = {
      destinations: [],
      additionalDestinations: [],
      timestamp: null
    };
    // Bind handlers
    this.handleInitialResponse = this.handleInitialResponse.bind(this);
    this.handleAdditionalResponse = this.handleAdditionalResponse.bind(this);
    // Add header
    this.innerHTML = this.templateCounter.innerHTML;
    // Counter area
    this.counterRegion = this.querySelector('#destinations-counter');
    // Counter
    this.counter = this.counterRegion.querySelector('#destinations-count');
    // Get socket instance
    this.retrieveSocket();
  }

  detachedCallback() {
    // Nullify state
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
    this.sockets.get().on('data:all:destinations', (response) => {
      this.handleInitialResponse(response, 'all');
    });
    // Listen for additional destination data
    this.sockets.get().on('data:add:destinations', (response) => {
      this.handleAdditionalResponse(response, 'add');
    });
    // Listen for a stream of destination data
    this.sockets.get().on('data:stream:destinations', (response) => {
      this.handleAdditionalResponse(response, 'stream');
    });
  }

  handleInitialResponse(response, type) {
    // Store response
    this.emit = response;
    // Store response type
    this.emit.type = type;
    // Before update time
    this.state.timestamp = new Date().getTime();
    // Store data in state
    this.state.destinations = response.data.destinations.slice(0);
    // Render initial data dump to view
    this.renderAllDestinations(this.state.destinations);
  }

  handleAdditionalResponse(response, type) {
    let index;
    // Store response
    this.emit = response;
    // Store response type
    this.emit.type = type;
    // Before update time
    this.state.timestamp = new Date().getTime();
    // Loop through each new result and add it state
    // We don't use forEach as it can be slower
    for (index = 0; index < response.data.destinations.length; index++) {
      const dest = response.data.destinations[index];
      this.state.destinations.push(dest);
      // Add destination to temporary array containing only new data
      this.state.additionalDestinations.push(dest);
    }
    // Render new data to view using temporary array
    this.renderAllDestinations(this.state.additionalDestinations);
    // Nullify temporary array
    this.state.additionalDestinations = [];
  }

  renderAllDestinations(data) {
    // Create fragment to hold DOM
    const fragment = document.createDocumentFragment();
    let index;
    // Loop through parsed data array
    // We don't use forEach as it can be slower
    for (index = 0; index < data.length; index++) {
      if(data[index]) {
        this.renderDestination(fragment, data[index]);
      }
    }
    // Attach fragment to DOM
    this.insertBefore(fragment, this.counterRegion);
    // Run update function
    this.updated();
  }

  renderDestination(fragment, destination) {
    // Clone a new list item
    const clonedTemplate = document.importNode(this.templateItem.content, true),
      dataFromPlaceholder = clonedTemplate.querySelector('#destination-from'),
      dataToPlaceholder = clonedTemplate.querySelector('#destination-to'),
      dataPopularityPlaceholder = clonedTemplate.querySelector('#destination-popularity')
    // Apply data
    dataFromPlaceholder.outerHTML = destination.from;
    dataToPlaceholder.outerHTML = destination.to;
    dataPopularityPlaceholder.outerHTML = destination.popularity;
    // Append HTML to fragment
    fragment.appendChild(clonedTemplate);
    // Increment counter
    this.counter.innerHTML = this.state.destinations.length;
  }

  updated() {
    this.sockets.get().emit('done', {
      clientId: this.sockets.getClientId(),
      type: this.emit.type,
      count: {
        total: this.state.destinations.length,
        current: this.emit.data.destinations.length
      },
      timestamps: {
        emitted: this.emit.timestamp,
        beforeRender: this.state.timestamp,
        afterRender: new Date().getTime()
      }
    }, (str) => {
      console.log(str);
    });
    // Scroll to bottom of the page
    window.scrollTo(0,document.body.scrollHeight); 
  }
}
