import Sockets from './../../core/sockets';

function flightDestinations($timeout) {
  return {
    restrict: 'AE',
    template: require('./index.html'),
    link: function($scope, $element, $attrs) {
      const CONSTANTS = {
        GET_DESTINATIONS: 'data:all:destinations',
        ADD_DESINTATIONS: 'data:add:destinations',
        STREAM_DESTINATIONS: 'data:stream:destinations'
      };

      $scope.destinations = [];
      let sockets = Sockets.retrieve();

      /*
      * Wait for data
      */
      sockets.get().on(CONSTANTS.GET_DESTINATIONS, (response) => {
        _processGetDestinations(response);
      });

      sockets.get().on(CONSTANTS.ADD_DESINTATIONS, (response) => {
        _processAddDestinations(response);
      });

      sockets.get().on(CONSTANTS.STREAM_DESTINATIONS, (response) => {
        _processStreamDestinations(response);
      });

      /*
      * Different processing methods. All wrapped in a $timeout
      * to ensure code is executed on the stack
      */
      var _processStreamDestinations = (response) => {
        var beforeRenderTimestamp = new Date().getTime();
        $timeout(() => {
          response.type = "stream";
          response.data.destinations.forEach((destination) => {
            $scope.destinations.push(destination);
          })
          _renderDone(beforeRenderTimestamp, response);
        });
      };

      var _processAddDestinations = (response) => {
        var beforeRenderTimestamp = new Date().getTime();
        $timeout(() => {
          response.type = "add";
          response.data.destinations.forEach((destination) => {
            $scope.destinations.push(destination);
          })
          _renderDone(beforeRenderTimestamp, response);
        });
      };

      var _processGetDestinations = (response) => {
        var beforeRenderTimestamp = new Date().getTime();
        $timeout(() => {
          response.type = "set";
          $scope.destinations = response.data.destinations;
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
              total : $scope.destinations.length,
              current : originalResponse.data.destinations.length
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

export default flightDestinations;
