let path = require('path');
let fs = require('fs');
let _data = require('./data');
const http = require('http');
const https = require('https');
const url = require('url');
const helpers = require('./helpers');
const query = require("querystring");
const config = require('./config');
let _logs = require('./logs');

let workers = {};

workers.loop = ()=>{
    setInterval(()=>{
        workers.gatherAll();
    }, 1000 * 5)
}

workers.gatherAll = ()=>{
    _data.list('checks', (err, checks)=>{
        if(!err && checks && checks.length > 0){
            //console.log('checks', checks)
            checks.forEach((check)=>{
                _data.read('checks', check, (err, originalCheck)=>{
                    //console.log('Original check',check, originalCheck)
                    if(!err && originalCheck){
                        workers.validateCheck(originalCheck)
                    }else{
                        //console.log('Error reading one of the checks data')
                    }
                })
            })

        }else{
            console.log('Error: Could not find any checks to process');
        }
    })
}

workers.validateCheck = (originalCheck)=>{
    //originalCheck = JSON.parse(originalCheck);
    originalCheck = typeof(originalCheck)=="object" && originalCheck !== null ? originalCheck : {};
    originalCheck.id = typeof(originalCheck.id) == "string" && originalCheck.id.trim().length >= 15 ? originalCheck.id.trim() : false;
    originalCheck.phone = typeof(originalCheck.phone) == "string" && originalCheck.phone.trim().length >= 10 ? originalCheck.phone.trim() : false;
    originalCheck.protocol = typeof(originalCheck.protocol) == "string" && ['http','https'].indexOf(originalCheck.protocol) > -1 ? originalCheck.protocol : false;
    originalCheck.url = typeof(originalCheck.url) == "string" && originalCheck.url.trim().length >= 0 ? originalCheck.url.trim() : false;
    originalCheck.method = typeof(originalCheck.method) == "string" && ['get','post','put','delete'].indexOf(originalCheck.method) > -1 ? originalCheck.method : false;
    originalCheck.successCodes = typeof(originalCheck.successCodes) == "object" && originalCheck.successCodes instanceof Array && originalCheck.successCodes.length > 0 ? originalCheck.successCodes : false;
    originalCheck.timeoutSeconds = typeof(originalCheck.timeoutSeconds) == "number" && originalCheck.timeoutSeconds % 1 === 0 && originalCheck.timeoutSeconds >=1 ? originalCheck.timeoutSeconds : false;

    originalCheck.state = typeof(originalCheck.state) == "string" && ['up','down'].indexOf(originalCheck.state) > -1 ? originalCheck.state : false;
    originalCheck.lastCheck = typeof(originalCheck.lastCheck) == "number" && originalCheck.lastCheck % 1 === 0 ? originalCheck.lastCheck : false;

    if(originalCheck.id && originalCheck.phone && originalCheck.protocol && originalCheck.url && originalCheck.method && originalCheck.successCodes && originalCheck.timeoutSeconds){
        //console.log('originalCheck',originalCheck)
        workers.performCheck(originalCheck)
    }else{
        //console.log("Error: Check invalid format or all false");
    }
}

workers.performCheck = (originalCheck) =>{
    let checkOutcome = {
        'error': false,
        'responseCode': false
    }

    let outcomeSent = false;
    let parseUrl = query.parse(originalCheck.protocol+'://'+originalCheck.url, true)
    let hostName = parseUrl.hostName;
    let path = parseUrl.path;

    let requestDetails = {
        'protocol': originalCheck.protocol+':',
        'hostname': hostName,
        'method': originalCheck.method.toUpperCase(),
        'path': path,
        'timeout': originalCheck.timeoutSeconds *1000,
    }

    let _moduleToUse = originalCheck.protocol == 'http' ? http : https;
    let req = _moduleToUse.request(requestDetails, (res)=>{
        let status = res.statusCode;
        checkOutcome.responseCode = status;
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheck, checkOutcome)
        }
    })

    req.on('error',(e)=>{
        checkOutcome.error = {
            'error': true,
            'value' : e
        }

        if(!outcomeSent){
            workers.processCheckOutcome(originalCheck, checkOutcome);
            outcomeSent = true;
        }
    })

    req.on('timeout',(e)=>{
        checkOutcome.error = {
            'error': true,
            'value' : 'timeout'
        }

        if(!outcomeSent){
            workers.processCheckOutcome(originalCheck, checkOutcome);
            outcomeSent = true;
        }
    })

    req.end();
}

workers.processCheckOutcome = (originalCheck, checkOutcome) => {
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheck.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up':'down';

    let useAlert = originalCheck.lastCheck && originalCheck.state !== state ? true : false;
    let newCheck = originalCheck;
    newCheck.state = state;

    let checkTime = Date.now();
    newCheck.lastCheck = checkTime;

    //workers.log(originalCheck, checkOutcome, state, useAlert, checkTime)

    _data.update('checks', newCheck.id, newCheck, (err)=>{
        if(!err){
            //console.log('useAlert ',useAlert, originalCheck, 'state', state, checkOutcome)
            if(useAlert){
                workers.alertUser(newCheck);
            }else{
                //console.log("Check outcome same")
            }
        }else{
            console.log("Error saving check update"); 
        }

    })
}

workers.log = (originalCheck, checkOutcome, state, useAlert, checkTime) =>{
    let logData = {
        'check': originalCheck,
        'outcome': checkOutcome,
        'state': state,
        "alert": useAlert,
        'time': checkTime
    }

    let logString = JSON.stringify(logData);

    let logFileName = originalCheck.id;

    _logs.append(logFileName, logString, (err)=>{
        if(!err){
            //console.log("Logging file success","logFileName: ", logFileName, "logString",logString);
        }else{
            console.log("Logging file failed");
        }
    });
}

workers.alertUser = (newCheck) =>{
    let msg = 'Alert check for'+newCheck.method.toUpperCase()+' '+newCheck.url+' is currently '+newCheck.state;
    helpers.sendTwilioSms(newCheck.phone, msg, (err, callback)=>{
        if(!err){
            //console.log('Success sent message to user', msg);
        }else{
            //console.log('Error sending SMS to user', msg);
        }
    })
}

workers.rotateLogs = () =>{
    _logs.list(false, (err, logs)=>{
        if(!err && logs && logs.length > 0){
            logs.forEach((logName)=>{
                let logId = logName.replace(".log","");
                let newFileId = logId+"-"+Date.now();
                _logs.compress(logId, newFileId, (err)=>{
                    if(!err){
                        _logs.truncate(logId, (err)=>{
                            if(!err){
                                //console.log("Success truncating file")
                            }else{
                                console.log("Error truncating file")
                            }
                        })
                    }else{
                        console.log("Error compressing file", err)
                    }
                })
            })
        }
    })
}

workers.logRotationLoop = ()=>{
    setInterval(()=>{
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24)
}


workers.init = ()=>{
    //console.log('\x1b[33m%s\x1b[0m','Background workers started');
    workers.gatherAll();

    workers.loop();

    workers.rotateLogs();

    workers.logRotationLoop();
}

module.exports = workers;