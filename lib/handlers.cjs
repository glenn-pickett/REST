const _data = require('./data.cjs');
const helpers = require('./helpers.cjs');
const query = require("querystring");
const config = require('./config.cjs');

//Define handlers
let handlers = {};

/*****
 * 
 * HTML handlers
 * 
 ****/

handlers.index = (data, callback) => {
    if (data.method == 'GET' || data.method == 'get') {
        let templateData = {
            'head.title': "Hello world",
            'head.description': "Description",
            'body.title': "Body title",
            'body.class': 'index'
        }

        helpers.getTemplate('index', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback("Missing template parts");
                    }
                })
            } else {
                //console.log('Str confused',str)
                callback(500, undefined, 'html')
            }
        })
    } else {
        //console.log('Method confused',data)
        callback(405, undefined, 'html');
    }
}

handlers.accountCreate = (data, callback) => {
    if (data.method == 'GET' || data.method == 'get') {
        let templateData = {
            'head.title': "Create Account",
            'head.description': "Signup is easy and only takes a few seconds!",
            'body.title': "Body title",
            'body.class': 'accountCreate'
        }

        //console.log('data accCreate', data)
        helpers.getTemplate('accountCreate', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, "Missing template parts");
                    }
                })
            } else {
                //console.log('Str confused',str)
                callback(500, undefined, 'html')
            }
        })
    } else {
        //console.log('Method confused', data)
        callback(405, undefined, 'html');
    }
}

handlers.accountEdit = (data, callback) => {
    if (data.method == 'get' | 'GET') {

        let templateData = {
            'head.title': "Edit Your Account",
            'body.class': 'accountEdit'
        }

        helpers.getTemplate('accountEdit', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

handlers.accountDelete = (data, callback) => {
    if (data.method == 'get' | 'GET') {

        let templateData = {
            'head.title': "Your account is successfully deleted",
            'head.description': 'Your account has been deleted.',
            'body.class': 'accountDelete'
        }

        helpers.getTemplate('accountDelete', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

handlers.sessionCreate = (data, callback) => {
    if (data.method == 'GET' || data.method == 'get') {
        let templateData = {
            'head.title': "Login Account",
            'head.description': "Enter phone number and password to log in",
            'body.title': "Body title",
            'body.class': 'sessionCreate'
        }

        //console.log('data sessionCreate', data)
        helpers.getTemplate('sessionCreate', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, "Missing template parts");
                    }
                })
            } else {
                //console.log('Str confused',str)
                callback(500, undefined, 'html')
            }
        })
    } else {
        //console.log('Method confused', data)
        callback(405, undefined, 'html');
    }
}

handlers.sessionDelete = (data, callback) => {
    if (data.method == 'GET' || data.method == 'get') {
        let templateData = {
            'head.title': "Logged Out",
            'head.description': "You have logged out",
            'body.title': "Body title",
            'body.class': 'sessionDelete'
        }

        //console.log('data sessionDelete', data)
        helpers.getTemplate('sessionDelete', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, "Missing template parts");
                    }
                })
            } else {
                //console.log('Str confused',str)
                callback(500, undefined, 'html')
            }
        })
    } else {
        //console.log('Method confused', data)
        callback(405, undefined, 'html');
    }
}

// Create a new check
handlers.checksCreate = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Create a New Check',
            'body.class': 'checksCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('checksCreate', templateData, function (err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

handlers.checkList = (data, callback) => {
    if (data.method == 'GET' || data.method == 'get') {
        let templateData = {
            'head.title': "Dashboard",
            'body.class': 'checkList'
        }

        //console.log('data checkList', data)
        helpers.getTemplate('checkList', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, "Missing template parts");
                    }
                })
            } else {
                //console.log('Str confused',str)
                callback(500, undefined, 'html')
            }
        })
    } else {
        //console.log('Method confused', data)
        callback(405, undefined, 'html');
    }
}

handlers.checkEdit = (data, callback) => {
    if (data.method == 'GET' || data.method == 'get') {
        let templateData = {
            'head.title': "Check Details",
            'body.class': 'checkEdit'
        }

        //console.log('data checkEdit', data)
        helpers.getTemplate('checkEdit', templateData, (err, str) => {
            if (!err && str) {
                helpers.addTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, "Missing template parts");
                    }
                })
            } else {
                //console.log('Str confused',str)
                callback(500, undefined, 'html')
            }
        })
    } else {
        //console.log('Method confused', data)
        callback(405, undefined, 'html');
    }
}

