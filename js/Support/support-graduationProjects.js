/*
  Support Graduation Projects page logic

  Fetch and render statistics (analysis numbers) from backend PHP.

  BACK BUTTON BEHAVIOR (required):
  - When user clicks any back button:
    * if user signed in => show payment popup
    * if user not signed in => show sign-in popup (and do NOT open payment popup)

  Implementation:
  - backProjectAuth.js is the definitive auth gate + payment popup.
  - This file contains a fallback guard that blocks payment popup for unauth users.
*/


(function () {
  'use strict';

  const PAGE_CATEGORY = 'graduationProjects';

  function getPhpUrl() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/html/')) return '../php/Support/support-graduationProjects.php';
    return './php/Support/support-graduationProjects.php';
  }

  // ---- Custom sign-in modal (no alert) ----
  function createSignInPopup() {
    let modal = document.getElementById('signInPopup');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'signInPopup';
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.background = 'rgba(0,0,0,0.55)';
    modal.style.zIndex = '99999';
    modal.style.display = 'none';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    modal.innerHTML = `
      <div style="width:min(520px, 92vw); background:#fff; border-radius:14px; padding:20px; box-shadow:0 20px 60px rgba(0,0,0,0.25);">
        <h3 style="margin:0 0 10px; font-size:18px;">Please sign in first</h3>
        <p style="margin:0 0 16px; color:#444;">to can back this project.</p>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button type="button" id="signInPopupCancel" style="padding:10px 14px; border-radius:10px; border:1px solid #ddd; background:#f7f7f7; cursor:pointer;">Cancel</button>
          <button type="button" id="signInPopupConfirm" style="padding:10px 14px; border-radius:10px; border:0; background:#0d6efd; color:#fff; cursor:pointer;">Sign In</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.style.display = 'none';
    };

    modal.querySelector('#signInPopupCancel')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    modal.querySelector('#signInPopupConfirm')?.addEventListener('click', () => {
      close();
      try {
        window.sessionStorage.setItem('postLoginReturnTo', window.location.href);
      } catch (_) {}

      const loginUrl = window.location.pathname.includes('/html/') ? '../html/login.html' : 'html/login.html';
      window.location.href = loginUrl;
    });

    return modal;
  }

  function showSignInPopup() {
    const modal = createSignInPopup();
    modal.style.display = 'flex';
  }

  // ---- Prevent pay popup for unauth users until sign-in ----
  // Uses the same lightweight auth endpoint as backProjectAuth.js.
  document.addEventListener(
    'click',
    async (e) => {
      const btn = e.target?.closest?.('.backBtn');
      if (!btn) return;


      const phpCheckUrl = (() => {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/html/')) return '../php/auth.php?check=1';
        return './php/auth.php?check=1';
      })();

      try {
        const res = await fetch(phpCheckUrl);
        if (!res.ok) throw new Error('auth check failed');
        const data = await res.json();
        const loggedIn = Boolean(data && data.loggedIn && data.user);

        if (!loggedIn) {
          // stop any other handlers from opening the payment popup
          e.preventDefault();
          e.stopPropagation();
          showSignInPopup();
        }
        // if logged in: let backProjectAuth.js handle showing payment popup
      } catch (_) {
        e.preventDefault();
        e.stopPropagation();
        showSignInPopup();
      }
    },
    true
  );


  function extractNumbersFromResponse(data) {
    const totalCollected =
      data?.totalCollected ?? data?.total_collected ?? data?.total ?? 0;
    const backers = data?.backers ?? data?.total_backers ?? data?.supporters ?? 0;
    const currentProjects =
      data?.currentProjects ?? data?.current_projects ?? data?.projects ?? 0;

    return {
      totalCollected: Number(totalCollected) || 0,
      backers: Number(backers) || 0,
      currentProjects: Number(currentProjects) || 0,
    };
  }

  function formatEGP(num) {
    try {
      return new Intl.NumberFormat('en-US').format(num);
    } catch {
      return String(num);
    }
  }

  async function updateAnalysis() {
    const analysisBox = document.querySelector('.analysis-box');
    if (!analysisBox) return;

    const spans = analysisBox.querySelectorAll('span');
    if (!spans || spans.length < 3) return;

    try {
      const res = await fetch(getPhpUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: PAGE_CATEGORY }),
      });

      if (!res.ok) return;
      const data = await res.json();

      // Ensure unauth click never opens payment popup before sign-in.
      // backProjectAuth.js will handle the rest via .backBtn
      // (some legacy tiles may use plain <button> without .backBtn)
      const btns = document.querySelectorAll('button');
      btns.forEach((b) => {
        if (!b.classList.contains('backBtn')) {
          const tile = b.closest('.s-box');
          if (tile) b.classList.add('backBtn');
        }
      });

      const { totalCollected, backers, currentProjects } = extractNumbersFromResponse(data);

      spans[0].textContent = `${formatEGP(totalCollected)} EGP`;
      spans[1].textContent = `${formatEGP(backers)}`;
      spans[2].textContent = `${formatEGP(currentProjects)}`;

      const tiles = document.querySelectorAll('.s-box');
      tiles.forEach((tile) => {
        const blocks = tile.querySelectorAll('.s-div-2');
        if (!blocks) return;
        const tSpans = tile.querySelectorAll('.s-div-2 span');
        if (tSpans.length < 3) return;
        tSpans[0].textContent = `${formatEGP(totalCollected)} EGP`;
        tSpans[1].textContent = `${formatEGP(backers)}`;
        tSpans[2].textContent = `${formatEGP(currentProjects)}`;
      });
    } catch (e) {
      console.error('Failed to update analysis:', e);
    }
  }

  function bindProjectTileMeta() {
    const section = document.querySelector(
      'section.support[data-category="graduationProjects"]'
    ) || document;

    const tiles = section.querySelectorAll('.s-box');
    tiles.forEach((tile, i) => {
      const btn = tile.querySelector('.backBtn') || tile.querySelector('button');
      if (!btn) return;
      btn.dataset.category = PAGE_CATEGORY;
      btn.dataset.projectIndex = String(i);

      // Ensure back buttons are recognized by backProjectAuth.js
      btn.classList.add('backBtn');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindProjectTileMeta();
    updateAnalysis();
  });
})();

