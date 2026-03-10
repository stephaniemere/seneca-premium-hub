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

    // --- Initialization ---
    
    // Listen for hash changes to perform simple client-side routing
    window.addEventListener('hashchange', handleRouting);
    
    // Initial route evaluation on load
    handleRouting();
});
