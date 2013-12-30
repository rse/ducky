
(function ($) {
    $(document).ready(function () {
        $("pre.highlight").each(function () {
            hljs.highlightBlock(this, true, false);
        });
        var swiper = $(".swiper-container").swiper({
            freeMode: false,
            freeModeFluid: false,
            mode: "horizontal",
            loop: false,
            autoResize: true,
            keyboardControl: true,
            mousewheelControl: false,
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
            swiper.swipePrev()
        })
        $(".icons .fa-arrow-circle-right").click(function (ev) {
            ev.preventDefault()
            swiper.swipeNext()
        })
    })
})(jQuery)

