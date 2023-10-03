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

const App = () =>{
    server.init();
    workers.init();
    /*
    setTimeout(()=>{
        cli.init();
    },50);
    */
}

//App();

//module.exports = app;
export default App();