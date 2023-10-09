/*
* Main File
*
*/

//let server = require('./lib/server');
import server from './lib/server.cjs';
//let workers = require('./lib/workers');
import workers from './lib/workers.cjs';
//let cli = require('./lib/cli');
//import cli from './lib/cli.cjs';

let App = {};

App.init = (callback) => {
    server.init();
    workers.init();
    /*
    setTimeout(() => {
        cli.init();
        //callback();
    }, 50);
    */
}

//Anon function added to trigger done in api test, through callback
//if (require.main === module) {
if (import.meta.url.endsWith(process.argv[1])) {
    App.init(function () { });
}else{
    App.init();
}

//module.exports = app;
export default App;
