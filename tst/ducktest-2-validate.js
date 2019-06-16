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
var validate = ducky.validate

describe("Ducky", function () {
    describe("validate()", function () {
        it("should validate stand-alone null/undefined", function () {
            expect(validate(null, "null")).to.be.true
            expect(validate(undefined, "undefined")).to.be.true
        })
        it("should validate stand-alone boolean/number/string/function", function () {
            expect(validate(true, "boolean")).to.be.true
            expect(validate(42, "number")).to.be.true
            expect(validate("foo", "string")).to.be.true
            expect(validate(function () {}, "function")).to.be.true
        })
        it("should validate stand-alone string with regular expression", function () {
            expect(validate("foo", "/foo/")).to.be.true
            expect(validate("foo", "/fo+/")).to.be.true
            expect(validate("foo", "/bar/")).to.be.false
        })
        it("should validate stand-alone object", function () {
            expect(validate(null, "object")).to.be.true
            expect(validate({}, "object")).to.be.true
            expect(validate([], "object")).to.be.true
        })
        it("should validate stand-alone any", function () {
            expect(validate(null, "any")).to.be.true
            expect(validate(true, "any")).to.be.true
            expect(validate(42, "any")).to.be.true
            expect(validate("foo", "any")).to.be.true
            expect(validate(function () {}, "any")).to.be.true
            expect(validate({}, "any")).to.be.true
            expect(validate([], "any")).to.be.true
        })
        it("should validate stand-alone classes", function () {
            expect(validate(new Array(), "Array")).to.be.true
            expect(validate(new RegExp(), "RegExp")).to.be.true
            var Foo = function () {}
            expect(validate(new Foo(), "Foo")).to.be.false
            ducky.register("Foo", Foo)
            var Quux = function () {}
            ducky.register("foo.bar.Quux", Quux)
            expect(validate(new Quux(), "foo.bar.Quux")).to.be.true
        })
        it("should validate arrays with arities", function () {
            expect(validate([], "[ any ]")).to.be.false
            expect(validate([], "[ any? ]")).to.be.true
            expect(validate([], "[ any* ]")).to.be.true
            expect(validate([], "[ any+ ]")).to.be.false
            expect(validate([], "[ any{1,oo} ]")).to.be.false
            expect(validate([ 42 ], "[ any? ]")).to.be.true
            expect(validate([ 42 ], "[ any* ]")).to.be.true
            expect(validate([ 42 ], "[ any+ ]")).to.be.true
            expect(validate([ 42 ], "[ any{1,oo} ]")).to.be.true
            expect(validate([ 42, "foo" ], "[ any? ]")).to.be.false
            expect(validate([ 42, "foo" ], "[ any* ]")).to.be.true
            expect(validate([ 42, "foo" ], "[ any+ ]")).to.be.true
            expect(validate([ 42, "foo" ], "[ any{1,2} ]")).to.be.true
        })
        it("should validate arrays as tuples", function () {
            expect(validate([ "foo", 42, true ], "[ string, number, boolean ]")).to.be.true
            expect(validate([ "foo", 42, 7, true ], "[ string, number+, boolean ]")).to.be.true
            expect(validate([ "foo", 42, 7, true ], "[ string, number*, boolean ]")).to.be.true
            expect(validate([ "foo", 42, 7, true ], "[ string, number{1,2}, boolean ]")).to.be.true
            expect(validate([ "foo", 42, 7, 0, true ], "[ string, number{1,2}, boolean ]")).to.be.false
        })
        it("should validate hashes with arities", function () {
            expect(validate({}, "{}")).to.be.true
            expect(validate({}, "{ foo?: any }")).to.be.true
            expect(validate({}, "{ foo: any }")).to.be.false
            expect(validate({ foo: "foo" }, "{ foo: any }")).to.be.true
            expect(validate({ foo: "foo", bar: "bar" }, "{ foo: any }")).to.be.false
        })
        it("should validate hashes with arbitrary keys", function () {
            expect(validate({}, "{ @?: any }")).to.be.true
            expect(validate({ foo: "foo" }, "{ @: any }")).to.be.true
            expect(validate({ foo: "foo" }, "{ @: number }")).to.be.false
        })
        it("should validate complex structure", function () {
            expect(validate(
                { foo: { bar: "bar", baz: 42 } },
                "{ foo: { bar: string, baz: number } }"
            )).to.be.true
            expect(validate(
                { foo: { bar: "bar", baz: [ 7, 42 ], quux: "quux" } },
                "{ foo: { bar: string, baz: [ number* ] } }"
            )).to.be.false
            expect(validate(
                { foo: { bar: [ "foo", "bar" ], baz: [ 7, 42 ], quux: "quux" } },
                "{ foo: { bar: [ /^(?:foo|bar)$/{2} ], baz: [ number* ], quux?: string } }"
            )).to.be.true
        })
        it("should correctly report errors", function () {
            var errors = []
            expect(validate(true, "string", errors)).to.be.false
            expect(errors).to.have.length(1)
            expect(errors[0]).to.match(/^mismatch at root-level:.*/)
            errors = []
            expect(validate(null, "{}", errors)).to.be.false
            expect(errors).to.have.length(1)
            errors = []
            expect(validate(null, "(null | {})", errors)).to.be.true
            expect(errors).to.have.length(0)
            errors = []
            expect(validate([ 42, "foo" ], "[ number, boolean ]", errors)).to.be.false
            expect(errors).to.have.length(2)
            expect(errors[0]).to.match(/^mismatch at path "\[1\]":.*/)
            expect(errors[1]).to.match(/^mismatch at path "\[1\]":.*/)
            expect(function () { validate.compile("{}")  }).to.not.throw(Error)
            expect(function () { validate.compile("{}}") }).to.throw(Error)
            expect(function () { validate.compile("") }).to.throw(Error)
        })
    })
})

