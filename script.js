document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Element Selectors ---
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('menu-toggle');
    const menuToggleIcon = menuToggle.querySelector('i');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle.querySelector('i');
    const themeStatus = document.getElementById('theme-status');
    const sections = document.querySelectorAll('section[id]');
    
    // Select all elements with the 'data-animate' attribute for scroll animations
    const animatedElements = document.querySelectorAll('[data-animate]');

    // --- 2. Mobile Menu Logic ---
    // Toggles the visibility of the mobile navigation menu
    const toggleMenu = (forceClose = false) => {
        const isActive = navMenu.classList.contains('active');
        if (forceClose || isActive) {
            // Close the menu
            navMenu.classList.remove('active');
            menuToggleIcon.classList.remove('fa-times'); // Change icon to bars
            menuToggleIcon.classList.add('fa-bars');
            menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
            menuToggle.setAttribute('aria-expanded', 'false');
        } else {
            // Open the menu
            navMenu.classList.add('active');
            menuToggleIcon.classList.remove('fa-bars'); // Change icon to times
            menuToggleIcon.classList.add('fa-times');
            menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    // Event listener for menu toggle button click
    menuToggle.addEventListener('click', () => toggleMenu());
    // Event listeners for navigation links to close menu when clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true)); // Force close on link click
    });

    // --- 3. Dark/Light Theme Toggle ---
    // Applies the selected theme (dark or light) to the document body
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme'); // Add 'dark-theme' class
            themeToggleIcon.classList.replace('fa-moon', 'fa-sun'); // Change icon to sun
            themeToggle.setAttribute('aria-label', 'Alternar para modo claro');
            themeStatus.textContent = "Modo escuro ativado.";
        } else { // theme === 'light'
            document.body.classList.remove('dark-theme'); // Remove 'dark-theme' class
            themeToggleIcon.classList.replace('fa-sun', 'fa-moon'); // Change icon to moon
            themeToggle.setAttribute('aria-label', 'Alternar para modo escuro');
            themeStatus.textContent = "Modo claro ativado.";
        }
    };

    // Determine initial theme: check localStorage, then user's system preference
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(currentTheme); // Apply the initial theme

    // Event listener for theme toggle button click
    themeToggle.addEventListener('click', () => {
        // Determine the new theme based on current state
        const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme); // Save preference to localStorage
        applyTheme(newTheme); // Apply the new theme
    });

    // --- 4. Active Nav Link on Scroll (Intersection Observer) ---
    // Options for the Intersection Observer that detects section visibility
    // rootMargin is set to offset the header height for more accurate active link highlighting
    const navObserverOptions = {
        root: null, // viewport as root
        // Using a fixed pixel value for rootMargin, assuming header height is around 80px.
        // This is more stable than dynamically calculating header.offsetHeight which might change.
        rootMargin: '-80px 0px -60% 0px', 
        threshold: 0, // Trigger as soon as target enters/exits root
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                // Add 'active' class to the link corresponding to the intersecting section
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);

    // Observe each section to detect when it enters the viewport
    sections.forEach(section => navObserver.observe(section));

    // --- 5. Animate Elements on Scroll (Intersection Observer) ---
    // This observer adds the 'animated' class to elements with 'data-animate' when they enter the viewport
    const animateObserverOptions = {
        root: null, // viewport as root
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is visible
    };
    
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated'); // Add 'animated' class to trigger CSS animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, animateObserverOptions);

    // Observe all elements that have the 'data-animate' attribute
    animatedElements.forEach(el => {
        animateObserver.observe(el);
    });
});
