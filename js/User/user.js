/**
 * User Profile Management JavaScript
 * Handles loading user data, displaying stats, and editing profile
 */

class UserProfile {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log("👤 UserProfile initializing...");
        this.loadUserData();
    }

    // Get PHP URL based on current path
    getPhpUrl() {
        const path = window.location.pathname.toLowerCase().trim();
        
        if (path.includes("/html/")) {
            return "../php/auth.php";
        }
        
        return "./php/auth.php";
    }

    getUpdateProfileUrl() {
        const path = window.location.pathname.toLowerCase().trim();
        
        if (path.includes("/html/")) {
return "../php/User/update_profile.php";
        }
        
        return "./php/User/update_profile.php";
    }

// Get login page URL based on current path
    getLoginUrl() {
        const path = window.location.pathname.toLowerCase().trim();
        
        if (path.includes("/html/user/") || path.includes("/html/admin/") || path.includes("/html/support/")) {
            return "../../html/login.html";
        }
        
        if (path.includes("/html/")) {
            return "login.html";
        }
        
        return "./html/login.html";
    }

    // Load user data from auth.php
    loadUserData() {
        fetch(this.getPhpUrl() + "?check=1")
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn && data.user) {
                    this.currentUser = data.user;
                    this.displayUserData(data.user);
                    this.loadUserStats();
                } else {
                    // Not logged in - redirect to login page
                    console.log("🚫 User not logged in, redirecting to login...");
                    this.redirectToLogin();
                }
            })
            .catch(err => {
                console.error("❌ Error loading user data:", err);
                this.showError("Failed to load user data");
            });
    }

    // Redirect to login page
    redirectToLogin() {
        const loginUrl = this.getLoginUrl();
        console.log("➡️ Redirecting to:", loginUrl);
        
        // Show message before redirect
        const userName = document.getElementById("userName");
        const userEmail = document.getElementById("userEmail");
        
        if (userName) {
            userName.textContent = "Please login first";
        }
        if (userEmail) {
            userEmail.textContent = "Redirecting to login page...";
        }
        
        // Delay redirect slightly to show message
        setTimeout(() => {
            window.location.href = loginUrl;
        }, 1000);
    }

    // Display user data in the UI
    displayUserData(user) {
        console.log("👤 Displaying user data:", user);

        // Update profile image
        const profileImg = document.getElementById("profileImg");
        if (profileImg && user.image) {
            profileImg.src = user.image;
            profileImg.onerror = () => {
                profileImg.src = "../attachments/logos/default_user.jpg";
            };
        }

        // Update username
        const userName = document.getElementById("userName");
        if (userName) {
            userName.textContent = user.username || "User";
        }

        // Update email
        const userEmail = document.getElementById("userEmail");
        if (userEmail && user.email) {
            userEmail.textContent = user.email;
        }
    }

    // Load user stats (donations, projects, rank)
    loadUserStats() {
        // For now, set default values
        // In a real implementation, you'd fetch from a donations table
        const totalDonations = document.getElementById("totalDonations");
        if (totalDonations) {
            totalDonations.textContent = "0";
        }

        const totalProjects = document.getElementById("totalProjects");
        if (totalProjects) {
            totalProjects.textContent = "0";
        }

        const userRank = document.getElementById("userRank");
        if (userRank) {
            userRank.textContent = "Bronze";
        }
    }

