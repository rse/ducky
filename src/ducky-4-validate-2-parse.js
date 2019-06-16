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

/*  parse specification  */
var validate_parse = {
    parse (token) {
        if (token.len <= 0)
            return null
        let ast = this.parse_spec(token)
        let symbol = token.peek()
        if (symbol !== null)
            throw new Error(`validate: parse error: unexpected token (expected end-of-string): "${token.ctx()}"`)
        return ast
    },

    /*  parse a specification  */
    parse_spec (token) {
        if (token.len <= 0)
            return null
        let ast
        let symbol = token.peek()
        if (symbol === "!")
            ast = this.parse_not(token)
        else if (symbol === "(")
            ast = this.parse_group(token)
        else if (symbol === "{")
            ast = this.parse_hash(token)
        else if (symbol === "[")
            ast = this.parse_array(token)
        else if (symbol === "/")
            ast = this.parse_regexp(token)
        else if (symbol.match(/^(?:null|undefined|boolean|number|string|function|object)$/))
            ast = this.parse_primary(token)
        else if (symbol === "any")
            ast = this.parse_any(token)
        else if (symbol.match(/^[_a-zA-Z$][_a-zA-Z$0-9]*(?:\.[_a-zA-Z$][_a-zA-Z$0-9]*)*$/))
            ast = this.parse_class(token)
        else
            throw new Error(`validate: parse error: invalid token symbol: "${token.ctx()}"`)
        return ast
    },

    /*  parse boolean "not" operation  */
    parse_not (token) {
        token.consume("!")
        let ast = this.parse_spec(token) /*  RECURSION  */
        ast = { type: "not", op: ast }
        return ast
    },

    /*  parse group (for boolean "or" operation)  */
    parse_group (token) {
        token.consume("(")
        let ast = this.parse_spec(token)
        while (token.peek() === "|") {
            token.consume("|")
            let child = this.parse_spec(token) /*  RECURSION  */
            ast = { type: "or", op1: ast, op2: child }
        }
        token.consume(")")
        return ast
    },

    /*  parse hash type specification  */
    parse_hash (token) {
        token.consume("{")
        let elements = []
        while (token.peek() !== "}") {
            let key = this.parse_key(token)
            let arity = this.parse_arity(token, "?")
            token.consume(":")
            let spec = this.parse_spec(token)  /*  RECURSION  */
            elements.push({ type: "element", key: key, arity: arity, element: spec })
            if (token.peek() === ",")
                token.skip()
            else
                break
        }
        let ast = { type: "hash", elements: elements }
        token.consume("}")
        return ast
    },

    /*  parse array type specification  */
    parse_array (token) {
        token.consume("[")
        let elements = []
        while (token.peek() !== "]") {
            var spec = this.parse_spec(token)  /*  RECURSION  */
            var arity = this.parse_arity(token, "?*+")
            elements.push({ type: "element", element: spec, arity: arity })
            if (token.peek() === ",")
                token.skip()
            else
                break
        }
        let ast = { type: "array", elements: elements }
        token.consume("]")
        return ast
    },

    /*  parse regular expression specification  */
    parse_regexp (token) {
        token.consume("/")
        let text = ""
        while (token.len >= 1) {
            if (token.peek(0) === "/")
                break
            else if (token.len >= 2 && token.peek(0) === "\\" && token.peek(1) === "/") {
                text += token.peek(1)
                token.skip(2)
            }
            else {
                text += token.peek(0)
                token.skip(1)
            }
        }
        token.consume("/")
        let regexp
        try { regexp = new RegExp(text) }
        catch (ex) {
            throw new Error(`validate: parse error: invalid regular expression "${text}": ${ex.message}`)
        }
        let ast = { type: "regexp", regexp: regexp }
        return ast
    },

    /*  parse primary type specification  */
    parse_primary (token) {
        let primary = token.peek()
        if (!primary.match(/^(?:null|undefined|boolean|number|string|function|object)$/))
            throw new Error(`validate: parse error: invalid primary type "${primary}"`)
        token.skip()
        return { type: "primary", name: primary }
    },

    /*  parse special "any" type specification  */
    parse_any (token) {
        let any = token.peek()
        if (any !== "any")
            throw new Error(`validate: parse error: invalid any type "${any}"`)
        token.skip()
        return { type: "any" }
    },

    /*  parse JavaScript class specification  */
    parse_class (token) {
        let clazz = token.peek()
        if (!clazz.match(/^[_a-zA-Z$][_a-zA-Z$0-9]*(?:\.[_a-zA-Z$][_a-zA-Z$0-9]*)*$/))
            throw new Error(`validate: parse error: invalid class type "${clazz}"`)
        token.skip()
        return { type: "class", name: clazz }
    },

    /*  parse arity specification  */
    parse_arity (token, charset) {
        let arity = [ 1, 1 ]
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
            ]
            token.skip(5)
        }
        else if (   token.len >= 3
                 && token.peek(0) === "{"
                 && token.peek(1).match(/^[0-9]+$/)
                 && token.peek(2) === "}"          ) {
            arity = [
                parseInt(token.peek(1), 10),
                parseInt(token.peek(1), 10)
            ]
            token.skip(3)
        }
        else if (
               token.len >= 1
            && token.peek().length === 1
            && charset.indexOf(token.peek()) >= 0) {
            let c = token.peek()
            switch (c) {
                case "?": arity = [ 0, 1 ];                break
                case "*": arity = [ 0, Number.MAX_VALUE ]; break
                case "+": arity = [ 1, Number.MAX_VALUE ]; break
            }
            token.skip()
        }
        return arity
    },

    /*  parse hash key specification  */
    parse_key (token) {
        var key = token.peek()
        if (!key.match(/^(?:[_a-zA-Z$][_a-zA-Z$0-9]*|@)$/))
            throw new Error(`validate: parse error: invalid key "${key}"`)
        token.skip()
        return key
    }
}

export { validate_parse }

