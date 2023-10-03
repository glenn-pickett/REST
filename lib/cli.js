const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
const os = require('os');
const v8 = require('v8');
class _events extends events { };
const e = new _events();
const _data = require('./data');
const _logs = require('./logs');
const helpers =require('./helpers');

let cli = {};

e.on('man', (str) => {
    cli.responders.help();
});

e.on('help', (str) => {
    cli.responders.help();
});

e.on('exit', (str) => {
    cli.responders.exit();
});

e.on('stats', (str) => {
    cli.responders.stats();
});

e.on('list users', (str) => {
    cli.responders.listUsers();
});

e.on('more user info', (str) => {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', (str) => {
    cli.responders.listChecks();
});

e.on('more check info', (str) => {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', (str) => {
    cli.responders.listLogs();
});

e.on('more log info', (str) => {
    cli.responders.moreLogInfo(str);
});

cli.responders = {};

cli.responders.help = () => {
    const commands = {
        'exit': 'Kill CLI (and the application)',
        'man': 'Alias for help page',
        'help': 'Show this help page',
        'stats': 'Get stats on operating system and resources',
        'list users': 'Show list of users',
        'List users': 'Show a list of all the registered (undeleted) users in the system',
        'More user info --{userId}': 'Show details of a specified user',
        'List checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
        'More check info --{checkId}': 'Show details of a specified check',
        'List logs': 'Show a list of all the log compressed files available to be read',
        'More log info --{logFileName}': 'Show details of a specified log file',
    }

    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            let value = commands[key];
            let line = '\x1b[34m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);
    cli.horizontalLine();
}

cli.verticalSpace = (lines) => {
    lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('');
    }
}

cli.horizontalLine = () => {
    let width = process.stdout.columns;

    let line = '';
    for (i = 0; i < width; i++) {
        line += '-';
    }
    console.log(line);
}

cli.centered = (str) => {
    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : '';
    let width = process.stdout.columns;

    let leftPadding = Math.floor((width - str.length) / 2);

    let line = '';
    for (i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);
}

cli.responders.exit = () => {
    process.exit(0);
}

cli.responders.stats = () => {
    let stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime': os.uptime() + 'Seconds',
    }

    cli.horizontalLine();
    cli.centered('CLI STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            let value = stats[key];
            let line = '\x1b[34m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);
    cli.horizontalLine();
}

cli.responders.listUsers = () => {
    _data.list('users', (err, userIds) => {
        if (!err && userIds && userIds.length > 0) {
            cli.verticalSpace();
            userIds.forEach((userId) => {
                _data.read('users', userId, (err, userData) => {
                    userData = JSON.parse(userData);
                    if (!err && userData) {
                        let line = 'Name: ' + userData.fName + ' ' + userData.lName + ' Phone: ' + userData.phone + ' Checks: ';
                        let numberOfChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line += numberOfChecks;
                        console.log(line);
                        cli.verticalSpace();
                    }
                    //console.log(userData)
                })
            })
        }
    })
}

cli.responders.moreUserInfo = (str) => {
    let arr = str.split('--');
    let userId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if (userId) {
        //202-115-5555
        //console.log('user id', userId, arr);
        _data.read('users', userId, (err, userData) => {
            userData = JSON.parse(userData);
            delete userData.hashPass;

            cli.verticalSpace();
            console.dir(userData, { 'colors': true });
            cli.verticalSpace();
        })
    }
}

cli.responders.listChecks = (str) => {
    _data.list('checks', (err, checksIds) => {

        if (!err && checksIds && checksIds.length > 0) {
            cli.verticalSpace();
            //console.log('checksIds', checksIds);
            checksIds.forEach((checkId) => {
                _data.read('checks', checkId, (err, checkData) => {
                    if (!err && checkData) {
                        checkData = typeof (checkData) == 'string' && checkData.length > 0 ? JSON.parse(checkData) : null;
                        //console.log('checkData', checkData, checkData.protocol)//Initially string
                        let includeCheck = false;
                        let lowerString = str ? str.toLowerCase() : 'unknown';

                        let state = typeof (checkData.state) == 'string' ? checkData.state : 'down';
                        let stateOrUnknown = typeof (checkData.state) == 'string' ? checkData.state : 'unknown';

                        if (lowerString.indexOf('--' + state) > -1 || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)) {
                            let line = 'ID: ' + checkData.id + ' '
                            if (checkData.method && checkData.method.length > 0) {
                                line += checkData.method.toUpperCase() + ' '
                            }
                            line += checkData.protocol + '://' + checkData.url + ' State : ' + stateOrUnknown;
                            console.log(line);
                            cli.verticalSpace();
                        }
                    }
                    //

                    //
                })
            })
        } else {
            console.log('Error checksIds', checksIds, err);
        }
    })
}

cli.responders.moreCheckInfo = (str) => {
    let arr = str.split('--');
    let checkId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if (checkId) {
        //202-115-5555
        //console.log('user id', userId, arr);
        _data.read('checks', checkId, (err, checkData) => {
            checkData = JSON.parse(checkData);

            cli.verticalSpace();
            console.dir(checkData, { 'colors': true });
            cli.verticalSpace();
        })
    }
}

cli.responders.listLogs = () => {
    _logs.list(true, (err, logFileNames) => {
        if (!err && logFileNames && logFileNames.length > 0) {
            cli.verticalSpace();
            logFileNames.forEach((logFileName)=>{
                if(logFileName.indexOf('-')> -1){
                    console.log(logFileName);
                    cli.verticalSpace();
                }
            });
        }
    });
}

cli.responders.moreLogInfo = (str) => {
    let arr = str.split('--');
    let logFileName = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if (logFileName) {
        cli.verticalSpace();

        _logs.decompress(logFileName, (err, strData)=>{
            if(!err && strData){
                let arr = strData.split('\n');
                arr.forEach((jsonString)=>{
                    let logObject = helpers.parseJsonToObject(jsonString);
                    if(logObject && JSON.stringify(logObject) !== '{}'){
                        console.dir(logObject, {'colors': true});
                        cli.verticalSpace();
                    } else {
                        console.log('Error logObject', logObject);
                    }
                })
            } else {
                console.log('Error strData', strData, err);
            }
        })
            //checkData = JSON.parse(checkData);
    };
}

cli.processInput = (str) => {
    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : false;

    if (str) {
        let uniqueInputs = [
            'man',
            'help',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        let matchFound = false;
        let counter = 0;

        //console.log('uniqueInputs', uniqueInputs)
        uniqueInputs.some((input) => {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;

                e.emit(input, str);
                return true;
            }
        });

        if (!matchFound) {
            console.log("Sorry, try again.");
        }
    }
}

cli.init = () => {
    //console.log('\x1b[34m%s\x1b[0m', "CLI is running");

    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });

    _interface.prompt();

    _interface.on('line', (str) => {
        cli.processInput(str);

        //Re-initialize prompt
        _interface.prompt();
    });

    _interface.on('close', () => {
        process.exit(0);
    });
}

module.exports = cli;