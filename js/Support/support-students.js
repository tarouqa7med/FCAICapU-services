// Fetch donation data from PHP endpoint
async function loadDonationStats() {
    try {
        const response = await fetch('../php/Support/support-students.php');
        const data = await response.json();
        
        if (!data.success) {
            console.error('Support data failed:', data.error);
            return;
        }

        const analysisSpans = document.querySelectorAll('.analysis-box div span');
        if (analysisSpans.length >= 3) {
            analysisSpans[0].textContent = Number(data.totalCollected).toLocaleString() + ' EGP';
            analysisSpans[1].textContent = data.backers;
            analysisSpans[2].textContent = data.projectCount;
        }

        const boxContainer = document.querySelector('.box');
        if (!boxContainer) return;

        boxContainer.innerHTML = data.projects
            .map((project) => renderSupportProjectCard(project))
            .join('');
    } catch (error) {
        console.error('Error loading donation stats:', error);
    }
}

function renderSupportProjectCard(project) {
    const collected = Number(project.collected_money || 0);
    const pledged = Number(project.pledged_goal || 0);
    const progressPercent = pledged > 0 ? Math.min(100, Math.round((collected / pledged) * 100)) : 0;
    const imageSrc = project.image ? project.image : '../attachments/wallpapers/computers.png';
    const description = project.description || 'Support this project to help students and improve learning resources.';

    return `
        <div class="s-box" data-project-id="${project.id}">
            <p>${escapeHtml(project.project_name)}</p>
            <p>${escapeHtml(description)}</p>
            <div>
                <div class="div1">
                    <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(project.project_name)}">
                </div>
                <div class="div2">
                    <div class="s-div2">
                        <div class="progress">
                            <div class="progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="s-div-2">
                            <span>${collected.toLocaleString()} EGP</span>
                            <p>total collected money of pledged goal</p>
                        </div>
                        <div class="s-div-2">
                            <span>${project.backers}</span>
                            <p>backers</p>
                        </div>
                        <div class="s-div-2">
                            <span>${project.days_to_go || 0}</span>
                            <p>days to go</p>
                        </div>
                        <button class="backBtn">Back this project</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
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