(function () {
  const doc = document;

  function formatAmountText(amt) {
    const n = Number(amt);
    if (!Number.isFinite(n)) return '';
    return `pay${n}$`;
  }

  function getProjectIdFromButton(btn) {
    const raw =
      btn &&
      (btn.dataset?.projectId ||
        btn.getAttribute('data-project-id') ||
        btn.getAttribute('data-projectId'));
    if (!raw) return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
  }

  function getProjectMetaFromButton(btn) {
    const amount =
      btn?.dataset?.amountToBack ||
      btn?.getAttribute?.('data-amount') ||
      btn?.getAttribute?.('data-amount-to-back');
    const amountNum = Number(amount);
    return { amountToBack: Number.isFinite(amountNum) ? amountNum : null };
  }

  function showPayPopupWithAmount(payAmount) {
    const payDiv = doc.getElementById('payDiv');
    if (!payDiv) return;

    const submitBtn = payDiv.querySelector('button[type="submit"], button');
    if (submitBtn) submitBtn.textContent = formatAmountText(payAmount);

    // Store context so pay click can read it.
    payDiv.dataset.amountToBack = String(payAmount ?? '');
    payDiv.style.display = 'flex';
  }

  function getAuthPHPUrl() {
    const path = window.location.pathname.toLowerCase().trim();
    if (path.includes('/html/')) return '../php/auth.php';
    return './php/auth.php';
  }

  function getCurrentUserFromAuthManager() {
    return fetch(getAuthPHPUrl() + '?check=1')
      .then((res) => res.json())
      .then((data) => (data && data.loggedIn && data.user ? data.user : null));
  }

  function tryExtractAmountInputValue(payDiv) {
    const inputs = payDiv.querySelectorAll('input');
    if (!inputs || !inputs.length) return null;

    // pay_method.js template has order:
    // [0] card number
    // [1..] expiry selects
    // text input(s) might vary
    // last required text before name is amount

    // Heuristic: find the input[type=text] that has numeric value and is not card number.
    const textInputs = Array.from(payDiv.querySelectorAll('input[type="text"], input'));

    // Prefer label-based extraction if available
    const amountLabel = Array.from(payDiv.querySelectorAll('label')).find((l) =>
      (l.textContent || '').toLowerCase().includes('enter amount')
    );
    if (amountLabel) {
      const nextInput = amountLabel.parentElement?.querySelector('input');
      if (nextInput && nextInput.value != null) return nextInput.value;
    }

    // Fallback: attempt to use the second-to-last numeric-ish input.
    // In current template, amount is typically the second last input field before name.
    if (textInputs.length >= 2) {
      const candidate = textInputs[textInputs.length - 2];
      if (candidate && candidate.value != null && String(candidate.value).trim() !== '') {
        return candidate.value;
      }
    }

    return null;
  }

  function wireBackAndPay() {
    doc.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.backBtn') : null;
      if (!btn) return;

      const projectId = getProjectIdFromButton(btn);
      const meta = getProjectMetaFromButton(btn);
      if (projectId == null || meta.amountToBack == null) return;

      const payDiv = doc.getElementById('payDiv');
      if (!payDiv) return;

      payDiv.dataset.projectId = String(projectId);
      payDiv.dataset.amountToBack = String(meta.amountToBack);

      // backProjectAuth.js handles showing the popup based on auth.
      // Still update label (and show if auth script hasn't opened it yet).
      showPayPopupWithAmount(meta.amountToBack);
    });

    doc.addEventListener('click', async (e) => {
      const payDiv = doc.getElementById('payDiv');
      if (!payDiv) return;

      const payButton =
        e.target && e.target.closest ? e.target.closest('button[type="submit"], button') : null;
      if (!payButton || !payDiv.contains(payButton)) return;

      e.preventDefault();

      const projectId = payDiv.dataset.projectId ? Number(payDiv.dataset.projectId) : null;
      const amountToBack = payDiv.dataset.amountToBack ? Number(payDiv.dataset.amountToBack) : null;

      const inputs = payDiv.querySelectorAll('input');
      const cardNumber = inputs && inputs[0] ? String(inputs[0].value || '').trim() : '';

      const amountValue = tryExtractAmountInputValue(payDiv);
      const amountNum = Number(amountValue || amountToBack);

      if (!projectId || !Number.isFinite(amountNum) || amountNum <= 0) {
        alert('Invalid payment context.');
        return;
      }
      if (!cardNumber) {
        alert('Card number is required.');
        return;
      }

      const user = await getCurrentUserFromAuthManager();
      if (!user) {
        alert('You must sign in first.');
        return;
      }

      const payload = {
        projectId,
        amount: amountNum,
        backerName: user.full_name,
        cardNumber: cardNumber,
      };

      const createDonationUrl = (() => {
        const p = window.location.pathname.toLowerCase();
        if (p.includes('/html/')) return '../php/Support/createDonation.php';
        return './php/Support/createDonation.php';
      })();

      fetch(createDonationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data || !data.success) throw new Error(data?.error || 'Donation failed');
          payDiv.style.display = 'none';
          alert('Thank you for your donation!');
        })
        .catch((err) => {
          console.error(err);
          alert('Donation failed.');
        });
    });
  }

  doc.addEventListener('DOMContentLoaded', wireBackAndPay);
})();

