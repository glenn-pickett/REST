const app = import('./../index.js');
const assert = require('assert');
const http = require('http');
const config = require('./../lib/config.cjs')

let api = {};

let helpers = {};

helpers.makeGetRequest = function(path, callback){
    let requestDetails = {
        'protocol' : 'http',
        'hostname': 'localhost',
        'port': config.httpPort,
        'method': 'GET',
        'path': path,
        'headers': {
            'Content-Type': 'application/json'
        }
    }

    let req = http.request(requestDetails, function(res){
        callback(res)
    });
    req.end();
}

api['app.init should start without throwing'] = function(res){
    assert.doesNotThrow(function(){
        app.init(function(err){
            done();
        });
    }, TypeError);
}

api['/ping should respond to GET with 200'] = function(done){
    helpers.makeGetRequest('/ping', function(res){
        assert.equal(res.statusCode, 200);
        done();
    })
}

api['/api/users should respond to GET with 400'] = function(done){
    helpers.makeGetRequest('/api/users', function(res){
        assert.equal(res.statusCode, 400);
        done();
    })
}

api['A random path should respond to GET with 404'] = function(done){
    helpers.makeGetRequest('/this/path/doesnt/exist', function(res){
        assert.equal(res.statusCode, 404);
        done();
    })
}

module.exports = api;