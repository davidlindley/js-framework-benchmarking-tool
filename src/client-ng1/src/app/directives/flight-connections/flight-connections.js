import Sockets from './../../core/sockets';

function flightConnections($timeout) {
  return {
    restrict: 'AE',
    scope : {
      connection: '='
    },
    template: require('./index.html'),
    link: function($scope, $element, $attrs) {
      const CONSTANTS = {
        GET_CONNECTIONS: 'data:all:connections',
        ADD_CONNECTIONS: 'data:add:connections'
      };

      $scope.connections = [];
      let sockets = Sockets.retrieve();

      /*
      * Wait for data
      */
      sockets.get().on(CONSTANTS.GET_CONNECTIONS, (response) => {
        _processGetConnections(response);
      });

      sockets.get().on(CONSTANTS.ADD_CONNECTIONS, (response) => {
        _processAddConnection(response);
      });

      /*
      * Different processing methods. All wrapped in a $timeout
      * to ensure code is executed on the stack
      */
      var _processGetConnections = (response) => {
        var beforeRenderTimestamp = new Date().getTime();
        $timeout(() => {
          response.type = "set";
          $scope.connections = response.data.connections;
          _renderDone(beforeRenderTimestamp, response);
        });
      };

      var _processAddConnection = (response) => {
        var beforeRenderTimestamp = new Date().getTime();
        $timeout(() => {
          response.type = "add";
          response.data.connections.forEach((connection) => {
            $scope.connections.push(connection);
          })
          _renderDone(beforeRenderTimestamp, response);
        });
      };

      /*
      * Called when the scope has been set
      * Waits for the angular app to detect the scope change
      * then emits 'done' back to the server
      */
      var _renderDone = (beforeRenderTimestamp, originalResponse) => {
        var watch = $scope.$watch(() => {
          return;
        }, () => {
            sockets.get().emit('done', {
              clientId: sockets.getClientId(),
              type: originalResponse.type,
              count       : {
                total : $scope.connections.length,
                current : originalResponse.data.connections.length
              },
              timestamps: {
                emitted: originalResponse.timestamp,
                beforeRender: beforeRenderTimestamp,
                afterRender: new Date().getTime()
              }
            }, (str) => {
              console.log(str);
            });
          // Scroll to bottom
          window.scrollTo(0,document.body.scrollHeight);
        });
      };
    }
  }
};

export default flightConnections;
