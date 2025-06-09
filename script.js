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
    }, '-=0.7')
    .from('.cta-button', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.6');

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

// Feature cards animation
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

// Pricing cards animation
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
        this.cardWidth = 350;
        this.cardGap = 30;
        this.cardFullWidth = this.cardWidth + this.cardGap;
        
        this.init();
        this.setupEventListeners();
        window.addEventListener('resize', this.updateCarousel.bind(this));
    }

    getVisibleCards() {
        const containerWidth = document.querySelector('.carousel-container').offsetWidth;
        return Math.floor(containerWidth / this.cardFullWidth);
    }

    init() {
        this.visibleCards = this.getVisibleCards();
        this.updateCarousel();
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        let dragThreshold = 50;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diffX = Math.abs(currentX - startX);
            if (diffX > 10) {
                e.preventDefault();
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
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
        }
        if (this.currentIndex < 0) {
            this.currentIndex = 0;
        }

        const translateX = -this.currentIndex * this.cardFullWidth;
        gsap.to(this.track, {
            duration: 0.6,
            x: translateX,
            ease: 'power2.out'
        });

        // Update button states
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
        this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
        
        this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.3' : '1';
        this.nextBtn.style.pointerEvents = this.currentIndex >= maxIndex ? 'none' : 'auto';
    }

    next() {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioCarousel();
});

// Testimonials slider
class TestimonialsSlider {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        this.slideDuration = 0.8;
        this.autoSlideDelay = 6000;
        
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
        if (index === this.currentIndex) return;

        const currentTestimonial = this.testimonials[this.currentIndex];
        const nextTestimonial = this.testimonials[index];

        // Animate out current testimonial
        gsap.to(currentTestimonial, {
            duration: this.slideDuration / 2,
            opacity: 0,
            display: 'none',
            ease: 'power2.out'
        });

        // Animate in next testimonial
        gsap.fromTo(nextTestimonial,
            { opacity: 0, display: 'block' },
            {
                duration: this.slideDuration / 2,
                opacity: 1,
                ease: 'power2.in',
                delay: this.slideDuration / 2
            }
        );

        // Update dots
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

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const success = Math.random() > 0.1;

        if (success) {
            alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
            this.reset();
        } else {
            alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        gsap.to(submitBtn, { scale: 1, duration: 0.1 });
    }, 2000);
});

// Parallax effect for hero background
gsap.to('.hero-background', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
const navHeight = navbar.offsetHeight;

function updateNavbarStyle() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    navbar.classList.toggle('scrolled', scrollTop > navHeight);
}

updateNavbarStyle();
window.addEventListener('scroll', updateNavbarStyle);

// Button hover animations
document.querySelectorAll('.cta-button, .contact-cta, .portfolio-btn, .pricing-btn, .submit-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.05,
            boxShadow: '0 10px 20px rgba(255, 68, 68, 0.4)',
            ease: 'power2.out'
        });
    });
    
    button.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            boxShadow: '0 0px 0px rgba(255, 68, 68, 0)',
            ease: 'power2.out'
        });
    });
});

// Portfolio card hover animations
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this.querySelector('.portfolio-image'), {
            duration: 0.6,
            scale: 1.1,
            ease: 'power2.out'
        });
        gsap.to(this.querySelector('.portfolio-overlay'), {
            duration: 0.3,
            opacity: 1,
            ease: 'power2.out'
        });
        gsap.to(this, {
            duration: 0.3,
            y: -5,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this.querySelector('.portfolio-image'), {
            duration: 0.6,
            scale: 1,
            ease: 'power2.out'
        });
        gsap.to(this, {
            duration: 0.3,
            y: 0,
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

// Loading animation
window.addEventListener('load', () => {
    gsap.to('body', {
        duration: 1,
        opacity: 1,
        ease: 'power2.out'
    });
});

// Scroll to top functionality
let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
        gsap.to(scrollToTopBtn, {
            duration: 0.3,
            opacity: 1,
            visibility: 'visible',
            y: 0,
            ease: 'power2.out'
        });
    } else {
        gsap.to(scrollToTopBtn, {
            duration: 0.3,
            opacity: 0,
            visibility: 'hidden',
            y: 10,
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