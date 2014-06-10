'use strict';

module.exports = function(grunt) {
    var srcFiles = ['src/clickjacket.js'];
    var testFiles = ['test/*.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            src: srcFiles,
            options: {
                specs: testFiles,
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: '.coverage.json',
                    report: [{type: 'text-summary'}, {type: 'html'}],
                    thresholds: {
                        statements: 100,
                        branches: 100,
                        functions: 100,
                        lines: 100
                    }
                }
            }
        },
        jshint: {
            lint: srcFiles.concat(testFiles),
            options: {
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
            src: {
                files: {
                    'build/clickjacket.min.js': srcFiles
                }
            }
        },
        copy: {
            src: {
                files: {
                    'build/clickjacket.js': srcFiles
                }
            }
        }
    });

    //register tasks
    grunt.registerTask('build', ['uglify', 'copy']);
    grunt.registerTask('test', ['jshint', 'jasmine']);

    //add npm tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
};
