var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  paths: {
    'unexpected': 'node_modules/unexpected/unexpected',
    'messagebus': 'node_modules/bussi/src/messagebus',
    'bind-polyfill': 'node_modules/polyfill-function-prototype-bind/bind',
    'es5': 'node_modules/es5-shim/es5-shim',
    'es6': 'node_modules/es6-shim/es6-shim',
  },

  shim: {
      'unexpected': {
          deps: ['es5', 'es6']
      }
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
