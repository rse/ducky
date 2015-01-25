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
        return (
               typeof value === "object"
            && (
                  Object.prototype.toString.call(value) === "[object " + node.name + "]"
               || (   typeof registry[node.name] === "function"
                   && value instanceof registry[node.name])
            )
        );
    }
};

