var crypto = require('crypto');
const config = require('./config');

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

module.exports = helpers;