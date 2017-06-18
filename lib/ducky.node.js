/*!
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Ducky = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

/* global 2: false */
/* global 6: false */
/* global 0: false */
/* global 20170618:  false */

/*  API version  */
var version = {
    major: 2,
    minor: 6,
    micro: 0,
    date: 20170618
};

exports.version = version;

},{}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

/*  custom Token class  */
var Token = function () {
    function Token() {
        _classCallCheck(this, Token);

        this.name = "";
        this.text = "";
        this.tokens = [];
        this.pos = 0;
        this.len = 0;
    }

    /*  setter for caller context name  */


    _createClass(Token, [{
        key: "setName",
        value: function setName(name) {
            this.name = name;
        }

        /*  setter for plain-text input  */

    }, {
        key: "setText",
        value: function setText(text) {
            this.text = text;
        }

        /*  setter for additional token symbols  */

    }, {
        key: "addToken",
        value: function addToken(b1, b2, e2, e1, symbol) {
            this.tokens.push({ b1: b1, b2: b2, e2: e2, e1: e1, symbol: symbol });
            this.len++;
        }

        /*  peek at the next token or token at particular offset  */

    }, {
        key: "peek",
        value: function peek(offset) {
            if (typeof offset === "undefined") offset = 0;
            if (offset >= this.len) throw new Error(this.name + ": parse error: not enough tokens");
            return this.tokens[this.pos + offset].symbol;
        }

        /*  skip one or more tokens  */

    }, {
        key: "skip",
        value: function skip(len) {
            if (typeof len === "undefined") len = 1;
            if (len > this.len) throw new Error(this.name + ": parse error: not enough tokens available to skip: " + this.ctx());
            this.pos += len;
            this.len -= len;
        }

        /*  consume the current token (by expecting it to be a particular symbol)  */

    }, {
        key: "consume",
        value: function consume(symbol) {
            if (this.len <= 0) throw new Error(this.name + ": parse error: no more tokens available to consume: " + this.ctx());
            if (this.tokens[this.pos].symbol !== symbol) throw new Error(this.name + ": parse error: expected token symbol \"" + symbol + "\": " + this.ctx());
            this.pos++;
            this.len--;
        }

        /*  return a textual description of the token parsing context  */

    }, {
        key: "ctx",
        value: function ctx(width) {
            if (typeof width === "undefined") width = 78;
            var tok = this.tokens[this.pos];

            /*  the current token itself  */
            var context = "<" + this.text.substr(tok.b2, tok.e2 - tok.b2 + 1) + ">";
            context = this.text.substr(tok.b1, tok.b2 - tok.b1) + context;
            context = context + this.text.substr(tok.e2 + 1, tok.e1 - tok.e2);

            /*  the previous and following token(s)  */
            var k = width - context.length;
            if (k > 0) {
                k = Math.floor(k / 2);
                var i = void 0,
                    str = void 0;
                if (this.pos > 0) {
                    /*  previous token(s)  */
                    var k1 = 0;
                    for (i = this.pos - 1; i >= 0; i--) {
                        tok = this.tokens[i];
                        str = this.text.substr(tok.b1, tok.e1 - tok.b1 + 1);
                        k1 += str.length;
                        if (k1 > k) break;
                        context = str + context;
                    }
                    if (i > 0) context = "[...]" + context;
                }
                if (this.len > 1) {
                    /*  following token(s)  */
                    var k2 = 0;
                    for (i = this.pos + 1; i < this.pos + this.len; i++) {
                        tok = this.tokens[i];
                        str = this.text.substr(tok.b1, tok.e1 - tok.b1 + 1);
                        k2 += str.length;
                        if (k2 > k) break;
                        context = context + str;
                    }
                    if (i < this.pos + this.len) context = context + "[...]";
                }
            }

            /*  place everything on a single line through escape sequences  */
            context = context.replace(/\r/, "\\r").replace(/\n/, "\\n").replace(/\t/, "\\t");
            return context;
        }
    }]);

    return Token;
}();

