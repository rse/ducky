/*!
**  jQuery Markup -- jQuery Template Based Markup Generation
**  Copyright (c) 2013 Ralf S. Engelschall <rse@engelschall.com>
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

/*  the static jQuery API extension  */
interface JQueryStatic {
    markup: {
        /*  global version number  */
        version: String;

        /*  global debug level  */
        debug: Number;

        /*  register a template engine  */
        register(spec: {
            id: String;
            name: String;
            url: String;
            available: () => boolean;
            compile: (txt: String) => (data?: Object) => String;
        }): void;

        /*  compile and store a template fragment  */
        compile(type: String, id: String, txt: String): void;

        /*  parse a manually loaded template file  */
        parse(txt: String, type?: String): void;

        /*  manually queue the loading of particular template file  */
        queue(url: String, type?: String): void;

        /*  load all queued template files  */
        load(onDone: () => void): void;

        /*  render a particular markup template (into unparsed/textual format)  */
        render(id: String, data: Object): String;

        /*  render a particular markup template (DOM unattached)  */
        (id: String, data?: Object): JQuery;
    };
}

/*  the dynamic jQuery result object API extension  */
interface JQuery {
    /*  render a particular markup template (DOM attached)  */
    markup(id: String, data?: Object): JQuery;
}

