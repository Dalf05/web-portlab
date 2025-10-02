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
        duration: 1.2,
        y: 80,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.hero-subtitle', {
        duration: 1.2,
        y: 40,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.7');

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

// Testimonials slider
class TestimonialsSlider {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = -1; // start at -1 so init will properly show the first testimonial
        this.autoSlideInterval = null;
        this.slideDuration = 0.8; // Duration for the fade animation
        this.autoSlideDelay = 6000; // Time between slides (ms)

        this.init();
        this.setupEventListeners();
        this.startAutoSlide();
    }

    init() {
        // Show first testimonial if exists
        if (this.testimonials.length) this.showTestimonial(0);
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

        const prevIndex = this.currentIndex === -1 ? null : this.currentIndex;
        const currentTestimonial = prevIndex !== null ? this.testimonials[prevIndex] : null;
        const nextTestimonial = this.testimonials[index];

        // Animate out the current testimonial
        if (currentTestimonial) {
            gsap.to(currentTestimonial, {
                duration: this.slideDuration / 2,
                opacity: 0,
                display: 'none', // Hide element after animation
                ease: 'power2.out'
            });
        }

        // Prepare and animate in the next testimonial
        gsap.set(nextTestimonial, { display: 'block' });
        gsap.fromTo(nextTestimonial,
            { opacity: 0 }, // Start state
            {
                duration: this.slideDuration / 2,
                opacity: 1, // End state
                ease: 'power2.in'
            }
        );

        // Update dot classes safely
        if (prevIndex !== null && this.dots[prevIndex]) this.dots[prevIndex].classList.remove('active');
        if (this.dots[index]) this.dots[index].classList.add('active');

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
    button.addEventListener('mouseenter', function () {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.05,
            boxShadow: '0 10px 20px rgba(255, 68, 68, 0.4)', // Add shadow on hover
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', function () {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            boxShadow: '0 0px 0px rgba(255, 68, 68, 0)', // Remove shadow
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
scrollToTopBtn.innerHTML = '<i class=\"fas fa-arrow-up\"></i>';
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

(function () {
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
                    // Fallback for older browsers; still show toast even if copy fails
                    const ok = fallbackCopy(email);
                    if (!ok) {
                        toast.textContent = 'Copiar manualmente: ' + email;
                    }
                    showToast();
                });
            } else {
                const ok = fallbackCopy(email);
                if (!ok) {
                    toast.textContent = 'Copiar manualmente: ' + email;
                }
                showToast();
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