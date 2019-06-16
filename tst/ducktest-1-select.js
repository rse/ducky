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
var select = ducky.select

describe("Ducky", function () {
    describe("select()", function () {
        var obj = {
            foo: {
                bar: {
                    baz: [ 7, "foo", 42, "bar", "quux" ],
                    quux: 42
                }
            }
        }
        it("should correctly get value", function () {
            expect(select(obj, "")).to.be.equal(obj)
            expect(select(obj, "   ")).to.be.equal(obj)
            expect(select(obj, "foo")).to.be.equal(obj.foo)
            expect(select(obj, "foo.bar")).to.be.equal(obj.foo.bar)
            expect(select(obj, "foo.bar.baz[0]")).to.be.equal(obj.foo.bar.baz[0])
            expect(select(obj, "foo.bar.baz[4]")).to.be.equal(obj.foo.bar.baz[4])
            expect(select(obj, "foo['bar'].baz[4]")).to.be.equal(obj.foo.bar.baz[4])
            expect(select(obj, "['foo']['bar'][\"baz\"]['4']")).to.be.equal(obj.foo.bar.baz[4])
            expect(select(obj, " [ 'foo' ] [ 'bar'] [ \"baz\" ][ '4' ] ")).to.be.equal(obj.foo.bar.baz[4])
        })
        it("should correctly set value", function () {
            var old = obj.foo.bar.baz
            expect(select(obj, "foo.bar.baz", { marker: 42 })).to.be.equal(old)
            expect(obj).to.be.like({ foo: { bar: { baz: { marker: 42 }, quux: 42 }}})
        })
    })
})

