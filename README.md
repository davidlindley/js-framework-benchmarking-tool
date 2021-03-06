# Dashboard framework performance tool
Project for performance testing of multiple javascript frameworks.

**Currently supported**: React, Vue, Angular 1.*, Angular 2 and vanilla JavaScript.

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
* `npm run build` - for all clients build
* `npm run {name}` - for a project build (webpack/gulp)
* `npm run server` - for server build

## Client public path config
* Go to src/server/config.ts for a setup
* You can find your's project at: `http://localhost:3000/{name}`

## Adding new framework/project
The easiest way to get up and running with a new framework would be to follow the implementation of an existing framework.

* add build config in: `./_build/client-{name}`
* add to server config in `./src/server/config.ts`
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
