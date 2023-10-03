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

let app = {};

app.init = ()=>{
    server.init();
    workers.init();
    /*
    setTimeout(()=>{
        cli.init();
    },50);
    */
}

app.init();

//module.exports = app;
export default app