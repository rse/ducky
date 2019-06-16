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

/*  execute object selection  */
var select_execute = function (obj, path) {
    /*  handle special case of empty path */
    if (path.length === 0) {
        if (arguments.length === 3)
            throw new Error("select: cannot set value on empty path")
        else
            return obj
    }

    /*  step into object graph according to path prefix  */
    let i = 0
    while (i < path.length - 1) {
        if (typeof obj !== "object")
            throw new Error("select: cannot further dereference: no more intermediate objects in path")
        obj = obj[path[i++]]
    }

    /*  get the old value  */
    if (typeof obj !== "object")
        throw new Error("select: cannot further dereference: no object at end of path")
    let value_old = obj[path[i]]

    /*  optionally set new value  */
    if (arguments.length === 3) {
        let value_new = arguments[2]
        if (value_new === undefined) {
            /*  delete value from collection  */
            if (obj instanceof Array)
                obj.splice(parseInt(path[i], 10), 1)
            else
                delete obj[path[i]]
        }
        else
            /*  set value into collection  */
            obj[path[i]] = value_new
    }

    return value_old
}

export { select_execute }

