
// scroll nav 200px & arrow-up button

let navScroll = document.getElementsByClassName("navbar")[0];
let arrowUpBtn = document.getElementById("arrow-up");
let arrowReturnBtn = document.getElementById("arrow-return");
window.onscroll = function () {
    if (document.documentElement.scrollTop >= 350) {
        arrowUpBtn.style.display = "flex";
        arrowReturnBtn.style.bottom = "90px";
    } else {
        arrowUpBtn.style.display = "none";
        arrowReturnBtn.style.bottom = "30px";
    }
};
if (arrowUpBtn) {
    arrowUpBtn.addEventListener(
        "click",
        function () {
            window.scrollTo({ top: 0 });
        }
    );
};

// button about volunteers & close Button animations

let volunteerBtn = document.getElementById("volunteers");

if (volunteerBtn) {
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
}

// change theme and save it with its colours

let darkMode = document.querySelectorAll(".darkMode");
let lightMode = document.querySelectorAll(".lightMode");
let color = document.documentElement.style;


darkMode.forEach(
    btn => {
        btn.addEventListener("click", function () {
            
            darkMode.forEach((dark) => (dark.style.display = "none"));
            lightMode.forEach((light) => (light.style.display = "block"));

            color.setProperty("--bg1", "#0f172a");
            color.setProperty("--bg2", "#111827");
            color.setProperty("--blob1", "#5bc8ffa8");
            color.setProperty("--blob2", "#0062ff49");
            color.setProperty("--blob3", "#ed3a9c8a");
            localStorage.setItem("--bg1", "#0f172a");
            localStorage.setItem("--bg2", "#111827");
            localStorage.setItem("--blob1", "#5bc8ffa8");
            localStorage.setItem("--blob2", "#0062ff49");
            localStorage.setItem("--blob3", "#ed3a9c8a");

            color.setProperty("--primary-color1", "#000f22");
            color.setProperty("--primary-color2", "#1b3554");
            color.setProperty("--primary-color3", "#3f6593");
            color.setProperty("--primary-color4", "#5b86b8");
            color.setProperty("--primary-color5", "#80aad3");
            color.setProperty("--primary-color6", "#c0e6fd");
            localStorage.setItem("--primary-color1", "#000f22");
            localStorage.setItem("--primary-color2", "#1b3554");
            localStorage.setItem("--primary-color3", "#3f6593");
            localStorage.setItem("--primary-color4", "#5b86b8");
            localStorage.setItem("--primary-color5", "#80aad3");
            localStorage.setItem("--primary-color6", "#c0e6fd");
        });
    }
)
lightMode.forEach(
    btn => {
        btn.addEventListener("click", function () {

            lightMode.forEach((light) => (light.style.display = "none"));
            darkMode.forEach((dark) => (dark.style.display = "block"));

            color.setProperty("--bg1", "#d8deff");
            color.setProperty("--bg2", "#d9e4ff");
            color.setProperty("--blob1", "#5bc8ffa8");
            color.setProperty("--blob2", "#0062ff75");
            color.setProperty("--blob3", "#1edc01cb");
            localStorage.setItem("--bg1", "#d8deff");
            localStorage.setItem("--bg2", "#d9e4ff");
            localStorage.setItem("--blob1", "#5bc8ffa8");
            localStorage.setItem("--blob2", "#0062ff75");
            localStorage.setItem("--blob3", "#1edc01cb");

            color.setProperty("--primary-color1", "#c0e6fd");
            color.setProperty("--primary-color2", "#80aad3");
            color.setProperty("--primary-color3", "#5b86b8");
            color.setProperty("--primary-color4", "#3f6593");
            color.setProperty("--primary-color5", "#1b3554");
            color.setProperty("--primary-color6", "#000f22");
            localStorage.setItem("--primary-color1", "#c0e6fd");
            localStorage.setItem("--primary-color2", "#80aad3");
            localStorage.setItem("--primary-color3", "#5b86b8");
            localStorage.setItem("--primary-color4", "#3f6593");
            localStorage.setItem("--primary-color5", "#1b3554");
            localStorage.setItem("--primary-color6", "#000f22");
        });
    }
)

if (darkMode && lightMode) {
    color.setProperty("--bg1", localStorage.getItem("--bg1"));
    color.setProperty("--bg2", localStorage.getItem("--bg2"));
    color.setProperty("--blob1", localStorage.getItem("--blob1"));
    color.setProperty("--blob2", localStorage.getItem("--blob2"));
    color.setProperty("--blob3", localStorage.getItem("--blob3"));
    color.setProperty("--primary-color1", localStorage.getItem("--primary-color1"));
    color.setProperty("--primary-color2", localStorage.getItem("--primary-color2"));
    color.setProperty("--primary-color3", localStorage.getItem("--primary-color3"));
    color.setProperty("--primary-color4", localStorage.getItem("--primary-color4"));
    color.setProperty("--primary-color5", localStorage.getItem("--primary-color5"));
    color.setProperty("--primary-color6", localStorage.getItem("--primary-color6"));

    if (localStorage.getItem("--primary-color1") === "#000f22") {
        darkMode.forEach((dark) => (dark.style.display = "none"));
        lightMode.forEach((light) => (light.style.display = "block"));
    } else {
        darkMode.forEach((dark) => (dark.style.display = "block"));
        lightMode.forEach((light) => (light.style.display = "none"));
    }
}
