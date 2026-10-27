
/* ======================================
   SPAIT INFOTECH - CAREERS PAGE JS
====================================== */

document.addEventListener("DOMContentLoaded", function () {
    const revealElements = document.querySelectorAll(
        ".careers-page .reveal"
    );

    // Reveal elements as they enter the viewport
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries, currentObserver) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element, index) {
            element.style.transitionDelay =
                `${(index % 3) * 100}ms`;

            observer.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }
});
