
GridLESS &mdash; Grid System for LESS CSS
=========================================

Abstract
--------

**GridLESS** is a flexible Open Source licensed Grid System for the LESS
CSS macro language to provide grid-based layouting of HTML content. It
primarily targets the layouting of content in Single-Page Apps (SPA),
but can be also used on Multi-Page Websites.

Features
--------

- elastic grid (viewport-width based percentage sizing)
- static grid (fixed-width based pixel sizing)
- based on rows, each of up to 16 columns
- arbitrary column spanning through fraction specifications
- arbitrary column offsetting through fraction specifications
- arbitrary grid nesting
- optionally attachable to custom CSS context class
- custom CSS class prefixes for rows, offsets and columns

Caveat
------

**GridLESS** is intentionally NOT "responsive", i.e., it does NOT provide
the usual media-query based breakpoints which automatically make columns
be "fluid" by allowing them to break into the next row. For the usual
content of Multi-Page Websites this is a nice and useful feauture, but
for the layout-optimized rendering of HTML content of Single-Page Apps
(SPA) such a feature is contra-productive. In an SPA one wants to fully
control the layouting and instead of having the content be "fluid" one
usually wants to respond to device orientation and size explicitly with,
for instance, a completely different layout.

Getting It
----------

You can conveniently get **GridLESS** in various ways:

- Git: directly clone the official repository:<br/>
  `$ git clone https://github.com/rse/gridless.git`

- Bower: install as client component via the Bower component manager:<br/>
  `$ bower install gridless`

- cURL: downloading only the main file from the repository:<br/>
  `$ curl -O https://raw.github.com/rse/gridless/master/grid.less`

