

// ------------------------------------------------------------------------------------- for (html/filesname.html)

let payFormByJS = `
    <div class="pop-up" id="payDiv">
        <div class="mini-pop-up">
            <button class="closeBtn payCloseBtn">&times;</button>
            <p>Please enter your info for paying</p>
            <form action="../php/transactions.php" method="get">
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