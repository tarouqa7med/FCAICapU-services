
document.addEventListener('DOMContentLoaded', async () => {
    const category = document.querySelector('.support').dataset.category || 'college';
    const analysisBox = document.querySelector('.analysis-box');
    const projectsBox = document.querySelector('.box');
    
    // Hide static, show loading
    const staticContent = document.querySelector('.analysis, .box');
    if (staticContent) staticContent.style.opacity = '0.5';
    
    // Loading state
    analysisBox.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading stats...</p></div>';
    projectsBox.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading projects...</p></div>';
    
    try {
        console.log('Fetching data for category:', category);
        const response = await fetch(`../php/Support/support-${category}.php?category=${category}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        if (data.success && data.projects) {
            // Update analysis stats
            analysisBox.innerHTML = `
                <div>
                    <span>${data.stats.total_pledged ? parseInt(data.stats.total_pledged).toLocaleString() : '0'} EGP</span>
                    <p>total collected money</p>
                </div>
                <div>
                    <span>${data.stats.total_backers || 0}</span>
                    <p>backers</p>
                </div>
                <div>
                    <span>${data.stats.project_count || 0}</span>
                    <p>current projects</p>
                </div>
            `;
            
            // Generate projects HTML
            let projectsHtml = '';
            (data.projects || []).slice(0, 4).forEach((project, index) => {
                const imgSrc = `../attachments/wallpapers/${project.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`;
                const progress = project.progress || Math.min(150, (project.pledged / project.goal * 100));
                projectsHtml += `
                    <div class="s-box">
                        <p>${project.name}</p>
                        <small class="text-muted">${project.full_name || 'Anonymous'} (${project.email})</small>
                        <div class="div1">
                            <img src="${imgSrc}" alt="${project.name}" onerror="this.src='../attachments/wallpapers/computers.png'">
                            <div class="div2">
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${progress}%">${Math.round(progress)}%</div>
                                </div>
                                <div class="div3">
                                    <span>${Math.round(project.pledged).toLocaleString()} EGP</span>
                                    <p>pledged of ${Math.round(project.goal).toLocaleString()} EGP goal</p>
                                </div>
                                <div class="div3">
                                    <span>${project.backers}</span>
                                    <p>backers</p>
                                </div>
                                <div class="div3">
                                    <span>${project.days_left || 30}</span>
                                    <p>days to go</p>
                                </div>
                                <button class="backBtn btn btn-success btn-sm mt-2" onclick="alert('Support ${project.name}! Coming soon...')">back this project</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            projectsBox.innerHTML = projectsHtml || '<div class="text-center p-5"><h5>No projects yet</h5><p class="text-muted">Check back soon!</p></div>';
            
            // Fade in
            staticContent.style.transition = 'opacity 0.3s';
            staticContent.style.opacity = '1';
        } else {
            throw new Error(data.error || 'No data received');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        analysisBox.innerHTML = '<div class="text-center p-5 text-warning"><i class="bi bi-exclamation-triangle fs-1 mb-3"></i><p>Error loading data. Please refresh or check connection.</p></div>';
        projectsBox.innerHTML = '<div class="text-center p-5 text-warning"><i class="bi bi-exclamation-triangle fs-1 mb-3"></i><p>Error loading projects.</p></div>';
    }
});
