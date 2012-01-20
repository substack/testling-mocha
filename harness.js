function assert(expr, msg) {
    if (!expr) throw new Error(msg || 'failed');
}

var suite = new mocha.Suite;
var utils = mocha.utils;
var Reporter = function (runner) {
    var push = require('/push');
    
    mocha.reporters.Base.call(this, runner);
    
    runner.on('fail', function (test, err) {
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
        push('assert', {
            type : 'ok',
            ok : true,
            name : test.fullTitle(),
            found : undefined,
            wanted : undefined
        });
    });
    
    runner.on('test end', function (test) {
        push('testEnd', {});
    });
     
    runner.on('suite', function (suite) {
        push('testBegin', { name : test.fullName() });
    });
    
    runner.on('suite end', function (suite) {
        push('end', {});
    });
    
    push('end', {});
};

mocha.interfaces.bdd(suite);
suite.emit('pre-require', window);

process.nextTick(function () {
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var reporter = new Reporter(runner);
    runner.run();
});
