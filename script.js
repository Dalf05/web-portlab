// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero animations
gsap.timeline()
    .from('.hero-title', {
        duration: 1.2, // Slightly longer duration
        y: 80, // Reduced start Y position
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.hero-subtitle', {
        duration: 1.2, // Slightly longer duration
        y: 40, // Reduced start Y position
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.7') // Adjusted overlap
    .from('.cta-button', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.6'); // Adjusted overlap

// General section content animation
gsap.utils.toArray('section:not(#hero) .container > *:not(.section-title)').forEach(element => {
    gsap.from(element, {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Section title animations
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Feature cards animation (already exists, keeping)
gsap.utils.toArray('.feature-card').forEach((card, index) => {
    gsap.from(card, {
        duration: 0.8,
        y: 80,
        opacity: 0,
        ease: 'power3.out',
        delay: index * 0.2,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Pricing cards animation (already exists, keeping)
gsap.utils.toArray('.pricing-card').forEach((card, index) => {
    gsap.from(card, {
        duration: 0.8,
        y: 80,
        opacity: 0,
        ease: 'power3.out',
        delay: index * 0.15,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Portfolio carousel
class PortfolioCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.cards = document.querySelectorAll('.portfolio-card');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndex = 0;
        
        this.init();
        this.setupEventListeners();
        window.addEventListener('resize', () => {
             // Re-calculate visible cards and update position on resize
             this.init(); // Re-initialize to recalculate cardWidth and visibleCards
        });
    }

    // Function to calculate a single card's full width including its gap
    _getCardFullWidth() {
        if (this.cards.length === 0) return 0;
        const firstCard = this.cards[0];
        const cardStyle = getComputedStyle(firstCard);
        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(cardStyle.marginRight) || 0; // Assuming gap is applied as right-margin
        return cardWidth + gap;
    }

    init() {
        this.cardWidth = this._getCardFullWidth(); // Calculate based on actual card size and gap
        if (this.cards.length > 1) {
            // Measure actual distance between two cards' left edges for precise cardWidth
            const firstCardRect = this.cards[0].getBoundingClientRect();
            const secondCardRect = this.cards[1].getBoundingClientRect();
            this.cardWidth = secondCardRect.left - firstCardRect.left;
        } else if (this.cards.length === 1) {
            this.cardWidth = this.cards[0].offsetWidth; // If only one card, just its width
        }

        // Fallback if cardWidth is still problematic (e.g., initial render issues)
        if (this.cardWidth === 0) {
            // A more robust fallback could be to read from CSS directly if a fixed value is expected
            // For now, if 0, it means it couldn't be measured, so we might need a default or re-try
            // console.warn("Card width calculated as 0, using fallback.");
            // This might occur if elements are not rendered or styled yet.
            // For responsive design, dynamically calculating `cardWidth` is crucial.
            // Let's ensure it's not zero by using a reasonable minimum.
            this.cardWidth = this.cards[0]?.offsetWidth || 380; // A reasonable default if measurement fails
        }
        
        this.updateCarousel();
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        const dragThreshold = 50; // Minimum drag distance to trigger slide

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diffX = Math.abs(currentX - startX);
            if (diffX > 10) { 
                e.preventDefault(); // Prevent vertical scrolling if horizontal swipe is detected
            }
        }, { passive: false }); 

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > dragThreshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }

    updateCarousel() {
        // Recalculate cardWidth on each update in case of layout changes (e.g., due to different screen sizes)
        this.cardWidth = this._getCardFullWidth();

        // Calculate how many cards can actually be fully visible
        const carouselContainer = document.querySelector('.carousel-container');
        const containerWidth = carouselContainer.offsetWidth;
        
        // This is a common point of error for responsive carousels.
        // Instead of counting "visible cards", we just need to ensure we don't slide past the end.
        // We calculate the maximum scrollable distance.
        const totalContentWidth = this.cards.length * this.cardWidth;
        // The track's width is totalContentWidth, but we can only scroll until the last card is visible.
        // The effective scrollable width is totalContentWidth - containerWidth,
        // but we need to account for the actual position of cards.
        
        // A more reliable way is to determine the max index.
        // The last possible `currentIndex` is when the last card starts to be visible on the right edge.
        // If all cards fit, maxIndex is 0.
        let maxIndex = Math.max(0, this.cards.length - (containerWidth / this.cardWidth));
        maxIndex = Math.floor(maxIndex); // Ensure it's an integer index

        // Ensure currentIndex is within valid bounds
        this.currentIndex = Math.max(0, Math.min(this.currentIndex, maxIndex));

        const translateX = -this.currentIndex * this.cardWidth;
        gsap.to(this.track, {
            duration: 0.6,
            x: translateX,
            ease: 'power2.out'
        });

        // Update button states based on the calculated maxIndex
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
        this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';

        this.nextBtn.style.opacity =
            this.currentIndex >= maxIndex ? '0.3' : '1';
        this.nextBtn.style.pointerEvents = this.currentIndex >= maxIndex ? 'none' : 'auto';
    }

    next() {
        this.currentIndex++;
        this.updateCarousel(); // Recalculate and update
    }

    prev() {
        this.currentIndex--;
        this.updateCarousel(); // Recalculate and update
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize carousel if gallery elements exist
    if (document.querySelector('.carousel-track') && document.getElementById('prevBtn') && document.getElementById('nextBtn')) {
        new PortfolioCarousel();
    }
});

// Testimonials slider
class TestimonialsSlider {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        this.slideDuration = 0.8; // Duration for the fade animation
        this.autoSlideDelay = 6000; // Time between slides (ms)
        
        this.init();
        this.setupEventListeners();
        this.startAutoSlide();
    }

    init() {
        this.showTestimonial(0);
    }

    setupEventListeners() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showTestimonial(index);
                this.resetAutoSlide();
            });
        });
    }

    showTestimonial(index) {
        if (index === this.currentIndex) return; // Don't re-show the current one

        const currentTestimonial = this.testimonials[this.currentIndex];
        const nextTestimonial = this.testimonials[index];

        // Animate out the current testimonial
        gsap.to(currentTestimonial, {
            duration: this.slideDuration / 2,
            opacity: 0,
            display: 'none', // Hide element after animation
            ease: 'power2.out'
        });

        // Animate in the next testimonial
        gsap.fromTo(nextTestimonial,
            { opacity: 0, display: 'block' }, // Start state
            {
                duration: this.slideDuration / 2,
                opacity: 1, // End state
                ease: 'power2.in',
                delay: this.slideDuration / 2 // Start animating in after previous fades out
            }
        );


        // Update dot classes immediately
        this.dots[this.currentIndex].classList.remove('active');
        this.dots[index].classList.add('active');

        // Update current index
        this.currentIndex = index;
    }

    nextTestimonial() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.showTestimonial(nextIndex);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextTestimonial();
        }, this.autoSlideDelay);
    }

    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }
}

// Initialize testimonials slider
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsSlider();
});

