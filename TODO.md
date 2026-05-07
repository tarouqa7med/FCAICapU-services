# TODO

## Support back-button auth + popup gating refactor
- [x] Refactor `js/Support/support-students.js` to use shared lightweight auth-check on back button click and reusable sign-in modal.
- [x] Refactor `js/Support/support-activities.js` similarly (simplified code, ensure unauth blocks payment popup).
- [x] Refactor `js/Support/support-college.js` similarly.
- [x] Refactor `js/Support/support-graduationProjects.js` similarly.

- [x] Ensure all 4 scripts still set `data-category` and `data-projectIndex` for payment flow.

- [ ] Smoke test: load each support page (unauth) and verify sign-in popup appears and payment does NOT open; load with auth and verify payment opens.