handlers.favicon = (data, callback) => {
    if (data.method == 'get || "GET') {
        helpers.getStaticAsset('favicon.ico', (err, data) => {
            if (!err && data) {
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        })
    } else {
        callback(405);
    }
}

handlers.public = (data, callback) => {
    if (data.method == 'get' || "GET") {
        let trimmedAssetName = data.trimmedPath.replace("public/", '').trim();
        if (trimmedAssetName.length > 0) {
            helpers.getStaticAsset(trimmedAssetName, (err, data) => {
                if (!err && data) {
                    let contentType = 'javascript';

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }
                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }
                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }
                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }

                    callback(200, data, contentType)

                } else {

                }
            })
        } else {
            //console.log("Public 404 err",err)
            callback(404, err);
        }
    } else {

    }
}

/*****
 * 
 * JSON handlers
 * 
 ****/

handlers.exampleError = (data, callback) => {
    let err = new Error("This is an example error")
    throw (err);
}

handlers.sample = function (data, callback) {
    callback(406, { 'name': 'Sample handler' })
};

handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete', 'POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers._users = {};

handlers.checks = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers._checks = {};

handlers._checks.post = (data, callback) => {
    data.payload = typeof (data.payload) == 'string' ? JSON.parse(data.payload) : data.payload;
    var protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    var url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;


    if (protocol && url && method && successCodes && timeoutSeconds) {
        let tokenId = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        //console.log("token is ",tokenId);

        _data.read('tokens', tokenId, function (err, tokenData) {
            if (!err && tokenData) {
                tokenData = JSON.parse(tokenData);
                let phone = tokenData.phone;
                //console.log("tokenData is ",tokenData, phone);
                _data.read('users', phone, (err, userData) => {
                    //userData = JSON.stringify(userData)
                    //console.log('userData checks post ', userData)
                    if (!err && userData) {
                        userData = JSON.parse(userData);
                        let userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        //console.log("userData is ",userData, userChecks);

                        if (userChecks.length < config.maxChecks) {
                            let checkId = helpers.createRandomString(20);

                            let checkObject = {
                                'id': checkId,
                                'phone': phone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                'successCodes': successCodes,
                                'timeoutSeconds': timeoutSeconds
                            }

                            //console.log("Check object", checkObject)

                            _data.create('checks', checkId, checkObject, (err) => {
                                if (!err) {
                                    userData.checks = userChecks;
                                    //console.log("typeof userData.checks", userData, userChecks, checkId)
                                    userData.checks.push(checkId);
                                    //console.log('User data updated',userData);
                                    _data.update('users', phone, userData, (err) => {

                                        if (!err) {
                                            //console.log("Check userData", userData)
                                            callback(200, checkObject)
                                        } else {
                                            //console.log("Check fail userData", userData, err)
                                            callback(500, { 'Error': "Could not update the check" });
                                        }
                                    })
                                } else {
                                    callback(500, { 'Error': "Could not create check" })
                                }
                            })
                        } else {
                            //console.log('userChecks.length: ', userChecks.length, 'config.maxChecks ', config.maxChecks)
                            callback(400, { "Error": "Max number of checks reached: " + config.maxChecks })
                        }
                    } else {
                        //callback(403, { "Error": "User Data" });
                    }
                })
            } else {
                callback(403, { "Error": "Token Data" });
            }
        })
    } else {
        //console.log('post error', protocol, url, method, successCodes, timeoutSeconds)
        callback(400, { 'Error': "Missing required inputs or invalid" });
    }
}

