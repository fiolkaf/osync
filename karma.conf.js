// Karma configuration
// Generated on Sun Jan 25 2015 19:21:23 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'test-config/test-main.js',
      {pattern: 'node_modules/unexpected/*.js', included: false},
      {pattern: 'node_modules/bussi/src/*.js', included: false},
      {pattern: 'node_modules/array.prototype.*/index.js', included: true},
      {pattern: 'node_modules/polyfill-function-prototype-bind/*.js', included: false},
      {pattern: 'src/**/*.js', included: false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
        reporters:[
            {type: 'json', dir:'coverage/'},
            {type: 'html', dir:'coverage/'}
        ],
    },

    // web server port
    port: 9879,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
