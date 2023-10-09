process.env.NODE_ENV = 'testing';

_app = {};

_app.tests = {};

_app.tests.unit = require('./unit.cjs');
_app.tests.api = require('./api.cjs');

_app.countTests = () => {
    let counter = 0;

    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    counter++;
                }
            }
        }
    }
    return counter;
}

_app.runTests = (done) => {
    let error = [];
    let success = 0;
    let limit = _app.countTests();
    let counter = 0;
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    //console.log('\x1b[32m%s\x1b[0m', "Testing", testName);
                    (function() {
                        let tmpTestName = testName;
                        var testValue = subTests[testName];
                        //console.log('\x1b[32m%s\x1b[0m', "Testing", tmpTestName);

                        try {
                            testValue(function() {
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                success++;

                                if (counter == limit) {
                                    _app.produceTestReport(limit, success, error);
                                }
                            });
                        } catch (e) {
                            error.push({
                                'name': testName,
                                'error': e
                            });

                            console.log('\x1b[31m%s\x1b[0m', tmpTestName);
                            counter++;

                            if (counter == limit) {
                                _app.produceTestReport(limit, success, error);
                            }
                        }
                    })();
                }
            }
        }
    }
    _app.produceTestReport(limit, success, error);
}


_app.produceTestReport = (limit, success, error) => {
    console.log("");
    console.log("-----------BEGIN TEST REPORT-----------");
    console.log("");
    console.log("Total Tests: ", limit);
    console.log("Pass: ", success);
    console.log("Fail: ", error.length);
    console.log("");

    if (error.length > 0) {
        console.log("");
        console.log("-----------BEGIN ERROR DETAILS---------");

        error.forEach((element) => {
            console.log('\x1b[31m%s\x1b[0m', element.name);
            console.log(element.error);
            console.log('');
        });
    }

    console.log("");
    console.log("-------------END TEST REPORT------------");
    process.exit(0);
}

_app.runTests();