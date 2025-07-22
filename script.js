// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.skill-progress');
const sections = document.querySelectorAll('section');
const contactForm = document.getElementById('contactForm');

// Detect device type
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);

// Responsive viewport handler
function handleViewportChange() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    }
});

// Close mobile menu when clicking on a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    });
});

// Enhanced smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        
        // Use different scroll behavior for mobile
        const scrollOptions = {
            top: sectionTop,
            behavior: isMobile ? 'auto' : 'smooth'
        };
        
        if (isMobile) {
            // For mobile, use a custom smooth scroll to avoid performance issues
            const startPosition = window.pageYOffset;
            const distance = sectionTop - startPosition;
            const duration = 800;
            let start = null;
            
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const ease = easeInOutCubic(progress / duration);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }
            
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(scrollOptions);
        }
    }
}

// Easing function for smooth animations
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Throttled scroll handler for better performance
let ticking = false;

function updateOnScroll() {
    updateActiveNavLink();
    animateSkillBars();
    animateOnScroll();
    updateHeaderBackground();
    
    // Only apply parallax on desktop for performance
    if (!isMobile && !isTablet) {
        parallaxEffect();
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Animate skill bars when they come into view
function animateSkillBars() {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight - 100 && !bar.classList.contains('animated')) {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
            bar.classList.add('animated');
        }
    });
}

// Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Animate elements on scroll (fade in effect)
function animateOnScroll() {
    const elements = document.querySelectorAll('.info-card, .skill-category, .timeline-item, .contact-info, .contact-form');
    
    elements.forEach(element => {
        if (!element.classList.contains('observed')) {
            observer.observe(element);
            element.classList.add('observed');
        }
    });
}

// Header background change on scroll
function updateHeaderBackground() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(102, 126, 234, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        header.style.backdropFilter = 'none';
    }
}

// Enhanced contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Validate form
    if (!name || !email || !message) {
        showNotification('Per favore compila tutti i campi', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Per favore inserisci un indirizzo email valido', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Invio in corso...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification(`Grazie ${name}! Il tuo messaggio è stato ricevuto.`, 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Parallax effect for hero section (desktop only)
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Enhanced typing effect for hero title
function typeWriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = isMobile ? 'none' : '2px solid white';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            if (!isMobile) {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        }
    }, isMobile ? 50 : 100);
}

// Touch gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Horizontal swipe on mobile menu
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && navLinks.classList.contains('active')) {
            // Swipe left to close menu
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
}, { passive: true });

// Resize handler for responsive adjustments
function handleResize() {
    handleViewportChange();
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
    
    // Reset skill bars animation on resize
    skillBars.forEach(bar => {
        bar.classList.remove('animated');
        bar.style.width = '0%';
    });
    
    // Re-trigger animations
    setTimeout(() => {
        animateSkillBars();
    }, 100);
}

// Debounced resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
});

// Scroll event listener with throttling
window.addEventListener('scroll', requestTick, { passive: true });

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set up viewport units
    handleViewportChange();
    
    // Add smooth scrolling to nav links
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            scrollToSection(sectionId);
        });
    });
    
    // Initialize typing effect with delay
    setTimeout(typeWriter, 1000);
    
    // Initialize animations
    setTimeout(() => {
        animateOnScroll();
        animateSkillBars();
    }, 500);
    
    // Add loading class to body
    document.body.classList.add('loaded');
});

// Utility function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('it-IT', options);
}

// Enhanced hover effects for timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (!isMobile) {
            item.style.transform = 'scale(1.02)';
            item.style.transition = 'transform 0.3s ease';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        if (!isMobile) {
            item.style.transform = 'scale(1)';
        }
    });
});

// Dynamic skill percentage display
skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    const percentage = document.createElement('span');
    percentage.className = 'skill-percentage';
    percentage.textContent = progress + '%';
    percentage.style.cssText = `
        position: absolute;
        right: 0;
        top: -25px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #667eea;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    bar.parentElement.style.position = 'relative';
    bar.parentElement.appendChild(percentage);
    
    // Show percentage when skill bar is animated
    const observer = new MutationObserver(() => {
        if (bar.classList.contains('animated')) {
            percentage.style.opacity = '1';
        }
    });
    
    observer.observe(bar, { attributes: true, attributeFilter: ['class'] });
});

// Enhanced click to copy functionality for contact info
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', () => {
        const text = item.querySelector('span').textContent;
        const cleanText = text.replace(/\[|\]/g, ''); // Remove brackets if present
        
        if (cleanText.includes('@') || cleanText.includes('+') || cleanText.includes('http')) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(cleanText).then(() => {
                    showCopyFeedback(item);
                }).catch(() => {
                    fallbackCopyTextToClipboard(cleanText, item);
                });
            } else {
                fallbackCopyTextToClipboard(cleanText, item);
            }
        }
    });
});

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text, element) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(element);
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Show copy feedback
function showCopyFeedback(element) {
    const originalBg = element.style.backgroundColor;
    const originalColor = element.style.color;
    
    element.style.backgroundColor = '#667eea';
    element.style.color = 'white';
    element.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        element.style.backgroundColor = originalBg;
        element.style.color = originalColor;
        element.style.transform = 'scale(1)';
    }, 1000);
    
    showNotification('Copiato negli appunti!', 'success');
}

// Performance optimization: Lazy load images if any are added
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Easter egg: Konami code (disabled on mobile for performance)
if (!isMobile) {
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });
}

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    body {
        opacity: 0;
    }
`;
document.head.appendChild(style);
