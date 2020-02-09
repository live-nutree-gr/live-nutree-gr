$(document).ready(function () {

    // Show/Hide mobile menu

    $('.top-nav-icon.icon-hamburger').click(function (e) {
        e.preventDefault();
        $('.top-nav-menu').toggleClass('active');
    });

    $('.top-nav-icon.icon-language').click(function (e) {
        e.preventDefault();
        $('.top-nav-menu').toggleClass('active');
    });
});

window.setTimeout(function () {
        $(".top-nav").addClass("unmask");
    }, 500
);

window.setTimeout(function () {
        $(".header").addClass("unmask");
    }, 1000
);
