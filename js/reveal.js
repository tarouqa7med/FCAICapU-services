// reveal code for all project

document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("active");
                }, 150);
            } // else {
            //     entry.target.classList.remove("active");
            // }
        });
    });

    elements.forEach(function (el) {
        observer.observe(el);
    });
});
