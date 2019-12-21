/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-eslint");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        version: grunt.file.readYAML("VERSION.yml"),
        browserify: {
            "ducky-browser": {
                files: {
                    "lib/ducky.browser.js": [ "src/ducky.js" ]
                },
                options: {
                    transform: [
                        [ "browserify-replace", { replace: [
                            { from: /\$major/g, to: "<%= version.major %>" },
                            { from: /\$minor/g, to: "<%= version.minor %>" },
                            { from: /\$micro/g, to: "<%= version.micro %>" },
                            { from: /\$date/g,  to: "<%= version.date  %>" }
                        ]}],
                        [ "babelify", {
                            presets: [
                                [ "@babel/preset-env", {
                                    "targets": {
                                        "browsers": "last 8 versions, > 1%, ie 11"
                                    }
                                } ]
                            ]
                        } ],
                        [ "uglifyify", { sourceMap: false, global: true } ]
                    ],
                    plugin: [
                        [ "browserify-derequire" ],
                        [ "browserify-header" ]
                    ],
                    browserifyOptions: {
                        standalone: "Ducky",
                        debug: false
                    }
                }
            },
            "ducky-node": {
                files: {
                    "lib/ducky.node.js": [ "src/ducky.js" ]
                },
                options: {
                    transform: [
                        [ "browserify-replace", { replace: [
                            { from: /\$major/g, to: "<%= version.major %>" },
                            { from: /\$minor/g, to: "<%= version.minor %>" },
                            { from: /\$micro/g, to: "<%= version.micro %>" },
                            { from: /\$date/g,  to: "<%= version.date  %>" }
                        ]}],
                        [ "babelify", {
                            presets: [
                                [ "@babel/preset-env", {
                                    "targets": {
                                        "node": "8.0.0"
                                    }
                                } ]
                            ]
                        } ]
                    ],
                    plugin: [
                        [ "browserify-derequire" ],
                        [ "browserify-header" ]
                    ],
                    browserifyOptions: {
                        standalone: "Ducky",
                        debug: false
                    }
                }
            }
        },
        eslint: {
            options: {
                configFile: "eslint.json"
            },
            gruntfile:  [ "Gruntfile.js" ],
            "ducky": [ "src/**/*.js" ]
        },
        mochaTest: {
            "ducky": {
                src: [ "tst/*.js" ]
            },
            options: {
                reporter: "spec"
            }
        },
        clean: {
            clean:     [ "lib/*", "lib" ],
            distclean: [ "node_modules" ]
        }
    });

    grunt.registerTask("default", [ "eslint", "browserify", "mochaTest" ]);
};

