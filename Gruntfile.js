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
                        'statements': 70,
                        'branches': 70,
                        'lines': 70,
                        'functions': 70
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
