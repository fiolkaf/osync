module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js']
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        coverage: {
            default: {
                options: {
                    thresholds: {
                        'statements': 80,
                        'branches': 80,
                        'lines': 80,
                        'functions': 80
                    },
                    dir: 'coverage',
                    root: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-istanbul-coverage');

    grunt.registerTask('default', ['jshint', 'karma', 'coverage']);
};
