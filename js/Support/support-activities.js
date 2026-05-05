document.addEventListener('DOMContentLoaded', async () => {
    const section = document.querySelector('.support');
    const category = section.dataset.category || 'activities';
    
    const analysisBox = document.querySelector('.analysis-box');
    const projectsContainer = document.querySelector('.box');
    
    // Show loading
    analysisBox.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status"></div>
            <p>Loading stats...</p>
        </div>
    `;
    projectsContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status"></div>
            <p>Loading projects...</p>
        </div>
    `;
    
    try {
        const url = `../php/Support/support-${category}.php?category=${category}`;
        console.log('Loading:', url);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
            // Stats
            analysisBox.innerHTML = `
                <div>
                    <span>${Math.round(data.stats.total_pledged || 0).toLocaleString()} EGP</span>
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
            
            // Projects
            let html = '';
            data.projects.forEach(project => {
                const progress = project.progress || Math.min(150, (project.pledged / project.goal * 100));
                const img = `../attachments/wallpapers/computers.png`; // Default
                
                html += `
                    <div class="s-box">
                        <p>${project.project_name || project.name}</p>
                        <div class="div1">
                            <img src="${img}" alt="">
                            <div class="div2">
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${Math.round(progress)}%;">${Math.round(progress)}%</div>
                                </div>
                                <div class="div3">
                                    <span>${Math.round(project.pledged || project.collected_money).toLocaleString()} EGP</span>
                                    <p>pledged of ${Math.round(project.goal || project.pledged_goal).toLocaleString()} EGP goal</p>
                                </div>
                                <div class="div3">
                                    <span>${project.backers}</span>
                                    <p>backers</p>
                                </div>
                                <div class="div3">
                                    <span>${project.days_to_go || project.days_left}</span>
                                    <p>days to go</p>
                                </div>
                                <button class="backBtn">back this project</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            projectsContainer.innerHTML = html || '<div class="col-12 text-center py-5"><h5>No projects found</h5></div>';
        } else {
            throw new Error(data.error || 'API failed');
        }
    } catch (error) {
        console.error('Error:', error);
        analysisBox.innerHTML = '<div class="alert alert-warning text-center">Failed to load data. Refresh page.</div>';
        projectsContainer.innerHTML = '<div class="alert alert-warning text-center">Failed to load projects.</div>';
    }
});
