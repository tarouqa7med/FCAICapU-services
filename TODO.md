# TODO

- [x] Create support-*.js scripts to attach `data-project-id` and `data-amount-to-back` metadata to each `.backBtn` by fetching projects from the existing PHP support endpoints.
- [x] Implement back-button authentication gating in `js/Support/backProjectAuth.js` (sign-in required -> redirect to login; signed-in -> open pay popup `#payDiv`).
- [x] Create/implement donation saving backend endpoint `php/Support/createDonation.php`.
- [x] Implement `js/Support/support-payback.js`:
  - [x] Update pay button label to required format `pay{amount}$` using `data-amount-to-back`.
  - [x] On pay click, POST donation payload to `php/Support/createDonation.php`.
- [ ] Wire `support-payback.js` into:
  - [ ] `html/support-activities.html`
  - [ ] `html/support-college.html`
  - [ ] `html/support-students.html`
  - [ ] `html/support-graduationProjects.html`
- [ ] Ensure back buttons have `.backBtn` class consistently for all cards (some buttons are missing `.backBtn` in HTML).
- [ ] Verify PHP `setup.php` donations table schema includes required fields (card_number, backer_name) and does not break existing schema.

