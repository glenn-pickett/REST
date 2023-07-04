 var _data = require('./data');
var helpers = require('./helpers');
const query = require("querystring");

//Define handlers
let handlers = {};
handlers.sample = function(data, callback){
    callback(406, {'name' : 'Sample handler'})
};

handlers.users = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method)> -1){
        handlers._users[data.method](data, callback);
    }else{
        callback(405);
    }
}

handlers._users = {};

handlers.tokens = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method)> -1){
        handlers._tokens[data.method](data, callback);
    }else{
        callback(405);
    }
}

handlers._tokens = {};

//Data: fName, lName, pass, privacy
handlers._users.post = (data, callback) => {
    //Sanitize
    var fName = typeof(data.payload.fName) == 'string' && data.payload.fName.trim().length > 0 ? data.payload.fName.trim(): false;
    var lName = typeof(data.payload.lName) == 'string' && data.payload.lName.trim().length > 0 ? data.payload.lName.trim(): false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim(): false;
    var pass = typeof(data.payload.pass) == 'string' && data.payload.pass.trim().length > 0 ? data.payload.pass.trim(): false;
    var privacy = typeof(data.payload.privacy) == 'boolean' && true ? true : false;
    //console.log('fName: ', fName,' lName: ', lName,' phone: ',phone,' pass ', pass,' privacy ', privacy);

    if(fName && lName && pass && phone && privacy){
        _data.read('users', phone, function(err, data){
            //console.log('err',err,'data',data);
            if(err){
                var hashPass = helpers.hash(pass);

                if(hashPass){
                    var userObject = {
                        'fName': fName,
                        'lName': lName,
                        'phone': phone,
                        'hashPass': hashPass,
                        'privacy': privacy
                    }
    
                    _data.create('users', phone, userObject, function(err){
                        if(!err){
                            callback(200, {"Result": "User created"});
                        }else{
                            //console.log(err);
                            callback(500, {'Error': "Could not create the user"});
                        }
                    })
                }else{
                    callback(500,{'Error': 'Hash fail'});
                }

                
            }else{
                callback(400,{'Error': 'User exists'});
            }

        })
    }else{
        callback(400,{'Error': 'Missing required fields'});
    }
}

handlers._users.get = (data, callback) => {
    //let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
    if(phone){
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
            if(tokenIsValid){
                _data.read('users', phone, function(err, data){
                    if(!err && data){
                        //console.log('Returning GET data', data);
                        delete data.hashPass;
                        
                        callback(200, data)
                    }else{
                        callback(404)
                    }
                })
            }else{
                callback(400, {"Error": "Missing required head token or invalid"})
            }
        })
    }else{
        callback(400, {'Error': 'Missing required data phone', phone})
    }
}

handlers._users.put = (data, callback) => {
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
    var fName = typeof(data.payload.fName) == 'string' && data.payload.fName.trim().length > 0 ? data.payload.fName.trim(): false;
    var lName = typeof(data.payload.lName) == 'string' && data.payload.lName.trim().length > 0 ? data.payload.lName.trim(): false;
    var pass = typeof(data.payload.pass) == 'string' && data.payload.pass.trim().length > 0 ? data.payload.lName.trim(): false;

    if(phone){
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
            if(tokenIsValid){
                if(fName || lName || pass){
                    _data.read("users", phone, function(err, userData){
                        if(!err && userData){
                            if(fName){
                                userData.fName = fName;
                            }
                            if(lName){
                                userData.lName = lName;
                            }
                            if(pass){
                                userData.hashPass = helpers.hash(pass);
                            }
                            _data.update('users', phone, userData, function(err){
                                if(!err){
                                    callback(200, {"Result": "User update successful"})
                                }else{
                                    //console.log(err);
                                    callback(500, {"Error": "Could not update the user"})
                                }
                            })
                        }else{
                            callback(400, {"Error": "The specified user does not exist"});
                        }
                    })
                }else{
                    callback(400, {"Error": "Missing fields to update"});
                }
            }else{
                callback(400, {"Error": "Missing required head token or invalid"})
            }
        })
    }else{
        callback(400, {"Error": "Missing required field"});
    }
}

handlers._users.delete = (data, callback) => {
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
    if(phone){
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
            if(tokenIsValid){
                _data.read('users', phone, function(err, data){
                    if(!err && data){
                        //console.log('Returning GET data', data);
                        _data.delete('users', phone, function(err){
                            if(!err){
                                callback(200, data);
                            }else{
                                callback(500, {"Error": "Could not delete user"});
                            }
                        })
                        
                        //callback(200, data)
                    }else{
                        callback(400, {"Error": " Could not find that user"});
                    }
                })
            }else{
                callback(400, {"Error": "Missing required head token or invalid"})
            }
        });
    }else{
        callback(400, {'Error': 'Missing required field'});
    }
}

