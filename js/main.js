// scroll nav 200px

let navScroll = document.getElementsByClassName("navbar")[0];
window.onscroll = function () {
    if (document.documentElement.scrollTop > 135) {
        navScroll.style.backgroundColor = "#226878";
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

// change theme and save it with its colours

let darkMode = document.querySelector(".darkMode");
let lightMode = document.querySelector(".lightMode");
let color = document.documentElement.style;

let primary = localStorage.getItem("--primary-color");

if (primary) {
    color.setProperty("--primary-color", localStorage.getItem("--primary-color"));
    color.setProperty("--secondary-color", localStorage.getItem("--secondary-color"));
    color.setProperty("--border-color", localStorage.getItem("--border-color"));
    color.setProperty("--text-color", localStorage.getItem("--text-color"));
    color.setProperty("--text-color-inverted", localStorage.getItem("--text-color-inverted"));
    color.setProperty("--owners-div-color", localStorage.getItem("--owners-div-color"));
    color.setProperty("--donations-div-color", localStorage.getItem("--donations-div-color"));
    color.setProperty("--drop-shadow-color", localStorage.getItem("--drop-shadow-color"));
    color.setProperty("--box-shadow-80", localStorage.getItem("--box-shadow-80"));
    color.setProperty("--contact-color", localStorage.getItem("--contact-color"));
    color.setProperty("--contact-hover-color", localStorage.getItem("--contact-hover-color"));
    color.setProperty("--input-color", localStorage.getItem("--input-color"));

    if (localStorage.getItem("--primary-color") === "black") {
        darkMode.style.display = "none";
        lightMode.style.display = "block";
    } else {
        lightMode.style.display = "none";
        darkMode.style.display = "block";
    }
}

darkMode.addEventListener("click", function () {
    darkMode.style.display = "none";
    lightMode.style.display = "block";

    color.setProperty("--primary-color", "black");
    localStorage.setItem("--primary-color", "black");
    color.setProperty("--secondary-color", "#050505");
    localStorage.setItem("--secondary-color", "#050505");
    color.setProperty("--border-color", "white");
    localStorage.setItem("--border-color", "white");
    color.setProperty("--text-color", "black");
    localStorage.setItem("--text-color", "black");
    color.setProperty("--text-color-inverted", "white");
    localStorage.setItem("--text-color-inverted", "white");
    color.setProperty("--owners-div-color", "#222222");
    localStorage.setItem("--owners-div-color", "#222222");
    color.setProperty("--donations-div-color", "#222222");
    localStorage.setItem("--donations-div-color", "#222222");
    color.setProperty("--drop-shadow-color", "cyan");
    localStorage.setItem("--drop-shadow-color", "cyan");
    color.setProperty("--box-shadow-80", "#ffffff40");
    localStorage.setItem("--box-shadow-80", "#ffffff40");
    color.setProperty("--contact-color", "#202020");
    localStorage.setItem("--contact-color", "#202020");
    color.setProperty("--contact-hover-color", "#3a3a3a");
    localStorage.setItem("--contact-hover-color", "#3a3a3a");
    color.setProperty("--input-color", "gray");
    localStorage.setItem("--input-color", "gray");
});

lightMode.addEventListener("click", function () {
    lightMode.style.display = "none";
    darkMode.style.display = "block";

    color.setProperty("--primary-color", "white");
    localStorage.setItem("--primary-color", "white");
    color.setProperty("--secondary-color", "white");
    localStorage.setItem("--secondary-color", "white");
    color.setProperty("--border-color", "black");
    localStorage.setItem("--border-color", "black");
    color.setProperty("--text-color", "white");
    localStorage.setItem("--text-color", "white");
    color.setProperty("--text-color-inverted", "black");
    localStorage.setItem("--text-color-inverted", "black");
    color.setProperty("--owners-div-color", "#c6c6c6");
    localStorage.setItem("--owners-div-color", "#c6c6c6");
    color.setProperty("--donations-div-color", "#c6c6c6");
    localStorage.setItem("--donations-div-color", "#c6c6c6");
    color.setProperty("--drop-shadow-color", "transparent");
    localStorage.setItem("--drop-shadow-color", "transparent");
    color.setProperty("--box-shadow-80", "#00000080");
    localStorage.setItem("--box-shadow-80", "#00000080");
    color.setProperty("--contact-color", "#d6d6d6");
    localStorage.setItem("--contact-color", "#d6d6d6");
    color.setProperty("--contact-hover-color", "#b1b1b1");
    localStorage.setItem("--contact-hover-color", "#b1b1b1");
    color.setProperty("--input-color", "white");
    localStorage.setItem("--input-color", "white");
});

// -----------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------- for (html/filename.html)

let back = document.getElementById("back");

back.addEventListener(
    "click",
    function() {
        
    }
)