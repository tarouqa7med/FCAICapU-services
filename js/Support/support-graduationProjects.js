// Fetch donation data from PHP endpoint
async function loadDonationStats() {
    try {
        const response = await fetch('../php/Support/support-graduationProjects.php');
        const data = await response.json();
        
        if (data.success) {
            const analysisSpans = document.querySelectorAll('.analysis-box div span');
            if (analysisSpans.length >= 3) {
                analysisSpans[0].textContent = data.totalCollected.toLocaleString() + ' EGP';
                analysisSpans[1].textContent = data.backers;
                analysisSpans[2].textContent = data.projectCount;
            }
            
            const projectBoxes = document.querySelectorAll('.s-box');
            data.projects.forEach((project, index) => {
                if (projectBoxes[index]) {
                    projectBoxes[index].dataset.projectId = project.id;
                    const spans = projectBoxes[index].querySelectorAll('.s-div-2 span');
                    const labels = projectBoxes[index].querySelectorAll('.s-div-2 p');
                    if (spans.length >= 1) {
                        spans[0].innerHTML = project.collected_money.toLocaleString() + ' EGP<br><small>of ' + project.pledged_goal.toLocaleString() + ' EGP pledged</small>';
                    }
                    if (labels.length >= 1) {
                        labels[0].textContent = 'total collected money of pledged goal';
                    }
                    if (spans.length >= 2) {
                        spans[1].textContent = project.backers;
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading donation stats:', error);
    }
}

// Load stats when page loads
document.addEventListener('DOMContentLoaded', loadDonationStats);

// Function to check if user is logged in
function isUserLoggedIn() {
    const loginBtn = document.getElementById("loginLink");
    return loginBtn && loginBtn.classList.contains("logoutBtn");
}

// Warning dialog HTML
let warningDialog = `
    <div class="pop-up" id="warningDiv">
        <div class="mini-pop-up">
            <button class="closeBtn warningCloseBtn">&times;</button>
            <p>Please sign in first to back this project</p>
            <div>
                <button id="signInBtn">Sign In</button>
                <button id="cancelBtn">Cancel</button>
            </div>
        </div>
    </div>
`;

// Function to show warning
function showWarning() {
    const container = document.getElementById("payFormByJS");
    if (!container) return;

    if (!document.getElementById("warningDiv")) {
        container.innerHTML += warningDialog;
    }

    const warningDiv = document.getElementById("warningDiv");
    if (warningDiv) {
        warningDiv.style.display = "flex";
    }

    // Hide payDiv if visible
    const payDiv = document.getElementById("payDiv");
    if (payDiv) payDiv.style.display = "none";
}

// Event listeners
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("backBtn")) {
        if (isUserLoggedIn()) {
            window.showPayDiv(); // from pay_method.js
        } else {
            showWarning();
        }
    }

    if (e.target.id === "signInBtn") {
        window.location.href = "login.html";
    }

    if (e.target.id === "cancelBtn" || e.target.classList.contains("warningCloseBtn")) {
        const warningDiv = document.getElementById("warningDiv");
        if (warningDiv) warningDiv.style.display = "none";
    }
});