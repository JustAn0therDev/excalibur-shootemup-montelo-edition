# Excalibur Shoot'em Up Sample - Montelo Edition

This version of the ExcaliburJS engine game sample is something I made for myself so I could understand the engine a bit better. It's great and give some insight on how to create make for browsers using TypeScript (although some knowledge of memory management and performance optimizations could be good, as the engine does consume a lot of resources from the browser/device).

## Running locally

* Using [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
* Run the `npm install` to install dependencies
* Run the `npm run dev` to run the development server to test out changes
   * [Webpack](https://webpack.js.org/) will build the [typescript](https://www.typescriptlang.org/) into javascript
   * [Webpack dev server](https://webpack.js.org/configuration/dev-server/) will host the script in a little server on http://localhost:8082/

## Building bundles

* Run `npm run build:dev` to produce javascript bundles for debugging in the `dist/` folder
* Run `npm run build:prod` to produce javascript bundles for production (minified) in the `dist/` folder
