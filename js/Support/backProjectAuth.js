(
    function () {
        function ensureAuthSupport() {
            const payDiv = document.getElementById('payDiv');
            const staticContainer = document.querySelector('#payFormByJS');

            // Handle case: page still uses older support pages that render payment div elsewhere
            // but the actual popup is #payDiv.
            if (!payDiv && staticContainer) {
                // It will be created by pay_method.js later; event delegation still works.
            }
        }

        function isLoggedInFromAuthManager() {
            // Lightweight sync check with php/auth.php?check=1.
            return fetch(getPhpUrl() + '?check=1')
                .then((res) => res.json())
                .then((data) => Boolean(data && data.loggedIn && data.user));
        }

        function getPhpUrl() {
            const path = window.location.pathname.toLowerCase().trim();

            if (path === '/' || path === '/index.html' || path.endsWith('index.html')) return './php/auth.php';
            if (path.includes('/html/')) return '../php/auth.php';
            return './php/auth.php';
        }

        function showMustSignInPopup() {
            // Required UI: custom popup with Sign In / Cancel buttons.
            const existing = document.getElementById('mustSignInPopup');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'mustSignInPopupOverlay';
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.background = 'rgba(0,0,0,0.45)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '9999';

            const modal = document.createElement('div');
            modal.id = 'mustSignInPopup';
            modal.style.background = '#fff';
            modal.style.padding = '18px 16px';
            modal.style.borderRadius = '10px';
            modal.style.width = 'min(520px, 92vw)';
            modal.style.boxShadow = '0 10px 25px rgba(0,0,0,0.25)';

            modal.innerHTML = `
                <h3 style="margin:0 0 10px;font-size:18px;">Sign in required</h3>
                <p style="margin:0 0 14px;color:#222;font-size:14px;">
                    you must sign in first to can back in this project
                </p>
                <div style="display:flex;gap:10px;justify-content:flex-end;">
                    <button id="mustSignInCancel" type="button" style="padding:8px 14px;border:1px solid #ccc;background:#f7f7f7;border-radius:8px;cursor:pointer;">Cancel</button>
                    <button id="mustSignInYes" type="button" style="padding:8px 14px;border:none;background:#0d6efd;color:#fff;border-radius:8px;cursor:pointer;">Sign In</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const remove = () => {
                overlay.remove();
            };

            modal.querySelector('#mustSignInCancel').addEventListener('click', remove);
            modal.querySelector('#mustSignInYes').addEventListener('click', () => {
                // After login, return to this same support page again.
                try {
                    window.sessionStorage.setItem('postLoginReturnTo', window.location.href);
                } catch (_) {}

                const loginUrl = window.location.pathname.includes('/html/') ? 'login.html' : 'html/login.html';
                window.location.href = loginUrl;
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) remove();
            });
        }

        function showBackPopup() {
            const payDiv = document.getElementById('payDiv');
            if (payDiv) {
                payDiv.style.display = 'flex';
            }
        }

        function bindBackButtons() {
            // Event delegation for dynamically generated buttons
            document.addEventListener('click', async (e) => {
                const btn = e.target && e.target.closest ? e.target.closest('.backBtn') : null;
                if (!btn) return;

                // Prevent default navigation/inline handlers (some support scripts use onclick).
                e.preventDefault();
                e.stopPropagation();

                try {
                    const loggedIn = await isLoggedInFromAuthManager();
                    if (loggedIn) {
                        showBackPopup();
                    } else {
                        showMustSignInPopup();
                    }
                } catch (err) {
                    console.error('Auth check failed for back button:', err);
                    showMustSignInPopup();
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            ensureAuthSupport();
            bindBackButtons();
        });
    }
)();