handlers._checks.get = (data, callback) => {
    //let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
    let dataQuery = query.parse(data.queryStringObject);
    let parse = query.parse(query.parse(data.queryStringObject).search.replace("?", ''));

    let id = typeof (parse.id) == 'string' && parse.id.trim().length >= 10 ? parse.id.trim() : false;

    /* id is for check id not user id
    if(!id){
        let cookieHeader = JSON.parse(data.headers.cookie);
        let token = typeof (cookieHeader.tokenId) == 'string' ? cookieHeader.tokenId : false;
    }

    console.log('check get data', data, id, "dataQuery :",dataQuery);
    if(parse.method != 'GET'){
        data.method = parse.method;
        console.log('checks post', data)
        //api.users(data, callback);
        if(data.method == 'POST'){
            console.log('checksCreate', data.headers.token)
            handlers._checks.post(data, callback);
            return;
        }
    }*/

    //console.log('check get data', data, id, "dataQuery :",dataQuery);
    if (id) {
        _data.read('checks', id, function (err, checkData) {
            if (!err && checkData) {
                checkData = JSON.parse(checkData)
                let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                handlers._tokens.verifyToken(token, checkData.phone, function (tokenIsValid) {
                    //console.log('check get data',token, checkData);
                    if (tokenIsValid) {
                        callback(200, checkData)
                    } else {
                        callback(403)
                    }
                });
            } else {
                //console.log("Checks get 404 err",err)
                callback(404, err);
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required id', id })
    }
}

handlers._checks.put = (data, callback) => {
    //data = JSON.stringify(data);
    data.payload = typeof (data.payload) == 'string' ? JSON.parse(data.payload) : data.payload;
    //data = JSON.parse(data);
    let id = typeof (data.payload.uid) == 'string' && data.payload.uid.trim().length >= 10 ? data.payload.uid.trim() : false;
    let protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    let url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    let successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    let timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            _data.read('checks', id, function (err, checkData) {
                if (!err && checkData) {
                    let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                    //console.log('checkData phone', checkData, checkData.phone);
                    checkData = JSON.parse(checkData)
                    handlers._tokens.verifyToken(token, checkData.phone, function (tokenIsValid) {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            _data.update('checks', id, checkData, function (err) {
                                if (!err) {
                                    callback(200, { "Result": "User update successful" })
                                } else {
                                    //console.log(err);
                                    callback(500, { "Error": "Could not update the user" })
                                }
                            })

                        } else {

                        }
                    })
                } else {
                    //console.log("error ", err, 'checkData ', checkData)
                    callback(400, { "Error": "Error getting check data" });
                }
            })
        } else {
            callback(400, { "Error": "Missing fields to update" });
        }
    } else {
        //let test = JSON.parse(data.payload);
        //callback(400, { "Error": `Missing id or invalid ${url} ${data.payload.displayId} ${test} ${test.url}` });
        callback(400, { "Error": `Missing id or invalid ${url} ${data.payload.displayId}` });
    }
}

handlers._checks.delete = (data, callback) => {
    let dataQuery = query.parse(data.queryStringObject);
    let parse = query.parse(query.parse(data.queryStringObject).search.replace("?", ''));
    parse = false ? JSON.stringify(parse) : parse;

    let id = typeof (parse.uid) == 'string' && parse.uid.trim().length >= 10 ? parse.uid.trim() : false;

    //let queryString = query.parse(data.queryStringObject).search.replace("?", '');
    //queryString = false ? JSON.stringify(queryString) : false;
    //let id = typeof (queryString.id) == 'string' && queryString.id.trim().length >= 10 ? queryString.id.trim() : false;
    //console.log("QueryString:", queryString,"id:",id,"queryString.id",queryString.id)
    if (id) {
        _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                checkData = JSON.parse(checkData);
                let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                //console.log("Check delete token", token,'checkData.phone',checkData.phone);
                handlers._tokens.verifyToken(token, checkData.phone, function (tokenIsValid) {
                    if (tokenIsValid) {
                        _data.delete('checks', id, function (err) {
                            if (!err) {
                                //console.log('Returning GET data', data);
                                _data.read('users', checkData.phone, function (err, userData) {
                                    if (!err && userData) {
                                        userData = JSON.parse(userData);
                                        let userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                        let checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            userData.checks = userChecks;
                                            _data.update('users', checkData.phone, userData, function (err) {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, { "Error": "Could not update the user" });
                                                }
                                            })
                                        } else {
                                            callback(500, { "Error": "Could not find check in uses data" })
                                        }
                                    } else {
                                        callback(500, { "Error": "Could not delete user" });
                                    }
                                })
                            } else {
                                callback(400, { "Error": " Could not find that user" });
                            }
                        })
                    } else {
                        callback(400, { "Error": "Missing required head token or invalid" })
                    }
                });
            } else {
                callback(400, { "Error": "The specific ID doesn't exist!" })
            }
        })
    } else {
        parse = JSON.stringify(parse.uid);
        callback(400, { 'Error': `Missing required field checks delete ${data.queryStringObject} ${parse} ${id}` });
    }
}

handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers._tokens = {};

//Data: fName, lName, pass, privacy
handlers._users.post = (data, callback) => {
    //Sanitize
    //let dataCheck = typeof(data) == 'string' ? JSON.parse(data) : data;
    data.payload = typeof (data.payload) == 'string' ? JSON.parse(data.payload) : data.payload;
    var fName = typeof (data.payload.fName) == 'string' && data.payload.fName.trim().length > 0 ? data.payload.fName.trim() : false;
    //let fName = JSON.parse(data.payload).fName;
    var lName = typeof (data.payload.lName) == 'string' && data.payload.lName.trim().length > 0 ? data.payload.lName.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
    var pass = typeof (data.payload.pass) == 'string' && data.payload.pass.trim().length > 0 ? data.payload.pass.trim() : false;
    var privacy = typeof (data.payload.privacy) == 'boolean' && true ? true : false;
    //console.log('fName: ', fName, ' lName: ', lName, ' phone: ', phone, ' pass ', pass, ' privacy ', privacy, ' data', data);

    if (fName && lName && pass && phone && privacy) {
        _data.read('users', phone, function (err, data) {
            //console.log('err',err,'data',data);
            if (err) {
                var hashPass = helpers.hash(pass);

                if (hashPass) {
                    var userObject = {
                        'fName': fName,
                        'lName': lName,
                        'phone': phone,
                        'hashPass': hashPass,
                        'privacy': privacy
                    }

                    userObject = typeof(userObject) == 'object' ? userObject : JSON.stringify(userObject);

                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200, { "Result": "User created" });
                        } else {
                            //console.log(err);
                            callback(500, { 'Error': "Could not create the user", userObject, phone, err });
                        }
                    })
                } else {
                    callback(500, { 'Error': 'Hash fail' });
                }
            } else {
                callback(400, { 'Error': 'User exists' });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required fields post 488', data });
    }
}

handlers._users.get = (data, callback) => {

    let parse = query.parse(data.queryStringObject)
    let parse1 = query.parse(parse.search.replace("?", ''));

    //let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
    let phone = typeof (parse1.phone) == 'string' && parse1.phone.trim().length >= 10 ? parse1.phone.trim() : false;

    if (Array.isArray(parse.phone) && phone == false) {
        phone = parse.phone[0];
    }

    /*console.log('User get data', phone, parse.phone[0], data, parse, parse1.method)*/
    //('User get data', phone, data, parse, parse1.method)

    if (parse1.method != 'GET') {
        data.method = parse1.method;
        //console.log('users handlers', data)
        //api.users(data, callback);
        if (data.method == 'DELETE') {
            //console.log('account/delete', data.headers.token)
            handlers._users.delete(data, callback);
            return;
        }
    }

    if (phone) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        /*const cookieRead = document && document.cookie && document.cookie.length > 10 ? document.cookie : '';
        cookieRead = cookieRead.length > 10 ? JSON.parse(cookieRead) : '';
        console.log('Cookie read', cookieRead.tokenId);
        if(cookieRead && cookieRead.tokenId.length < 10 ){
            token = token.length > 10 ? token: cookieRead.tokenId
        }*/
        //console.log('User get token', token)
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        //console.log('Returning GET data', data);
                        data = typeof (data) == 'string' ? JSON.parse(data) : data;
                        delete data.hashPass;
                        //console.log('Handlers data ', data, err)
                        callback(200, data)
                    } else {
                        //console.log("User get 404 err",err)
                        callback(404, err)
                    }
                })
            } else {
                callback(403, { "Error": "Missing required head token or invalid" })
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required data phone', phone, data })
    }
}

