/*
* Main File
*
*/

import server from './lib/server.cjs';
import workers from './lib/workers.cjs';
import cli from './lib/cli.cjs';
import cluster from 'cluster';
import os from 'os';

let app = {};

app.init = (callback) => {
    if (cluster.isMaster) {
        workers.init();
        setTimeout(() => {
            cli.init();
            callback();
        }, 50);

        for(let i=0; i < os.cpus().length; i++){
            cluster.fork()
        }
    } else {
        server.init();
    }
}

//Anon function added to trigger done in api test, through callback
//if (require.main === module) {
if (import.meta.url.endsWith(process.argv[1])) {
    app.init(function () { });
} else {
    app.init();
}

//module.exports = app;
export default app;
