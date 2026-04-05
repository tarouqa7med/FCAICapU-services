// scroll nav 200px

let navScroll = document.getElementsByClassName("navbar")[0];
window.onscroll = function () {
    if (document.documentElement.scrollTop > 135) {
        navScroll.style.backgroundColor = "brown";
    } else {
        navScroll.style.backgroundColor = "transparent";
    }
};

// button about volunteers & close Button animations

let volunteerBtn = document.getElementById("volunteers");
let popUp = document.getElementsByClassName("pop-up")[0];
let miniPopUp = document.getElementsByClassName("mini-pop-up")[0];
volunteerBtn.addEventListener("click", function () {
    document.getElementById("volunteerdiv").style.display = "block";
});
let closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", function () {
    popUp.classList.add("popup-hide");
    miniPopUp.classList.add("mini-popup-hide");
    setTimeout(function () {
        document.getElementById("volunteerdiv").style.display = "none";
        popUp.classList.remove("popup-hide");
        miniPopUp.classList.remove("mini-popup-hide");
    }, 750);
});

// Change theme

let darkMode = document.querySelector(".darkMode");
let lightMode = document.querySelector(".lightMode");
let color = document.documentElement.style;

darkMode.addEventListener("click", function () {
    darkMode.style.display = "none";
    lightMode.style.display = "block";
    color.setProperty("--primary-color", "#1f0000");
    color.setProperty("--third-color", "#711a1a");
    color.setProperty("--fourth-color", "#8b4a4a");
    color.setProperty("--toBrown", "#ec9595");
    color.setProperty("--about", "#740000");
    color.setProperty("--about-img", "#660011");
    color.setProperty("--text-color", "black");
    color.setProperty("--text-color-inverted", "white");
    color.setProperty("--card-body-p", "black");
    color.setProperty("--drop-shadow-color", "cyan")
    color.setProperty("--drop-shadow-color-inverted", "blue")
});
lightMode.addEventListener("click", function () {
    lightMode.style.display = "none";
    darkMode.style.display = "block";
    color.setProperty("--primary-color", "#ffcdcd");
    color.setProperty("--third-color", "#ffb7b7");
    color.setProperty("--fourth-color", "#d88787");
    color.setProperty("--toBrown", "brown");
    color.setProperty("--about", "#ff5f5f8a");
    color.setProperty("--about-img", "#ffc0ca");
    color.setProperty("--text-color", "white");
    color.setProperty("--text-color-inverted", "black");
    color.setProperty("--card-body-p", "#aaa");
    color.setProperty("--drop-shadow-color", "blue")
    color.setProperty("--drop-shadow-color-inverted", "cyan")
});

document
    .getElementById("donationForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("name").value;
        let amount = document.getElementById("amount").value;

        document.getElementById("msg").innerHTML =
            "شكراً يا " + name + " ❤️ تم تسجيل تبرعك بقيمة " + amount + " جنيه";

        this.reset();
    });
