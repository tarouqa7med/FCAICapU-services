// scroll nav 200px

let navScroll = document.getElementsByClassName("navbar")[0];
window.onscroll = function () {
    if (document.documentElement.scrollTop > 135) {
        navScroll.style.backgroundColor = "brown";
    } else {
        navScroll.style.backgroundColor = "transparent";
    }
};

// button about volunteers

let volunteerBtn = document.getElementById("volunteers");
volunteerBtn.addEventListener(
    "click",
    function () {
        document.getElementById("volunteerdiv").style.display =
            document.getElementById("volunteerdiv").style.display === "block"
                ? "none"
                : "block";
    }
);

// Change theme

let darkMode = document.querySelector(".darkMode");
let lightMode = document.querySelector(".lightMode");

darkMode.addEventListener(
    "click",
    function () {
        darkMode.style.display = "none";
        lightMode.style.display = "block";
        document.documentElement.style.setProperty("--primary-color", "#1f0000");
    }
);
lightMode.addEventListener(
    "click",
    function () {
        lightMode.style.display = "none";
        darkMode.style.display = "block";
        document.documentElement.style.setProperty("--primary-color", "#ffdcdc");
    }
);

let closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", function () {
    document.getElementById("volunteerdiv").style.display = "none";
});

document.getElementById("donationForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("name").value;
        let amount = document.getElementById("amount").value;

        document.getElementById("msg").innerHTML =
            "شكراً يا " + name + " ❤️ تم تسجيل تبرعك بقيمة " + amount + " جنيه";

        this.reset();
    });
