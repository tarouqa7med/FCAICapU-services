# TODO - Add Sign Out Button to User and Admin Pages

## Steps completed:

1. [x] Add Sign Out button to html/User/user.html
2. [x] Expose AuthManager globally in js/auth.js
3. [x] Add logout handler in js/User/user.js
4. [x] Add logout handler to html/Admin/admin.html

## Changes made:
- html/User/user.html: Added "Sign Out" button in profile card
- js/auth.js: Changed `new AuthManager()` to `window.authManager = new AuthManager()` to expose the instance globally
- js/User/user.js: Added `handleSignOut()` function that calls `authManager.logout()`
- html/Admin/admin.html: Added onclick handler to signoutBtn and inline JavaScript for modal handling
