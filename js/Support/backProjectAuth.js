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
            // We'll do a lightweight sync check with php/auth.php?check=1.
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
            const signIn = window.confirm(
            'you must sign in first to can back this project.\n\nPress OK to Sign In, Cancel to cancel.'
            );

            if (!signIn) return;

            // After login, return to this same support page again.
            // Keep full URL (including hash like #support-activities).
            try {
            window.sessionStorage.setItem('postLoginReturnTo', window.location.href);
            } catch (_) {}

            const loginUrl = window.location.pathname.includes('/html/') ? 'login.html' : 'html/login.html';
            window.location.href = loginUrl;
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

            // Prevent inline onclick handlers (some support scripts may show alerts or open pay popup)
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

