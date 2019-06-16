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

var select_compile = function (spec) {
    /*  result and state variables  */
    let path = []
    let pos = 0

    /*  iterate over selection specification  */
    let m
    let txt = spec
    while (txt !== "") {
        /*  case 1: standard path segment  */
        if ((m = txt.match(/^\s*(?:\.)?\s*([a-zA-Z$0-9_][a-zA-Z$0-9_:-]*)/)) !== null)
            path.push(m[1])
        /*  case 2: numerical array-style dereference  */
        else if ((m = txt.match(/^\s*\[\s*(\d+|\*{1,2})\s*\]/)) !== null)
            path.push(m[1])
        /*  case 3: double-quoted string array-style dereference  */
        else if ((m = txt.match(/^\s*\[\s*"((?:\\"|.)*?)"\s*\]/)) !== null)
            path.push(m[1].replace(/\\"/g, "\""))
        /*  case 4: single-quoted string array-style dereference  */
        else if ((m = txt.match(/^\s*\[\s*'((?:\\'|.)*?)'\s*\]/)) !== null)
            path.push(m[1].replace(/\\'/g, "'"))
        /*  skip all whitespaces between segments  */
        else if ((m = txt.match(/^\s+$/)) !== null)
            break
        else
            throw new Error("select: parse error: invalid character at: " +
                spec.substr(0, pos) + "<" + txt.substr(0, 1) + ">" + txt.substr(1))

        /*  advance parsing position  */
        pos += m[0].length
        txt = txt.substr(m[0].length)
    }

    return path
}

export { select_compile }

