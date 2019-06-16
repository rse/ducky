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

import { select }   from "./ducky-3-select-3-api.js"
import { validate } from "./ducky-4-validate-4-api.js"

/*  API function: flexible option handling  */
var options = function (spec, input) {
    let output = {}

    /*  prepare output by creating the structure and setting default values  */
    let required = []
    const prepare = (path) => {
        /*  fetch and act on current value of specification  */
        let val = select(spec, path.join("."))
        if (typeof val === "object" && !(val instanceof Array) && val !== null) {
            /*  option structure  */
            for (let name in val) {
                if (!Object.hasOwnProperty.call(val, name))
                    continue
                prepare(path.concat(name)) /* RECURSION */
            }
        }
        else if (typeof val === "object" && val instanceof Array && val !== null) {
            /*  option element  */
            if (val.length <= 0 || val.length > 2)
                throw new Error(`options: invalid option specification at "${path.join(".")}" ` +
                    "(expected array of length 1 or 2)")
            if (typeof val[0] !== "string")
                throw new Error(`options: invalid option specification at "${path.join(".")}[0]" ` +
                    "(expected string type)")

            /*  create parent structure in output  */
            let out = output, i = 0
            while (i < path.length - 1) {
                if (typeof out[path[i]] !== "object")
                    out[path[i]] = {}
                out = out[path[i]]
                i++
            }

            /*  handle value  */
            if (val.length === 2) {
                /*  handle optional value (via default value)  */
                let errors = []
                if (!validate(val[1], val[0], errors))
                    throw new Error(`options: invalid option specification at "${path.join(".")}" ` +
                        `(validation does not match default value): ${errors.join("; ")}`)
                out[path[i]] = val[1]
            }
            else {
                /*  handle required value (via remembering)  */
                required.push(path.join("."))
            }
        }
        else
            throw new Error(`options: invalid option specification at "${path}" (expected object or array)`)
    }
    prepare([])

    /*  provide merge function  */
    let initially = true
    let merge = function (input) {
        /*  initially ensure that all required options are given in input  */
        if (initially) {
            initially = false
            for (let i = 0; i < required.length; i++)
                if (select(input, required[i]) === undefined)
                    throw new Error(`options: value for required option "${required[i]}" missing`)
        }

        /*  merge values into output  */
        const mergeInternal = (path, val) => {
            let info = select(spec, path)
            if (typeof info !== "object")
                throw new Error(`options: value provided for unknown option "${path}" (invalid path)`)
            if (!(info instanceof Array)) {
                /*  option structure  */
                for (let name in val) {
                    if (!Object.hasOwnProperty.call(val, name))
                        continue
                    mergeInternal(path === "" ? name : `${path}.${name}`, val[name]) /* RECURSION */
                }
            }
            else {
                /*  option element  */
                let errors = []
                if (!validate(val, info[0], errors))
                    throw new Error(`options: invalid value for option "${path}": ${errors.join("; ")}`)
                select(this, path, val)
            }
        }
        mergeInternal("", input)
        return this
    }

    /*  attach merge function and optionally call it immediately  */
    Object.defineProperty(output, "merge", {
        configurable: false,
        enumerable:   false,
        writable:     false,
        value:        merge
    })
    if (typeof input === "object" && input !== null)
        output.merge(input)

    /*  provide resulting option object  */
    return output
}

export { options }

