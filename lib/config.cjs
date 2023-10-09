const environments = {};

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisisItB36v1s!',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC20a5b2b04',
        'authToken': '55a014d5cf',
        'fromPhone': '+2022222222',
    },
    'templateGlobals': {
        'appName': "Uptime Checker",
        'companyName': 'Glenn Pickett',
        'yearCreated': '2023',
        'baseUrl': 'https://localhost:3001'
        //'baseUrl': 'https://10.0.0.187:3001'
    }
};

environments.testing = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'staging',
    'hashingSecret': 'thisisItB36v1s!',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC20a5b2b04',
        'authToken': '55a014d5cf',
        'fromPhone': '+2022222222',
    },
    'templateGlobals': {
        'appName': "Uptime Checker",
        'companyName': 'Glenn Pickett',
        'yearCreated': '2023',
        'baseUrl': 'https://localhost:3001'
        //'baseUrl': 'https://10.0.0.187:3001'
    }
};

environments.production = {
    'port': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisisItB36v1s!',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC20a5b2b04',
        'authToken': '55a014d5cf',
        'fromPhone': '+2022222222',

    },
    'templateGlobals': {
        'appName': "Uptime Checker",
        'companyName': 'Glenn Pickett',
        'yearCreated': '2023',
        'baseUrl': 'https://rest-jet.vercel.app'
    }
};

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const envExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = envExport;