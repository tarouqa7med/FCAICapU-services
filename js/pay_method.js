

// ------------------------------------------------------------------------------------- for (html/filesname.html)

let selectedProjectId = null;
let payFormRendered = false;

let payFormByJS = `
    <div class="pop-up" id="payDiv">
        <div class="mini-pop-up">
            <button class="closeBtn payCloseBtn">&times;</button>
            <p>Please enter your info for paying</p>
            <form id="payForm">
                <input type="hidden" name="projectId" id="projectIdInput">
                <label for="cardNumber">Card Number :</label>
                <input type="text" name="cardNumber" inputmode="numeric" maxlength="19" required>
                <div>
                    <div>
                        <label for="month">Expiry Date MM/YY</label>
                        <div>
                            <select name="month" id="month">
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
                            <select name="year" id="year">
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
                        <label for="cvv">CVV</label>
                        <input type="text" name="cvv" id="cvv" maxlength="3">
                    </div>
                </div>
                <label for="amount">Enter amount of money (at least 25 EGP) :</label>
                <input type="text" name="amount" id="amount" inputmode="numeric" required>
                <label for="backerName">Your name :</label>
                <input type="text" name="backerName" id="backerName" required>
                <button type="submit">Pay $</button>
            </form>
            <div>
                <img src="../attachments/mastercard-7c511229.png" alt="">
                <img src="../attachments/miza.dfc41445.svg" alt="">
            </div>
        </div>
    </div>
`

function ensurePayDivRendered() {
    const container = document.getElementById("payFormByJS");
    if (!container) return false;

    if (!document.getElementById("payDiv")) {
        container.innerHTML = payFormByJS;
        bindPayForm();
    }

    const payDiv = document.getElementById("payDiv");
    if (payDiv) {
        payDiv.style.display = "none";
    }
    return true;
}

function bindPayForm() {
    if (payFormRendered) return;
    const payForm = document.getElementById("payForm");
    if (!payForm) return;

    payForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const projectIdInput = document.getElementById("projectIdInput");
        const amountInput = document.getElementById("amount");
        const backerNameInput = document.getElementById("backerName");
        const cardNumberInput = document.getElementById("cardNumber");

        const projectId = projectIdInput?.value || selectedProjectId;
        const amount = parseFloat(amountInput?.value || 0);
        const backerName = backerNameInput?.value.trim();
        const cardNumber = cardNumberInput?.value.trim();

        if (!projectId) {
            alert("Project not selected. Please click Back this project again.");
            return;
        }

        if (isNaN(amount) || amount < 25) {
            alert("Please enter a valid amount of at least 25 EGP.");
            return;
        }

        if (!backerName) {
            alert("Please enter your name.");
            return;
        }

        const formData = new FormData();
        formData.append("projectId", projectId);
        formData.append("amount", amount);
        formData.append("backerName", backerName);
        formData.append("cardNumber", cardNumber);

        try {
            const response = await fetch("../php/transactions.php", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                alert("Payment saved successfully.");
                payForm.reset();
                const payDiv = document.getElementById("payDiv");
                if (payDiv) payDiv.style.display = "none";
                if (window.loadDonationStats) {
                    window.loadDonationStats();
                }
            } else {
                alert(result.error || "Payment could not be saved.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving payment details.");
        }
    });

    payFormRendered = true;
}

function setPayProject(projectId) {
    selectedProjectId = projectId;
    const projectIdInput = document.getElementById("projectIdInput");
    if (projectIdInput) {
        projectIdInput.value = projectId;
    }
}

function showPayDiv() {
    const ok = ensurePayDivRendered();
    if (!ok) return;

    const payDiv = document.getElementById("payDiv");
    if (!payDiv) return;
    payDiv.style.display = "flex";
}

// Close handling (delegated): only works after injection
document.addEventListener("click", function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("payCloseBtn")) {
        const payDiv = document.getElementById("payDiv");
        if (payDiv) payDiv.style.display = "none";
    }

    if (e.target && e.target.classList && e.target.classList.contains("backBtn")) {
        const projectBox = e.target.closest('.s-box');
        if (projectBox && projectBox.dataset.projectId) {
            setPayProject(projectBox.dataset.projectId);
        }
    }
});

// expose to auth gate
window.ensurePayDivRendered = ensurePayDivRendered;
window.showPayDiv = showPayDiv;
window.setPayProject = setPayProject;