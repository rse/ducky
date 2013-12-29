/*
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

