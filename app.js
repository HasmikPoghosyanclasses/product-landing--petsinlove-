/**
 * PetsInLove - Landing Page JavaScript
 * Version 1.1 - UX Enhancements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐾 PetsInLove Landing Page Loaded');
    
    // Initialize all components
    initSmoothScroll();
    initHeaderScroll();
    initActiveNavigation();
    initModal();
    initAnimations();
});

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Header background change on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Run on load
}

/**
 * Active section highlighting in navbar
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!sections.length || !navLinks.length) return;
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to matching link
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
        
        // If at the top of the page, remove all active classes
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Run on load
}

/**
 * CTA Modal functionality
 */
function initModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('cta-modal');
    const modalClose = document.getElementById('modal-close');
    const ctaBtn = document.getElementById('cta-btn');
    const ctaTriggers = document.querySelectorAll('.cta-trigger');
    const signupForm = document.getElementById('signup-form');
    
    if (!modalOverlay || !modal) return;
    
    // Open modal function
    function openModal() {
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    // Close modal function
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Reset form
        if (signupForm) {
            signupForm.reset();
            clearErrors();
        }
    }
    
    // Clear all error messages
    function clearErrors() {
        const errorMessages = modal.querySelectorAll('.error-message');
        const inputs = modal.querySelectorAll('input');
        
        errorMessages.forEach(el => el.textContent = '');
        inputs.forEach(input => input.classList.remove('error'));
    }
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Form validation
    function validateForm() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        
        let isValid = true;
        clearErrors();
        
        // Validate name
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Please enter your name';
            nameInput.classList.add('error');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            nameInput.classList.add('error');
            isValid = false;
        }
        
        // Validate email
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Please enter your email address';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Event Listeners
    
    // Open modal from header CTA button
    if (ctaBtn) {
        ctaBtn.addEventListener('click', openModal);
    }
    
    // Open modal from other CTA triggers
    ctaTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });
    
    // Close modal with close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking backdrop
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Success! In a real app, you'd send this to a server
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                
                console.log('Form submitted:', { name, email });
                
                // Show success message (replace form content)
                modal.querySelector('.modal-header').innerHTML = `
                    <span class="modal-icon">🎉</span>
                    <h2>Welcome to the Family!</h2>
                    <p>Thanks for joining, ${name}! Check your inbox at ${email} for a special welcome gift.</p>
                `;
                signupForm.style.display = 'none';
                modal.querySelector('.modal-footer-text').style.display = 'none';
                
                // Close modal after delay
                setTimeout(() => {
                    closeModal();
                    // Reset modal content after it's closed
                    setTimeout(() => {
                        location.reload(); // Simple way to reset modal
                    }, 300);
                }, 3000);
            }
        });
    }
    
    // Real-time validation on input
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorEl = document.getElementById(`${this.id}-error`);
            if (errorEl) errorEl.textContent = '';
        });
    });
}

/**
 * Simple fade-in animations on scroll
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.product-card, .benefit-card, .testimonial-card, .pricing-card'
    );
    
    if (!animatedElements.length) return;
    
    // Set initial state
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Utility: Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
