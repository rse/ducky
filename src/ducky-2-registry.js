/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2015 Ralf S. Engelschall <rse@engelschall.com>
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

/*  internal type registry  */
var registry = {};

/*  pre-fill type registry with JavaScript standard types  */
var std_types = [
    "Object",  "Boolean", "Number",  "String",  "Function",
    "RegExp",  "Array",   "Date",    "Error",
    "Set",     "Map",     "WeakMap", "Promise", "Proxy", "Iterator"
];
for (var i = 0; i < std_types.length; i++)
    if (typeof this[std_types[i]] === "function")
        registry[std_types[i]] = this[std_types[i]];

/*  API function: register a type under a name  */
ducky.register = function (name, type) {
    /*  sanity check arguments  */
    if (arguments.length !== 2)
        throw new Error("register: invalid number of arguments: \"" +
            arguments.length + "\" (exactly 2 expected)");
    if (typeof name !== "string")
        throw new Error("register: invalid name argument: \"" +
            name + "\" (string expected)");
    if (typeof type !== "function")
        throw new Error("register: invalid type argument: \"" +
            type + "\" (function object expected)");
    if (typeof registry[name] !== "undefined")
        throw new Error("register: type already registered under name: \"" +
            name + "\"");

    /*  add type to registry  */
    registry[name] = type;
};

/*  API function: unregister a type under a name  */
ducky.unregister = function (name) {
    /*  sanity check arguments  */
    if (arguments.length !== 1)
        throw new Error("unregister: invalid number of arguments: \"" +
            arguments.length + "\" (exactly 1 expected)");
    if (typeof name !== "string")
        throw new Error("unregister: invalid name argument: \"" +
            name + "\" (string expected)");
    if (typeof registry[name] === "undefined")
        throw new Error("unregister: no type registered under name: \"" +
            name + "\"");

    /*  delete type from registry  */
    delete registry[name];
};

