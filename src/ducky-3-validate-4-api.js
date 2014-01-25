/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2014 Ralf S. Engelschall <rse@engelschall.com>
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

/*  internal compile cache  */
var validate_cache = {};

/*  API function: validate an arbitrary value against a validation DSL  */
ducky.validate = function (value, spec) {
    /*  sanity check arguments  */
    if (arguments.length !== 2)
        throw new Error("validate: invalid number of arguments: \"" +
            arguments.length + "\" (exactly 2 expected)");
    if (typeof spec !== "string")
        throw new Error("validate: invalid specification argument: \"" +
            spec + "\" (string expected)");

    /*  compile validation AST from specification
        or reuse cached pre-compiled validation AST  */
    var ast = validate_cache[spec];
    if (typeof ast === "undefined") {
        ast = ducky.validate.compile(spec);
        validate_cache[spec] = ast;
    }

    /*  execute validation AST against the value  */
    return ducky.validate.execute(value, ast);
};

ducky.validate.compile = function (spec) {
    /*  sanity check arguments  */
    if (arguments.length !== 1)
        throw new Error("validate: invalid number of arguments: \"" +
            arguments.length + "\" (exactly 1 expected)");
    if (typeof spec !== "string")
        throw new Error("validate: invalid specification argument: \"" +
            spec + "\" (string expected)");

    /*  tokenize the specification string into a token stream */
    var token = validate_tokenize(spec);

    /*  parse the token stream into an AST  */
    var ast = validate_parse.parse_spec(token);

    return ast;
};

ducky.validate.execute = function (value, ast) {
    /*  sanity check arguments  */
    if (arguments.length !== 2)
        throw new Error("validate: invalid number of arguments: \"" +
            arguments.length + "\" (exactly 2 expected)");

    /*  execute validation AST against the value  */
    return validate_execute.exec_spec(value, ast);
};

