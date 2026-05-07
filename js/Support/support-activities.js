// Support page logic for Activities
// Generates project cards by calling the PHP endpoint and wires project metadata for back/pay.

document.addEventListener('DOMContentLoaded', async () => {
  const section = document.querySelector('section.support');
  if (!section) return;

  const category = section.getAttribute('data-category') || 'activities';
  const staticContent = document.getElementById('static-content');

  // If the page already has hardcoded cards, do not override.
  // This script only adds data-* attributes to existing back buttons and updates UI text.
  const backButtons = Array.from(document.querySelectorAll('.backBtn'));
  if (!backButtons.length) return;

  // Best-effort: fetch projects so we can map button back amount/project id.
  // The PHP endpoint for activities returns top 4 projects with id/name and collected money.
  try {
    const res = await fetch(`../php/Support/support-activities.php?category=${encodeURIComponent(category)}`);
    const data = await res.json();
    if (!data || !data.success || !Array.isArray(data.projects)) return;

    // Map by button text (project_name) if possible.
    backButtons.forEach((btn) => {
      const label = (btn.textContent || '').trim().toLowerCase();
      // buttons text is fixed "Back this project"; project name is in DOM sibling <p>.
      const box = btn.closest('.s-div2') || btn.closest('.s-div-2') || btn.closest('.s-div2') || btn.parentElement;
      const parentBox = btn.closest('.s-box') || box?.closest?.('.s-box');
      const title = parentBox ? parentBox.querySelector(':scope > p') : null;
      const titleText = (title?.textContent || '').trim().toLowerCase();

      const proj = data.projects.find((p) => (p.project_name || '').toLowerCase() === titleText) ||
        data.projects.find((p) => (p.project_name || '').toLowerCase().includes(titleText) || titleText.includes((p.project_name || '').toLowerCase()));

      if (!proj) return;

      btn.dataset.projectId = String(proj.id);
      // amount to back: use pledged_goal as target goal for the label requirement.
      // If you have a fixed donation amount in your UI, replace this accordingly.
      btn.dataset.amountToBack = String(proj.pledged_goal ?? proj.pledged ?? proj.goal ?? 0);
    });
  } catch (e) {
    console.error(e);
  }
});