// Parallax effect for hero background
gsap.to('.hero-background', {
    yPercent: 20, // Reduced parallax effect
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top', // Start when the top of the hero hits the top of the viewport
        end: 'bottom top', // End when the bottom of the hero hits the top of the viewport
        scrub: true // Smoothly scrub animation based on scroll
    }
});

// Navbar background on scroll (refined)
const navbar = document.querySelector('.navbar');
const heroSection = document.getElementById('hero');
const navHeight = navbar.offsetHeight;

// Function to update navbar style based on scroll position
function updateNavbarStyle() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > navHeight) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Initial call and add event listener
updateNavbarStyle();
window.addEventListener('scroll', updateNavbarStyle);

// Button hover animations (using GSAP for smoother effect)
document.querySelectorAll('.cta-button, .contact-cta, .portfolio-btn, .pricing-btn, .submit-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.05,
            boxShadow: '0 10px 20px rgba(255, 68, 68, 0.4)', // Add shadow on hover
            ease: 'power2.out'
        });
    });
    
    button.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            boxShadow: '0 0px 0px rgba(255, 68, 68, 0)', // Remove shadow
            ease: 'power2.out'
        });
    });
});

// Portfolio card hover animations
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this.querySelector('.portfolio-image'), {
            duration: 0.6, // Slightly longer duration
            scale: 1.1,
            ease: 'power2.out'
        });
         gsap.to(this.querySelector('.portfolio-overlay'), {
             duration: 0.3,
             opacity: 1, // Ensure overlay is fully visible
             ease: 'power2.out'
         });
         gsap.to(this, {
             duration: 0.3,
             y: -5, // Subtle lift effect
             ease: 'power2.out'
         });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this.querySelector('.portfolio-image'), {
            duration: 0.6, // Slightly longer duration
            scale: 1,
            ease: 'power2.out'
        });
         gsap.to(this, {
             duration: 0.3,
             y: 0, // Return to original position
             ease: 'power2.out'
         });
    });
});

// Feature Icon hover animation
document.querySelectorAll('.feature-card').forEach(card => {
    const icon = card.querySelector('.feature-icon i');
    if (icon) {
        card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                duration: 0.4,
                rotationY: 360,
                ease: 'back.out(1.7)'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                duration: 0.4,
                rotationY: 0,
                ease: 'back.out(1.7)'
            });
        });
    }
});

// Loading animation (more pronounced)
window.addEventListener('load', () => {
    gsap.to('body', {
        duration: 1, // Longer duration
        opacity: 1, // Fade in to full opacity (assuming initial opacity is 0 in CSS)
        ease: 'power2.out'
    });
});

// Scroll to top functionality
let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex; /* Use flex to center icon */
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3); /* Add shadow */
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) { // Show button after scrolling down more
        gsap.to(scrollToTopBtn, {
            duration: 0.3,
            opacity: 1,
            visibility: 'visible',
            y: 0, // Ensure it's at its natural position
            ease: 'power2.out'
        });
    } else {
         gsap.to(scrollToTopBtn, {
             duration: 0.3,
             opacity: 0,
             visibility: 'hidden',
             y: 10, // Slide down slightly as it hides
             ease: 'power2.in'
         });
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

(function() {
    // Create toast for copy confirmation
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = 'Correo copiado';
    document.body.appendChild(toast);

    // Attach copy behavior to mail button(s)
    document.querySelectorAll('.contact-btn.mail').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = btn.dataset.email || 'daniel.portlab@gmail.com';
            // Try navigator.clipboard first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast();
                }).catch(() => {
                    // Fallback for older browsers
                    fallbackCopy(email) && showToast();
                });
            } else {
                fallbackCopy(email) && showToast();
            }
        });
    });

    function fallbackCopy(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(textarea);
            return ok;
        } catch (err) {
            return false;
        }
    }

    let toastTimer = null;
    function showToast() {
        clearTimeout(toastTimer);
        toast.classList.add('visible');
        toastTimer = setTimeout(() => {
            toast.classList.remove('visible');
        }, 2200);
    }
})();