/* ---- Authentication snippet
let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
    console.log('token', token, 'phone',phone, 'tokenIsValid',tokenIsValid)
    if(tokenIsValid){

    }else{
        callback(400, {"Error": "Missing required head token or invalid"})
    }
})
*/

//Data: fName, lName, pass, privacy
handlers._tokens.post = (data, callback) => {
    //Sanitize
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim(): false;
    var pass = typeof(data.payload.pass) == 'string' && data.payload.pass.trim().length > 0 ? data.payload.pass.trim(): false;
    
    if(pass && phone){
        _data.read('users', phone, function(err, userData){
            //console.log('err',err,'userData',userData);

            if(!err && userData){
                var hashPass = helpers.hash(pass);
                let parse = JSON.parse(userData);

                if(hashPass == parse.hashPass){
                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    
                    var tokenObject = {
                        phone: phone,
                        tokenId: tokenId,
                        expires: expires
                    }
    
                    _data.create('tokens', tokenId, tokenObject, function(err){
                        if(!err){
                            callback(200, tokenObject);
                        }else{
                            //console.log(err);
                            callback(500, {'Error': "Could not create the token"});
                        }
    
                    })
                }else{
                    callback(400,{'Error': "Password doesn't match"});
                }
            }else{
                callback(400,{'Error': 'Could not find user'});
            }
        })
    }else{
        callback(400,{'Error': 'Missing required fields'});
    }
}

handlers._tokens.get = (data, callback) => {
    let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length >= 10 ? data.payload.id.trim() : false;
    //console.log("tokens id: ", data.queryStringObject.id, data);
    let parse = query.parse(data.queryStringObject)
    let parse1 = query.parse(parse.search.replace("?",''));
    //console.log("Parse get token ", parse, 'Parse id', parse1.id);

    if(parse1.id){
        _data.read('tokens', parse1.id, function(err, tokenData){
            if(!err && tokenData){{
                //console.log('Returning GET tokenData', tokenData);
                tokenData = JSON.parse(tokenData);
                callback(200, tokenData)
            }}else{
                callback(404)
            }
        })

    }else{
        callback(400, {'Error': 'Missing required data id', parse1})
    }
}

handlers._tokens.put = (data, callback) =>{
    let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length >= 10 ? data.payload.id.trim() : false;
    let extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    //console.log("Token put id:", id, "extend", extend, data);
    
    if(id && extend){
        _data.read('tokens', id, function(err, tokenData){
            if(!err && tokenData){
                let parse = JSON.parse(tokenData);
                //console.log("TokenData", tokenData, parse);
                if(parse.expires > Date.now()){
                    parse.expires = Date.now()+1000*60*60;

                    _data.update('tokens', id, parse, function(err){
                        if(!err){
                            callback(200, {"Result": "Token expiration updated"});
                        }else{
                            callback(500, "Could not update token expiration");
                        }
                    })
                }else{
                    //console.log("tokenData.expires:",parse.expires,"Date.now()+1000*60*60", Date.now()+1000*60*60)
                    callback(400, {"Error": "The token has expired"});
                }
            }else{
                callback(400, {"Error": "Specified tokens does not exist"});
            }
        })
    }else{
        callback(400, {"Error": "Missing or invalid field(s)"});
    }
}

handlers._tokens.delete = (data, callback) => {
    //console.log("Delete data", data);
    let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length >= 20 ? data.payload.id.trim() : false;
    if(id){
        _data.read('tokens', id, function(err, data){
            if(!err && data){
                //console.log('Returning GET data', data);
                _data.delete('tokens', id, function(err){
                    if(!err){
                        callback(200, {"Result": "Logout successful"});
                    }else{
                        callback(500, {"Error": "Could not delete token"});
                    }
                })
            }else{
                callback(400, {"Error": " Could not find that token"});
            }
        })
    }else{
        callback(400, {'Error': 'Missing required field'});
    }
}

//Validate user and token
handlers._tokens.verifyToken = (id, phone, callback) =>{
    _data.read('tokens', id, function(err, tokenData){
        let parse = JSON.parse(tokenData)
        //console.log("verify tokenData",parse.tokenId);
        if(!err && parse){
            if(parse.phone == phone && parse.expires > Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    })
}

handlers.ping = function(data, callback){
    callback(200);
};

handlers.notFound = function(data, callback){
    callback(404);
};

module.exports = handlers;