# stepwatch.js

A simple multistep timer browser and mobile app, written entirely in JavaScript using Vue.js, and packaged for mobile using Apache Cordova.

## What's it for?

With stepwatch.js, you can define a named **Program** as a series of timed **Steps**, each of which has a specific duration. When you start a **Run** from the Program, each of the steps you defined will count down in sequence, until the entire Run is completed. You can pause and resume the Run in progress, or cancel it if desired.

Finished Runs are kept in history and can be saved as new Programs for future repetition.

stepwatch.js is good for:
* Timing your workout routine
* Setting up a multi-week running program (such as a certain trademarked Furniture to Metric Distance Measurement program)
* Timing a recipe

## Plans for the future

Currently the app is only minimally functional as the code gets built out. Big goals are:
* Converting to PouchDB as a client-side data store for synchronization to a backend for backup
* A social web site where users can share their Programs

## Build Setup

``` bash
# install dependencies
npm install
cordova prepare

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# build for iOS, Android, and browser
npm run cordova-build

# run in iOS Simulator
npm run cordova-ios

# run in browser
npm run cordova-browser

# run on attached Android Device
npm run cordova-android-device

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## License

Released under the [GNU Affero GPL License v3.0](https://www.gnu.org/licenses/agpl-3.0.html).