handlers._users.put = (data, callback) => {
    data.payload = typeof (data.payload) == 'string' ? JSON.parse(data.payload) : data.payload;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
    var fName = typeof (data.payload.fName) == 'string' && data.payload.fName.trim().length > 0 ? data.payload.fName.trim() : false;
    var lName = typeof (data.payload.lName) == 'string' && data.payload.lName.trim().length > 0 ? data.payload.lName.trim() : false;
    var pass = typeof (data.payload.pass) == 'string' && data.payload.pass.trim().length > 0 ? data.payload.lName.trim() : false;

    //console.warn('Putting user', data);
    if (phone) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                if (fName || lName || pass) {
                    _data.read("users", phone, function (err, userData) {
                        if (!err && userData) {
                            userData = JSON.parse(userData);
                            if (fName) {
                                userData.fName = fName;
                            }
                            if (lName) {
                                userData.lName = lName;
                            }
                            if (pass) {
                                userData.hashPass = helpers.hash(pass);
                            }

                            //userData = JSON.parse(userData);
                            _data.update('users', phone, userData, function (err) {
                                if (!err) {
                                    userData = JSON.stringify(userData);
                                    callback(200, { "Result": `User update successful ${fName} ${userData.fName}` })
                                } else {
                                    //console.log(err);
                                    callback(500, { "Error": "Could not update the user" })
                                }
                            })
                        } else {
                            callback(400, { "Error": "The specified user does not exist" });
                        }
                    })
                } else {
                    callback(400, { "Error": "Missing fields to update" });
                }
            } else {
                callback(400, { "Error": "Missing required head token or invalid" })
            }
        })
    } else {
        //data = JSON.stringify(data.payload);
        //data = JSON.parse(data.payload);
        callback(400, { "Error": `Missing required field users put ${data.payload.phone} ${data.payload}` });
    }
}

