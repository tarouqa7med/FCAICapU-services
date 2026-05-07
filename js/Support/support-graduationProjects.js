// Support page logic for Graduation Projects
// Adds project metadata (projectId, amount) to existing .backBtn elements.

document.addEventListener('DOMContentLoaded', async () => {
  const section = document.querySelector('section.support');
  if (!section) return;

  const category = section.getAttribute('data-category') || 'graduationProjects';
  const backButtons = Array.from(document.querySelectorAll('.backBtn'));
  if (!backButtons.length) return;

  // The graduation projects UI uses the PHP endpoint which already returns: id, project_name, goal/pledged etc.
  // We'll map the visible card title to the returned project_name.
  try {
    const res = await fetch(`../php/Support/support-graduationProjects.php?category=${encodeURIComponent(category)}`);
    const data = await res.json();
    if (!data || !data.success || !Array.isArray(data.projects)) return;

    backButtons.forEach((btn) => {
      const card = btn.closest('.s-box') || btn.closest('.s-div2') || btn.parentElement;
      const titleEl = card ? (card.querySelector(':scope > p') || card.querySelector('p')) : null;
      const titleText = (titleEl?.textContent || btn.textContent || '').trim().toLowerCase();

      const proj = data.projects.find((p) => (p.project_name || '').toLowerCase() === titleText) ||
        data.projects.find((p) => (p.project_name || '').toLowerCase().includes(titleText) || titleText.includes((p.project_name || '').toLowerCase()));

      if (!proj) return;

      btn.dataset.projectId = String(proj.id);
      // amountToBack should be the amount user is backing with.
      // UI requirement asks pay{amount}$ so we use goal/pledged as displayed.
      const amountToBack = proj.goal ?? proj.pledged ?? proj.pledged_goal ?? 0;
      btn.dataset.amountToBack = String(amountToBack);
    });
  } catch (e) {
    console.error(e);
  }
});

