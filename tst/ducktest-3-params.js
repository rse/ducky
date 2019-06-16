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

/* global require: true */
/* global global: true */
/* global describe: true */
/* global it: true */
/* global expect: true */

global.chai = require("chai")
chai.use(require("chai-fuzzy"))
global.expect = global.chai.expect
global.chai.config.includeStack = true

var ducky = require("../lib/ducky.node.js")

describe("Ducky", function () {
    describe("params()", function () {
        it("should parse 'arguments' of a function", function () {
            var foo = function () {
                var params = ducky.params("foo", arguments, {
                    name:    { pos: 0,     req: true,  valid: "string"      },
                    enabled: { pos: 1,     def: false, valid: "boolean"     },
                    spec:    { pos: 2,     def: [],    valid: "[ number* ]" },
                    other:   { pos: "...", def: [],    valid: "[ number* ]" }
                })
                expect(params.name).to.be.equal("bar")
                expect(params.enabled).be.equal(true)
                expect(params.spec).be.like([ 42, 7 ])
                expect(params.other).be.like([ 1, 2, 3 ])
            };
            foo("bar", true, [ 42, 7 ], 1, 2, 3)
            foo({ name: "bar", enabled: true, spec: [ 42, 7 ], other: [ 1, 2, 3 ] })
            expect(function () { foo() }).to.throw(Error)
            expect(function () { foo({ quux: "quux" }) }).to.throw(Error)
        })
    })
})

