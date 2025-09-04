// Mobile-optimized JavaScript for iDENTify website

// Mobile Navigation Functionality
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    const isOpen = mobileMenu.classList.contains('active');
    
    if (isOpen) {
        // Close menu
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    } else {
        // Open menu
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
}

// Close mobile menu when clicking overlay
function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Smooth scrolling for navigation links (mobile-optimized)
function smoothScrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        // Close mobile menu if open
        closeMobileMenu();
        
        // Smooth scroll with mobile-optimized timing
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile-optimized number animation with requestIdleCallback
function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-number, .market-size, .metric-value');
    
    numberElements.forEach(numberEl => {
        // Check if already animated to prevent re-animation
        if (numberEl.dataset.animated) return;
        numberEl.dataset.animated = 'true';
        
        const target = parseFloat(numberEl.dataset.target);
        const unit = numberEl.nextElementSibling?.textContent.trim() || '';
        
        // Detect mobile device for faster animations
        const isMobile = window.innerWidth <= 768;
        const duration = isMobile ? 1000 : 2000;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = target * progress;
            
            // Handle different number formats
            if (unit === 'M') {
                numberEl.textContent = value.toFixed(1);
            } else if (unit === 'B') {
                numberEl.textContent = Math.floor(value);
            } else if (unit === '$') {
                // If it's a dollar amount and it's an integer, don't show decimals
                if (Number.isInteger(target)) {
                    numberEl.textContent = value.toFixed(0);
                } else {
                    numberEl.textContent = value.toFixed(2);
                }
            } else if (unit === 'months') {
                numberEl.textContent = value.toFixed(1);
            } else {
                numberEl.textContent = Math.floor(value);
            }
            
            if (progress < 1) {
                // Use requestIdleCallback on mobile for better performance
                if (isMobile && window.requestIdleCallback) {
                    requestIdleCallback(() => requestAnimationFrame(tick));
                } else {
                    requestAnimationFrame(tick);
                }
            }
        }

        // Start animation with idle callback on mobile
        if (isMobile && window.requestIdleCallback) {
            requestIdleCallback(() => requestAnimationFrame(tick));
        } else {
            requestAnimationFrame(tick);
        }
    });
}

// Mobile-optimized funding progress bars animation
function animateFundingBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(progressBar => {
        const percentage = parseFloat(progressBar.dataset.percentage) || 0;
        const isMobile = window.innerWidth <= 768;
        const duration = isMobile ? 1000 : 1500;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const width = percentage * progress;
            progressBar.style.width = width + '%';
            
            if (progress < 1) {
                if (isMobile && window.requestIdleCallback) {
                    requestIdleCallback(() => requestAnimationFrame(tick));
                } else {
                    requestAnimationFrame(tick);
                }
            }
        }

        if (isMobile && window.requestIdleCallback) {
            requestIdleCallback(() => requestAnimationFrame(tick));
        } else {
            requestAnimationFrame(tick);
        }
    });
}

// Simplified demo functionality for mobile performance
function showDemoInfo() {
    // Show a simple modal or redirect to demo video
    const resultsContent = document.getElementById('resultsContent');
    
    if (resultsContent) {
        resultsContent.innerHTML = `
            <div class="scan-result">
                <div class="health-status healthy">
                    <strong>Demo Video Available</strong><br>
                    Watch our comprehensive product demonstration
                </div>
                <div style="margin-top: 1rem;">
                    <div class="result-item">
                        <span class="result-label">Video Length</span>
                        <span class="result-value">3:45 min</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Features Shown</span>
                        <span class="result-value">Full Demo</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Contact for Demo</span>
                        <span class="result-value">Available</span>
                    </div>
                </div>
                <div style="margin-top: 1.5rem; text-align: center;">
                    <button class="btn btn-primary" onclick="launchDemo()" style="width: 100%;">
                        <i class="fas fa-play"></i> Watch Full Demo
                    </button>
                </div>
            </div>
        `;
    }
}

