let server = require('./lib/server');
let workers = require('./lib/workers');

let app = {};

app.init = ()=>{
    server.init();

    workers.init();
}

app.init();

module.exports = app;