var chalk = require('chalk');
var Stream = function () {
    function Stream(directions, connection, data) {
        this.directions = directions;
        this.connection = connection;
        this.data = data;
        this.count = 0;
        this.streamBuffer();
    }
    Stream.prototype.streamBuffer = function () {
        var _this = this;
        var bufferData = [];
        if (!this.data.length) {
            this.streamEnd();
            return;
        }
        this.count++;
        for (var i = this.directions.ppe; i > 0; i--) {
            bufferData.push(this.data.shift());
        }

        this.connection.socket.emit('data:stream:destinations', {
            timestamp: new Date().getTime(),
            data: {
                destinations: bufferData
            }
        });

        this.connection.socket.once('done', function () {
            _this.streamBuffer();
        });
    };
    Stream.prototype.streamEnd = function () {
        console.log(chalk.bgRed('----- stream done: ' + this.connection.name + ' packages: ' + this.count));
    };
    return Stream;
}();
module.exports = Stream;