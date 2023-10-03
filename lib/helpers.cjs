const crypto = require('crypto');
const config = require('./config.cjs');
const https = require('https');
const query = require("querystring");
const path = require('path');
const fs = require('fs');

const envFilePath = path.resolve(__dirname, '.env');

if (fs.existsSync(envFilePath)) {
    const envFileContents = fs.readFileSync(envFilePath, 'utf8');
    const envLines = envFileContents.split('\n');

    // Process each line and set environment variables
    envLines.forEach((line) => {
        //console.log('line', line)
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
    //console.log('process env', process.env)
}

var helpers = {};

helpers.hash = (str) => {
    if (typeof (str) == 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        //console.log('hash', hash);
        return hash;
    } else {
        //console.log("Str not hashing", str)
        return false;
    }
}

helpers.parseJsonToObject = (str) => {
    try {
        let obj = decodeURIComponent(str);
        return obj;
    } catch (e) {
        return {};
    }
}

helpers.createRandomString = (strLength) => {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;

    if (strLength) {
        let possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmonpqrstuvwxyz0123456789';
        let str = '';
        for (i = 1; i < strLength; i++) {
            let randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomChar;
        }
        return str;
    } else {
        return false;
    }
}

helpers.sendTwilioSms = (phone, msg, callback) => {
    phone = typeof (phone) == "string" && phone.trim().length >= 10 ? phone.trim() : false;
    msg = typeof (msg) == "string" && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if (phone && msg) {
        let payload = {
            "From": config.twilio.fromPhone,
            "To": '+1' + phone,
            "Body": msg,
        }

        let stringPayload = query.stringify(payload);

        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts' + config.twilio.accountSid + '/Messages.cjson',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload),
            }
        };

        let req = https.request(requestDetails, function (res) {
            let status = res.statusCode;

            if (status == 200 || status == 201) {
                callback(false)
            } else {
                callback('Status code was ' + false);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringPayload);

        req.end();

    } else {
        callback(400, { "Error": "Missing required fields helpers twilio" })
    }
}

helpers.getStaticAsset = (fileName, callback) => {
    fileName = typeof (fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if (fileName) {
        let publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir + fileName, (err, data) => {
            if (!err && data) {
                callback(false, data);
            } else {
                callback("No file found");
            }
        })
    }

}

helpers.getTemplate = (templateName, data, callback) => {
    templateName = 'string' && templateName.length > 0 ? templateName : false;
    data = typeof (data) == 'object' && data !== null ? data : {};

    //console.log('Template Name', templateName)
    if (templateName) {
        let templateDir = path.join(__dirname, '/../templates/');
        fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
            //console.log('Str', str, err)
            if (!err && str && str.length > 0) {
                let finalString = helpers.interpolate(str, data);
                //console.log('finalString',finalString);
                callback(false, finalString);
            } else {
                callback('No template found')
            }
        })
    } else {
        callback("Template name not valid");
    }
}

helpers.addTemplates = (str, data, callback) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};

    helpers.getTemplate('_header', data, (err, header) => {
        if (!err && header) {
            helpers.getTemplate('_footer', data, (err, footer) => {
                if (!err && footer) {
                    let fullString = header + str + footer;
                    callback(false, fullString);
                } else {
                    callback('Could not find footer');
                }
            })
        } else {
            callback("Could not find header");
        }
    })
}

helpers.interpolate = (str, data) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};

    for (let keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName];
        }
    }

    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key] == 'string')) {
            let replace = data[key];
            let find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }

    return str;
}

// In-memory store for storing tokens (not suitable for production)
const tokenStore = {};
const secretKey = process.env.secret;

// Helper function to generate a JWT
helpers.generateJwt = (payload) => {
    // Create a header (base64url-encoded JSON)
    const header = Buffer.from(JSON.stringify({ alg: 'HS512', typ: 'JWT' })).toString('base64');

    // Create a payload (base64url-encoded JSON)
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Create a signature (HMAC-SHA256)
    const signature = crypto.createHmac('sha512', secretKey)
        .update(`${header}.${encodedPayload}`)
        .digest('base64');

    //console.log(`Token ${header}.${encodedPayload}.${signature}`)
    // Concatenate the header, payload, and signature with periods
    return `${header}.${encodedPayload}.${signature}`;
};

// Helper function to verify a JWT
helpers.verifyJwt = (token) => {
    const [header, encodedPayload, signature] = token.split('.');

    // Verify the signature
    const expectedSignature = crypto.createHmac('sha512', secretKey)
        .update(`${header}.${encodedPayload}`)
        .digest('base64');

    if (signature !== expectedSignature) {
        return false;
    }

    // Decode the payload and verify the expiration (you can add more checks)
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf-8'));
    //console.log('JWT decoded payload', payload);

    // Check expiration (example: 1-hour expiration)
    if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
    }

    // Check if the token is in the store
    if (!tokenStore[token]) {
        return false;
    }

    //console.log('Token verify successful');
    return true;
}

module.exports = helpers;