exports.Token = Token;

},{}],3:[function(_dereq_,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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
var std_types = ["Object", "Boolean", "Number", "String", "Function", "RegExp", "Array", "Date", "Error", "Set", "Map", "WeakMap", "Promise", "Proxy", "Iterator"];

/* global global: false */
for (var i = 0; i < std_types.length; i++) {
    if (typeof global[std_types[i]] === "function") registry[std_types[i]] = global[std_types[i]];
}exports.registry = registry;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unregister = exports.register = exports.registered = undefined;

var _ducky2Registry1Data = _dereq_("./ducky-2-registry-1-data.js");

/*  API function: register a type under a name  */
var register = function register(name, type) {
    /*  sanity check arguments  */
    if (arguments.length !== 2) throw new Error("register: invalid number of arguments: " + arguments.length + " (exactly 2 expected)");
    if (typeof name !== "string") throw new Error("register: invalid name argument: \"" + name + "\" (string expected)");
    if (typeof type !== "function") throw new Error("register: invalid type argument: \"" + type + "\" (function object expected)");
    if (typeof _ducky2Registry1Data.registry[name] !== "undefined") throw new Error("register: type already registered under name: \"" + name + "\"");

    /*  add type to registry  */
    _ducky2Registry1Data.registry[name] = type;
};

/*  API function: unregister a type under a name  */
/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

var unregister = function unregister(name) {
    /*  sanity check arguments  */
    if (arguments.length !== 1) throw new Error("unregister: invalid number of arguments: " + arguments.length + " (exactly 1 expected)");
    if (typeof name !== "string") throw new Error("unregister: invalid name argument: \"" + name + "\" (string expected)");
    if (typeof _ducky2Registry1Data.registry[name] === "undefined") throw new Error("unregister: no type registered under name: \"" + name + "\"");

    /*  delete type from registry  */
    delete _ducky2Registry1Data.registry[name];
};

/*  API function: check for registered type under a name  */
var registered = function registered(name) {
    /*  sanity check arguments  */
    if (arguments.length !== 1) throw new Error("registered: invalid number of arguments: " + arguments.length + " (exactly 1 expected)");
    if (typeof name !== "string") throw new Error("registered: invalid name argument: \"" + name + "\" (string expected)");
    return _ducky2Registry1Data.registry[name];
};

exports.registered = registered;
exports.register = register;
exports.unregister = unregister;

},{"./ducky-2-registry-1-data.js":3}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

var select_compile = function select_compile(spec) {
    /*  result and state variables  */
    var path = [];
    var pos = 0;

    /*  iterate over selection specification  */
    var m = void 0;
    var txt = spec;
    while (txt !== "") {
        /*  case 1: standard path segment  */
        if ((m = txt.match(/^\s*(?:\.)?\s*([a-zA-Z$0-9_][a-zA-Z$0-9_:-]*)/)) !== null) path.push(m[1]);
        /*  case 2: numerical array-style dereference  */
        else if ((m = txt.match(/^\s*\[\s*(\d+|\*{1,2})\s*\]/)) !== null) path.push(m[1]);
            /*  case 3: double-quoted string array-style dereference  */
            else if ((m = txt.match(/^\s*\[\s*"((?:\\"|.)*?)"\s*\]/)) !== null) path.push(m[1].replace(/\\"/g, "\""));
                /*  case 4: single-quoted string array-style dereference  */
                else if ((m = txt.match(/^\s*\[\s*'((?:\\'|.)*?)'\s*\]/)) !== null) path.push(m[1].replace(/\\'/g, "'"));
                    /*  skip all whitespaces between segments  */
                    else if ((m = txt.match(/^\s+$/)) !== null) break;else throw new Error("select: parse error: invalid character at: " + spec.substr(0, pos) + "<" + txt.substr(0, 1) + ">" + txt.substr(1));

        /*  advance parsing position  */
        pos += m[0].length;
        txt = txt.substr(m[0].length);
    }

    return path;
};

exports.select_compile = select_compile;

},{}],6:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

/*  execute object selection  */
var select_execute = function select_execute(obj, path) {
    /*  handle special case of empty path */
    if (path.length === 0) {
        if (arguments.length === 3) throw new Error("select: cannot set value on empty path");else return obj;
    }

    /*  step into object graph according to path prefix  */
    var i = 0;
    while (i < path.length - 1) {
        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") throw new Error("select: cannot further dereference: no more intermediate objects in path");
        obj = obj[path[i++]];
    }

    /*  get the old value  */
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") throw new Error("select: cannot further dereference: no object at end of path");
    var value_old = obj[path[i]];

    /*  optionally set new value  */
    if (arguments.length === 3) {
        var value_new = arguments[2];
        if (value_new === undefined) {
            /*  delete value from collection  */
            if (obj instanceof Array) obj.splice(parseInt(path[i], 10), 1);else delete obj[path[i]];
        } else
            /*  set value into collection  */
            obj[path[i]] = value_new;
    }

    return value_old;
};

exports.select_execute = select_execute;

},{}],7:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.select = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                              **  Ducky -- Duck-Typed Value Handling for JavaScript
                                                                                                                                                                                                                                                                              **  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

var _ducky3Select1Compile = _dereq_("./ducky-3-select-1-compile.js");

var _ducky3Select2Execute = _dereq_("./ducky-3-select-2-execute.js");

/*  the internal compile cache  */
var select_cache = {};

/*  API function: select an arbitrary value via a path specification
    and either get the current value or set the new value  */
