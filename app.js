/**
 * PetsInLove - Landing Page JavaScript
 * Version 1.1 - Showcase Interactions (Gallery + Lightbox)
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐾 PetsInLove Landing Page Loaded');
    
    // Initialize all components
    initSmoothScroll();
    initHeaderScroll();
    initGalleryFilters();
    initLightbox();
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
 * Gallery Filter functionality
 */
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterBtns.length || !galleryItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // Animate in
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Update lightbox indices for visible items
            updateLightboxIndices();
        });
    });
}

/**
 * Update lightbox data indices for visible items only
 */
function updateLightboxIndices() {
    const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
    visibleItems.forEach((item, index) => {
        item.dataset.visibleIndex = index;
    });
}

/**
 * Lightbox functionality
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxEmoji = document.getElementById('lightbox-emoji');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxSubtitle = document.getElementById('lightbox-subtitle');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!lightbox || !galleryItems.length) return;
    
    let currentIndex = 0;
    let visibleItems = [];
    
    // Get visible items
    function getVisibleItems() {
        return Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    }
    
    // Update lightbox content
    function updateLightbox() {
        visibleItems = getVisibleItems();
        const item = visibleItems[currentIndex];
        
        if (!item) return;
        
        const emoji = item.querySelector('.gallery-emoji').textContent;
        const title = item.querySelector('.gallery-title').textContent;
        const subtitle = item.querySelector('.gallery-subtitle').textContent;
        
        lightboxEmoji.textContent = emoji;
        lightboxTitle.textContent = title;
        lightboxSubtitle.textContent = subtitle;
        lightboxCurrent.textContent = currentIndex + 1;
        lightboxTotal.textContent = visibleItems.length;
    }
    
    // Open lightbox
    function openLightbox(index) {
        visibleItems = getVisibleItems();
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }
    
    // Go to previous image
    function prevImage() {
        visibleItems = getVisibleItems();
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightbox();
    }
    
    // Go to next image
    function nextImage() {
        visibleItems = getVisibleItems();
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightbox();
    }
    
    // Event Listeners
    
    // Click on gallery item to open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Find visible index
            visibleItems = getVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Previous button
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    // Next button
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Click on lightbox background to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Initialize indices
    updateLightboxIndices();
}

/**
 * Simple fade-in animations on scroll
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.product-card, .benefit-card, .testimonial-card, .pricing-card, .gallery-item'
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
