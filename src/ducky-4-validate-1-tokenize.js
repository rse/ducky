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

import { Token } from "./ducky-1-util.js"

/*  tokenize the validation specification  */
var validate_tokenize = function (spec) {
    /*  create new Token abstraction  */
    var token = new Token()
    token.setName("validate")
    token.setText(spec)

    /*  determine individual token symbols  */
    let m
    let b = 0
    while (spec !== "") {
        m = spec.match(/^(\s*)([^\\{}\[\]:,?*+()!|/\s]+|[\\{}\[\]:,?*+()!|/])(\s*)/)
        if (m === null)
            throw new Error(`validate: parse error: cannot further canonicalize: "${spec}"`)
        token.addToken(
            b,
            b + m[1].length,
            b + m[1].length + m[2].length - 1,
            b + m[0].length - 1,
            m[2]
        )
        spec = spec.substr(m[0].length)
        b += m[0].length
    }
    token.addToken(b, b, b, b, null)
    return token
}

export { validate_tokenize }