var select = function select(obj, spec, value) {
    /*  sanity check arguments  */
    if (arguments.length < 2) throw new Error("select: invalid number of arguments: " + arguments.length + " (minimum of 2 expected)");else if (arguments.length > 3) throw new Error("select: invalid number of arguments: " + arguments.length + " (maximum of 3 expected)");
    if (typeof spec !== "string") throw new Error("select: invalid specification argument: \"" + spec + "\" (string expected)");

    /*  compile select path from specification
        or reuse cached pre-compiled selection path  */
    var path = select_cache[spec];
    if (typeof path === "undefined") {
        path = (0, _ducky3Select1Compile.select_compile)(spec);
        select_cache[spec] = path;
    }

    /*  execute the object selection  */
    return arguments.length === 2 ? (0, _ducky3Select2Execute.select_execute)(obj, path) : (0, _ducky3Select2Execute.select_execute)(obj, path, value);
};

/*  compile a path specification into array of dereferencing steps  */
select.compile = function (spec) {
    /*  sanity check argument  */
    if (arguments.length !== 1) throw new Error("select: invalid number of arguments: " + arguments.length + " (exactly 1 expected)");
    if (typeof spec !== "string") throw new Error("select: invalid specification argument: \"" + spec + "\" (string expected)");
    return _ducky3Select1Compile.select_compile.apply(undefined, arguments);
};

/*  execute object selection  */
select.execute = function (obj, path) {
    /*  sanity check arguments  */
    if (arguments.length < 2) throw new Error("select: invalid number of arguments: " + arguments.length + " (minimum of 2 expected)");else if (arguments.length > 3) throw new Error("select: invalid number of arguments: " + arguments.length + " (maximum of 3 expected)");
    if (!((typeof path === "undefined" ? "undefined" : _typeof(path)) === "object" && path instanceof Array)) throw new Error("select: invalid path argument: \"" + path + "\" (array expected)");
    return _ducky3Select2Execute.select_execute.apply(undefined, arguments);
};

exports.select = select;

},{"./ducky-3-select-1-compile.js":5,"./ducky-3-select-2-execute.js":6}],8:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate_tokenize = undefined;

var _ducky1Util = _dereq_("./ducky-1-util.js");

