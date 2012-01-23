require.load('./mocha.js');

window.assert = function (expr, msg) {
    if (!expr) throw new Error(msg || 'failed');
}

var suite = new mocha.Suite;
mocha.interfaces.bdd(suite);
suite.emit('pre-require', window);

var utils = mocha.utils;
var push = require('/push');
    
function Reporter (runner) {
    mocha.reporters.Base.call(this, runner);
    
    runner.on('fail', function (test, err) {
        push('log', { message : 'fail!' });
        
        push('assert', {
            type : 'fail',
            ok : false,
            name : test.fullTitle(),
            found : err.toString(),
            wanted : undefined
        });
        if (err.uncaught) runner.emit('test end', test);
    });
    
    runner.on('pass', function (test) {
        push('log', { message : 'pass!' });
        
        push('assert', {
            type : 'ok',
            ok : true,
            name : test.fullTitle(),
            found : undefined,
            wanted : undefined
        });
    });
    
    runner.on('test end', function () {
        push('log', { message : 'start!' });
    });
    
    runner.on('test end', function (test) {
        push('log', { message : 'test end' });
        push('testEnd', {});
    });
     
    runner.on('suite', function (suite) {
        push('log', { message : 'suite begin' });
        push('testBegin', { name : Object.keys(suite) });
    });
    
    runner.on('suite end', function (suite) {
        push('log', { message : 'suite end' });
        push('end', {});
    });
    
    push('log', { message : 'test log' });
    setTimeout(function () {
        push('end', {});
    }, 1000);
}
Reporter.prototype = new(mocha.reporters.Base);

setTimeout(function () {
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var reporter = new Reporter(runner);
    runner.run();
}, 1);

require.load('./test.js');
