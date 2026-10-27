
/* ======================================
   SPAIT INFOTECH - INSIGHTS PAGE JS
====================================== */

document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".insight-filter");
    const searchInput = document.getElementById("insightSearch");
    const articleGrid = document.getElementById("insightGrid");
    const articles = Array.from(
        document.querySelectorAll(".insight-card")
    );

    const emptyMessage = document.getElementById("insightsEmpty");
    const countMessage = document.getElementById("insightCount");
    const resetButton = document.getElementById("resetInsights");

    const reader = document.getElementById("articleReader");
    const readerCategory = document.getElementById("readerCategory");
    const readerTitle = document.getElementById("readerTitle");
    const readerIntro = document.getElementById("readerIntro");
    const readerBody = document.getElementById("readerBody");
    const closeArticleButton = document.getElementById("closeArticle");

    let activeCategory = "All";

    // Sample article content. Replace with approved company articles.
    const articleContent = {
        "article-web": {
            category: "Web Development",
            title: "Responsive web design: beyond screen sizes",
            intro: "A useful website should provide a clear, accessible experience across phones, tablets, laptops, and larger displays.",
            sections: [
                {
                    heading: "Start with flexible layouts",
                    body: "Use responsive grids, flexible widths, and suitable breakpoints instead of designing for only one screen size. Test content at different widths to identify overflow and layout problems."
                },
                {
                    heading: "Keep usability in focus",
                    body: "Readable text, clear navigation, accessible forms, and appropriately sized touch targets all contribute to a better experience on smaller devices."
                },
                {
                    heading: "Test real interactions",
                    body: "Check menus, links, forms, images, and keyboard navigation. Responsive design is not just about fitting a page on the screen; it is about making the page usable."
                }
            ]
        },

        "article-software": {
            category: "Software",
            title: "Building software that's easier to maintain",
            intro: "Maintainable software is easier to understand, test, improve, and support as requirements change.",
            sections: [
                {
                    heading: "Write clear, focused code",
                    body: "Use meaningful names, small functions, and clear responsibilities. Consistent conventions help team members understand a project without unnecessary effort."
                },
                {
                    heading: "Test important behavior",
                    body: "Automated tests can help identify regressions when code changes. Focus on critical workflows and common failure scenarios."
                },
                {
                    heading: "Document important decisions",
                    body: "Explain setup steps, configuration, APIs, and decisions that may not be obvious from the code itself. Useful documentation saves time during maintenance."
                }
            ]
        },

        "article-ai": {
            category: "AI & Data",
            title: "Starting an AI project with the right questions",
            intro: "An AI project should begin with a clear problem and realistic measures of success, rather than choosing a model first.",
            sections: [
                {
                    heading: "Define the problem",
                    body: "Identify the people who will use the solution, the decision it should support, and the outcome that would make the project useful."
                },
                {
                    heading: "Understand the data",
                    body: "Assess whether the available data is relevant, sufficiently representative, and appropriate to use. Data quality can strongly affect model performance."
                },
                {
                    heading: "Plan for responsible use",
                    body: "Consider privacy, security, bias, reliability, and human review. Evaluate the system in the context where it will actually be used."
                }
            ]
        },

        "article-business": {
            category: "Business & IT",
            title: "Digital transformation starts with a clear goal",
            intro: "Technology investments are more useful when they address a defined business challenge and support measurable outcomes.",
            sections: [
                {
                    heading: "Understand the current process",
                    body: "Map existing workflows, identify repeated manual tasks, and speak with the people who use the process every day."
                },
                {
                    heading: "Choose a practical improvement",
                    body: "Prioritize changes that address a real need. A focused improvement can be easier to test and measure than a large, unclear transformation."
                },
                {
                    heading: "Measure the outcome",
                    body: "Use relevant indicators such as completion time, error rates, customer feedback, or operational costs to assess whether the change is working."
                }
            ]
        },

        "article-performance": {
            category: "Web Development",
            title: "Website performance is part of user experience",
            intro: "A website should help visitors find information and complete tasks without unnecessary waiting or interaction barriers.",
            sections: [
                {
                    heading: "Optimize page resources",
                    body: "Compress images, remove unused code where practical, and load resources thoughtfully. Measure performance before and after changes."
                },
                {
                    heading: "Design for accessibility",
                    body: "Use semantic HTML, visible focus states, clear labels, and sufficient contrast. People should be able to navigate important tasks in different ways."
                },
                {
                    heading: "Monitor real user journeys",
                    body: "Review key pages and interactions on mobile and desktop. Test forms, navigation, and other actions that matter to your visitors."
                }
            ]
        },

        "article-security": {
            category: "Software",
            title: "Security considerations for modern applications",
            intro: "Security should be considered throughout application design, development, deployment, and maintenance.",
            sections: [
                {
                    heading: "Protect access",
                    body: "Use appropriate authentication and authorization, validate permissions on the server, and avoid exposing sensitive information in client-side code."
                },
                {
                    heading: "Handle data carefully",
                    body: "Validate untrusted input, use secure configuration, protect secrets, and apply suitable data access controls."
                },
                {
                    heading: "Keep reviewing and updating",
                    body: "Maintain dependencies, review logs appropriately, test important security controls, and establish a process for addressing vulnerabilities."
                }
            ]
        }
    };


    // Scroll reveal animations
    const revealElements = document.querySelectorAll(
        ".insights-page .reveal"
    );

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
            element.style.transitionDelay = `${(index % 3) * 80}ms`;
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }


    // Filter and search
    function filterArticles() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        articles.forEach(function (article) {
            const category = article.dataset.category || "";
            const title = article.dataset.title || "";
            const articleText = article.textContent.toLowerCase();

            const matchesCategory =
                activeCategory === "All" ||
                category === activeCategory;

            const matchesSearch =
                !searchTerm ||
                title.toLowerCase().includes(searchTerm) ||
                articleText.includes(searchTerm);

            const isVisible = matchesCategory && matchesSearch;

            article.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        emptyMessage.hidden = visibleCount !== 0;

        countMessage.textContent =
            visibleCount === 1
                ? "Showing 1 insight"
                : `Showing ${visibleCount} insights`;
    }


    filters.forEach(function (filterButton) {
        filterButton.addEventListener("click", function () {
            activeCategory = filterButton.dataset.filter;

            filters.forEach(function (button) {
                const isActive = button === filterButton;

                button.classList.toggle("active", isActive);
                button.setAttribute("aria-pressed", String(isActive));
            });

            filterArticles();
        });
    });


    searchInput.addEventListener("input", filterArticles);


    function resetFilters() {
        activeCategory = "All";
        searchInput.value = "";

        filters.forEach(function (button) {
            const isActive = button.dataset.filter === "All";

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        filterArticles();
    }

    resetButton.addEventListener("click", resetFilters);


    // Open a sample article in the reader section
    function openArticle(articleId) {
        const article = articleContent[articleId];

        if (!article) {
            return;
        }

        readerCategory.textContent = article.category;
        readerTitle.textContent = article.title;
        readerIntro.textContent = article.intro;

        // Build content safely using DOM methods and textContent.
        readerBody.replaceChildren();

        article.sections.forEach(function (section) {
            const heading = document.createElement("h3");
            heading.textContent = section.heading;

            const paragraph = document.createElement("p");
            paragraph.textContent = section.body;

            readerBody.append(heading, paragraph);
        });

        reader.hidden = false;
        reader.classList.add("is-visible");

        reader.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "start"
        });
    }


    document.querySelectorAll("[data-article]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const articleId = link.dataset.article;
            openArticle(articleId);
        });
    });


    closeArticleButton.addEventListener("click", function () {
        reader.hidden = true;
        document.getElementById("latest-insights").scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "start"
        });
    });


    // Initial article count
    filterArticles();
});