/*  tokenize the validation specification  */
var validate_tokenize = function validate_tokenize(spec) {
    /*  create new Token abstraction  */
    var token = new _ducky1Util.Token();
    token.setName("validate");
    token.setText(spec);

    /*  determine individual token symbols  */
    var m = void 0;
    var b = 0;
    while (spec !== "") {
        m = spec.match(/^(\s*)([^{}\[\]:,?*+()!|/\s]+|[{}\[\]:,?*+()!|/])(\s*)/);
        if (m === null) throw new Error("validate: parse error: cannot further canonicalize: \"" + spec + "\"");
        token.addToken(b, b + m[1].length, b + m[1].length + m[2].length - 1, b + m[0].length - 1, m[2]);
        spec = spec.substr(m[0].length);
        b += m[0].length;
    }
    token.addToken(b, b, b, b, null);
    return token;
}; /*
   **  Ducky -- Duck-Typed Value Handling for JavaScript
   **  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

exports.validate_tokenize = validate_tokenize;

},{"./ducky-1-util.js":2}],9:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

/*  parse specification  */
var validate_parse = {
    parse: function parse(token) {
        if (token.len <= 0) return null;
        var ast = this.parse_spec(token);
        var symbol = token.peek();
        if (symbol !== null) throw new Error("validate: parse error: unexpected token (expected end-of-string): \"" + token.ctx() + "\"");
        return ast;
    },


    /*  parse a specification  */
    parse_spec: function parse_spec(token) {
        if (token.len <= 0) return null;
        var ast = void 0;
        var symbol = token.peek();
        if (symbol === "!") ast = this.parse_not(token);else if (symbol === "(") ast = this.parse_group(token);else if (symbol === "{") ast = this.parse_hash(token);else if (symbol === "[") ast = this.parse_array(token);else if (symbol === "/") ast = this.parse_regexp(token);else if (symbol.match(/^(?:null|undefined|boolean|number|string|function|object)$/)) ast = this.parse_primary(token);else if (symbol === "any") ast = this.parse_any(token);else if (symbol.match(/^[_a-zA-Z$][_a-zA-Z$0-9]*(?:\.[_a-zA-Z$][_a-zA-Z$0-9]*)*$/)) ast = this.parse_class(token);else throw new Error("validate: parse error: invalid token symbol: \"" + token.ctx() + "\"");
        return ast;
    },


    /*  parse boolean "not" operation  */
    parse_not: function parse_not(token) {
        token.consume("!");
        var ast = this.parse_spec(token); /*  RECURSION  */
        ast = { type: "not", op: ast };
        return ast;
    },


    /*  parse group (for boolean "or" operation)  */
    parse_group: function parse_group(token) {
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
    parse_hash: function parse_hash(token) {
        token.consume("{");
        var elements = [];
        while (token.peek() !== "}") {
            var key = this.parse_key(token);
            var arity = this.parse_arity(token, "?");
            token.consume(":");
            var spec = this.parse_spec(token); /*  RECURSION  */
            elements.push({ type: "element", key: key, arity: arity, element: spec });
            if (token.peek() === ",") token.skip();else break;
        }
        var ast = { type: "hash", elements: elements };
        token.consume("}");
        return ast;
    },


    /*  parse array type specification  */
    parse_array: function parse_array(token) {
        token.consume("[");
        var elements = [];
        while (token.peek() !== "]") {
            var spec = this.parse_spec(token); /*  RECURSION  */
            var arity = this.parse_arity(token, "?*+");
            elements.push({ type: "element", element: spec, arity: arity });
            if (token.peek() === ",") token.skip();else break;
        }
        var ast = { type: "array", elements: elements };
        token.consume("]");
        return ast;
    },


    /*  parse regular expression specification  */
    parse_regexp: function parse_regexp(token) {
        token.consume("/");
        var text = "";
        while (token.len >= 1) {
            if (token.peek(0) === "/") break;else if (token.len >= 2 && token.peek(0) === "\\" && token.peek(1) === "/") {
                text += token.peek(1);
                token.skip(2);
            } else {
                text += token.peek(0);
                token.skip(1);
            }
        }
        token.consume("/");
        var regexp = void 0;
        try {
            regexp = new RegExp(text);
        } catch (ex) {
            throw new Error("validate: parse error: invalid regular expression \"" + text + "\": " + ex.message);
        }
        var ast = { type: "regexp", regexp: regexp };
        return ast;
    },


    /*  parse primary type specification  */
    parse_primary: function parse_primary(token) {
        var primary = token.peek();
        if (!primary.match(/^(?:null|undefined|boolean|number|string|function|object)$/)) throw new Error("validate: parse error: invalid primary type \"" + primary + "\"");
        token.skip();
        return { type: "primary", name: primary };
    },


    /*  parse special "any" type specification  */
    parse_any: function parse_any(token) {
        var any = token.peek();
        if (any !== "any") throw new Error("validate: parse error: invalid any type \"" + any + "\"");
        token.skip();
        return { type: "any" };
    },


    /*  parse JavaScript class specification  */
    parse_class: function parse_class(token) {
        var clazz = token.peek();
        if (!clazz.match(/^[_a-zA-Z$][_a-zA-Z$0-9]*(?:\.[_a-zA-Z$][_a-zA-Z$0-9]*)*$/)) throw new Error("validate: parse error: invalid class type \"" + clazz + "\"");
        token.skip();
        return { type: "class", name: clazz };
    },


    /*  parse arity specification  */
    parse_arity: function parse_arity(token, charset) {
        var arity = [1, 1];
        if (token.len >= 5 && token.peek(0) === "{" && token.peek(1).match(/^[0-9]+$/) && token.peek(2) === "," && token.peek(3).match(/^(?:[0-9]+|oo)$/) && token.peek(4) === "}") {
            arity = [parseInt(token.peek(1), 10), token.peek(3) === "oo" ? Number.MAX_VALUE : parseInt(token.peek(3), 10)];
            token.skip(5);
        } else if (token.len >= 3 && token.peek(0) === "{" && token.peek(1).match(/^[0-9]+$/) && token.peek(2) === "}") {
            arity = [parseInt(token.peek(1), 10), parseInt(token.peek(1), 10)];
            token.skip(3);
        } else if (token.len >= 1 && token.peek().length === 1 && charset.indexOf(token.peek()) >= 0) {
            var c = token.peek();
            switch (c) {
                case "?":
                    arity = [0, 1];break;
                case "*":
                    arity = [0, Number.MAX_VALUE];break;
                case "+":
                    arity = [1, Number.MAX_VALUE];break;
            }
            token.skip();
        }
        return arity;
    },


    /*  parse hash key specification  */
    parse_key: function parse_key(token) {
        var key = token.peek();
        if (!key.match(/^(?:[_a-zA-Z$][_a-zA-Z$0-9]*|@)$/)) throw new Error("validate: parse error: invalid key \"" + key + "\"");
        token.skip();
        return key;
    }
};

exports.validate_parse = validate_parse;

},{}],10:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate_execute = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         **  Ducky -- Duck-Typed Value Handling for JavaScript
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         **  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

var _ducky2Registry2Api = _dereq_("./ducky-2-registry-2-api.js");

/*  provide a reasonable context information for error messages  */
var errCtx = function errCtx(path, msg) {
    if (path === "") return "mismatch at root-level: " + msg;else return "mismatch at path \"" + path + "\": " + msg;
};