handlers._users.delete = (data, callback) => {
    let parse = query.parse(data.queryStringObject)
    //let parse1 = query.parse(parse.search.replace("?", ''));

    //JSON.stringify(parse.phone[0])

    let phone = typeof (parse.phone[0]) == 'string' && parse.phone[0].trim().length >= 10 ? parse.phone[0].trim() : false;
    //let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
    /*
    let phone = typeof (parse1.phone) == 'string' && parse1.phone.trim().length >= 10 ? parse1.phone.trim() : false;
    
    if(!phone){
        phone = JSON.stringify(parse.phone[0]).trim();
    };
    */

    let cookieHeader = JSON.parse(data.headers.cookie);

    //console.log('Deleting user', cookieHeader)

    //let phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length >= 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        let token = typeof (cookieHeader.tokenId) == 'string' ? cookieHeader.tokenId : false;
        //token = false ? data.cookie.tokenId : false;
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        //console.log('Returning GET data', data);
                        _data.delete('users', phone, function (err) {
                            if (!err) {
                                callback(200, data);
                            } else {
                                callback(500, { "Error": "Could not delete user" });
                            }
                        })
                    } else {
                        callback(400, { "Error": " Could not find that user" });
                    }
                })
            } else {
                //data =  JSON.stringify(data);
                callback(400, { "Error": `Missing required head token or invalid ${data.headers} ${token} ${phone}` })
            }
        });
    } else {
        //parse = JSON.stringify(parse.phone[0])
        parse = parse.phone[0]
        callback(400, { 'Error': `Missing required field users delete ${parse} ${phone}` });
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
    //console.trace('Handlers POST');
    //Sanitize
    data.payload = typeof (data.payload) == 'string' ? JSON.parse(data.payload) : data.payload;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
    var pass = typeof (data.payload.pass) == 'string' && data.payload.pass.trim().length > 0 ? data.payload.pass.trim() : false;
    //console.log('Tokens posting', pass, phone, data)
    if (pass && phone) {
        _data.read('users', phone, function (err, userData) {
            //console.log('Tokens posting ', err, 'userData', userData);

            if (!err && userData) {
                var hashPass = helpers.hash(pass);
                //let parse = JSON.parse(userData);
                //let parse = userData;
                let parse = typeof(userData) == 'string' ? JSON.parse(userData): userData;

                if (hashPass == parse.hashPass) {
                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;

                    var tokenObject = {
                        phone: phone,
                        tokenId: tokenId,
                        expires: expires
                    }

                    let tokenJwt = helpers.generateJwt(tokenObject);
                    //console.log('JWT Token', tokenJwt)

                    _data.create('tokens', tokenId, tokenObject, function (err) {
                        if (!err) {
                            //console.log(helpers.verifyJwt(tokenJwt))
                            callback(200, tokenObject);
                        } else {
                            //console.log(err);
                            callback(500, { 'Error': "Could not create the token" });
                        }
                    })
                } else {
                    callback(400, { 'Error': `Password doesn't match` });
                }
            } else {
                callback(400, { 'Error': 'Could not find user' });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required fields tokens post needs phone, pass', data });
    }
}

handlers._tokens.get = (data, callback) => {
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length >= 10 ? data.payload.id.trim() : false;
    //console.log("tokens id: ", data.queryStringObject.id, data);
    let parse = query.parse(data.queryStringObject)
    let parse1 = query.parse(parse.search.replace("?", ''));
    //console.log("Parse get token ", parse, 'Parse id', parse1.id, data);
    //console.log("Parse get token id", parse1.id, data.headers.token);

    if (parse1.id) {
        _data.read('tokens', parse1.id, function (err, tokenData) {
            if (!err && tokenData) {
                {
                    //console.log('Returning GET tokenData', tokenData);
                    tokenData = JSON.parse(tokenData);
                    callback(200, tokenData)
                }
            } else {
                //console.log("Tokens get 404 err",err)
                callback(404, err)
            }
        })

    } else {
        callback(400, { 'Error': 'Missing required data id', data })
    }
}

handlers._tokens.put = (data, callback) => {
    data.payload = typeof (data.payload) == 'string' ? JSON.parse(data.payload) : data.payload;
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length >= 10 ? data.payload.id.trim() : false;
    let extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    //console.log("Token put id:", id, JSON.stringify(data.payload), "extend", extend, data);

    if (id && extend) {
        _data.read('tokens', id, function (err, tokenData) {
            //console.log("TokenData", tokenData,'err', err);
            if (!err && tokenData && tokenData.length > 10) {

                let parse = JSON.parse(tokenData);
                if (parse.expires > Date.now()) {
                    parse.expires = Date.now() + 1000 * 60 * 60;
                    _data.update('tokens', id, parse, function (err) {

                        /*    // Check to make sure the token isn't already expired
                        if(tokenData.expires > Date.now()){
                            // Set the expiration an hour from now
                            tokenData.expires = Date.now() + 1000 * 60 * 60;
                            // Store the new updates
                            _data.update('tokens',id,tokenData,function(err){*/
                        if (!err) {
                            callback(200, { "Result": "Token expiration updated" });
                        } else {
                            callback(500, "Could not update token expiration");
                        }
                    });
                } else {
                    //console.log("tokenData.expires:",tokenData.expires,"Date.now()+1000*60*60", Date.now()+1000*60*60)
                    callback(400, { "Error": "The token has expired" });
                };
            } else {
                callback(400, { "Error": "Specified tokens does not exist" });
            };
        });
    } else {
        callback(400, { "Error": "Missing or invalid field(s)" });
    };
};

handlers._tokens.delete = (data, callback) => {
    //console.log("Delete data", data);
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length >= 20 ? data.payload.id.trim() : false;
    if (id) {
        _data.read('tokens', id, function (err, data) {
            if (!err && data) {
                //console.log('Returning GET data', data);
                _data.delete('tokens', id, function (err) {
                    if (!err) {
                        callback(200, { "Result": "Logout successful" });
                    } else {
                        callback(500, { "Error": "Could not delete token" });
                    }
                })
            } else {
                callback(400, { "Error": " Could not find that token" });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required field token delete' });
    }
}

//Validate user and token
handlers._tokens.verifyToken = (id, phone, callback) => {
    _data.read('tokens', id, function (err, tokenData) {
        //console.log("verify tokenData", tokenData, id, phone)
        //let parse = JSON.parse(tokenData)
        //console.log("verify tokenData",parse.tokenId);
        /*
        if (!err && parse) {
            if (parse.phone == phone && parse.expires > Date.now()) {
                */
        if (!err && tokenData) {
            tokenData = typeof (tokenData) == 'string' ? JSON.parse(tokenData) : tokenData;
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                //console.log("verify tokenData success");
                callback(true);
            } else {
                //console.log("verify tokenData not accessing parsed tokenData?", tokenData);
                callback(false);
            }
        } else {
            //console.log("verify tokenData failed err ir no data",err, tokenData);
            callback(false);
        }
    })
}

handlers.ping = function (data, callback) {
    callback(200);
};

handlers.notFound = function (data, callback) {
    //console.log("Legit not found 404 err")
    callback(404);
};

module.exports = handlers;