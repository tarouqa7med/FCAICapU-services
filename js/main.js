
// scroll nav 200px & arrow-up button

let navScroll = document.getElementsByClassName("navbar")[0];
let arrowUpBtn = document.getElementById("arrow-up");
let arrowReturnBtn = document.getElementById("arrow-return");
window.onscroll = function () {
    if (document.documentElement.scrollTop >= 350) {
        navScroll.style.backgroundColor = "#226878";
        arrowUpBtn.style.display = "flex";
        arrowReturnBtn.style.bottom = "90px";
    } else {
        navScroll.style.backgroundColor = "transparent";
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

// button for pay & close Button animations

let payBtns = document.querySelectorAll(".backBtn");
let closeBtns = document.querySelectorAll(".payCloseBtn");

payBtns.forEach(
    function (btn) {
        btn.addEventListener("click", function () {
            document.getElementById("payDiv").style.display = "flex";
        }
    );
});

closeBtns.forEach(
    function (btn) {
        btn.addEventListener("click", function () {
            document.getElementById("payDiv").style.display = "none";
        }
    );
});


// change theme and save it with its colours

let darkMode = document.querySelectorAll(".darkMode");
let lightMode = document.querySelectorAll(".lightMode");
let color = document.documentElement.style;


darkMode.forEach(
    btn => {
        btn.addEventListener("click", function () {
            darkMode.forEach(dark => dark.style.display = "none");
            lightMode.forEach(light => light.style.display = "block");
            
            color.setProperty("--primary-color", "#000304");
            localStorage.setItem("--primary-color", "#000304");
            color.setProperty("--secondary-color", "#000507");
            localStorage.setItem("--secondary-color", "#000507");
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
    }
)
lightMode.forEach(
    btn => {
        btn.addEventListener("click", function () {
            lightMode.forEach(light => light.style.display = "none");
            darkMode.forEach(dark => dark.style.display = "block");

            color.setProperty("--primary-color", "#d3f7ff");
            localStorage.setItem("--primary-color", "#d3f7ff");
            color.setProperty("--secondary-color", "#cbf5ff");
            localStorage.setItem("--secondary-color", "#cbf5ff");
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
    }
)

if (darkMode && lightMode) {
    color.setProperty("--primary-color", localStorage.getItem("--primary-color"));
    color.setProperty("--primary-color-support", localStorage.getItem("--primary-color-support"));
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
        darkMode.forEach((dark) => (dark.style.display = "none"));
        lightMode.forEach((light) => (light.style.display = "block"));
    } else {
        darkMode.forEach((dark) => (dark.style.display = "block"));
        lightMode.forEach((light) => (light.style.display = "none"));
    }
}

// ------------------------------------------------------------------------------------- for (html/filesname.html)

let payFormByJS = `
    <div class="pop-up" id="payDiv">
        <div class="mini-pop-up">
            <button class="closeBtn payCloseBtn">&times;</button>
            <p>Please enter your info for paying</p>
            <form action="" method="get">
                <label for="">Card Number :</label>
                <input type="text" id="" inputmode="numeric" maxlength="19" required>
                <div>
                    <div>
                        <label for="">Expiry Date MM/YY</label>
                        <div>
                            <select name="month" id="">
                                <option value="1">01</option>
                                <option value="2">02</option>
                                <option value="3">03</option>
                                <option value="4">04</option>
                                <option value="5">05</option>
                                <option value="6">06</option>
                                <option value="7">07</option>
                                <option value="8">08</option>
                                <option value="9">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                            <select name="year" id="">
                                <option value="26">26</option>
                                <option value="27">27</option>
                                <option value="28">28</option>
                                <option value="29">29</option>
                                <option value="30">30</option>
                                <option value="31">31</option>
                                <option value="32">32</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label for="">CVV</label>
                        <input type="text" id=""  maxlength="3">
                    </div>
                </div>
                <label for="">Enter amount of money (at least 25 EGP) :</label>
                <input type="text" inputmode="numeric">
                <label for="">Your name :</label>
                <input type="text" name="" id="" required>
                <button type="submit">Pay $</button>
            </form>
            <div>
                <img src="../attachments/mastercard-7c511229.png" alt="">
                <img src="../attachments/miza.dfc41445.svg" alt="">
            </div>
        </div>
    </div>
`
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("payFormByJS").innerHTML = payFormByJS;
});
window.onload = function () {
    document.getElementById("payFormByJS").innerHTML = payFormByJS;
};

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("payCloseBtn")) {
        document.getElementById("payDiv").style.display = "none";
    }
});

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
