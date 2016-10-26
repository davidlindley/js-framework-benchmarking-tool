# Dashboard framework performance tool
Project for performance testing of multiple javascript frameworks. <br>
Currently supported: react, vue, angular1, angular2, vanilla

## Project structure
* _build
  * client-{name} - This is a place to create your gulp or webpack build
* src
  * client-{name} - This is a place for frontend project
  * common        - A common folder for fonts,images,css
  * server        - Our server
  * * config.ts
* gulpfile.js

## Commands
* `npm run start`- for a server
* `npm run build` - for all clients build (you will need to run this once before starting a server for the first time)
* `npm run {name}` - for a project build ( webpack/gulp )
* `npm run server` - for server build

## Client public path config
* Go to src/server/config.ts for a setup
* You can find your's project at: localhost:3000/{name}

## Adding new framework/project
Currently there is no flexible way to do it - best will be to follow implementation of one of existing frameworks.

* add build under: `./_build/client-{name}`
* add to server cfg in `./src/server/config.ts`
* add to server in `./src/server/server.ts`
* add to dashboard in `./src/dashboard/app/components/graph/graph.ts`
* build in `./src/client-{name}`

# Server communication

## Destinations response
```js
{
  timestamp : DATE,
  data : [
    {
      id: number,
	   from : string,
	   to : string,
	   popularity : number
    },{
	  ...
    }
  ]
}
```

### data:all:destinations
```js
sockets.on('data:all:destinations', (res) => {
  this.destinations = res.data.destinations;
})
```

### data:add:destinations
```js
sockets.on('data:add:destinations', (res) => {
    res.data.destinations.forEach((dest) => {
        this.destinations.push(dest);
    })
})
```

## data:stream:destinations
```js
sockets.on('data:stream:destinations', (res) => {
    res.data.destinations.forEach((dest) => {
        this.destinations.push(dest);
    })
})
```

# Contributors
* [Markogiannakis,A,Aristos](https://github.com/arismarko)
* [Lindley,D,David](https://github.com/davidlindley)
* [Johnson,JP,Josh](https://github.com/jshjohnson)
* [Swiat,Radoslaw](https://github.com/radswiat)
