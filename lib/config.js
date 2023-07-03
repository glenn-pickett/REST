const environments = {};

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisisItB36v1s!',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC20a5b2b0456c8bf350cb4850738b0e57',
        'authToken': '55a014d5cfde9610b0fb9fd738176936',
        'fromPhone': '+13014125476',
    }
};

environments.production = {
    'port': 5000,
    'httpPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisisB1##3rB36v1s!',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC20a5b2b0456c8bf350cb4850738b0e57',
        'authToken': '55a014d5cfde9610b0fb9fd738176936',
        'fromPhone': '+13014125476',
    }
};

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const envExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = envExport;