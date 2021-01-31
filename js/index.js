jQuery(document).ready(function () {
    let $slides = jQuery('.slider li'),
        currentSlide = $slides.first(),

        nextSlide = function () {
            currentSlide.removeClass('show');
            currentSlide = currentSlide.next();
            if (currentSlide.length === 0) {
                currentSlide = $slides.first();
            }
            currentSlide.addClass('show');
        },

        prevSlide = function () {
            currentSlide.removeClass('show');
            currentSlide = currentSlide.prev();
            if (currentSlide.length === 0) {
                currentSlide = $slides.last();
            }
            currentSlide.addClass('show');
        };

    // Slider next button
    jQuery('.next').on('click', function () {
        nextSlide();
    });

    // Slider prev button
    jQuery('.prev').on('click', function () {
        prevSlide();
    });

    if (window.innerWidth < 640
        && (!!navigator.maxTouchPoints || 'ontouchstart' in document.documentElement)
    ) {
        jQuery('.slider').swipe({
            swipeLeft: function () {
                nextSlide();
            },
            swipeRight: function () {
                prevSlide();
            }
        });
    }

    if (!window.isMobile() || window.innerWidth > 640) {
        // rotate hero image slideshow for desktop
        jQuery('.slide-1').waitForImages(function () {
            let autoplayId,
                startAutoplay = function () {
                    clearInterval(autoplayId);
                    autoplayId = setInterval(function () {
                        nextSlide();
                    }, 6000)
                };

            startAutoplay();

            // add 2nd function on click
            jQuery('.next').on('click', function () {
                startAutoplay();
            });

            // add 2nd function on click
            jQuery('.prev').on('click', function () {
                startAutoplay();
            });

            // replaces swipe functions
            if (!!navigator.maxTouchPoints || 'ontouchstart' in document.documentElement) {
                jQuery('.slider').swipe({
                    swipeLeft: function () {
                        nextSlide();
                        startAutoplay();
                    },
                    swipeRight: function () {
                        prevSlide();
                        startAutoplay();
                    }
                });
            }
        });
    }
});