// Check login status first, then edit profile
    editProfile() {
        // Use update_profile.php to check login status and get user data
        fetch(this.getUpdateProfileUrl())
            .then(res => res.json())
            .then(data => {
                if (!data.loggedIn) {
                    // Not logged in - show alert and redirect
                    alert(data.message || "You must login first to edit your profile. Redirecting to login page...");
                    
                    // Redirect to login page using consistent method
                    window.location.href = this.getLoginUrl();
                    return;
                }
                
                // Logged in - proceed with edit
                this.currentUser = data.user;
                this.displayUserData(data.user);
                this.openEditModal();
            })
            .catch(err => {
                console.error("❌ Error checking login:", err);
                alert("Error checking login status. Please try again.");
            });
    }

    // Open edit modal (called after login check)
    openEditModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById("editProfileModal");
        if (!modal) {
            this.createEditProfileModal();
            modal = document.getElementById("editProfileModal");
        }

        // Populate form with current user data
        document.getElementById("editUsername").value = this.currentUser.username || "";
        document.getElementById("editFullName").value = this.currentUser.full_name || "";
        document.getElementById("editImageUrl").value = this.currentUser.image || "";

        // Enable auto-save when modal is opened
        setTimeout(() => {
            this.autoSaveProfile();
        }, 100);

        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    // Create edit profile modal HTML
    createEditProfileModal() {
        const modalHtml = `
            <div class="modal fade" id="editProfileModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content" style="background: var(--primary-color2); color: var(--primary-color6);">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Profile</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editProfileForm">
                                <div class="mb-3">
                                    <label for="editUsername" class="form-label">Username</label>
                                    <input type="text" class="form-control" id="editUsername" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editFullName" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="editFullName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editImageUrl" class="form-label">Profile Image URL</label>
                                    <input type="url" class="form-control" id="editImageUrl" placeholder="https://example.com/image.jpg">
                                    <small class="text-muted">Leave empty to keep current image</small>
                                </div>
                                <div id="editProfileMessage"></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="userProfile.saveProfile()">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        const container = document.querySelector(".user-dashboard");
        if (container) {
            container.insertAdjacentHTML("beforeend", modalHtml);
        }
    }

// Save profile changes
    saveProfile() {
        const username = document.getElementById("editUsername").value.trim();
        const full_name = document.getElementById("editFullName").value.trim();
        const image = document.getElementById("editImageUrl").value.trim();

        // Validate
        if (!username || !full_name) {
            this.showEditMessage("Please fill in all required fields", "danger");
            return;
        }

        // Send update request
        const formData = new FormData();
        formData.append("username", username);
        formData.append("full_name", full_name);
        if (image) {
            formData.append("image", image);
        }

        fetch(this.getUpdateProfileUrl(), {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                this.showEditMessage("Saved!", "success");
                
                // Update current user data
                this.currentUser = data.user;
                this.displayUserData(data.user);

                // Close modal after 1 second
                setTimeout(() => {
                    const modal = document.getElementById("editProfileModal");
                    if (modal) {
                        const bsModal = bootstrap.Modal.getInstance(modal);
                        if (bsModal) {
                            bsModal.hide();
                        }
                    }
                }, 1000);
            } else {
                this.showEditMessage(data.message, "danger");
            }
        })
        .catch(err => {
            console.error("❌ Error saving profile:", err);
            this.showEditMessage("Failed to save profile. Please try again.", "danger");
        });
    }

    // Auto-save profile on input change (real-time)
    autoSaveProfile() {
        const usernameInput = document.getElementById("editUsername");
        const fullNameInput = document.getElementById("editFullName");
        const imageInput = document.getElementById("editImageUrl");
        
        if (!usernameInput || !fullNameInput) return;

        // Debounce timer
        let saveTimeout = null;

        const performAutoSave = () => {
            const username = usernameInput.value.trim();
            const full_name = fullNameInput.value.trim();
            const image = imageInput?.value.trim() || "";

            // Validate
            if (!username || !full_name) {
                return;
            }

            // Show saving indicator
            this.showEditMessage("Auto-saving...", "info");

            // Send update request
            const formData = new FormData();
            formData.append("username", username);
            formData.append("full_name", full_name);
            if (image) {
                formData.append("image", image);
            }

            fetch(this.getUpdateProfileUrl(), {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.showEditMessage("Updated!", "success");
                    this.currentUser = data.user;
                    this.displayUserData(data.user);
                } else {
                    this.showEditMessage(data.message, "warning");
                }
            })
            .catch(err => {
                console.error("❌ Auto-save error:", err);
            });
        };

        // Add input listeners with debounce
        const addAutoSaveListener = (input) => {
            if (!input) return;
            input.addEventListener("input", () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(performAutoSave, 1000); // Auto-save after 1 second of typing
            });
        };

        addAutoSaveListener(usernameInput);
        addAutoSaveListener(fullNameInput);
        addAutoSaveListener(imageInput);
    }

    // Show message in edit modal
    showEditMessage(message, type) {
        const messageDiv = document.getElementById("editProfileMessage");
        if (messageDiv) {
            messageDiv.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                </div>
            `;
        }
    }

    // Show error message
    showError(message) {
        const userName = document.getElementById("userName");
        if (userName) {
            userName.textContent = message;
        }
    }
}

// Create global instance
let userProfile;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    userProfile = new UserProfile();
    
    // Make editProfile globally available
    window.editProfile = () => {
        userProfile.editProfile();
    };
    
    // Make signOut globally available
    window.handleSignOut = () => {
        if (window.authManager) {
            window.authManager.logout();
            window.location.href = "../../index.html";
        }
    };
});

// Listen for auth updates from other pages
window.addEventListener("message", (event) => {
    // Handle broadcast messages if needed
});
