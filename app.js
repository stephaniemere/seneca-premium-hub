// app.js - Application Logic and Routing

document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let isLoggedIn = sessionStorage.getItem('senecaLoggedIn') === 'true';

    // --- DOM Elements ---
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email-input');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const mainNav = document.getElementById('main-nav');
    
    // Views
    const views = {
        login: document.getElementById('view-login'),
        home: document.getElementById('view-home'),
        premium: document.getElementById('view-premium'),
        trust: document.getElementById('view-trust')
    };

    // --- Functions ---
    
    const showView = (viewName) => {
        // Hide all views
        Object.values(views).forEach(view => {
            if (view) view.classList.remove('active');
        });

        // Show target view
        if (views[viewName]) {
            views[viewName].classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const updateNavState = () => {
        if (isLoggedIn) {
            mainNav.classList.remove('hidden');
        } else {
            mainNav.classList.add('hidden');
        }
    };

    const handleRouting = () => {
        // Protect routes - if not logged in, force login view
        if (!isLoggedIn) {
            window.location.hash = ''; // Clear hash
            showView('login');
            updateNavState();
            return;
        }

        const hash = window.location.hash.slice(1) || 'home';
        
        switch (hash) {
            case 'premium':
                showView('premium');
                break;
            case 'trust':
                showView('trust');
                break;
            case 'home':
            default:
                showView('home');
                break;
        }
        updateNavState();
    };

    // --- Authentication ---
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        
        // Extract suffix
        const atIndex = email.lastIndexOf('@');
        if (atIndex === -1) {
            showError("Invalid email address format.");
            return;
        }
        
        const suffix = email.substr(atIndex);
        
        // Check against mock database loaded from data.js
        const allowedSuffixes = window.ALLOWED_SUFFIXES || [];
        
        if (allowedSuffixes.includes(suffix)) {
            // Login Success
            isLoggedIn = true;
            sessionStorage.setItem('senecaLoggedIn', 'true');
            loginError.classList.remove('visible');
            window.location.hash = '#home'; // Trigger route change
        } else {
            // Login Failed
            showError("Email suffix not found in authorized Trust or Premium database.");
        }
    });

    const showError = (msg) => {
        loginError.textContent = msg;
        loginError.classList.add('visible');
        
        // Shake animation could go here
        emailInput.classList.add('shake');
        setTimeout(() => emailInput.classList.remove('shake'), 400);
    };

    logoutBtn.addEventListener('click', () => {
        isLoggedIn = false;
        sessionStorage.removeItem('senecaLoggedIn');
        window.location.hash = ''; // Triggers routing to login
    });

    // --- Content Rendering ---
    
    const renderResources = (containerId, resourceData) => {
        const container = document.getElementById(containerId);
        if (!container || !resourceData) return;
        
        let htmlContent = '';
        
        resourceData.forEach(group => {
            htmlContent += `
                <div class="resource-group">
                    <h4 class="resource-category-title">${group.category}</h4>
                    <div class="resource-links">
            `;
            
            group.links.forEach(link => {
                // Determine icon based on type
                const iconSvg = link.type === 'video' 
                    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`
                    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
                    
                htmlContent += `
                    <a href="${link.url}" class="resource-link resource-type-${link.type}" target="_blank">
                        <span class="resource-icon">${iconSvg}</span>
                        ${link.title}
                    </a>
                `;
            });
            
            htmlContent += `
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = htmlContent;
    };

    // --- Initialization ---
    
    // Render dynamic content
    renderResources('premium-resource-container', window.PREMIUM_RESOURCES);
    renderResources('trust-resource-container', window.TRUST_RESOURCES);

    // Listen for hash changes to perform simple client-side routing
    window.addEventListener('hashchange', handleRouting);
    
    // Initial route evaluation on load
    handleRouting();
});
