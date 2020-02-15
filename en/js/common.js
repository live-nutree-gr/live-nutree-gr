jQuery(document).ready(function () {

    // Show/Hide mobile menu
    jQuery('.top-nav-icon.icon-hamburger').click(function (e) {
        e.preventDefault();
        jQuery('.top-nav-menu').toggleClass('active');
    });

    setTimeout(function () {
        jQuery(".top-nav").addClass("unmask");
    }, 500);

    setTimeout(function () {
        jQuery(".header").addClass("unmask");
    }, 1000);
});
