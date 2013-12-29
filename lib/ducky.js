/*!
**  Ducky -- Value Duck-Typing for JavaScript
**  Copyright (c) 2010-2013 Ralf S. Engelschall <rse@engelschall.com>
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

/*  Universal Module Definition (UMD)  */
(function (root, name, factory) {
    /* global define: false */
    /* global module: false */
    if (typeof define === "function" && typeof define.amd !== "undefined")
        /*  AMD environment  */
        define(name, function () { return factory(root); });
    else if (typeof module === "object" && typeof module.exports === "object")
        /*  CommonJS environment  */
        module.exports = factory(root);
    else
        /*  Browser environment  */
        root[name] = factory(root);
}(this, "Ducky", function (/* root */) {
    var Ducky = {};

    /*  custom Token class  */
    var Token = function () {
        this.name   = "";
        this.text   = "";
        this.tokens = [];
        this.pos    = 0;
        this.len    = 0;
    };
    Token.prototype = {
        /*  setter for caller context name  */
        setName: function (name) {
            this.name = name;
        },

        /*  setter for plain-text input  */
        setText: function (text) {
            this.text = text;
        },

        /*  setter for additional token symbols  */
        addToken: function (b1, b2, e2, e1, symbol) {
            this.tokens.push({ b1: b1, b2: b2, e2: e2, e1: e1, symbol: symbol });
            this.len++;
        },

        /*  peek at the next token or token at particular offset  */
        peek: function (offset) {
            if (typeof offset === "undefined")
                offset = 0;
            if (offset >= this.len)
                throw new Error(this.name + ": parse error: not enough tokens");
            return this.tokens[this.pos + offset].symbol;
        },

        /*  skip one or more tokens  */
        skip: function (len) {
            if (typeof len === "undefined")
                len = 1;
            if (len > this.len)
                throw new Error(this.name + ": parse error: not enough tokens available to skip: " + this.ctx());
            this.pos += len;
            this.len -= len;
        },

        /*  consume the current token (by expecting it to be a particular symbol)  */
        consume: function (symbol) {
            if (this.len <= 0)
                throw new Error(this.name + ": parse error: no more tokens available to consume: " + this.ctx());
            if (this.tokens[this.pos].symbol !== symbol)
                throw new Error(this.name + ": parse error: expected token symbol \"" + symbol + "\": " + this.ctx());
            this.pos++;
            this.len--;
        },

        /*  return a textual description of the token parsing context  */
        ctx: function (width) {
            if (typeof width === "undefined")
                width = 78;
            var tok = this.tokens[this.pos];

            /*  the current token itself  */
            var ctx = "<" + this.text.substr(tok.b2, tok.e2 - tok.b2 + 1) + ">";
            ctx = this.text.substr(tok.b1, tok.b2 - tok.b1) + ctx;
            ctx = ctx + this.text.substr(tok.e2 + 1, tok.e1 - tok.e2);

            /*  the previous and following token(s)  */
            var k = (width - ctx.length);
            if (k > 0) {
                k = Math.floor(k / 2);
                var i, str;
                if (this.pos > 0) {
                    /*  previous token(s)  */
                    var k1 = 0;
                    for (i = this.pos - 1; i >= 0; i--) {
                        tok = this.tokens[i];
                        str = this.text.substr(tok.b1, tok.e1 - tok.b1 + 1);
                        k1 += str.length;
                        if (k1 > k)
                            break;
                        ctx = str + ctx;
                    }
                    if (i > 0)
                        ctx = "[...]" + ctx;
                }
                if (this.len > 1) {
                    /*  following token(s)  */
                    var k2 = 0;
                    for (i = this.pos + 1; i < this.pos + this.len; i++) {
                        tok = this.tokens[i];
                        str = this.text.substr(tok.b1, tok.e1 - tok.b1 + 1);
                        k2 += str.length;
                        if (k2 > k)
                            break;
                        ctx = ctx + str;
                    }
                    if (i < this.pos + this.len)
                        ctx = ctx + "[...]";
                }
            }

            /*  place everything on a single line through escape sequences  */
            ctx = ctx.replace(/\r/, "\\r")
                     .replace(/\n/, "\\n")
                     .replace(/\t/, "\\t");
            return ctx;
        }
    };


    var select_compile = function (spec) {
        /*  result and state variables  */
        var path = [];
        var pos = 0;

        /*  iterate over selection specification  */
        var m;
        var txt = spec;
        while (txt !== "") {
            /*  case 1: standard path segment  */
            if ((m = txt.match(/^\s*(?:\.)?\s*([a-zA-Z$0-9_][a-zA-Z$0-9_:-]*)/)) !== null)
                path.push(m[1]);
            /*  case 2: numerical array-style dereference  */
            else if ((m = txt.match(/^\s*\[\s*(\d+|\*{1,2})\s*\]/)) !== null)
                path.push(m[1]);
            /*  case 3: double-quoted string array-style dereference  */
            else if ((m = txt.match(/^\s*\[\s*"((?:\\"|.)*?)"\s*\]/)) !== null)
                path.push(m[1].replace(/\\"/g, "\""));
            /*  case 4: single-quoted string array-style dereference  */
            else if ((m = txt.match(/^\s*\[\s*'((?:\\'|.)*?)'\s*\]/)) !== null)
                path.push(m[1].replace(/\\'/g, "'"));
            /*  skip all whitespaces between segments  */
            else if ((m = txt.match(/^\s+$/)) !== null)
                break;
            else
                throw new Error("select: parse error: invalid character at: " +
                    spec.substr(0, pos) + "<" + txt.substr(0, 1) + ">" + txt.substr(1));

            /*  advance parsing position  */
            pos += m[0].length;
            txt = txt.substr(m[0].length);
        }

        return path;
    };


    /*  execute object selection  */
    var select_execute = function (obj, path) {
        /*  handle special case of empty path */
        if (path.length === 0) {
            if (arguments.length === 3)
                throw new Error("select: cannot set value on empty path");
            else
                return obj;
        }

        /*  step into object graph according to path prefix  */
        var i = 0;
        while (i < path.length - 1) {
            if (typeof obj !== "object")
                throw new Error("select: cannot further dereference: no more intermediate objects in path");
            obj = obj[path[i++]];
        }

        /*  get the old value  */
        if (typeof obj !== "object")
            throw new Error("select: cannot further dereference: no object at end of path");
        var value_old = obj[path[i]];

        /*  optionally set new value  */
        if (arguments.length === 3) {
            var value_new = arguments[2];
            if (value_new === undefined) {
                /*  delete value from collection  */
                if (obj instanceof Array)
                    obj.splice(parseInt(path[i], 10), 1);
                else
                    delete obj[path[i]];
            }
            else
                /*  set value into collection  */
                obj[path[i]] = value_new;
        }

        return value_old;
    };

    /*  the internal compile cache  */
    var select_cache = {};

    /*  API function: select an arbitrary value via a path specification
        and either get the current value or set the new value  */
    Ducky.select = function (obj, spec, value) {
        /*  sanity check arguments  */
        if (arguments.length < 2)
            throw new Error("select: invalid number of arguments: \"" +
                arguments.length + "\" (minimum of 2 expected)");
        else if (arguments.length > 3)
            throw new Error("select: invalid number of arguments: \"" +
                arguments.length + "\" (maximum of 3 expected)");
        if (typeof spec !== "string")
            throw new Error("select: invalid specification argument: \"" +
                spec + "\" (string expected)");

        /*  compile select path from specification
            or reuse cached pre-compiled selection path  */
        var path = select_cache[spec];
        if (typeof path === "undefined") {
            path = select_compile(spec);
            select_cache[spec] = path;
        }

        /*  execute the object selection  */
        return (
              arguments.length === 2
            ? select_execute(obj, path)
            : select_execute(obj, path, value)
        );
    };

    /*  compile a path specification into array of dereferencing steps  */
    Ducky.select.compile = function (spec) {
        /*  sanity check argument  */
        if (arguments.length !== 1)
            throw new Error("select: invalid number of arguments: \"" +
                arguments.length + "\" (exactly 1 expected)");
        if (typeof spec !== "string")
            throw new Error("select: invalid specification argument: \"" +
                spec + "\" (string expected)");
        return select_compile.apply(undefined, arguments);
    };

    /*  execute object selection  */
    Ducky.select.execute = function (obj, path) {
        /*  sanity check arguments  */
        if (arguments.length < 2)
            throw new Error("select: invalid number of arguments: \"" +
                arguments.length + "\" (minimum of 2 expected)");
        else if (arguments.length > 3)
            throw new Error("select: invalid number of arguments: \"" +
                arguments.length + "\" (maximum of 3 expected)");
        if (!(typeof path === "object" && path instanceof Array))
            throw new Error("select: invalid path argument: \"" +
                path + "\" (array expected)");
        return select_execute.apply(undefined, arguments);
    };


    /*  tokenize the validation specification  */
    var validate_tokenize = function (spec) {
        /*  create new Token abstraction  */
        var token = new Token();
        token.setName("validate");
        token.setText(spec);

        /*  determine individual token symbols  */
        var m;
        var b = 0;
        while (spec !== "") {
            m = spec.match(/^(\s*)([^{}\[\]:,?*+()!|\s]+|[{}\[\]:,?*+()!|])(\s*)/);
            if (m === null)
                throw new Error("validate: parse error: cannot further canonicalize: \"" + spec + "\"");
            token.addToken(
                b,
                b + m[1].length,
                b + m[1].length + m[2].length - 1,
                b + m[0].length - 1,
                m[2]
            );
            spec = spec.substr(m[0].length);
            b += m[0].length;
        }
        return token;
    };


    /*  parse specification  */
    var validate_parse = {
        parse_spec: function (token) {
            if (token.len <= 0)
                return null;
            var ast;
            var symbol = token.peek();
            if (symbol === "!")
                ast = this.parse_not(token);
            else if (symbol === "(")
                ast = this.parse_group(token);
            else if (symbol === "{")
                ast = this.parse_hash(token);
            else if (symbol === "[")
                ast = this.parse_array(token);
            else if (symbol.match(/^(?:null|undefined|boolean|number|string|function|object)$/))
                ast = this.parse_primary(token);
            else if (symbol === "any")
                ast = this.parse_any(token);
            else if (symbol.match(/^[A-Z][_a-zA-Z$0-9]*$/))
                ast = this.parse_class(token);
            else
                throw new Error("validate: parse error: invalid token symbol: \"" + token.ctx() + "\"");
            return ast;
        },

        /*  parse boolean "not" operation  */
        parse_not: function (token) {
            token.consume("!");
            var ast = this.parse_spec(token); /*  RECURSION  */
            ast = { type: "not", op: ast };
            return ast;
        },

        /*  parse group (for boolean "or" operation)  */
        parse_group: function (token) {
            token.consume("(");
            var ast = this.parse_spec(token);
            while (token.peek() === "|") {
                token.consume("|");
                var child = this.parse_spec(token); /*  RECURSION  */
                ast = { type: "or", op1: ast, op2: child };
            }
            token.consume(")");
            return ast;
        },

        /*  parse hash type specification  */
        parse_hash: function (token) {
            token.consume("{");
            var elements = [];
            while (token.peek() !== "}") {
                var key = this.parse_key(token);
                var arity = this.parse_arity(token, "?");
                token.consume(":");
                var spec = this.parse_spec(token);  /*  RECURSION  */
                elements.push({ type: "element", key: key, arity: arity, element: spec });
                if (token.peek() === ",")
                    token.skip();
                else
                    break;
            }
            var ast = { type: "hash", elements: elements };
            token.consume("}");
            return ast;
        },

        /*  parse array type specification  */
        parse_array: function (token) {
            token.consume("[");
            var elements = [];
            while (token.peek() !== "]") {
                var spec = this.parse_spec(token);  /*  RECURSION  */
                var arity = this.parse_arity(token, "?*+");
                elements.push({ type: "element", element: spec, arity: arity });
                if (token.peek() === ",")
                    token.skip();
                else
                    break;
            }
            var ast = { type: "array", elements: elements };
            token.consume("]");
            return ast;
        },

        /*  parse primary type specification  */
        parse_primary: function (token) {
            var primary = token.peek();
            if (!primary.match(/^(?:null|undefined|boolean|number|string|function|object)$/))
                throw new Error("validate: parse error: invalid primary type \"" + primary + "\"");
            token.skip();
            return { type: "primary", name: primary };
        },

        /*  parse special "any" type specification  */
        parse_any: function (token) {
            var any = token.peek();
            if (any !== "any")
                throw new Error("validate: parse error: invalid any type \"" + any + "\"");
            token.skip();
            return { type: "any" };
        },

        /*  parse JavaScript class specification  */
        parse_class: function (token) {
            var clazz = token.peek();
            if (!clazz.match(/^[A-Z][_a-zA-Z$0-9]*$/))
                throw new Error("validate: parse error: invalid class type \"" + clazz + "\"");
            token.skip();
            return { type: "class", name: clazz };
        },

        /*  parse arity specification  */
        parse_arity: function (token, charset) {
            var arity = [ 1, 1 ];
            if (   token.len >= 5
                && token.peek(0) === "{"
                && token.peek(1).match(/^[0-9]+$/)
                && token.peek(2) === ","
                && token.peek(3).match(/^(?:[0-9]+|oo)$/)
                && token.peek(4) === "}"          ) {
                arity = [
                    parseInt(token.peek(1), 10),
                    (  token.peek(3) === "oo"
                     ? Number.MAX_VALUE
                     : parseInt(token.peek(3), 10))
                ];
                token.skip(5);
            }
            else if (
                   token.len >= 1
                && token.peek().length === 1
                && charset.indexOf(token.peek()) >= 0) {
                var c = token.peek();
                switch (c) {
                    case "?": arity = [ 0, 1 ];                break;
                    case "*": arity = [ 0, Number.MAX_VALUE ]; break;
                    case "+": arity = [ 1, Number.MAX_VALUE ]; break;
                }
                token.skip();
            }
            return arity;
        },

        /*  parse hash key specification  */
        parse_key: function (token) {
            var key = token.peek();
            if (!key.match(/^(?:[_a-zA-Z$][_a-zA-Z$0-9]*|@)$/))
                throw new Error("validate: parse error: invalid key \"" + key + "\"");
            token.skip();
            return key;
        }
    };


    var validate_execute = {
        /*  validate specification (top-level)  */
        exec_spec: function (value, node) {
            var valid = false;
            if (node !== null) {
                switch (node.type) {
                    case "not":     valid = this.exec_not(    value, node); break;
                    case "or":      valid = this.exec_or(     value, node); break;
                    case "hash":    valid = this.exec_hash(   value, node); break;
                    case "array":   valid = this.exec_array(  value, node); break;
                    case "primary": valid = this.exec_primary(value, node); break;
                    case "class":   valid = this.exec_class(  value, node); break;
                    case "any":     valid = true;                           break;
                    default:
                        throw new Error("validate: invalid validation AST: " +
                            "node has unknown type \"" + node.type + "\"");
                }
            }
            return valid;
        },

        /*  validate through boolean "not" operation  */
        exec_not: function (value, node) {
            return !this.exec_spec(value, node.op);  /*  RECURSION  */
        },

        /*  validate through boolean "or" operation  */
        exec_or: function (value, node) {
            return (
                   this.exec_spec(value, node.op1)  /*  RECURSION  */
                || this.exec_spec(value, node.op2)  /*  RECURSION  */
            );
        },

        /*  validate hash type  */
        exec_hash: function (value, node) {
            var i, el;
            var valid = (typeof value === "object");
            var fields = {};
            var field;
            if (valid) {
                /*  pass 1: ensure that all mandatory fields exist
                    and determine map of valid fields for pass 2  */
                var hasAnyKeys = false;
                for (field in value) {
                    if (   !Object.hasOwnProperty.call(value, field)
                        || !Object.propertyIsEnumerable.call(value, field)
                        || field === "constructor"
                        || field === "prototype"                          )
                        continue;
                    hasAnyKeys = true;
                    break;
                }
                for (i = 0; i < node.elements.length; i++) {
                    el = node.elements[i];
                    fields[el.key] = el.element;
                    if (   el.arity[0] > 0
                        && (   (el.key === "@" && !hasAnyKeys)
                            || (el.key !== "@" && typeof value[el.key] === "undefined"))) {
                        valid = false;
                        break;
                    }
                }
            }
            if (valid) {
                /*  pass 2: ensure that no unknown fields exist
                    and that all existing fields are valid  */
                for (field in value) {
                    if (   !Object.hasOwnProperty.call(value, field)
                        || !Object.propertyIsEnumerable.call(value, field)
                        || field === "constructor"
                        || field === "prototype"                          )
                        continue;
                    if (   typeof fields[field] !== "undefined"
                        && this.exec_spec(value[field], fields[field])) /*  RECURSION  */
                        continue;
                    if (   typeof fields["@"] !== "undefined"
                        && this.exec_spec(value[field], fields["@"]))   /*  RECURSION  */
                        continue;
                    valid = false;
                    break;
                }
            }
            return valid;
        },

        /*  validate array type  */
        exec_array: function (value, node) {
            var i, el;
            var valid = (typeof value === "object" && value instanceof Array);
            if (valid) {
                var pos = 0;
                for (i = 0; i < node.elements.length; i++) {
                    el = node.elements[i];
                    var found = 0;
                    while (found < el.arity[1] && pos < value.length) {
                        if (!this.exec_spec(value[pos], el.element))  /*  RECURSION  */
                            break;
                        found++;
                        pos++;
                    }
                    if (found < el.arity[0]) {
                        valid = false;
                        break;
                    }
                }
                if (pos < value.length)
                    valid = false;
            }
            return valid;
        },

        /*  validate standard JavaScript type  */
        exec_primary: function (value, node) {
            return (node.name === "null" && value === null) || (typeof value === node.name);
        },

        /*  validate custom JavaScript type  */
        exec_class: function (value, node) {
            /* jshint evil:true */
            /* eslint no-eval: 0 */
            return (   typeof value === "object"
                   && (   Object.prototype.toString.call(value) === "[object " + node.name + "]")
                       || eval("value instanceof " + node.name)                                  );
        }
    };


    /*  internal compile cache  */
    var validate_cache = {};

    /*  API function: validate an arbitrary value against a validation DSL  */
    Ducky.validate = function (value, spec) {
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
            ast = Ducky.validate.compile(spec);
            validate_cache[spec] = ast;
        }

        /*  execute validation AST against the value  */
        return Ducky.validate.execute(value, ast);
    };

    Ducky.validate.compile = function (spec) {
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

    Ducky.validate.execute = function (value, ast) {
        /*  sanity check arguments  */
        if (arguments.length !== 2)
            throw new Error("validate: invalid number of arguments: \"" +
                arguments.length + "\" (exactly 2 expected)");

        /*  execute validation AST against the value  */
        return validate_execute.exec_spec(value, ast);
    };


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
        if (!Ducky.validate(value, valid))
            throw new Error(func + ": parameter \"" + param + "\" has " +
                what + " " + JSON.stringify(value) + ", which does not validate " +
                "against \"" + valid + "\"");
    };

    /*  API function: flexible parameter handling  */
    Ducky.params = function (func, args, spec) {
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

    return Ducky;
}));

