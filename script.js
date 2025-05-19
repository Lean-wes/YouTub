document.addEventListener('DOMContentLoaded', function() {
    // Initialize prism.js for syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Toggle collapsible sections
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            // Toggle the content visibility
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                this.querySelector('.toggle-icon').textContent = '+';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                this.querySelector('.toggle-icon').textContent = '-';
            }
        });
    });

    // Implementation of the search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const allSections = document.querySelectorAll('.content-section');
    const allSubsections = document.querySelectorAll('.subsection');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchResults.innerHTML = '';
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        // Search through all sections and subsections for the search term
        let results = [];
        
        allSections.forEach(section => {
            const sectionTitle = section.querySelector('h2').textContent;
            const sectionId = section.id;
            
            if (sectionTitle.toLowerCase().includes(searchTerm)) {
                results.push({
                    title: sectionTitle,
                    id: sectionId,
                    type: 'section'
                });
            }
        });
        
        allSubsections.forEach(subsection => {
            const subsectionTitle = subsection.querySelector('h3').textContent;
            const subsectionId = subsection.id;
            
            if (subsectionTitle.toLowerCase().includes(searchTerm)) {
                results.push({
                    title: subsectionTitle,
                    id: subsectionId,
                    type: 'subsection'
                });
            }
            
            // Also search in the content text
            const content = subsection.textContent;
            if (content.toLowerCase().includes(searchTerm)) {
                if (!results.some(r => r.id === subsectionId)) {
                    results.push({
                        title: subsectionTitle,
                        id: subsectionId,
                        type: 'subsection'
                    });
                }
            }
        });
        
        // Display the search results
        if (results.length > 0) {
            searchResults.style.display = 'block';
            results.slice(0, 10).forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result-item');
                resultItem.innerHTML = `<a href="#${result.id}">${result.title}</a>`;
                resultItem.addEventListener('click', function() {
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                    
                    // Expand the section if it's collapsed
                    const targetElement = document.getElementById(result.id);
                    const parentSection = result.type === 'subsection' 
                        ? targetElement.closest('.content-section') 
                        : targetElement;
                    
                    const sectionContent = parentSection.querySelector('.section-content');
                    if (!sectionContent.style.maxHeight) {
                        const header = parentSection.querySelector('.section-header');
                        header.click();
                    }
                    
                    // Scroll to the element
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                });
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.style.display = 'block';
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        }
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#search-container')) {
            searchResults.style.display = 'none';
        }
    });

    // Progress indicator for each topic
    document.querySelectorAll('.difficulty-indicator').forEach(indicator => {
        const level = parseInt(indicator.getAttribute('data-level'));
        const maxLevel = 5;
        
        for (let i = 1; i <= maxLevel; i++) {
            const dot = document.createElement('span');
            dot.classList.add('difficulty-dot');
            if (i <= level) {
                dot.classList.add('active');
            }
            indicator.appendChild(dot);
        }
    });

    // Expand all / Collapse all functionality
    document.getElementById('expand-all').addEventListener('click', function() {
        document.querySelectorAll('.section-content').forEach(content => {
            content.style.maxHeight = content.scrollHeight + "px";
            content.previousElementSibling.querySelector('.toggle-icon').textContent = '-';
        });
    });
    
    document.getElementById('collapse-all').addEventListener('click', function() {
        document.querySelectorAll('.section-content').forEach(content => {
            content.style.maxHeight = null;
            content.previousElementSibling.querySelector('.toggle-icon').textContent = '+';
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