var validate_execute = {
    /*  validate specification (top-level)  */
    exec_spec: function exec_spec(value, node, path, errors) {
        var valid = false;
        if (node !== null) {
            switch (node.type) {
                case "not":
                    valid = this.exec_not(value, node, path, errors);break;
                case "or":
                    valid = this.exec_or(value, node, path, errors);break;
                case "hash":
                    valid = this.exec_hash(value, node, path, errors);break;
                case "array":
                    valid = this.exec_array(value, node, path, errors);break;
                case "regexp":
                    valid = this.exec_regexp(value, node, path, errors);break;
                case "primary":
                    valid = this.exec_primary(value, node, path, errors);break;
                case "class":
                    valid = this.exec_class(value, node, path, errors);break;
                case "any":
                    valid = true;break;
                default:
                    throw new Error("validate: invalid validation AST: node has unknown type \"" + node.type + "\"");
            }
        }
        return valid;
    },


    /*  validate through boolean "not" operation  */
    exec_not: function exec_not(value, node, path, errors) {
        var err = errors !== null ? [] : null;
        var valid = this.exec_spec(value, node.op, path, err); /*  RECURSION  */
        valid = !valid;
        if (!valid && errors !== null) err.forEach(function (e) {
            return errors.push(e);
        });
        return valid;
    },


    /*  validate through boolean "or" operation  */
    exec_or: function exec_or(value, node, path, errors) {
        var _ref = errors !== null ? [[], []] : [null, null],
            _ref2 = _slicedToArray(_ref, 2),
            err1 = _ref2[0],
            err2 = _ref2[1];

        var valid1 = this.exec_spec(value, node.op1, path, err1); /*  RECURSION  */
        var valid2 = this.exec_spec(value, node.op2, path, err2); /*  RECURSION  */
        var valid = valid1 || valid2;
        if (!valid && errors !== null) {
            err1.forEach(function (e) {
                return errors.push(e);
            });
            err2.forEach(function (e) {
                return errors.push(e);
            });
        }
        return valid;
    },


    /*  validate hash type  */
    exec_hash: function exec_hash(value, node, path, errors) {
        var i = void 0,
            el = void 0;
        var valid = (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value !== null;
        var fields = {};
        var field = void 0;
        if (!valid && errors !== null) {
            if (value === null) errors.push("mismatch at path \"" + path + "\": found \"null\", expected hash");else errors.push("mismatch at path \"" + path + "\": found type \"" + (typeof value === "undefined" ? "undefined" : _typeof(value)) + "\", expected hash");
        } else if (valid) {
            /*  pass 1: ensure that all mandatory fields exist
                and determine map of valid fields for pass 2  */
            var hasAnyKeys = false;
            for (field in value) {
                if (!Object.hasOwnProperty.call(value, field) || !Object.propertyIsEnumerable.call(value, field) || field === "constructor" || field === "prototype") continue;
                hasAnyKeys = true;
                break;
            }
            for (i = 0; i < node.elements.length; i++) {
                el = node.elements[i];
                fields[el.key] = el.element;
                if (el.arity[0] > 0 && (el.key === "@" && !hasAnyKeys || el.key !== "@" && typeof value[el.key] === "undefined")) {
                    valid = false;
                    if (errors !== null) {
                        if (el.key === "@") errors.push(errCtx(path, "mandatory element under arbitrary key not found"));else errors.push(errCtx(path, "mandatory element under key \"" + el.key + "\" not found"));
                    } else break;
                }
            }
        }
        if (valid || errors !== null) {
            /*  pass 2: ensure that no unknown fields exist
                and that all existing fields are valid  */
            var sep = path !== "" ? "." : "";
            for (field in value) {
                if (!Object.hasOwnProperty.call(value, field) || !Object.propertyIsEnumerable.call(value, field) || field === "constructor" || field === "prototype") continue;
                if (typeof fields[field] === "undefined" && typeof fields["@"] === "undefined" && errors !== null) errors.push(errCtx(path, "element under key \"" + field + "\" unexpected"));
                if (typeof fields[field] !== "undefined" && this.exec_spec(value[field], fields[field], "" + path + sep + field, errors)) /*  RECURSION  */
                    continue;
                if (typeof fields["@"] !== "undefined" && this.exec_spec(value[field], fields["@"], "" + path + sep + field, errors)) /*  RECURSION  */
                    continue;
                valid = false;
                if (errors === null) break;
            }
        }
        return valid;
    },


    /*  validate array type  */
    exec_array: function exec_array(value, node, path, errors) {
        var i = void 0,
            el = void 0;
        var valid = (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value instanceof Array;
        if (!valid && errors !== null) errors.push(errCtx(path, "found type \"" + (typeof value === "undefined" ? "undefined" : _typeof(value)) + "\", expected array"));else if (valid) {
            var pos = 0;
            var err = null;

            /*  iterate over all AST nodes  */
            for (i = 0; i < node.elements.length; i++) {
                el = node.elements[i];
                var found = 0;
                err = errors !== null ? [] : null;

                /*  iterate over remaining value elements
                    - as long as the maximum value is not still reached and
                    - as long as there are still elements available
                    - as long as the elements are still valid  */
                while (found < el.arity[1] && pos < value.length) {
                    if (!this.exec_spec(value[pos], el.element, path + "[" + pos + "]", err)) /*  RECURSION  */
                        break;
                    found++;
                    pos++;
                }
                if (found < el.arity[0]) {
                    if (errors !== null) errors.push(errCtx(path + "[" + pos + "]", "found only " + found + " elements of array element type #" + i + ", " + ("expected at least " + el.arity[0] + " elements")));
                    valid = false;
                    break;
                }
            }

            /*  if last AST node matched not successfully, report its errors  */
            if (!valid && err !== null && err.length > 0) {
                if (errors !== null) err.forEach(function (e) {
                    return errors.push(e);
                });
            }

            /*  in case more elements are available without matching nodes  */
            else if (pos < value.length) {
                    if (errors !== null) errors.push(errCtx(path, "matched only " + pos + " elements, " + ("but " + value.length + " elements found")));
                    valid = false;
                }
        }
        return valid;
    },


    /*  validate regular expression  */
    exec_regexp: function exec_regexp(value, node, path, errors) {
        var valid = node.regexp.test(value.toString());
        if (!valid && errors !== null) errors.push(errCtx(path, "value failed to match regular expression " + node.regexp.toString()));
        return valid;
    },


    /*  validate standard JavaScript type  */
    exec_primary: function exec_primary(value, node, path, errors) {
        var valid = node.name === "null" && value === null || (typeof value === "undefined" ? "undefined" : _typeof(value)) === node.name;
        if (!valid && errors !== null) errors.push(errCtx(path, "found type \"" + (typeof value === "undefined" ? "undefined" : _typeof(value)) + "\", expected primary type \"" + node.name + "\""));
        return valid;
    },


    /*  validate custom JavaScript type  */
    exec_class: function exec_class(value, node, path, errors) {
        var type = (0, _ducky2Registry2Api.registered)(node.name);
        var valid = (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && (Object.prototype.toString.call(value) === "[object " + node.name + "]" || typeof type === "function" && value instanceof type);
        if (!valid && errors !== null) errors.push(errCtx(path, "found type \"" + (typeof value === "undefined" ? "undefined" : _typeof(value)) + "\", expected class type \"" + node.name + "\""));
        return valid;
    }
};

exports.validate_execute = validate_execute;

},{"./ducky-2-registry-2-api.js":4}],11:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate = undefined;

var _ducky4Validate1Tokenize = _dereq_("./ducky-4-validate-1-tokenize.js");

var _ducky4Validate2Parse = _dereq_("./ducky-4-validate-2-parse.js");

var _ducky4Validate3Execute = _dereq_("./ducky-4-validate-3-execute.js");

/*  internal compile cache  */
var validate_cache = {};

/*  API function: validate an arbitrary value against a validation DSL  */
/*
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

var validate = function validate(value, spec, errors) {
    /*  sanity check arguments  */
    if (arguments.length < 2) throw new Error("validate: invalid number of arguments: " + arguments.length + " (minimum of 2 expected)");else if (arguments.length > 3) throw new Error("validate: invalid number of arguments: " + arguments.length + " (maximum of 3 expected)");
    if (typeof spec !== "string") throw new Error("validate: invalid specification argument: \"" + spec + "\" (string expected)");

    /*  compile validation AST from specification
        or reuse cached pre-compiled validation AST  */
    var ast = validate_cache[spec];
    if (typeof ast === "undefined") {
        ast = validate.compile(spec);
        validate_cache[spec] = ast;
    }

    /*  execute validation AST against the value  */
    return validate.execute(value, ast, errors);
};

