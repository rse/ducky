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

/*  determine or at least guess whether we were called with
    positional or name-based parameters  */
var params_is_name_based = function (args, spec) {
    var name_based = false;
    if (   args.length === 1
        && typeof args[0] === "object") {
        /*  ok, looks like a regular call like
            "foo({ foo: ..., bar: ...})"  */
        name_based = true;

        /*  ...but do not be mislead by a positional use like
            "foo(bar)" where "bar" is an arbitrary object!  */
        for (var name in args[0]) {
            if (!Object.hasOwnProperty.call(args[0], name)) {
                if (typeof spec[name] === "undefined")
                    name_based = false;
            }
        }
    }
    return name_based;
};

/*  common value validity checking  */
var params_check_validity = function (func, param, value, valid, what) {
    if (typeof valid === "undefined")
        return;
    if (!ducky.validate(value, valid))
        throw new Error(func + ": parameter \"" + param + "\" has " +
            what + " " + JSON.stringify(value) + ", which does not validate " +
            "against \"" + valid + "\"");
};

/*  API function: flexible parameter handling  */
ducky.params = function (func, args, spec) {
    /*  start with a fresh parameter object  */
    var params = {};

    /*  handle parameter defaults  */
    var name;
    for (name in spec) {
        if (!Object.hasOwnProperty.call(spec, name))
            continue;
        if (typeof spec[name].def !== "undefined") {
            if (typeof spec[name].valid !== "undefined")
                params_check_validity(func, name, spec[name].def, spec[name].valid, "default value");
            params[name] = spec[name].def;
        }
    }

    /*  process parameters  */
    if (params_is_name_based(args, spec)) {
        args = args[0];

        /*
         *  case 1: name-based parameter specification
         */

        /*  pass 1: check for unknown but extra parameters  */
        for (name in args) {
            if (!Object.hasOwnProperty.call(args, name))
                continue;
            if (typeof spec[name] === "undefined")
                throw new Error(func + ": unknown parameter \"" + name + "\"");
            params_check_validity(func, name, args[name], spec[name].valid, "value");
            params[name] = args[name];
        }

        /*  pass 2: check for required but missing parameters  */
        for (name in spec) {
            if (!Object.hasOwnProperty.call(spec, name))
                continue;
            if (   typeof spec[name].req !== "undefined"
                && spec[name].req
                && typeof args[name] === "undefined")
                throw new Error(func + ": required parameter \"" + name + "\" missing");
        }
    }
    else {
        /*
         *  case 2: positional parameter specification
         */

        /*  pass 1: determine number of positional and total required parameters
            and the mapping from parameter position to parameter name  */
        var positional = 0;
        var required = 0;
        var pos2name = {};
        for (name in spec) {
            if (!Object.hasOwnProperty.call(spec, name))
                continue;
            if (typeof spec[name].pos !== "undefined") {
                pos2name[spec[name].pos] = name;
                if (typeof spec[name].pos === "number")
                    positional++;
                if (typeof spec[name].req !== "undefined" && spec[name].req)
                    required++;
            }
        }

        /*  check for required parameters  */
        if (args.length < required)
            throw new Error(func + ": invalid number of arguments " +
                "(at least " + required + " required)");

        /*  pass 2: process parameters in sequence  */
        var i = 0;
        while (i < positional && i < args.length) {
            params_check_validity(func, pos2name[i], args[i], spec[pos2name[i]].valid, "value");
            params[pos2name[i]] = args[i];
            i++;
        }
        if (i < args.length) {
            if (typeof pos2name["..."] === "undefined")
                throw new Error(func + ": too many arguments provided");
            var rest = [];
            while (i < args.length)
                rest.push(args[i++]);
            params_check_validity(func, pos2name["..."], rest, spec[pos2name["..."]].valid, "value");
            params[pos2name["..."]] = rest;
        }
    }

    /*  return prepared parameter object  */
    return params;
};

