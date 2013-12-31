
/* global module: true */
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-bower-install-simple");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        "bower-install-simple": {
            options: {
                color:       true,
                production:  true,
                directory:   "bower_components"
            }
        },
        copy: {
            "lodash": {
                src: [ "bower_components/lodash/dist/lodash.js" ],
                dest: "lib/lodash/lodash.js"
            },
            "nunjucks": {
                src: [ "bower_components/nunjucks/browser/nunjucks.js" ],
                dest: "lib/nunjucks/nunjucks.js"
            },
            "jquery": {
                src: [ "bower_components/jquery/jquery.js" ],
                dest: "lib/jquery/jquery.js"
            },
            "jquery-markup": {
                src: [ "bower_components/jquery-markup/jquery.markup.js" ],
                dest: "lib/jquery-markup/jquery.markup.js"
            },
            "director": {
                src: [ "bower_components/director/build/director.js" ],
                dest: "lib/director/director.js"
            },
            "swiper": {
                src: [ "bower_components/swiper/dist/idangerous.swiper-2.4.1.js" ],
                dest: "lib/swiper/idangerous.swiper.js"
            },
            "swiper-css": {
                src: [ "bower_components/swiper/dist/idangerous.swiper.css" ],
                dest: "lib/swiper/idangerous.swiper.css"
            },
            "swiper-plugins": {
                files: [{
                    expand: true, flatten: true, filter: "isFile",
                    src: "bower_components/swiper/plugins/*/idangerous.swiper.[a-z]*[a-z].js",
                    dest: "lib/swiper/"
                }]
            },
            "highlight": {
                src: [ "bower_components/highlightjs/highlight.pack.js" ],
                dest: "lib/highlight/highlight.js"
            },
            "sanitize": {
                src: [ "bower_components/sanitize.css/sanitize.css" ],
                dest: "lib/sanitize/sanitize.css"
            },
            "font-awesome-css": {
                src: [ "bower_components/font-awesome/css/font-awesome.css" ],
                dest: "lib/font-awesome/font-awesome.css",
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/\.\.\/fonts\//g, "");
                    }
                }
            },
            "font-awesome-fonts": {
                files: [{
                    expand: true, flatten: false, cwd: "bower_components/font-awesome/fonts",
                    src: "fontawesome-webfont.*",
                    dest: "lib/font-awesome/"
                }]
            },
            "gridless": {
                src: [ "bower_components/gridless/predef/eg12.css" ],
                dest: "lib/gridless/eg12.css"
            },
            "typopro": {
                files: [
                    { expand: true, flatten: false, cwd: "bower_components/typopro/web",
                      src: "TypoPRO-OpenSans/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "bower_components/typopro/web",
                      src: "TypoPRO-DejaVu/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "bower_components/typopro/web",
                      src: "TypoPRO-YanoneKaffeesatz/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "bower_components/typopro/web",
                      src: "TypoPRO-Journal/**", dest: "lib/typopro/" }
                ]
            }
        },
        clean: {
            clean:     [ "lib" ],
            distclean: [ "node_modules", "bower_components" ]
        }
    });

    grunt.registerTask("default", [ "bower-install-simple", "copy" ]);
};

