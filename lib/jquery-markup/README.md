
jQuery Markup
=============

(jQuery Template Based Markup Generation)

Abstract
--------

jQuery Markup is a [jQuery](http://jquery.com/) plugin for assembling,
pre-compiling, expanding and then DOM-injecting HTML markup code
fragments based on plain HTML or an arbitrary template language.

Motivation
----------

When developing a Single-Page Application (SPA), JavaScript code is
used to render the entire UI in the browser on-the-fly. The UI is still
based on HTML markup and CSS stylesheets. While the CSS stylesheets are
(as their name implies) inherently cascading and are applied by the
browser once the HTML markup comes into place, the HTML markup has to
be manually rendered via JavaScript into the DOM tree. For this various
so-called HTML template languages exist. They allow you to describe the
markup in more concise and partially dynamic language and render the
static plain HTML markup on-the-fly. But a handy solution is needed to
on-the-fly pick up particular templates, render them and inject them
into the DOM. This is where jQuery.Markup comes into the play.

Solution
--------

First, the HTML markup is linked to the SPA with `<link>` tags similar
to CSS stylesheets, but instead of a `rel` attribute with value
`stylesheet`, the value `markup` is used. The attribute `type` is set
to `text/x-markup-xxx` to tell jQuery.Markup about the default template
language (`xxx`):

    <!DOCTYPE html>
    <html>
        <head>
            [...]
            <script src="app.js" type="text/javascript"></script>
            <link href="app.css" rel="stylesheet" type="text/css"/>
            <link href="app.html" rel="markup" type="text/x-markup-handlebars"/>
            [...]
        </head>
       [...]
    </html>

Second, a markup template is a regular HTML/XHTML file, but with one or more
`<markup>` tags at the top-level (and optionally also at a deeper nested level):

    <!-- container markup template -->
    <markup id="hello">
       <div class="hello">
           Welcome:<br/>
           <!-- embedded message markup template -->
           <markup id="message">
               <div class="message row-{{k}}">{{i}}. {{message}}</div>
           </markup>
       </div>
    </markup>

    <!-- some other template -->
    <markup id="foo">
       <div class="foo">{{foo}}</div>
    </markup>

Third, in your application give jQuery.Markup a chance to load the
markup template files, parse and compile the contained `<markup>`
sections and tell you once it finished this step:

    $(document).ready(function () {
        $.markup.load(function () {
            /* ...start your SPA code here... */
        });
    });

Finally, render some markup into the DOM through the pre-compiled and stored markup templates:

    /*  render a "hello" container markup  */
    var h = $("body").markup("hello");

    /*  insert ten message markups  */
    for (var i = 0; i < 10; i++) {
        $(h).markup("hello/message", {
            i: i, k: i % 2,
            message: "Hello World"
        });
    }

In this example, the resulting DOM fragment will be:

    <body>
       [...]
       <div class="hello">
           Welcome:<br/>
           <div class="message row-0">0. Hello World</div>
           <div class="message row-1">1. Hello World</div>
           <div class="message row-0">2. Hello World</div>
           <div class="message row-1">3. Hello World</div>
           <div class="message row-0">4. Hello World</div>
           <div class="message row-1">5. Hello World</div>
           <div class="message row-0">6. Hello World</div>
           <div class="message row-1">7. Hello World</div>
           <div class="message row-0">8. Hello World</div>
           <div class="message row-1">9. Hello World</div>
       </div>
       [...]
    </body>

API
---

The Application Programming Interface (API) of jQuery.Markup is
(in abbreviated TypeScript definition syntax):

    /*  global version number  */
    $.markup.version: String;

    /*  global debug level  */
    $.markup.debug: Number;

    /*  register a template engine  */
    $.markup.register({
        id: String;
        name: String;
        url: String;
        available: () => boolean;
        compile: (txt: String) => (data?: Object) => String;
    }): void;

    /*  compile and store a template fragment  */
    $.markup.compile(type: String, id: String, txt: String): void;

    /*  parse a manually loaded template file  */
    $.markup.parse(txt: String, type?: String): void;

    /*  manually queue the loading of particular template file  */
    $.markup.queue(url: String, type?: String): void;

    /*  load all queued template files  */
    $.markup.load(onDone: () => void): void;

    /*  render a particular markup template (into unparsed/textual format)  */
    $.markup.render(id: String, data: Object): String;

    /*  render a particular markup template (DOM unattached)  */
    $.markup(id: String, data?: Object): jQuery;

    /*  render a particular markup template (DOM attached)  */
    $([...]).markup(id: String, data?: Object): jQuery;

In practice you usually need only the `$.markup.load()` function for
loading all your markup templates once on startup and the `$.markup()`
function for rendering a particular markup template into a DOM fragment.
All other functions are just the exposed lower-level functionality and
are usually directly used in rare situations only.

Templates
---------

The template files can contain arbitrary HTML/XHTML markup, just surrounded
with `<markup>` tags. Those tags have the following syntax:

    <markup id="ID" [type="TYPE"] [include="true|false"] [wrap="true|false"] [trim="true|false"]>
        [...]
    </markup>

The `id` attribute has to be globally unique for top-level tags and
locally unique for nested tags. The `type` attribute can be any
registered name of a template language (see below for pre-registered
ones). The `include` attribute can be set to `true` for nested tags
in order to allow their content to be included into the parent tag
(by default nested tags are treated as they would be located at the
top-level and are just nested for logical reasons only).
The `wrap` attribute can be set to `true` for markups where
an outer wrapping `<div>` element should be generated with
a class derived from the effective markup id (a minus-seperated
path of all markup `id`s, starting at the top-level).
The `trim` attribute can be set to `true` for markups where
whitespaces around HTML tags should be trimmed in order
to avoid a pollution of the DOM with nasty plain-text elements.

Template Engine Support
-----------------------

The following built-in HTML template languages and corresponding
expansion engines are provided out-of-the-box:

- `plain`: Plain-Text markup (efficient: pass-through)<br/>
  This expands nothing, it just passes through the markup code, without
  performing any expansions at all. Usually too less useful in practice, but
  sometimes sufficient enough. It is the default language.

- `simple`: Simple markup (efficient: pre-compilation)<br/>
  This expands simple variable references like `{{foo}}` and
  structured variable references like `{{foo.bar[42].quux}}`.
  This often is sufficient in practice.

For more sophisticated features, the following external HTML
template languages and corresponding expansion engines are supported
out-of-the-box, too:

- `handlebars`: [Handlebars](http://handlebarsjs.com/) (efficient: pre-compilation)
- `nunjucks`: [Nunjucks](http://nunjucks.jlongster.com/) (efficient: pre-compilation)
- `emblem`: [Emblem](http://emblemjs.com/) (efficient: pre-compilation)
- `dust`: [DUST](http://linkedin.github.io/dustjs/) (efficient: pre-compilation)
- `jade`: [Jade](http://jade-lang.com/) (efficient: pre-compilation)
- `mustache`: [Mustache](http://mustache.github.io/) (efficient: pre-compilation)
- `walrus`: [Walrus](http://documentup.com/jeremyruppel/walrus/) (efficient: pre-compilation)
- `haml`: [HAML-JS](https://github.com/creationix/haml-js) (efficient: pre-compilation)
- `dot`: [doT](http://olado.github.io/doT/) (efficient: pre-compilation)
- `rssi`: [rssi](https://github.com/mvasilkov/rssi) (efficient: pre-compilation)
- `hogan`: [Twitter Hogan](http://twitter.github.io/hogan.js/) (efficient: pre-compilation)
- `underscore`: [Underscore](http://underscorejs.org/) (efficient: pre-compilation)
- `jiko`: [Jiko](http://jiko.neoname.eu/) (efficient: pre-compilation)
- `qatrix`: [Qatrix Template](http://qatrix.com/) (efficient: cached on-the-fly compilation)
- `teddy`: [Teddy](https://github.com/kethinov/teddy) (efficient: pre-compilation)
- `ejs`: [EJS](http://embeddedjs.com/) (efficient: pre-compilation)
- `jst`: [JST](http://code.google.com/p/trimpath/wiki/JavaScriptTemplates) (efficient: pre-compilation)
- `markup`: [Markup](https://github.com/adammark/Markup.js/) (inefficient: on-the-fly compilation)
- `plates`: [Plates](https://github.com/flatiron/plates) (inefficient: on-the-fly compilation)
- `emmet`: [Emmet](http://emmet.io) (inefficient: on-the-fly compilation)

For supporting an additional external template engine use a construct like the following:

    $.markup.register({
        id:        "handlebars",
        name:      "Handlebars",
        url:       "http://handlebarsjs.com/",
        available: function ()    { return typeof Handlebars !== "undefined" &&
                                           typeof Handlebars.compile === "function"; },
        compile:   function (txt) { return Handlebars.compile(txt); }
    });

Check out [Template-Engine-Chooser](http://garann.github.io/template-chooser/)
to quickly find out which template language fits best for your scenario.
My personal preference is to use the built-in Simple language for
simple requirements, [Handlebars](http://handlebarsjs.com/) for
average requirements and [Nunjucks](http://nunjucks.jlongster.com/) for
more complex requirements.

Getting jQuery-Markup
---------------------

You can conveniently get jQuery-Markup in various ways:

- Git: directly clone the official jQuery-Markup repository

  `$ git clone https://github.com/rse/jquery-markup.git`

- Bower: install as client component via the Bower component manager:

  `$ bower install jquery-markup`

- cURL: downloading only the main file from the repository

  `$ curl -O https://raw.github.com/rse/jquery-markup/master/jquery.markup.js`

Building jQuery-Markup
----------------------

You can pick the jQuery plugin in file "jquery.markup.js" as is for use,
but for linting and minifying it yourself you need Node.js ("node") and
its Node.js Package Manager ("npm") globally installed.

    # approach 1: use convenient Makefile (author preference)
    $ make

    # approach 2: use Grunt locally (contributor recommendation)
    $ npm install
    $ node_modules/grunt-cli/bin/grunt

    # approach 3: install and use Grunt globally (contributor alternative)
    $ npm install -g grunt-cli
    $ npm install
    $ grunt

License
-------

Copyright (c) 2013 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

