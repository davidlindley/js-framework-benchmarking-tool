var chalk = require('chalk');

class Stream{

    private count;

    /**
     * Create new stream
     */
    constructor(private directions, private connection, private data) {
        this.count = 0;
        this.streamBuffer();
    }

    private streamBuffer() {

        let bufferData = [];

        if(!this.data.length) { this.streamEnd(); return; }

        this.count++;

        for(let i = this.directions.ppe; i > 0; i--){
            bufferData.push(this.data.shift());
        }

        // stream package
        this.connection.socket.emit('data:stream:destinations', {
            timestamp : new Date().getTime(),
            data : {
                destinations: bufferData
            }
        })

        // when package stream done
        this.connection.socket.once('done', () => {
            this.streamBuffer();
        })
    }

    private streamEnd() {
        console.log(chalk.bgRed('----- stream done: ' + this.connection.name + ' packages: ' + this.count));
    }
}

module.exports = Stream;