validate.compile = function (spec) {
    /*  sanity check arguments  */
    if (arguments.length !== 1) throw new Error("validate: invalid number of arguments: " + arguments.length + " (exactly 1 expected)");
    if (typeof spec !== "string") throw new Error("validate: invalid specification argument: \"" + spec + "\" (string expected)");

    /*  tokenize the specification string into a token stream */
    var token = (0, _ducky4Validate1Tokenize.validate_tokenize)(spec);

    /*  parse the token stream into an AST  */
    var ast = _ducky4Validate2Parse.validate_parse.parse(token);

    return ast;
};

validate.execute = function (value, ast, errors) {
    /*  sanity check arguments  */
    if (arguments.length < 2) throw new Error("validate: invalid number of arguments: " + arguments.length + " (minimum of 2 expected)");else if (arguments.length > 3) throw new Error("validate: invalid number of arguments: " + arguments.length + " (maximum of 3 expected)");
    if (arguments.length < 3 || typeof errors === "undefined") errors = null;

    /*  execute validation AST against the value  */
    return _ducky4Validate3Execute.validate_execute.exec_spec(value, ast, "", errors);
};

exports.validate = validate;

},{"./ducky-4-validate-1-tokenize.js":8,"./ducky-4-validate-2-parse.js":9,"./ducky-4-validate-3-execute.js":10}],12:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.params = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                              **  Ducky -- Duck-Typed Value Handling for JavaScript
                                                                                                                                                                                                                                                                              **  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

