/// <reference path="../typings/index.d.ts" />
const express   = require('express');
const http      = require('http');
const path      = require('path');
const Sockets   = require('./comp/sockets/sockets');
const config    = require('./config');

// Server base dir
const BASE_DIR = path.join(__dirname);

/**
 * The server.
 *
 * @class Server
 */
class Server {

    public app: express.Application;
    private http;

    /**
     * Bootstrap the application.
     *
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @constructor
     */
    constructor() {

        //create expressjs application
        this.app = express();

        this.http = (<any>http).Server(this.app);

        this.config();

        this.port();

        this.sockets();
    }

    /**
     * Set up server config
     * @method config
     */
    config() {
        // turn off cache
        this.app.use(function (req, res, next) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            next()
        });

        this.app.use('/',   express.static(path.join(BASE_DIR, config.PATH_WEB_DASH)));
        this.app.use('/ng', express.static(path.join(BASE_DIR, config.PATH_WEB_NG)));
        this.app.use('/rt', express.static(path.join(BASE_DIR, config.PATH_WEB_RT)));
        this.app.use('/ng1', express.static(path.join(BASE_DIR, config.PATH_WEB_NG1)));
        this.app.use('/vue', express.static(path.join(BASE_DIR, config.PATH_WEB_VUE)));
        this.app.use('/js', express.static(path.join(BASE_DIR, config.PATH_WEB_JS)));
        this.app.use('/common', express.static(path.join(BASE_DIR, config.PATH_WEB_COMMON)));
    }

    /**
     * Set server port to use
     * @method port
     */
    port() {
        this.http.listen(config.SERVER_PORT, function () {
            console.log('listening on *:' + config.SERVER_PORT);
        });
    }

    sockets() {
        new Sockets(this.http);
    }

}


let server = Server.bootstrap();
export = server.app;













