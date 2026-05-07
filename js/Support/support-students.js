// Support page logic for Students
// Adds project metadata (projectId, amount) to existing .backBtn elements.

document.addEventListener('DOMContentLoaded', async () => {
  const section = document.querySelector('section.support');
  if (!section) return;

  const category = section.getAttribute('data-category') || 'students';
  const backButtons = Array.from(document.querySelectorAll('.backBtn'));
  if (!backButtons.length) return;

  try {
    const res = await fetch(`../php/Support/support-students.php?category=${encodeURIComponent(category)}`);
    const data = await res.json();
    if (!data || !data.success || !Array.isArray(data.projects)) return;

    backButtons.forEach((btn) => {
      const titleEl = btn.closest('.s-box') ? btn.closest('.s-box').querySelector(':scope > p') : null;
      const titleText = (titleEl?.textContent || btn.textContent || '').trim().toLowerCase();

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