var _ducky4Validate4Api = _dereq_("./ducky-4-validate-4-api.js");

/*  determine or at least guess whether we were called with
    positional or name-based parameters  */
var params_is_name_based = function params_is_name_based(args, spec) {
    var name_based = false;
    if (args.length === 1 && _typeof(args[0]) === "object") {
        /*  ok, looks like a regular call like
            "foo({ foo: ..., bar: ...})"  */
        name_based = true;

        /*  ...but do not be mislead by a positional use like
            "foo(bar)" where "bar" is an arbitrary object!  */
        for (var name in args[0]) {
            if (!Object.hasOwnProperty.call(args[0], name)) {
                if (typeof spec[name] === "undefined") name_based = false;
            }
        }
    }
    return name_based;
};

/*  common value validity checking  */
var params_check_validity = function params_check_validity(func, param, value, valid, what) {
    if (typeof valid === "undefined") return;
    if (!(0, _ducky4Validate4Api.validate)(value, valid)) throw new Error(func + ": parameter \"" + param + "\" has " + (what + " " + JSON.stringify(value) + ", which does not validate against \"" + valid + "\""));
};

/*  API function: flexible parameter handling  */
var params = function params(func, args, spec) {
    /*  start with a fresh parameter object  */
    var params = {};

    /*  handle parameter defaults  */
    var name = void 0;
    for (name in spec) {
        if (!Object.hasOwnProperty.call(spec, name)) continue;
        if (typeof spec[name].def !== "undefined") {
            if (typeof spec[name].valid !== "undefined") params_check_validity(func, name, spec[name].def, spec[name].valid, "default value");
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
            if (!Object.hasOwnProperty.call(args, name)) continue;
            if (typeof spec[name] === "undefined") throw new Error(func + ": unknown parameter \"" + name + "\"");
            params_check_validity(func, name, args[name], spec[name].valid, "value");
            params[name] = args[name];
        }

        /*  pass 2: check for required but missing parameters  */
        for (name in spec) {
            if (!Object.hasOwnProperty.call(spec, name)) continue;
            if (typeof spec[name].req !== "undefined" && spec[name].req && typeof args[name] === "undefined") throw new Error(func + ": required parameter \"" + name + "\" missing");
        }
    } else {
        /*
         *  case 2: positional parameter specification
         */

        /*  pass 1: determine number of positional and total required parameters
            and the mapping from parameter position to parameter name  */
        var positional = 0;
        var required = 0;
        var pos2name = {};
        for (name in spec) {
            if (!Object.hasOwnProperty.call(spec, name)) continue;
            if (typeof spec[name].pos !== "undefined") {
                pos2name[spec[name].pos] = name;
                if (typeof spec[name].pos === "number") positional++;
                if (typeof spec[name].req !== "undefined" && spec[name].req) required++;
            }
        }

        /*  check for required parameters  */
        if (args.length < required) throw new Error(func + ": invalid number of arguments (at least " + required + " required)");

        /*  pass 2: process parameters in sequence  */
        var i = 0;
        while (i < positional && i < args.length) {
            params_check_validity(func, pos2name[i], args[i], spec[pos2name[i]].valid, "value");
            params[pos2name[i]] = args[i];
            i++;
        }
        if (i < args.length) {
            if (typeof pos2name["..."] === "undefined") throw new Error(func + ": too many arguments provided");
            var rest = [];
            while (i < args.length) {
                rest.push(args[i++]);
            }params_check_validity(func, pos2name["..."], rest, spec[pos2name["..."]].valid, "value");
            params[pos2name["..."]] = rest;
        }
    }

    /*  return prepared parameter object  */
    return params;
};

exports.params = params;

},{"./ducky-4-validate-4-api.js":11}],13:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.options = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                              **  Ducky -- Duck-Typed Value Handling for JavaScript
                                                                                                                                                                                                                                                                              **  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

var _ducky3Select3Api = _dereq_("./ducky-3-select-3-api.js");

var _ducky4Validate4Api = _dereq_("./ducky-4-validate-4-api.js");

