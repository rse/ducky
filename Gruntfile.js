/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2014 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module: true */
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-expand-include");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        version: grunt.file.readYAML("VERSION.yml"),
        "expand-include": {
            "ducky": {
                src: [ "src/ducky.js" ],
                dest: "lib/ducky.js",
                options: {
                    directiveSyntax: "js",
                    globalDefines: {
                        major: "<%= version.major %>",
                        minor: "<%= version.minor %>",
                        micro: "<%= version.micro %>",
                        date:  "<%= version.date  %>"
                    }
                }
            }
        },
        jshint: {
            options: {
                jshintrc: "jshint.json"
            },
            gruntfile:   [ "Gruntfile.js" ],
            "ducky":  [ "lib/ducky.js" ]
        },
        eslint: {
            options: {
                config: "eslint.json"
            },
            target: [ "lib/ducky.js" ],
        },
        mochaTest: {
            "ducky": {
                src: [ "tst/*.js" ]
            },
            options: {
                reporter: "spec"
            }
        },
        uglify: {
            options: {
                preserveComments: "some",
                report: "min"
            },
            dist: {
                src:  "lib/ducky.js",
                dest: "lib/ducky.min.js"
            }
        },
        clean: {
            clean:     [ "lib/*", "lib" ],
            distclean: [ "node_modules" ]
        }
    });

    grunt.registerTask("default", [ "expand-include", "jshint", "eslint", "mochaTest", "uglify" ]);
};

