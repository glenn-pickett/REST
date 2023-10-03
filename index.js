/*
* Main File
*
*/

let server = require('./lib/server');
let workers = require('./lib/workers');
let cli = require('./lib/cli');

let app = {};

app.init = ()=>{
    server.init();
    workers.init();
    setTimeout(()=>{
        cli.init();
    },50);
}

app.init();

module.exports = app.init();