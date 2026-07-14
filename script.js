/**
 * Diogo Correia - Portfolio Interactions
 * Native JavaScript logic for sticky navbar, scroll reveals, active state tracking, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar scroll effect
    const nav = document.querySelector('.nav-menu');
    const handleScroll = () => {
        if (window.scrollY > 40) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on load

    // 2. Active section link highlighting in Navbar
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleActiveLink = () => {
        let currentSectionId = '';
        
        // Find current visible section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            // Buffer to trigger activation when section is 150px near top of viewport
            if (window.scrollY >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            const targetHref = link.getAttribute('href');
            if (targetHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', handleActiveLink, { passive: true });
    handleActiveLink(); // Run once to initialize

    // 3. Intersection Observer for Entrance/Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserverOptions = {
        threshold: 0.05, // Trigger as soon as 5% of the element is visible
        rootMargin: '0px 0px -40px 0px' // Offset bottom margin for scroll experience
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Parallax effect in Hero (Subtle translation on scroll)
    const profileImg = document.querySelector('.profile-photo');
    const heroInfo = document.querySelector('.intro');

    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                if (profileImg) {
                    profileImg.style.transform = `translateY(${scrollY * 0.08}px)`;
                }
                if (heroInfo) {
                    heroInfo.style.transform = `translateY(${scrollY * 0.03}px)`;
                }
            }
        }, { passive: true });
    }

    // 5. Media Lightbox / Modal (Maximize videos & images)
    const modal = document.getElementById('mediaModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalClose = modal.querySelector('.modal-close');
    const mediaContainers = document.querySelectorAll('.media-container');

    mediaContainers.forEach(container => {
        container.style.cursor = 'zoom-in';
        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            const video = container.querySelector('video');

            modalContent.innerHTML = ''; // Clear modal content

            if (img) {
                const clonedImg = img.cloneNode(true);
                modalContent.appendChild(clonedImg);
            } else if (video) {
                const modalVideo = document.createElement('video');
                modalVideo.src = video.querySelector('source').src;
                modalVideo.controls = true;
                modalVideo.autoplay = true;
                modalVideo.muted = false; // Allow audio on full preview
                modalVideo.loop = true;
                modalVideo.playsInline = true;
                modalContent.appendChild(modalVideo);
            }

            modal.style.display = 'flex';
            // Trigger reflow to start transition
            modal.offsetHeight;
            modal.classList.add('modal-active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Disable scroll on background
        });
    });

    const closeModal = () => {
        modal.classList.remove('modal-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scroll
        
        const modalVideo = modalContent.querySelector('video');
        if (modalVideo) {
            modalVideo.pause();
        }

        setTimeout(() => {
            modal.style.display = 'none';
            modalContent.innerHTML = '';
        }, 300); // Animation duration
    };

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            closeModal();
        }
    });

    // 6. Theme Toggle (Light / Dark Mode)
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Read local storage or check system preferences
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (userPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }
});