/*  API function: flexible option handling  */
var options = function options(spec, input) {
    var output = {};

    /*  prepare output by creating the structure and setting default values  */
    var required = [];
    var prepare = function prepare(path) {
        /*  fetch and act on current value of specification  */
        var val = (0, _ducky3Select3Api.select)(spec, path.join("."));
        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object" && !(val instanceof Array) && val !== null) {
            /*  option structure  */
            for (var name in val) {
                if (!Object.hasOwnProperty.call(val, name)) continue;
                prepare(path.concat(name)); /* RECURSION */
            }
        } else if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object" && val instanceof Array && val !== null) {
            /*  option element  */
            if (val.length <= 0 || val.length > 2) throw new Error("options: invalid option specification at \"" + path.join(".") + "\" " + "(expected array of length 1 or 2)");
            if (typeof val[0] !== "string") throw new Error("options: invalid option specification at \"" + path.join(".") + "[0]\" " + "(expected string type)");

            /*  create parent structure in output  */
            var out = output,
                i = 0;
            while (i < path.length - 1) {
                if (_typeof(out[path[i]]) !== "object") out[path[i]] = {};
                out = out[path[i]];
                i++;
            }

            /*  handle value  */
            if (val.length === 2) {
                /*  handle optional value (via default value)  */
                var errors = [];
                if (!(0, _ducky4Validate4Api.validate)(val[1], val[0], errors)) throw new Error("options: invalid option specification at \"" + path.join(".") + "\" " + ("(validation does not match default value): " + errors.join("; ")));
                out[path[i]] = val[1];
            } else {
                /*  handle required value (via remembering)  */
                required.push(path.join("."));
            }
        } else throw new Error("options: invalid option specification at \"" + path + "\" (expected object or array)");
    };
    prepare([]);

    /*  provide merge function  */
    var initially = true;
    var merge = function merge(input) {
        var _this = this;

        /*  initially ensure that all required options are given in input  */
        if (initially) {
            initially = false;
            for (var i = 0; i < required.length; i++) {
                if ((0, _ducky3Select3Api.select)(input, required[i]) === undefined) throw new Error("options: value for required option \"" + required[i] + "\" missing");
            }
        }

        /*  merge values into output  */
        var mergeInternal = function mergeInternal(path, val) {
            var info = (0, _ducky3Select3Api.select)(spec, path);
            if ((typeof info === "undefined" ? "undefined" : _typeof(info)) !== "object") throw new Error("options: value provided for unknown option \"" + path + "\" (invalid path)");
            if (!(info instanceof Array)) {
                /*  option structure  */
                for (var name in val) {
                    if (!Object.hasOwnProperty.call(val, name)) continue;
                    mergeInternal(path === "" ? name : path + "." + name, val[name]); /* RECURSION */
                }
            } else {
                /*  option element  */
                var errors = [];
                if (!(0, _ducky4Validate4Api.validate)(val, info[0], errors)) throw new Error("options: invalid value for option \"" + path + "\": " + errors.join("; "));
                (0, _ducky3Select3Api.select)(_this, path, val);
            }
        };
        mergeInternal("", input);
        return this;
    };

    /*  attach merge function and optionally call it immediately  */
    Object.defineProperty(output, "merge", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: merge
    });
    if ((typeof input === "undefined" ? "undefined" : _typeof(input)) === "object" && input !== null) output.merge(input);

    /*  provide resulting option object  */
    return output;
};

exports.options = options;

},{"./ducky-3-select-3-api.js":7,"./ducky-4-validate-4-api.js":11}],14:[function(_dereq_,module,exports){
"use strict";

var _ducky0Version = _dereq_("./ducky-0-version.js");

var _ducky2Registry2Api = _dereq_("./ducky-2-registry-2-api.js");

var _ducky3Select3Api = _dereq_("./ducky-3-select-3-api.js");

var _ducky4Validate4Api = _dereq_("./ducky-4-validate-4-api.js");

var _ducky5Params = _dereq_("./ducky-5-params.js");

var _ducky6Options = _dereq_("./ducky-6-options.js");

/*!
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2017 Ralf S. Engelschall <rse@engelschall.com>
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

module.exports = {
    version: _ducky0Version.version,
    register: _ducky2Registry2Api.register,
    unregister: _ducky2Registry2Api.unregister,
    select: _ducky3Select3Api.select,
    validate: _ducky4Validate4Api.validate,
    params: _ducky5Params.params,
    options: _ducky6Options.options
};

},{"./ducky-0-version.js":1,"./ducky-2-registry-2-api.js":4,"./ducky-3-select-3-api.js":7,"./ducky-4-validate-4-api.js":11,"./ducky-5-params.js":12,"./ducky-6-options.js":13}]},{},[14])(14)
});