const helpers = require('../lib/helpers.cjs');
const assert = require('assert');
const logs = require('./../lib/logs.cjs');
const example = require('./../lib/exampleProblem.cjs');

let unit = {};

unit['helpers.getANumber should return 1'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(val, 1);
    done();
}

unit['helpers.getANumber should return a number'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(typeof (val), 'number');
    done();
}

unit['helpers.getANumber should return 2'] = function (done) {
    let val = helpers.getANumber();
    assert.equal(val, 2);
    done();
}

unit['logs.list should callback a false error and an array of log names'] = function (done) {
    logs.list(true, function (err, logFileNames) {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
}

unit['logs.truncate should not throw error, but a callback'] = function (done) {
    assert.doesNotThrow(function () {
        logs.truncate("I do not exist", function (err) {
            assert.ok(err);
            done();
        });
        //}, TypeError);
    });
};

unit['problem.init should not throw error'] = function (done) {
    assert.doesNotThrow(function () {
        example.init();
        done();
        }, TypeError);
    //});
};

module.exports = unit;