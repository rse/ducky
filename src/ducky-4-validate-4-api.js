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

import { validate_tokenize } from "./ducky-4-validate-1-tokenize.js"
import { validate_parse    } from "./ducky-4-validate-2-parse.js"
import { validate_execute  } from "./ducky-4-validate-3-execute.js"

/*  internal compile cache  */
let validate_cache = {}

/*  API function: validate an arbitrary value against a validation DSL  */
var validate = function (value, spec, errors) {
    /*  sanity check arguments  */
    if (arguments.length < 2)
        throw new Error(`validate: invalid number of arguments: ${arguments.length} (minimum of 2 expected)`)
    else if (arguments.length > 3)
        throw new Error(`validate: invalid number of arguments: ${arguments.length} (maximum of 3 expected)`)
    if (typeof spec !== "string")
        throw new Error(`validate: invalid specification argument: "${spec}" (string expected)`)

    /*  compile validation AST from specification
        or reuse cached pre-compiled validation AST  */
    var ast = validate_cache[spec]
    if (typeof ast === "undefined") {
        ast = validate.compile(spec)
        validate_cache[spec] = ast
    }

    /*  execute validation AST against the value  */
    return validate.execute(value, ast, errors)
}

validate.compile = function (spec) {
    /*  sanity check arguments  */
    if (arguments.length !== 1)
        throw new Error(`validate: invalid number of arguments: ${arguments.length} (exactly 1 expected)`)
    if (typeof spec !== "string")
        throw new Error(`validate: invalid specification argument: "${spec}" (string expected)`)

    /*  tokenize the specification string into a token stream */
    var token = validate_tokenize(spec)

    /*  parse the token stream into an AST  */
    var ast = validate_parse.parse(token)

    return ast
}

validate.execute = function (value, ast, errors) {
    /*  sanity check arguments  */
    if (arguments.length < 2)
        throw new Error(`validate: invalid number of arguments: ${arguments.length} (minimum of 2 expected)`)
    else if (arguments.length > 3)
        throw new Error(`validate: invalid number of arguments: ${arguments.length} (maximum of 3 expected)`)
    if (arguments.length < 3 || typeof errors === "undefined")
        errors = null

    /*  execute validation AST against the value  */
    return validate_execute.exec_spec(value, ast, "", errors)
}

export { validate }

