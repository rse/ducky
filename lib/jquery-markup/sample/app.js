
/*  once the DOM (and its <link> tags) is ready...  */
$(document).ready(function () {
    /*  once jQuery.Markup has loaded the markup templates...  */
    $.markup.debug = 4;
    $.markup.load(function () {
        /*  render a "hello" container markup  */
        var h = $("body").markup("hello");

        /*  insert ten message markups  */
        for (var i = 0; i < 10; i++) {
            $(h).markup("hello/message", {
                i: i, k: i % 2,
                message: "Hello World"
            });
        }
    });
});

