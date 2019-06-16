
Ducky &mdash; [duckyjs.com](http://duckyjs.com/)
================================================

**Duck-Typed Value Handling for JavaScript**

<p/>
<img src="https://nodei.co/npm/ducky.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/ducky.png" alt=""/>

Abstract
--------

Ducky is a small Open-Source JavaScript library, providing Duck-Typed
Value Validation, Value Selection and Flexible Function Parameter
Handling. It can be used in [Node.js](http://nodejs.org/) based server
and browser based client environments.

Getting Ducky
----------------

You can conveniently get Ducky in various ways:

- NPM: install as server component via the Node Package Manager:<br/>
  `$ npm install ducky`

- Git: directly clone the official repository:<br/>
  `$ git clone https://github.com/rse/ducky.git`

- cURL: download only the main file from the repository:<br/>
  `$ curl -O https://raw.github.com/rse/ducky/master/lib/ducky.browser.js`

API
---

Ducky provides the following API:

#### ducky.version = { major: Number, minor: Number, micro: Number, date: Number }

The version of Ducky, provided as a tuple of separate pieces, for easy comparison.

    if (!(ducky.version.major >= 2 && ducky.version.minor >= 0))
        throw new Error("need at least Ducky 2.0.0");

#### ducky.register(name: String, type: Function): void

Register under `name` an additional host or application type,
represented by the constructor function `type`. This allows
`ducky.validate()` and `ducky.params()` to validate objects
which are instances of the type.

    var Foo = function () { ... };
    ducky.register("app.Foo", Foo);
    ducky.validate(new Foo(), "app.Foo");

The following host types are pre-registered by default (if actually
existing in the particular native or "polyfilled" host environment):
`Object`, `Boolean`, `Number`, `String`, `Function`, `RegExp`, `Array`,
`Date`, `Error`, `Set`, `Map`, `WeakMap`, `Promise`, `Proxy` and
`Iterator`.

#### ducky.unregister(name: String): void

Unregisters the additional host or application type, which was previously
registered under `name` with `ducky.register()`.

    ducky.unregister("app.Foo");

#### ducky.select(object: Object, path: String, value?: Object): Object

Dereference into (and this way subset) `object` according to the
`path` specification and either return the dereferenced value or
set a new `value`. Object has to be a hash or array object. The
`path` argument has to follow the following grammar (which is a
direct JavaScript dereferencing syntax):

LHS          |     | RHS
------------ | --- | -----------------------------
path         | ::= | segment segment\*
segment      | ::= | bybareword &#124; bykey
bybareword   | ::= | `"."`? identifier
bykey        | ::= | `"["` key `"]"`
identifier   | ::= | `/[_a-zA-Z$][_a-zA-Z$0-9]*>/`
key          | ::= | number &#124; squote &#124; dquote
number       | ::= | `/[0-9]+/`
dquote       | ::= | `/"(?:\\"|.)*?"/`
squote       | ::= | `/'(?:\\'|.)*?'/`

Setting the `value` to `undefined` effectively removes the
dereferenced value. If the dereferenced parent object is a hash, this
means the value is `delete`'ed from it. If the dereferenced parent
object is an array, this means the value is `splice`'ed out of it.

    ducky.select({ foo: { bar: { baz: [ 42, 7, "Quux" ] } } },
        "foo['bar'].baz[2]") // &rarr; "Quux"

In case caching of the internally compiled Abstract Syntax Tree (AST)
is not wishes, you can perform the compile and execute steps
of `ducky.select` individually:

##### ducky.select.compile(path: String): Object

Compile the selection specification `path` into an AST.

##### ducky.select.execute(object: Object, ast: Object, value?: Object): Object

Select from `object` a value via `ast` and either return it or set it to the new value `value`.

#### ducky.validate(object: Object, spec: String, errors?: String[]): Boolean

Validate an arbitrary nested JavaScript object `object` against the
specification `spec`. The specification `spec` has to be a string
following the following grammar (which is a mixture of JSON-like
structure and RegExp-like quantifiers):

LHS          |     | RHS
------------ | --- | -----------------------------
spec         | ::= | not &#124; alt &#124; hash &#124; array &#124; any &#124; regexp &#124; primary &#124; class
not          | ::= | `"!"` spec
alt          | ::= | `"("` spec (`"`&#124;`"` spec)\* `")"`
hash         | ::= | `"{"` (key arity? `":"` spec (`","` key arity? `":"` spec)\*)? `"}"`
array        | ::= | `"["` (spec arity? (`","` spec arity?)\*)? `"]"`
arity        | ::= | `"?"` &#124; `"*"` &#124; `"+"` &#124; `"{"` number `","` (number &#124; `"oo"`) `"}"`
number       | ::= | `/^[0-9]+$/`
key          | ::= | `/^[_a-zA-Z$][_a-zA-Z$0-9]*$/` &#124; `"@"`
any          | ::= | `"any"`
regexp       | ::= | `/^\/(?:\\\/|.)*\/$/`
primary      | ::= | `/^(?:null|undefined|boolean|number|string|function|object)$/`
class        | ::= | `/^[_a-zA-Z$][_a-zA-Z$0-9]\*(?:\.[_a-zA-Z$][_a-zA-Z$0-9]\*)\*$/`

The special key `@` can be used to match an arbitrary hash element key.

    ducky.validate({ foo: "Foo", bar: "Bar", baz: [ 42, 7, "Quux" ] },
        "{ foo: string, bar: any, baz: [ number+, string* ], quux?: any }") // &arr; true

If an empty `errors` array is given, use it to assemble detailed error
messages in case of a validation failure.

In case caching of the internally compiled Abstract Syntax Tree (AST)
is not wishes, you can perform the compile and execute steps
of `ducky.validate` individually:

##### ducky.validate.compile(spec: String): Object

Compile the validation specification `spec` into an AST.

##### ducky.validate.execute(object: Object, ast: Object, errors?: String[]): Boolean

Validate `object` against `ast` and return `true` in case it validates.
If an empty `errors` array is given, use it to assemble detailed error
messages in case of a validation failure.

#### ducky.params(name: String, args: Object[], spec: Object): Object

Handle positional and named function parameters by processing a
function's `arguments` array. Parameter `name` is the name of the
function for use in exceptions in case of invalid parameters. Parameter
`args` usually is the JavaScript `arguments` pseudo-array of a function.
Parameter `spec` is the parameter specification: each key is the name
of a parameter and the value has to be an `Object` with the following
possible fields: `pos` for the optional position in case of positional
usage, `def` for the default value (of not required and hence optional
parameters), `req` to indicate whether the parameter is required and
`valid` for type validation (a validation specification string accepted
by the `validate>()` method).

    function config () {
        var params = ducky.params("config", arguments, {
            scope: { pos: 0, req: true,      valid: "boolean"           },
            key:   { pos: 1, req: true,      valid: /^[a-z][a-z0-9_]*$/ },
            value: { pos: 2, def: undefined, valid: "object"            },
            force: {         def: false,     valid: "boolean"           }
        });
        var result = cfg_get(params.scope, params.key);
        if (typeof params.value !== "undefined")
            cfg_set(params.scope, params.key, params.value, params.force);
        return result;
    }
    var value = config("foo", "bar");
    config("foo", "bar", "quux");
    config({ scope: "foo", key: "bar", value: "quux", force: true });

#### ducky.options(spec: Object, options?: Object): Object

Manage configuration option objects. Parameter `spec` is the option
object specification: each key is the name of a parameter (or a
sub-path) and the value has to be an `Array` with a type specification
accepted by the `validate()` method as its first element and optionally
a default value as the second element. If no default value is given
for an option, it has to exist on initial value merging. Value
merging is performed either when the `options` parameter is
given or method `merge(options: Object): Object` is called
on the resulting option object.

    function config (options) {
        var options = ducky.options({
            foo:      [ "string"           ],
            bar:      [ "boolean", false   ],
            quux:     [ "number",  1.2     ],
            sub: {
                foo:  [ "string",  "dummy" ],
                bar:  [ "boolean", false   ],
                quux: [ "number",  2.4     ]
            }
        });
        options.merge({ foo: "bar", sub: { bar: true } })
        options.merge({ sub: { quux: 4.8 } })
    }

License
-------

Copyright (c) 2010-2019 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

