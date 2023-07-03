const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const query = require("querystring");

var helpers = {};

helpers.hash = (str) =>{
    if(typeof(str)=='string' && str.length >0){
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        //console.log('hash', hash);
        return hash;
    }else{
        //console.log("Str not hashing", str)
        return false;
    }
}

helpers.parseJsonToObject = (str) => {
    try{
        let obj = decodeURIComponent(str);
        return obj;
    }catch(e){
        return {};
    }
}

helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

    if(strLength){
        let possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmonpqrstuvwxyz0123456789';
        let str = '';
        for(i = 1; i<strLength; i++){
            let randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str +=  randomChar;
        }
        return str;
    }else{
        return false;
    }
}

helpers.sendTwilioSms = (phone, msg, callback) => {
    phone = typeof(phone) == "string" && phone.trim().length >= 10 ? phone.trim(): false;
    msg = typeof(msg) == "string" && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    
    if(phone && msg){
        let payload = {
            "From": config.twilio.fromPhone,
            "To": '+1'+phone,
            "Body": msg,
        }

        let stringPayload = query.stringify(payload);

        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts'+config.twilio.accountSid+'/Messages.json',
            'auth': config.twilio.accountSid+':'+config.twilio.authToken,
            'headers':{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload),
            }
        };

        let req = https.request(requestDetails, function(res){
            let status = res.statusCode;

            if(status == 200 || status == 201){
                callback(false)
            }else{
                callback('Status code was '+false);
            }
        });

        req.on('error',(e)=>{
            callback(e);
        });

        req.write(stringPayload);

        req.end();

    }else{
        callback(400, {"Error":"Missing required fields"})
    }
}

module.exports = helpers;