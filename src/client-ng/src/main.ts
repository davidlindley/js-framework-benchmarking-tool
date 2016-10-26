import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Sockets from "./services/socket-service/socket.service";
import { AppModule } from './app/app.module';

class App {

    private sockets;

    constructor() {
        // create new sockets instance
        this.sockets = Sockets.create('ng');

        // connect to sockets
        this.sockets.ready().then(() => {
            this.startAngular();
        })
    }

    // initialize vue
    private startAngular() {
        platformBrowserDynamic().bootstrapModule(AppModule);
    }

    static create() {
        return new App();
    }
}

App.create();
