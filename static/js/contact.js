
/* =========================================
   SPAIT INFOTECH - CONTACT PAGE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Scroll reveal animation
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element, index) {
            element.style.transitionDelay = `${(index % 3) * 100}ms`;
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }


    // Contact form demo validation
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            formStatus.textContent =
                "Your form is valid, but this demo does not send messages yet. Connect a backend to receive enquiries.";

            formStatus.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });
    }

});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    console.log(result);
});

   