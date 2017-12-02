
(function ($) {
    $(document).ready(function () {
        $("*[data-syntax]").each(function () {
            var language = $(this).data("syntax")
            var syntax = new Syntax({
                language: language,
                cssPrefix: "syntax-"
            })
            syntax.config({})
            var text = $(this).text()
            text = text
                .replace(/^(?:[ \t]*\r?\n)+/, "")
                .replace(/([ \t]*\r?\n)(?:[ \t]*\r?\n)*[ \t]*$/, "$1")
            syntax.richtext(text)
            var html = syntax.html()
            $(this).html(html)
            $(".syntax-anchor", this).each(function () {
                var m = $(this).attr("class").match(/syntax-anchor-(\S+)/)
                var num = m[1]
                $(this).addClass("cn-" + num + "-i")
            })
            $(this).addClass("syntax")
        })
        var swiper = new Swiper(".swiper-container", {
            freeMode: false,
            freeModeFluid: false,
            mode: "horizontal",
            loop: false,
            autoResize: true,
            keyboard: true,
            mousewheel: false,
            pagination: ".pagination",
            paginationClickable: true,
            createPagination: true,
            hashNav: true,
            preventLinks: false,
            scrollbar: {
                container: ".swiper-scrollbar",
                draggable: true,
                hide: false,
                snapOnRelease: true
            },
            onSlideChangeEnd: function () {
                $(".icons .fa-arrow-circle-left").show();
                $(".icons .fa-arrow-circle-right").show();
                if (swiper.activeIndex === 0)
                    $(".icons .fa-arrow-circle-left").hide();
                else if (swiper.activeIndex === 3)
                    $(".icons .fa-arrow-circle-right").hide();
            }
        })
        $(".icons .fa-arrow-circle-left").click(function (ev) {
            ev.preventDefault()
            swiper.slidePrev()
        })
        $(".icons .fa-arrow-circle-right").click(function (ev) {
            ev.preventDefault()
            swiper.slideNext()
        })
    })
})(jQuery)

