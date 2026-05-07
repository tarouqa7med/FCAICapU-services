// Support page logic for College
// Adds project metadata (projectId, amount) to existing .backBtn elements.

document.addEventListener('DOMContentLoaded', async () => {
  const section = document.querySelector('section.support');
  if (!section) return;

  const category = section.getAttribute('data-category') || 'college';
  const backButtons = Array.from(document.querySelectorAll('.backBtn'));
  if (!backButtons.length) return;

  try {
    const res = await fetch(`../php/Support/support-college.php?category=${encodeURIComponent(category)}`);
    const data = await res.json();
    if (!data || !data.success || !Array.isArray(data.projects)) return;

    backButtons.forEach((btn) => {
      const titleEl = btn.closest('.s-box')
        ? btn.closest('.s-box').querySelector(':scope > div:nth-child(1) p')
        : null;

      // Fallback: find the nearest <p> directly under the same card.
      const card = btn.closest('.s-box, .s-div2, .s-div-2, .s-div1');
      const nameP = card ? (card.querySelector('p') || null) : null;
      const titleText = (nameP?.textContent || btn.textContent || '').trim().toLowerCase();

      const proj = data.projects.find((p) => (p.project_name || '').toLowerCase() === titleText) ||
        data.projects.find((p) => (p.project_name || '').toLowerCase().includes(titleText) || titleText.includes((p.project_name || '').toLowerCase()));

      if (!proj) return;

      btn.dataset.projectId = String(proj.id);
      btn.dataset.amountToBack = String(proj.pledged_goal ?? proj.goal ?? proj.pledged ?? 0);
    });
  } catch (e) {
    console.error(e);
  }
});