// Launch demo function (simplified)
function launchDemo() {
    // Scroll to demo section
    const demoSection = document.querySelector('#demo');
    if (demoSection) {
        demoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Show demo info
    setTimeout(() => {
        showDemoInfo();
    }, 500);
}

// Simulate scan function (simplified for mobile)
function simulateScan() {
    const scanButton = document.querySelector('.scan-button');
    const scanText = document.querySelector('.scan-text');
    
    if (!scanButton || !scanText) return;
    
    // Show scanning state
    scanButton.textContent = 'Scanning...';
    scanButton.disabled = true;
    scanText.textContent = 'Analyzing...';
    
    // Simulate scan process with shorter duration for mobile
    const isMobile = window.innerWidth <= 768;
    const scanDuration = isMobile ? 1500 : 2000;
    
    setTimeout(() => {
        scanButton.textContent = 'Scan Complete!';
        scanText.textContent = 'Results: Healthy teeth detected';
        
        // Reset after shorter time on mobile
        setTimeout(() => {
            scanButton.textContent = 'Scan';
            scanButton.disabled = false;
            scanText.textContent = 'Ready to Scan';
        }, isMobile ? 2000 : 3000);
    }, scanDuration);
}

// Mobile-specific optimizations and event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation event listeners
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Mobile menu link navigation
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollToSection(targetId);
        });
    });
    
    // Desktop navigation links (simplified)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollToSection(targetId);
        });
    });
    
    // Touch event handling for better mobile interaction
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Close mobile menu on swipe down
            if (diff < 0 && document.querySelector('.mobile-menu.active')) {
                closeMobileMenu();
            }
        }
    }
    
    // Viewport change detection for device rotation
    let currentOrientation = window.orientation || 0;
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            const newOrientation = window.orientation || 0;
            if (newOrientation !== currentOrientation) {
                currentOrientation = newOrientation;
                // Close mobile menu on orientation change
                if (document.querySelector('.mobile-menu.active')) {
                    closeMobileMenu();
                }
            }
        }, 100);
    });
    
    // Connection speed detection for conditional loading
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Disable heavy animations on slow connections
            document.body.classList.add('slow-connection');
        }
    }
    
    // Contact form handling (simplified for mobile)
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Simplified form field management
        const interestSelect = document.getElementById('interest');
        const investmentRangeSelect = document.getElementById('investment-range');
        const timelineSelect = document.getElementById('timeline');
        
        function updateFormFields() {
            const selectedInterest = interestSelect.value;
            const investmentInterests = ['pre-seed-investment', 'seed-round-lead', 'strategic-investment', 'follow-on-investment'];
            
            if (investmentInterests.includes(selectedInterest)) {
                // Hide "Not Applicable" options for investment interests
                Array.from(investmentRangeSelect.options).forEach(option => {
                    if (option.value === 'not-applicable') {
                        option.style.display = 'none';
                    }
                });
                Array.from(timelineSelect.options).forEach(option => {
                    if (option.value === 'not-applicable') {
                        option.style.display = 'none';
                    }
                });
                
                // If "Not Applicable" is currently selected, reset to empty
                if (investmentRangeSelect.value === 'not-applicable') {
                    investmentRangeSelect.value = '';
                }
                if (timelineSelect.value === 'not-applicable') {
                    timelineSelect.value = '';
                }
            } else {
                // Show "Not Applicable" options for non-investment interests
                Array.from(investmentRangeSelect.options).forEach(option => {
                    option.style.display = '';
                });
                Array.from(timelineSelect.options).forEach(option => {
                    option.style.display = '';
                });
            }
        }
        
        // Add event listener for interest changes
        if (interestSelect) {
            interestSelect.addEventListener('change', updateFormFields);
            // Initialize form fields on page load
            updateFormFields();
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const company = formData.get('company');
            const interest = formData.get('interest');
            const investmentRange = formData.get('investment-range');
            const timeline = formData.get('timeline');
            const portfolioFocus = formData.get('portfolio-focus');
            const message = formData.get('message');
            
            // Enhanced validation
            if (!name || !email || !interest || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Validate investment-specific fields
            const investmentInterests = ['pre-seed-investment', 'seed-round-lead', 'strategic-investment', 'follow-on-investment'];
            if (investmentInterests.includes(interest)) {
                if (!investmentRange || investmentRange === '' || investmentRange === 'not-applicable') {
                    alert('Please select a valid investment range.');
                    return;
                }
                if (!timeline || timeline === '' || timeline === 'not-applicable') {
                    alert('Please select a valid timeline.');
                    return;
                }
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                alert('Thank you for your message! We\'ll get back to you soon.');
                
                // Reset form
                contactForm.reset();
                
                // Log form data (for development - remove in production)
                console.log('Form submitted:', { 
                    name, 
                    email, 
                    company, 
                    interest, 
                    investmentRange, 
                    timeline, 
                    portfolioFocus, 
                    message 
                });
            }, 2000);
        });
    }
    
    // Simplified resource tracking (removed console.log for performance)
    document.querySelectorAll('.resource-card .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Future analytics integration can be added here
            // Removed console.log for mobile performance
        });
    });
    
    // Mobile-optimized Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                
                // Animate numbers in market section
                if (section.id === 'market') {
                    animateNumbers();
                }
                
                // Animate numbers in business model section
                if (section.id === 'business-model') {
                    animateNumbers();
                }
                
                // Animate funding bars in funding section
                if (section.id === 'funding') {
                    animateFundingBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    document.querySelectorAll('#market, #business-model, #funding').forEach(section => {
        observer.observe(section);
    });
    
    // Mobile-optimized scroll effect for navbar
    const navbar = document.querySelector('.navbar');
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}); 