/*
* Main File
*
*/

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('node:querystring');
const StringDecoder = require('node:string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./data');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

let server = {};

/* Create/Read/Updates a file 
_data.create('test', 'newFile', {'kiss':'my_ass'}, function(err){
    console.log('data create', err);
})

_data.read('test', 'newFile', function(err, data){
    console.log('Data read error', err,' this is the data: ',data);
});

_data.update('test', 'newFile', {'beat': 'these_tits'}, function(err){
    console.log('Data update error', err);
});
*/

//Create server 
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
    res.end('Server started')
});



server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

//Create server 
server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res);
});


helpers.sendTwilioSms('3014125476', 'Hello', function (err) {
    //console.log("Twilio error", err);
});

server.unifiedServer = function (req, res) {
    //res.setRequestHeader('Access-Control-Allow-Origin', '*');
    //console.log('req.headers',req.headers)
    var parsedUrl = url.parse(req.url, true)
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    let queryStringObject = querystring.stringify(parsedUrl);
    let method = req.method.toLowerCase();
    let headers = req.headers;

    //Get payload
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data)
    });

    req.on('end', function () {
        buffer += decoder.end();

        let chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
        //console.log("Buffer is now ", buffer);

        //buffer = typeof(buffer) == 'string' && buffer.length > 0 ? JSON.parse(buffer) : buffer;

        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': decodeURIComponent(queryStringObject),
            'method': method,
            'headers': headers,
            //'payload': helpers.parseJsonToObject(buffer)
            'payload': buffer
        };

        //console.log('queryStringObject ', decodeURIComponent(queryStringObject));

        try {
            chosenHandler(data, function (statusCode, payload, contentType) {
                server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType)
            });
        } catch (e) {
            //console.log("Chosen handler fail",e);
            debug(e);
            //console.log("Chosen handler fail",e);
            server.processHandlerResponse(res, method, trimmedPath, 500, { 'Error': "An unknown error has occured" }, 'json')

        }
        //console.log("statusCode ", statusCode, 'payload',payload,'payloadString',payloadString);
    });

    //console.log("Returning: ", buffer);
};

server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType) => {
    statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
    contentType = typeof (contentType) == 'string' ? contentType : 'json';

    /*
    if (method == 'post') {
        console.trace('Unified server');
    }
    */

    //console.log("statusCode ", statusCode, 'payload',payload);

    let payloadString = {};

    if (contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        payload = typeof (payload) == 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
    }
    if (contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof (payload) == 'string' ? payload : '';
    }
    if (contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }
    if (contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }
    if (contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }
    if (contentType == 'jpg') {
        res.setHeader('Content-Type', 'text/jpeg');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }
    if (contentType == 'javascript') {
        res.setHeader('Content-Type', 'text/javascript');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }
    if (contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof (payload) == 'string' ? payload : '';
    }

    let phone, token, cookieString;
    if (payloadString.phone && payloadString.phone.length >= 10) {
        phone = payloadString.phone.length;
        cookieString += `phone=${phone};`
    }
    if (payloadString.tokenId && payloadString.tokenId.length > 20) {
        token = payloadString.tokenId
        cookieString += `tokenId=${tokenId};`
    }

    /*
    if(cookieString && cookieString.length > 10){
        res.setHeader('Set-Cookie',`[${cookieString} HttpOnly, Secure;]`);
    }
    
    if( && payloadString.tokenId.length){
        res.setHeader('Set-Cookie',`phone=202-115-5555+;tokenId=738ML8IFW1GswJEGHpy`);
        payloadString = typeof(payload) == 'string' ? payload : '';
    }*/

    res.writeHead(statusCode);
    //console.log('payloadString', payloadString)
    res.end(payloadString);

}

//Defining router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/delete': handlers.accountDelete,
    'session/create': handlers.sessionCreate,
    'session/delete': handlers.sessionDelete,
    'checks/all': handlers.checkList,
    'checks/edit': handlers.checkEdit,
    'checks/create': handlers.checksCreate,
    'sample': handlers.sample,
    'ping': handlers.ping,
    'api/checks': handlers.checks,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'examples/error': handlers.exampleError
};

server.init = () => {
    //Start server
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[36m%s\x1b[0m', "Server listening on port:", config.httpPort);
        console.log('\x1b[33m%s\x1b[0m','Background workers started');
    });

    //Start server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('\x1b[36m%s\x1b[0m', "Server https listening on port:", config.httpsPort);
        console.log('\x1b[33m%s\x1b[0m','Background workers started');
    });
}

module.exports = server;
