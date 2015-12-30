/*jslint node: true, sloppy: true */

module.exports = function (grunt) {

    grunt.initConfig({

        inlineEverything: {

            simpleExample: {

                options: {
                    tags: {
                        link: true,
                        script: true
                    }
                },

                src: 'czemaco.html',
                dest: 'dist/index.html'

            }

        }

    });

    grunt.loadNpmTasks('grunt-cruncher');

    grunt.registerTask('inline', ['inlineEverything']);

    grunt.registerTask('default', ['inlineEverything']);

};