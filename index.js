/*
* Main File
*
*/

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('node:querystring');
const StringDecoder = require('node:string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

_data.create('test', 'newFile', {'kiss':'my_ass'}, function(err){
    console.log('data create', err);
})

_data.read('test', 'newFile', function(err, data){
    console.log('Data read error', err,' this is the data: ',data);
});

_data.update('test', 'newFile', {'beat': 'these_tits'}, function(err){
    console.log('Data update error', err);
});

//Create server 
const httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

//Start server
httpServer.listen(config.httpPort, function(){
    console.log("Server listening on port:", config.httpPort);
});

var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}

//Create server 
const httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res);
});

//Start server
httpsServer.listen(config.httpsPort, function(){
    console.log("Server https listening on port:", config.httpsPort);
});

const unifiedServer = function(req, res){
    var parsedUrl = url.parse(req.url, true)
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    let queryStringObject = querystring.stringify(parsedUrl);

    let method = req.method.toLowerCase();

    let headers = req.headers;

    //Get payload
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data)
    });

    req.on('end', function(){
        buffer += decoder.end();

        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //console.log("Buffer is now ", buffer);
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': decodeURIComponent(queryStringObject),
            'method': method,
            'headers': headers,
            //'payload': helpers.parseJsonToObject(buffer)
            'payload': JSON.parse(buffer)
        };

        //console.log('queryStringObject ', decodeURIComponent(queryStringObject));

        chosenHandler(data, function(statusCode, payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            console.log("statusCode ", statusCode, 'payload',payload);

            //payload = JSON.parse(payload);
            
            payload= typeof(payload) == 'object' ? payload : {};

            let payloadString  = JSON.stringify(payload);

            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            
            console.log("statusCode ", statusCode, 'payload',payload,'payloadString',payloadString);
        })

        //console.log("Returning: ", buffer);
    });
}

//Defining router
const router = {
    'checks': handlers.checks,
    'sample' : handlers.sample,
    'ping' : handlers.ping,
    'users' : handlers.users,
    'tokens': handlers.tokens
}