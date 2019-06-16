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

import { registered } from "./ducky-2-registry-2-api.js"

/*  provide a reasonable context information for error messages  */
var errCtx = (path, msg) => {
    if (path === "")
        return `mismatch at root-level: ${msg}`
    else
        return `mismatch at path "${path}": ${msg}`
}

var validate_execute = {
    /*  validate specification (top-level)  */
    exec_spec (value, node, path, errors) {
        let valid = false
        if (node !== null) {
            switch (node.type) {
                case "not":     valid = this.exec_not(    value, node, path, errors); break
                case "or":      valid = this.exec_or(     value, node, path, errors); break
                case "hash":    valid = this.exec_hash(   value, node, path, errors); break
                case "array":   valid = this.exec_array(  value, node, path, errors); break
                case "regexp":  valid = this.exec_regexp( value, node, path, errors); break
                case "primary": valid = this.exec_primary(value, node, path, errors); break
                case "class":   valid = this.exec_class(  value, node, path, errors); break
                case "any":     valid = true;                                         break
                default:
                    throw new Error(`validate: invalid validation AST: node has unknown type "${node.type}"`)
            }
        }
        return valid
    },

    /*  validate through boolean "not" operation  */
    exec_not (value, node, path, errors) {
        let err = errors !== null ? [] : null
        let valid = this.exec_spec(value, node.op, path, err)  /*  RECURSION  */
        valid = !valid
        if (!valid && errors !== null)
            err.forEach((e) => errors.push(e))
        return valid
    },

    /*  validate through boolean "or" operation  */
    exec_or (value, node, path, errors) {
        let [ err1, err2 ] = errors !== null ? [ [], [] ] : [ null, null ]
        let valid1 = this.exec_spec(value, node.op1, path, err1)  /*  RECURSION  */
        let valid2 = this.exec_spec(value, node.op2, path, err2)  /*  RECURSION  */
        let valid = valid1 || valid2
        if (!valid && errors !== null) {
            err1.forEach((e) => errors.push(e))
            err2.forEach((e) => errors.push(e))
        }
        return valid
    },

    /*  validate hash type  */
    exec_hash (value, node, path, errors) {
        let i, el
        let valid = (typeof value === "object" && value !== null)
        let fields = {}
        let field
        if (!valid && errors !== null) {
            if (value === null)
                errors.push(`mismatch at path "${path}": found "null", expected hash`)
            else
                errors.push(`mismatch at path "${path}": found type "${typeof value}", expected hash`)
        }
        else if (valid) {
            /*  pass 1: ensure that all mandatory fields exist
                and determine map of valid fields for pass 2  */
            let hasAnyKeys = false
            for (field in value) {
                if (   !Object.hasOwnProperty.call(value, field)
                    || !Object.propertyIsEnumerable.call(value, field)
                    || field === "constructor"
                    || field === "prototype"                          )
                    continue
                hasAnyKeys = true
                break
            }
            for (i = 0; i < node.elements.length; i++) {
                el = node.elements[i]
                fields[el.key] = el.element
                if (   el.arity[0] > 0
                    && (   (el.key === "@" && !hasAnyKeys)
                        || (el.key !== "@" && typeof value[el.key] === "undefined"))) {
                    valid = false
                    if (errors !== null) {
                        if (el.key === "@")
                            errors.push(errCtx(path, "mandatory element under arbitrary key not found"))
                        else
                            errors.push(errCtx(path, `mandatory element under key "${el.key}" not found`))
                    }
                    else
                        break
                }
            }
        }
        if (valid || errors !== null) {
            /*  pass 2: ensure that no unknown fields exist
                and that all existing fields are valid  */
            let sep = (path !== "" ? "." : "")
            for (field in value) {
                if (   !Object.hasOwnProperty.call(value, field)
                    || !Object.propertyIsEnumerable.call(value, field)
                    || field === "constructor"
                    || field === "prototype"                          )
                    continue
                if (   typeof fields[field] === "undefined"
                    && typeof fields["@"]   === "undefined"
                    && errors !== null                     )
                    errors.push(errCtx(path, `element under key "${field}" unexpected`))
                if (   typeof fields[field] !== "undefined"
                    && this.exec_spec(value[field], fields[field], `${path}${sep}${field}`, errors)) /*  RECURSION  */
                    continue
                if (   typeof fields["@"] !== "undefined"
                    && this.exec_spec(value[field], fields["@"], `${path}${sep}${field}`, errors)) /*  RECURSION  */
                    continue
                valid = false
                if (errors === null)
                    break
            }
        }
        return valid
    },

    /*  validate array type  */
    exec_array (value, node, path, errors) {
        let i, el
        let valid = (typeof value === "object" && value instanceof Array)
        if (!valid && errors !== null)
            errors.push(errCtx(path, `found type "${typeof value}", expected array`))
        else if (valid) {
            let pos = 0
            let err = null

            /*  iterate over all AST nodes  */
            for (i = 0; i < node.elements.length; i++) {
                el = node.elements[i]
                let found = 0
                err = errors !== null ? [] : null

                /*  iterate over remaining value elements
                    - as long as the maximum value is not still reached and
                    - as long as there are still elements available
                    - as long as the elements are still valid  */
                while (found < el.arity[1] && pos < value.length) {
                    if (!this.exec_spec(value[pos], el.element, `${path}[${pos}]`, err))  /*  RECURSION  */
                        break
                    found++
                    pos++
                }
                if (found < el.arity[0]) {
                    if (errors !== null)
                        errors.push(errCtx(`${path}[${pos}]`,
                            `found only ${found} elements of array element type #${i}, ` +
                            `expected at least ${el.arity[0]} elements`))
                    valid = false
                    break
                }
            }

            /*  if last AST node matched not successfully, report its errors  */
            if (!valid && err !== null && err.length > 0) {
                if (errors !== null)
                    err.forEach((e) => errors.push(e))
            }

            /*  in case more elements are available without matching nodes  */
            else if (pos < value.length) {
                if (errors !== null)
                    errors.push(errCtx(path, `matched only ${pos} elements, ` +
                        `but ${value.length} elements found`))
                valid = false
            }
        }
        return valid
    },

    /*  validate regular expression  */
    exec_regexp (value, node, path, errors) {
        let valid = (value !== null && typeof value.toString === "function" ?
            node.regexp.test(value.toString()) : false)
        if (!valid && errors !== null)
            errors.push(errCtx(path, `value failed to match regular expression ${node.regexp.toString()}`))
        return valid
    },

    /*  validate standard JavaScript type  */
    exec_primary (value, node, path, errors) {
        let valid = (node.name === "null" && value === null) || (typeof value === node.name)
        if (!valid && errors !== null)
            errors.push(errCtx(path, `found type "${typeof value}", expected primary type "${node.name}"`))
        return valid
    },

    /*  validate custom JavaScript type  */
    exec_class (value, node, path, errors) {
        let type = registered(node.name)
        let valid = (
               typeof value === "object"
            && (
                  Object.prototype.toString.call(value) === "[object " + node.name + "]"
               || (   typeof type === "function"
                   && value instanceof type     )
            )
        )
        if (!valid && errors !== null)
            errors.push(errCtx(path, `found type "${typeof value}", expected class type "${node.name}"`))
        return valid
    }
}

export { validate_execute }

