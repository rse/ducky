
/* global module: true */
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            "lodash": {
                src: [ "node_modules/lodash/lodash.min.js" ],
                dest: "lib/lodash/lodash.js"
            },
            "nunjucks": {
                src: [ "node_modules/nunjucks/browser/nunjucks.js" ],
                dest: "lib/nunjucks/nunjucks.js"
            },
            "jquery": {
                src: [ "node_modules/jquery/dist/jquery.js" ],
                dest: "lib/jquery/jquery.js"
            },
            "jquery-markup": {
                src: [ "node_modules/jquery-markup/jquery.markup.js" ],
                dest: "lib/jquery-markup/jquery.markup.js"
            },
            "director": {
                src: [ "node_modules/director/build/director.js" ],
                dest: "lib/director/director.js"
            },
            "swiper": {
                src: [ "node_modules/swiper/dist/js/swiper.js" ],
                dest: "lib/swiper/swiper.js"
            },
            "swiper-css": {
                src: [ "node_modules/swiper/dist/css/swiper.css" ],
                dest: "lib/swiper/swiper.css"
            },
            "syntax": {
                src: [ "node_modules/syntax/lib/syntax.browser.js" ],
                dest: "lib/syntax/syntax.js"
            },
            "normalize.css": {
                src: [ "node_modules/normalize.css/normalize.css" ],
                dest: "lib/normalize/normalize.css"
            },
            "font-awesome-css": {
                src: [ "node_modules/font-awesome/css/font-awesome.css" ],
                dest: "lib/font-awesome/font-awesome.css",
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/\.\.\/fonts\//g, "");
                    }
                }
            },
            "font-awesome-fonts": {
                files: [{
                    expand: true, flatten: false, cwd: "node_modules/font-awesome/fonts",
                    src: "fontawesome-webfont.*",
                    dest: "lib/font-awesome/"
                }]
            },
            "gridless": {
                src: [ "node_modules/gridless/predef/eg12.css" ],
                dest: "lib/gridless/eg12.css"
            },
            "typopro": {
                files: [
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-OpenSans/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-DejaVu/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-YanoneKaffeesatz/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-Journal/**", dest: "lib/typopro/" }
                ]
            }
        },
        clean: {
            clean:     [ "lib" ],
            distclean: [ "node_modules", "node_modules" ]
        }
    });

    grunt.registerTask("default", [ "copy" ]);
};