Usage
-----

    @import "grid.less";`
    [<name-ctx> {] .grid-elastic(<name-row>, <name-off>, <name-col>, <columns>, <gutter-percent>); [}]
    [<name-ctx> {] .grid-static(<name-row>, <name-off>, <name-col>, <columns>, <column-width>, <gutter-width>); [}]

- `<name-ctx>`<br/>
  CSS class name for the context (optional).
  Example: `grid`
- `<name-row>`<br/>
  CSS class name for the grid rows.
  Example: `row`
- `<name-off>`<br/>
  CSS class name for the column offsets.
  Example: `off`
- `<name-col>`<br/>
  CSS class name for the columns.
  Example: `col`
- `<columns>`<br/>
  Maximum number of columns which can be used.
  Has to be greater than 1 and lower or equal 16.
  Example: `16`
- `<gutter-percent>`<br/>
  Width of the gutter between columns in an elastic grid, in percentage of the total row width.
  Has to be greater than 0.0 and lower or equal 1.0.
  Example: `0.05`
- `<column-width>`<br/>
  Width of the columns in a static grid, in pixels.
  Example: `70`
- `<gutter-width>`<br/>
  Width of the gutter between columns in a static grid, in pixels.
  Example: `10`

### Example

#### sample.less:

    ...
    @import "grid.less";
    .g-elastic { .grid-elastic(row, off, col, 16, 0.10); }
    ...

#### sample.html:

    ...
    <div>
        <div class="g-elastic row">
            <div class="off-2-4 col-1-4">1-4</div>
            <div class="col-1-4">1-4</div>
        </div>
        <div class="g-elastic row">
            <div class="col-1-4">1-4</div>
            <div class="col-3-4">4-4</div>
        </div>
    </div>
    ...

eg12
----

As an elastic grid variant with the usual 12 column divide is most
useful and hence used very often in practice, we additionally provide
such a pre-generated grid under the name "eg12", based on the following
`eg12.less` source:

    @import "grid.less";
    .grid-elastic(g-row, g-off, g-col, 12, 0.05);

The generated `eg12.css` file can be used without LESS out-of-the-box.
It provides the top-level CSS classes `g-row`, `g-off-K-N` and
`g-col-K-N`. Because this grid is often used inside a single-page app
and there even in in an arbitrary nested way, the grid is generated
without a surrounding top-level CSS class as this makes it more
intuitive and easier to use.

Use it like this:

    <div class="g-row">
        <div class="g-off-2-4 g-col-1-4">1-4</div>
        <div class="g-col-1-4">1-4</div>
    </div>
    <div class="g-row">
        <div class="g-col-1-3">1-3</div>
        <div class="g-col-2-3">2-3</div>
    </div>
    <div class="g-row">
        <div class="g-col-2-3">2-3</div>
        <div class="g-col-1-3">1-3</div>
    </div>
    <div class="g-row">
        <div class="g-col-1-1">1-1</div>
    </div>

sg950
-----

As a fixed grid variant of 950px with the usual 12 column divide (each
column has 70px and the gutter between columns is 10px) is rather useful
for websites and hence also used very often in practice, we additionally
provide such a pre-generated grid under the name "sg950", based on the
following `sg950.less` source:

    @import "grid.less";
    .grid-static(sg950-row, off, col, 12, 70, 10); }

The generated `sg950.css` file can be used without LESS out-of-the-box.
It provides under the top-level CSS class `sg950`, the row class `row`
and the column classes `off-K-N` and `col-K-N`. Because this grid is usually used
inside multi-page websites and there just as a singleton without any
nesting but lots of rows and columns, the grid is generated with a
surrounding top-level CSS class "sg950" as this makes it more convenient
to use.

Use it like this:

    <div class="sg950 row">
        <div class="off-2-4 col-1-4">1-4</div>
        <div class="col-1-4">1-4</div>
    </div>
    <div class="sg950 row">
        <div class="col-1-3">1-3</div>
        <div class="col-2-3">2-3</div>
    </div>
    <div class="sg950 row">
        <div class="col-2-3">2-3</div>
        <div class="col-1-3">1-3</div>
    </div>
    <div class="sg950 row">
        <div class="col-1-1">1-1</div>
    </div>

HTML Tables vs. CSS Grids
-------------------------

"A Web developer goes into a bar, but leaves as soon as he sees the table layout." &mdash; unknown

People since years debate on "HTML Tables vs. CSS Positioning for
Layouting Content". The common consensus is that CSS Positioning is
preferred as it is more flexible, more semantically correct, etc. But
when it comes to CSS Grids and their particular usual application with
&lt;div&gt; elements in a fully rigid markup structure, the benefits are
less obvious. So, as a recap, just compare the HTML Table and the CSS
Grid approaches with their pros and cons:

### HTML Table Approach

    <table>
        <tr>
            <td colspan="2"></td>
            <td>1-4</td>
            <td>1-4</td>
        </tr>
        <tr>
            <div>1-4</div>
            <div colspan="3">3-4</div>
        </tr>
    </table>

- con: originally intended for "tabular data" only
- con: uses both inner and outer cell padding
- PRO: supported everywhere out-of-the-box
- con: does NOT support fluid content ("responsive design")
- con: is usually slower in rendering (is rendered as a whole)
- PRO: supports columns to span multiple rows ("rowspan" attribute)
- con: works with a dedicated HTML element only (&lt;table&gt;)
- con: can only use explicit pre-calculated percentages

### CSS Grid Approach

    <div>
        <div class="g-row">
            <div class="g-off-2-4 g-col-1-4">1-4</div>
            <div class="g-col-1-4">1-4</div>
        </div>
        <div class="g-row">
            <div class="g-col-1-4">1-4</div>
            <div class="g-col-3-4">4-4</div>
        </div>
    </div>

- PRO: is not intended for "tabular data", but for layouting
- PRO: uses only inner cell padding (gutter)
- con: NOT supported everywhere out-of-the-box (need extra code)
- PRO: can support fluid content ("responsive design")
- PRO: is usually faster in rendering (is rendered row by row)
- con: does NOT support columns to span multiple rows
- PRO: cells can be overlapping
- PRO: works with any HTML element (&lt;div&gt;, &lt;section&gt;, etc)
- PRO: can use fraction-based percentages (1/2, 1/3, 1/4, etc)

Future
------

In the near future there will be a [standardized CSS Grid Layout](http://www.w3.org/TR/css3-grid-layout/),
but it needs time until it really [can be used](http://caniuse.com/css-grid) in practice.
In the meantime we have to stick with CSS Grids, like those provided by **GridLESS**.

See Also
--------

- [Semantic Grid](http://semantic.gs/)<br/>
  (we've borrowed the LESS macro idea from it)

- [Simple Grid](http://thisisdallas.github.io/Simple-Grid/)<br/>
  (we've borrowed the idea of "col-N-K" fractions from it)

- [Micro Clearfix Hack](http://nicolasgallagher.com/micro-clearfix-hack/)<br/>
  (we've borrowed the float clearing from it)

License
-------

Copyright (c) 2013 Ralf S. Engelschall (http://engelschall.com/)

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

