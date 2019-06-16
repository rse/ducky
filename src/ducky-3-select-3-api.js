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

import { select_compile } from "./ducky-3-select-1-compile.js"
import { select_execute } from "./ducky-3-select-2-execute.js"

/*  the internal compile cache  */
let select_cache = {}

/*  API function: select an arbitrary value via a path specification
    and either get the current value or set the new value  */
var select = function (obj, spec, value) {
    /*  sanity check arguments  */
    if (arguments.length < 2)
        throw new Error(`select: invalid number of arguments: ${arguments.length} (minimum of 2 expected)`)
    else if (arguments.length > 3)
        throw new Error(`select: invalid number of arguments: ${arguments.length} (maximum of 3 expected)`)
    if (typeof spec !== "string")
        throw new Error(`select: invalid specification argument: "${spec}" (string expected)`)

    /*  compile select path from specification
        or reuse cached pre-compiled selection path  */
    let path = select_cache[spec]
    if (typeof path === "undefined") {
        path = select_compile(spec)
        select_cache[spec] = path
    }

    /*  execute the object selection  */
    return (
          arguments.length === 2
        ? select_execute(obj, path)
        : select_execute(obj, path, value)
    )
}

/*  compile a path specification into array of dereferencing steps  */
select.compile = function (spec) {
    /*  sanity check argument  */
    if (arguments.length !== 1)
        throw new Error(`select: invalid number of arguments: ${arguments.length} (exactly 1 expected)`)
    if (typeof spec !== "string")
        throw new Error(`select: invalid specification argument: "${spec}" (string expected)`)
    return select_compile.apply(undefined, arguments)
}

/*  execute object selection  */
select.execute = function (obj, path) {
    /*  sanity check arguments  */
    if (arguments.length < 2)
        throw new Error(`select: invalid number of arguments: ${arguments.length} (minimum of 2 expected)`)
    else if (arguments.length > 3)
        throw new Error(`select: invalid number of arguments: ${arguments.length} (maximum of 3 expected)`)
    if (!(typeof path === "object" && path instanceof Array))
        throw new Error(`select: invalid path argument: "${path}" (array expected)`)
    return select_execute.apply(undefined, arguments)
}

export { select }

