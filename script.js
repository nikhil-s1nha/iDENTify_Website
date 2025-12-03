// Mobile-optimized JavaScript for iDENTify website

// Scroll lock variables
let scrollY = 0;

// Focus management variables
let previouslyFocusedEl = null;
let focusTrapEnabled = false;
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Fixed-position scroll locking for better mobile experience
function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
}

function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollY);
}

// Focus management utilities
function focusFirstElement(container) {
    const focusableElements = container.querySelectorAll(focusableSelector);
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function enableFocusTrap(container) {
    if (focusTrapEnabled) return;
    
    focusTrapEnabled = true;
    
    const focusableElements = Array.from(container.querySelectorAll(focusableSelector));
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (!focusTrapEnabled || !document.querySelector('.mobile-menu.active')) {
            return;
        }
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
    
    document.addEventListener('keydown', handleTabKey);
    
    // Store the handler for cleanup
    container._focusTrapHandler = handleTabKey;
}

function disableFocusTrap() {
    if (!focusTrapEnabled) return;
    
    focusTrapEnabled = false;
    
    // Remove the event listener
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu._focusTrapHandler) {
        document.removeEventListener('keydown', mobileMenu._focusTrapHandler);
        delete mobileMenu._focusTrapHandler;
    }
}

// Mobile Navigation Functionality
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    const isOpen = mobileMenu.classList.contains('active');
    
    if (isOpen) {
        // Close menu - delegate to closeMobileMenu for proper focus management
        closeMobileMenu();
    } else {
        // Open menu
        // Store the currently focused element before opening
        previouslyFocusedEl = document.activeElement;
        
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        lockScroll();
        
        // Focus management: move focus to first focusable element in menu
        focusFirstElement(mobileMenu);
        
        // Enable focus trap
        enableFocusTrap(mobileMenu);
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
    mobileMenu.setAttribute('aria-hidden', 'true');
    unlockScroll();
    
    // Disable focus trap
    disableFocusTrap();
    
    // Restore focus to previously focused element or toggle button
    if (previouslyFocusedEl && previouslyFocusedEl !== document.body) {
        previouslyFocusedEl.focus();
    } else {
        mobileMenuToggle.focus();
    }
    
    // Clear the stored element
    previouslyFocusedEl = null;
}

// Smooth scrolling for navigation links (mobile-optimized)
function smoothScrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        // Close mobile menu if open
        closeMobileMenu();
        
        // Get navbar height from CSS variable
        const navH = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height').replace('px','') || 72;
        const y = target.getBoundingClientRect().top + window.pageYOffset - Number(navH);
        
        // Smooth scroll with mobile-optimized timing
        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    }
}

// Enhanced number animation with easing
function animateNumbers(root = document) {
    const numberElements = root.querySelectorAll('.stat-number, .market-size, .metric-value, .revenue-amount, .impact-number');
    
    numberElements.forEach(numberEl => {
        // Check if already animated to prevent re-animation
        if (numberEl.dataset.animated) return;
        numberEl.dataset.animated = 'true';
        
        const target = parseFloat(numberEl.dataset.target);
        if (isNaN(target)) return;
        
        // Safely detect unit from sibling element
        const sibling = numberEl.nextElementSibling;
        let unit = '';
        if (sibling) {
            if (sibling.classList.contains('impact-unit')) {
                unit = '%';
            } else {
                const siblingText = sibling.textContent.trim();
                if (siblingText) {
                    unit = siblingText;
                }
            }
        }
        
        // Detect mobile device for faster animations
        const isMobile = window.innerWidth <= 768;
        const duration = isMobile ? 1000 : 2000;
        const startTime = performance.now();
        
        // Easing function for smooth deceleration
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const value = target * easedProgress;
            
            // Handle different number formats
            if (unit === 'M') {
                numberEl.textContent = value.toFixed(1);
            } else if (unit === 'B') {
                numberEl.textContent = (Number.isInteger(parseFloat(numberEl.dataset.target)))
                    ? Math.floor(value)
                    : value.toFixed(1);
            } else if (unit === '$') {
                // If it's a dollar amount and it's an integer, don't show decimals
                if (Number.isInteger(target)) {
                    numberEl.textContent = value.toFixed(0);
                } else {
                    numberEl.textContent = value.toFixed(2);
                }
            } else if (unit === 'months') {
                numberEl.textContent = value.toFixed(1);
            } else if (unit === '%') {
                numberEl.textContent = Math.floor(value);
            } else {
                numberEl.textContent = Math.floor(value);
            }
            
            if (progress < 1) {
                // Use requestAnimationFrame for consistent frame rate
                requestAnimationFrame(tick);
            } else {
                // Ensure final value is exact
                if (unit === '%') {
                    numberEl.textContent = Math.floor(target);
                } else if (Number.isInteger(target)) {
                    numberEl.textContent = Math.floor(target);
                } else {
                    numberEl.textContent = target.toFixed(1);
                }
            }
        }

        // Start animation with requestAnimationFrame
        requestAnimationFrame(tick);
    });
}


// Phone Animation Sequence (Hero section)
function triggerPhoneAnimation() {
    const phoneAttachment = document.querySelector('.phone-attachment');
    const phoneScreen = document.querySelector('.phone-screen');
    const scanResultOverlay = document.querySelector('.scan-result-overlay');
    const heatmapOverlay = document.querySelector('.heatmap-overlay');
    
    if (!phoneAttachment || !phoneScreen) return;
    
    // Phase 1: Attachment snaps on
    phoneAttachment.classList.add('attachment-snap');
    
    setTimeout(() => {
        // Phase 2: Camera flash
        const flash = phoneScreen.querySelector('.camera-flash') || document.createElement('div');
        flash.classList.add('camera-flash', 'flash');
        if (!phoneScreen.querySelector('.camera-flash')) {
            phoneScreen.appendChild(flash);
        }
        
        setTimeout(() => {
            flash.classList.remove('flash');
            
            // Phase 3: Scan reveal
            if (scanResultOverlay) {
                scanResultOverlay.classList.add('scan-reveal');
            }
            
            setTimeout(() => {
                // Phase 4: Heatmap transition (red -> yellow -> green)
                if (heatmapOverlay) {
                    heatmapOverlay.classList.add('heatmap-red');
                    
                    setTimeout(() => {
                        heatmapOverlay.classList.remove('heatmap-red');
                        heatmapOverlay.classList.add('heatmap-yellow');
                        
                        setTimeout(() => {
                            heatmapOverlay.classList.remove('heatmap-yellow');
                            heatmapOverlay.classList.add('heatmap-green');
                        }, 500);
                    }, 500);
                }
            }, 500);
        }, 300);
    }, 800);
}

// Chat Animation Sequencing
function triggerChatSequence() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection || heroSection.dataset.chatAnimated) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Mark as animated to prevent re-triggering
    heroSection.dataset.chatAnimated = 'true';
    
    const chatView = heroSection.querySelector('.hero-chat-view');
    if (!chatView) return;
    
    if (prefersReducedMotion) {
        // Set time directly to 8:12 AM
        const chatTime = chatView.querySelector('.chat-time');
        if (chatTime) {
            chatTime.textContent = '8:12 AM';
        }
        
        // Show patient and doctor messages, hide typing indicator
        const messages = chatView.querySelectorAll('.message, .delivered-status, .time-transition');
        messages.forEach(msg => msg.classList.add('visible'));
        
        // Hide typing indicator
        const typingIndicator = chatView.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
        
        // Trigger transition to hero content immediately
        setTimeout(() => {
            triggerHeroTransition();
        }, 100);
        return;
    }
    
    const message1 = chatView.querySelector('.message-1');
    const message2 = chatView.querySelector('.message-2');
    const typingIndicator = chatView.querySelector('.typing-indicator');
    const deliveredStatus = chatView.querySelector('.delivered-status');
    const timeTransition = chatView.querySelector('.time-transition');
    const message3 = chatView.querySelector('.message-3');
    const message4 = chatView.querySelector('.message-4');
    const chatTime = chatView.querySelector('.chat-time');
    const chatMessages = chatView.querySelector('.chat-messages');
    const fadeOverlay = chatView.querySelector('.chat-fade-overlay');
    
    // Message 1 (patient): Fade in immediately
    if (message1) {
        message1.classList.add('visible');
        scrollChatToBottom(chatMessages);
    }
    
    // Message 2 (patient): Fade in after 2000ms
    setTimeout(() => {
        if (message2) {
            message2.classList.add('visible');
            scrollChatToBottom(chatMessages);
        }
    }, 2000);
    
    // Typing indicator: Show after 3500ms, hide after 2000ms (5500ms total)
    setTimeout(() => {
        showTypingIndicator(typingIndicator);
        scrollChatToBottom(chatMessages);
        
        setTimeout(() => {
            hideTypingIndicator(typingIndicator);
        }, 2000);
    }, 3500);
    
    // Delivered status: Show after 5500ms
    setTimeout(() => {
        if (deliveredStatus) {
            deliveredStatus.classList.add('visible');
        }
    }, 5500);
    
    // Time transition: Animate after 7000ms (fade 2:08 AM → 8:12 AM)
    setTimeout(() => {
        // Fade overlay in
        if (fadeOverlay) {
            fadeOverlay.classList.add('active');
        }
        
        // After fade in, animate time transition
        setTimeout(() => {
            animateTimeTransition(chatTime, timeTransition);
            
            // Fade overlay out
            setTimeout(() => {
                if (fadeOverlay) {
                    fadeOverlay.classList.remove('active');
                }
            }, 400);
        }, 400);
    }, 7000);
    
    // Message 3 (doctor): Fade in after 9000ms
    setTimeout(() => {
        if (message3) {
            message3.classList.add('visible');
            scrollChatToBottom(chatMessages);
        }
    }, 9000);
    
    // Message 4 (doctor): Fade in after 10500ms
    setTimeout(() => {
        if (message4) {
            message4.classList.add('visible');
            scrollChatToBottom(chatMessages);
        }
        
        // Trigger transition to hero content after 2 seconds (12500ms total)
        setTimeout(() => {
            triggerHeroTransition();
        }, 2000);
    }, 10500);
}

// Transition from chat view to hero content view
function triggerHeroTransition() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chatView = heroSection.querySelector('.hero-chat-view');
    const fadeOverlay = chatView?.querySelector('.chat-fade-overlay');
    
    // Activate fade overlay for subtle darkening
    if (fadeOverlay) {
        fadeOverlay.classList.add('active');
    }
    
    if (prefersReducedMotion) {
        // Instant transition for reduced motion
        heroSection.classList.add('transitioned');
        return;
    }
    
    // Smooth transition: fade out chat, fade in hero content
    heroSection.classList.add('transitioned');
}

// Reset and replay the chat sequence
function replayChatSequence() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const chatView = heroSection.querySelector('.hero-chat-view');
    if (!chatView) return;
    
    // Reset state
    heroSection.classList.remove('transitioned');
    heroSection.dataset.chatAnimated = '';
    
    // Reset all messages
    const messages = chatView.querySelectorAll('.message, .delivered-status, .time-transition');
    messages.forEach(msg => {
        msg.classList.remove('visible');
    });
    
    // Reset typing indicator
    const typingIndicator = chatView.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = '';
        typingIndicator.classList.remove('visible');
    }
    
    // Reset time
    const chatTime = chatView.querySelector('.chat-time');
    if (chatTime) {
        chatTime.textContent = '2:08 AM';
    }
    
    // Reset fade overlay
    const fadeOverlay = chatView.querySelector('.chat-fade-overlay');
    if (fadeOverlay) {
        fadeOverlay.classList.remove('active');
    }
    
    // Scroll to top of hero section
    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Restart chat sequence after a brief delay
    setTimeout(() => {
        triggerChatSequence();
    }, 500);
}

// Typing indicator helpers
function showTypingIndicator(typingIndicator) {
    if (!typingIndicator) return;
    typingIndicator.classList.add('visible');
}

function hideTypingIndicator(typingIndicator) {
    if (!typingIndicator) return;
    typingIndicator.classList.remove('visible');
}

// Time transition animation
function animateTimeTransition(chatTime, timeTransition) {
    if (!chatTime) return;
    
    // Fade out current time
    chatTime.style.transition = 'opacity 0.5s ease';
    chatTime.style.opacity = '0';
    
    setTimeout(() => {
        // Change text content to "8:12 AM"
        chatTime.textContent = '8:12 AM';
        
        // Fade in new time
        chatTime.style.opacity = '1';
        
        // Show time transition element
        if (timeTransition) {
            timeTransition.classList.add('visible');
        }
    }, 500);
}

// Auto-scroll chat messages to bottom
function scrollChatToBottom(chatMessages) {
    if (!chatMessages) return;
    
    requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Message Bubble Animation (Legacy - kept for compatibility)
// LEGACY CODE: No longer used - legacy hero section has been replaced by chat-hero
/*
function triggerMessageBubble() {
    const messageBubble = document.querySelector('.message-bubble');
    if (!messageBubble) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        messageBubble.style.opacity = '1';
        return;
    }
    
    // Fade-in with delay is handled by CSS, but we can add notification pulse
    messageBubble.classList.add('fade-in-delayed');
}
*/

// Story Beat Animations
function triggerStoryBeats(element) {
    if (!element) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const storyBeats = element.querySelectorAll('[data-story-beat]');
    
    storyBeats.forEach((beat, index) => {
        const delay = index * 200;
        setTimeout(() => {
            beat.classList.add('visible');
            
            // Animations are triggered by CSS when .visible class is added
        }, delay);
    });
}

// Mirrored Stories Animation
function triggerMirroredStories(element) {
    if (!element) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const leftColumn = element.querySelector('.mirrored-column-left');
    const rightColumn = element.querySelector('.mirrored-column-right');
    const centerDivider = element.querySelector('.center-divider');
    
    if (leftColumn) {
        setTimeout(() => {
            leftColumn.classList.add('visible');
        }, 0);
    }
    
    if (rightColumn) {
        setTimeout(() => {
            rightColumn.classList.add('visible');
        }, 200);
    }
    
    if (centerDivider) {
        setTimeout(() => {
            centerDivider.classList.add('visible');
        }, 400);
    }
}

// Solution section phone animation sequence
function triggerSolutionPhoneAnimation() {
    const phoneAttachmentSolution = document.querySelector('.phone-attachment-solution');
    const phoneScreenSolution = document.querySelector('.phone-screen-solution');
    const cameraFlash = phoneScreenSolution?.querySelector('.camera-flash');
    const scanImageReveal = phoneScreenSolution?.querySelector('.scan-image-reveal');
    const heatmapVisualization = phoneScreenSolution?.querySelector('.heatmap-visualization');
    const scanStatusLabel = phoneScreenSolution?.querySelector('.scan-status-label');
    const futuristicReveal = document.querySelector('.futuristic-reveal');
    const solutionReveal = document.querySelector('.solution-reveal');
    
    if (!phoneAttachmentSolution || !phoneScreenSolution) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Dark-to-light transition
    const darkToLight = document.querySelector('.dark-to-light-transition');
    if (darkToLight && !prefersReducedMotion) {
        darkToLight.style.background = 'linear-gradient(180deg, var(--gradient-bg-start), var(--gradient-bg-start))';
    }
    
    // Futuristic reveal
    if (futuristicReveal) {
        futuristicReveal.classList.add('visible');
    }
    
    if (solutionReveal) {
        solutionReveal.classList.add('visible');
    }
    
    // Reset all animation classes
    phoneAttachmentSolution.classList.remove('attachment-snap');
    if (cameraFlash) cameraFlash.classList.remove('flash');
    if (scanImageReveal) scanImageReveal.classList.remove('scan-reveal');
    if (heatmapVisualization) {
        const heatmapRed = heatmapVisualization.querySelector('.heatmap-red');
        const heatmapYellow = heatmapVisualization.querySelector('.heatmap-yellow');
        const heatmapGreen = heatmapVisualization.querySelector('.heatmap-green');
        if (heatmapRed) heatmapRed.classList.remove('active');
        if (heatmapYellow) heatmapYellow.classList.remove('active');
        if (heatmapGreen) heatmapGreen.classList.remove('active');
    }
    
    if (prefersReducedMotion) {
        phoneAttachmentSolution.classList.add('attachment-snap');
        if (scanImageReveal) scanImageReveal.classList.add('scan-reveal');
        if (scanStatusLabel) {
            scanStatusLabel.classList.add('visible');
        }
        return;
    }
    
    // Phase 1: Attachment snaps on
    phoneAttachmentSolution.classList.add('attachment-snap');
    
    setTimeout(() => {
        // Phase 2: Camera flash
        if (cameraFlash) {
            cameraFlash.classList.add('flash');
            setTimeout(() => {
                cameraFlash.classList.remove('flash');
                
                // Phase 3: Scan reveal (after flash is removed)
                if (scanImageReveal) {
                    scanImageReveal.classList.add('scan-reveal');
                }
                
                setTimeout(() => {
                    // Phase 4: Heatmap layers (red -> yellow -> green)
                    if (heatmapVisualization) {
                        const heatmapRed = heatmapVisualization.querySelector('.heatmap-red');
                        const heatmapYellow = heatmapVisualization.querySelector('.heatmap-yellow');
                        const heatmapGreen = heatmapVisualization.querySelector('.heatmap-green');
                        
                        if (heatmapRed) {
                            heatmapRed.classList.add('active');
                            setTimeout(() => {
                                heatmapRed.classList.remove('active');
                                if (heatmapYellow) {
                                    heatmapYellow.classList.add('active');
                                    setTimeout(() => {
                                        heatmapYellow.classList.remove('active');
                                        if (heatmapGreen) {
                                            heatmapGreen.classList.add('active');
                                            
                                            // Emphasize "Ready to Scan" label when animation completes
                                            if (scanStatusLabel) {
                                                scanStatusLabel.classList.add('visible');
                                                setTimeout(() => {
                                                    scanStatusLabel.classList.add('pulse');
                                                }, 200);
                                            }
                                        }
                                    }, 500);
                                }
                            }, 500);
                        }
                    }
                }, 500);
            }, 300);
        }
    }, 800);
    
    // Stagger solution card reveals
    const solutionCards = document.querySelectorAll('[data-reveal-sequence]');
    solutionCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 200);
    });
}

// Transformation Sequence Animation
function triggerTransformationSequence(element) {
    if (!element) return;
    
    // Check if scroll listener is already attached
    if (element.dataset.scrollBound === 'true') {
        return;
    }
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    
    if (prefersReducedMotion || isMobile) {
        // Show all states immediately on mobile or reduced motion
        const states = element.querySelectorAll('.transformation-state');
        states.forEach(state => {
            state.style.opacity = '1';
        });
        return;
    }
    
    // Set flag to prevent duplicate listeners
    element.dataset.scrollBound = 'true';
    
    // Track scroll progress for transformation states
    function trackScrollProgress() {
        const scrollY = window.scrollY;
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Compute progress using bounded formula and clamp between 0 and 1
        let progress = (scrollY - elementTop) / (elementHeight - windowHeight);
        progress = Math.max(0, Math.min(1, progress));
        
        const beforeState = element.querySelector('.before-state');
        const transitionState = element.querySelector('.transition-state');
        const afterState = element.querySelector('.after-state');
        
        if (progress < 0.33) {
            // BEFORE state
            if (beforeState) {
                beforeState.classList.add('before-visible');
                beforeState.style.opacity = '1';
            }
            if (transitionState) transitionState.style.opacity = '0.3';
            if (afterState) afterState.style.opacity = '0.3';
        } else if (progress < 0.66) {
            // TRANSITION state
            if (beforeState) beforeState.style.opacity = '0.5';
            if (transitionState) {
                transitionState.classList.add('transition-visible');
                transitionState.style.opacity = '1';
            }
            if (afterState) afterState.style.opacity = '0.3';
        } else {
            // AFTER state
            if (beforeState) beforeState.style.opacity = '0.3';
            if (transitionState) transitionState.style.opacity = '0.5';
            if (afterState) {
                afterState.classList.add('after-visible');
                afterState.style.opacity = '1';
            }
            
            // Animate inbox counter
            const counterValue = element.querySelector('.counter-value');
            if (counterValue && !counterValue.dataset.animated) {
                counterValue.dataset.animated = 'true';
                const target = parseInt(counterValue.dataset.target) || 3;
                let current = 17;
                const interval = setInterval(() => {
                    current = Math.max(target, current - 1);
                    counterValue.textContent = current;
                    if (current <= target) {
                        clearInterval(interval);
                    }
                }, 50);
            }
        }
    }
    
    // Throttle scroll tracking
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = requestAnimationFrame(() => {
            trackScrollProgress();
            scrollTimeout = null;
        });
    }, { passive: true });
    
    // Initial check
    trackScrollProgress();
}

// Animate heatmap overlay - operates on child layers
function animateHeatmap(element) {
    if (!element) return;
    
    const heatmapRed = element.querySelector('.heatmap-red');
    const heatmapYellow = element.querySelector('.heatmap-yellow');
    const heatmapGreen = element.querySelector('.heatmap-green');
    
    if (!heatmapRed || !heatmapYellow || !heatmapGreen) return;
    
    // Remove active classes from all layers
    heatmapRed.classList.remove('active');
    heatmapYellow.classList.remove('active');
    heatmapGreen.classList.remove('active');
    
    setTimeout(() => {
        heatmapRed.classList.add('active');
        setTimeout(() => {
            heatmapRed.classList.remove('active');
            heatmapYellow.classList.add('active');
            setTimeout(() => {
                heatmapYellow.classList.remove('active');
                heatmapGreen.classList.add('active');
            }, 500);
        }, 500);
    }, 100);
}

// Stagger elements animation
function staggerElements(elements, delay = 200) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * delay);
    });
}

// Parallax scroll effect
let parallaxElements = [];
let isParallaxEnabled = true;

function parallaxScroll() {
    if (!isParallaxEnabled) return;
    
    const scrollY = window.pageYOffset;
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) return; // Disable parallax on mobile
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Animate progress bar
function animateProgressBar(element, target, duration = 1500) {
    if (!element) return;
    
    element.style.setProperty('--target-width', `${target}%`);
    element.classList.add('animate');
    
    setTimeout(() => {
        element.style.width = `${target}%`;
    }, 50);
}

// Simulate scan function (enhanced with animation sequence)
function simulateScan() {
    const scanButton = document.querySelector('.scan-button');
    const scanText = document.querySelector('.scan-text');
    
    if (!scanButton || !scanText) return;
    
    // Trigger full animation sequence
    triggerPhoneAnimation();
    
    // Show scanning state
    scanButton.textContent = 'Scanning...';
    scanButton.disabled = true;
    scanText.textContent = 'Analyzing...';
    
    // Simulate scan process with shorter duration for mobile
    const isMobile = window.innerWidth <= 768;
    const scanDuration = isMobile ? 2000 : 3000;
    
    setTimeout(() => {
        scanButton.textContent = 'Scan Complete!';
        scanText.textContent = 'Results: Healthy teeth detected';
        
        // Reset after shorter time on mobile
        setTimeout(() => {
            scanButton.textContent = 'Scan';
            scanButton.disabled = false;
            scanText.textContent = 'Ready to Scan';
            
            // Reset animation elements
            const phoneAttachment = document.querySelector('.phone-attachment');
            const scanResultOverlay = document.querySelector('.scan-result-overlay');
            const heatmapOverlay = document.querySelector('.heatmap-overlay');
            
            if (phoneAttachment) phoneAttachment.classList.remove('attachment-snap');
            if (scanResultOverlay) scanResultOverlay.classList.remove('scan-reveal');
            if (heatmapOverlay) {
                heatmapOverlay.classList.remove('heatmap-red', 'heatmap-yellow', 'heatmap-green');
            }
        }, isMobile ? 2000 : 3000);
    }, scanDuration);
}

// Mobile-specific optimizations and event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
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
            const href = this.getAttribute('href') || '';
            if (href.includes('.html')) {
                // Allow normal navigation for cross-page links
                closeMobileMenu();
                return; // do not preventDefault
            }
            e.preventDefault();
            smoothScrollToSection(href);
        });
    });
    
    // Add Escape key handler for mobile menu
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.querySelector('.mobile-menu.active')) {
            closeMobileMenu();
        }
    });
    
    // Desktop/global anchor handling excluding mobile menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.closest('.mobile-menu')) return; // let mobile handler manage
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScrollToSection(this.getAttribute('href'));
        });
    });
    
    // Handle cross-page navigation
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function (e) {
            // Allow normal navigation for cross-page links
            // No preventDefault needed
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
    
    // Viewport change detection for device rotation using modern APIs
    const mql = window.matchMedia('(orientation: portrait)');
    let wasPortrait = mql.matches;
    
    mql.addEventListener('change', e => {
        if (e.matches !== wasPortrait) {
            wasPortrait = e.matches;
            if (document.querySelector('.mobile-menu.active')) {
                closeMobileMenu();
            }
        }
    });
    
    // Optional: Also watch screen.orientation when available
    if (screen.orientation) {
        screen.orientation.addEventListener('change', () => {
            if (document.querySelector('.mobile-menu.active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Connection speed detection for conditional loading
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Disable heavy animations on slow connections
            document.body.classList.add('slow-connection');
        }
    }
    
    // Contact form handling (simplified for mobile) - only if contact form exists
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Validation - require only name, email, and message (phone is optional)
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
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
                    phone, 
                    message 
                });
            }, 2000);
        });
    }
    
    // Simplified resource tracking (removed console.log for performance) - only if resource cards exist
    const resourceCards = document.querySelectorAll('.resource-card .btn');
    if (resourceCards.length > 0) {
        resourceCards.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Future analytics integration can be added here
                // Removed console.log for mobile performance
            });
        });
    }
    
    // Enhanced Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add visible class for scroll animations
                if (element.classList.contains('fade-in') || 
                    element.classList.contains('slide-up') || 
                    element.classList.contains('slide-left') || 
                    element.classList.contains('slide-right')) {
                    element.classList.add('visible');
                }
                
                // Hero reveal is now part of hero-section and controlled by triggerHeroTransition()
                
                // Animate numbers in various sections
                if (['tam', 'sam', 'som', 'market-segments', 'business-overview', 'unit-economics', 'financial-projections', 'impact'].includes(element.id)) {
                    animateNumbers(element);
                    
                    // Animate progress bars in impact section
                    if (element.id === 'impact') {
                        const progressBars = element.querySelectorAll('.progress-fill');
                        progressBars.forEach(bar => {
                            const target = parseInt(bar.dataset.target) || 0;
                            animateProgressBar(bar, target);
                        });
                    }
                }
                
                // Animate transformation counter
                if (element.id === 'transformation') {
                    const counterValue = element.querySelector('.counter-value');
                    if (counterValue && !counterValue.dataset.animated) {
                        // Counter animation is handled in triggerTransformationSequence
                    }
                }
                
                // Trigger chat sequence when hero section is visible
                if (element.classList.contains('hero-section') && !element.dataset.chatAnimated) {
                    triggerChatSequence();
                }
                
                // LEGACY CODE: Legacy hero section has been replaced by chat-hero
                // Trigger phone animation and message bubble when legacy hero section is visible
                /*
                if (element.id === 'hero' && element.classList.contains('hero') && !element.classList.contains('chat-hero') && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    triggerMessageBubble();
                    setTimeout(() => {
                        triggerPhoneAnimation();
                    }, 500);
                }
                */
                
                // Trigger story beats animation when problem section is visible
                if (element.id === 'problem' && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    triggerStoryBeats(element);
                }
                
                // Trigger mirrored stories animation
                if (element.id === 'mirrored-stories' && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    triggerMirroredStories(element);
                }
                
                // Trigger Solution phone animation when solution section is visible
                if (element.id === 'solution' && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    setTimeout(() => {
                        triggerSolutionPhoneAnimation();
                    }, 500);
                }
                
                // Trigger transformation sequence
                if (element.id === 'transformation' && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    triggerTransformationSequence(element);
                }
                
                // Sequential step reveal for How It Works (5 steps)
                if (element.id === 'how-it-works') {
                    const steps = element.querySelectorAll('.step');
                    staggerElements(Array.from(steps), 200);
                    
                    // Add micro-animations to step icons
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            const iconContainer = step.querySelector('.step-icon-animate');
                            if (iconContainer) {
                                iconContainer.classList.add('visible');
                            }
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections and animated elements
    const sectionsToObserve = document.querySelectorAll('section, .fade-in, .slide-up, .slide-left, .slide-right');
    sectionsToObserve.forEach(section => {
        scrollObserver.observe(section);
    });
    
    // Legacy observer for number animations (kept for compatibility)
    const observer = scrollObserver;
    
    // Observe sections for animations (only if motion is not reduced)
    if (!prefersReducedMotion) {
        // Check which sections exist on the current page
        const sectionsToObserve = [];
        if (document.querySelector('#hero')) sectionsToObserve.push('#hero');
        if (document.querySelector('#tam')) sectionsToObserve.push('#tam');
        if (document.querySelector('#sam')) sectionsToObserve.push('#sam');
        if (document.querySelector('#som')) sectionsToObserve.push('#som');
        if (document.querySelector('#market-segments')) sectionsToObserve.push('#market-segments');
        if (document.querySelector('#business-overview')) sectionsToObserve.push('#business-overview');
        if (document.querySelector('#unit-economics')) sectionsToObserve.push('#unit-economics');
        if (document.querySelector('#financial-projections')) sectionsToObserve.push('#financial-projections');
        
        sectionsToObserve.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) observer.observe(section);
        });
        
        // Animate hero stats immediately on load if hero section exists
        if (document.querySelector('#hero')) {
            animateNumbers(document);
        }
    }
    
    // Mobile-optimized scroll effect for navbar
    const navbar = document.querySelector('.navbar');
    let ticking = false;
    
    function updateNavbar() {
        // Navbar color change disabled - keeping consistent color
        // if (window.scrollY > 50) {
        //     navbar.classList.add('scrolled');
        // } else {
        //     navbar.classList.remove('scrolled');
        // }
        ticking = false;
    }
    
    // Auto-hide scroll hint when user scrolls
    const chatScrollHint = document.querySelector('.chat-scroll-hint');
    let scrollHintHidden = false;
    
    function handleScrollHint() {
        if (chatScrollHint && !scrollHintHidden && window.scrollY > 100) {
            chatScrollHint.classList.add('hidden');
            scrollHintHidden = true;
        }
    }
    
    // Optional: Add manual trigger for hero transition (skip animation)
    if (chatScrollHint) {
        chatScrollHint.addEventListener('click', () => {
            triggerHeroTransition();
        });
    }
    
    // Add click/tap anywhere on chat to skip animation and transition to hero content
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && !heroSection.dataset.skipListenerAdded) {
        heroSection.dataset.skipListenerAdded = 'true';
        const chatView = heroSection.querySelector('.hero-chat-view');
        if (chatView) {
            chatView.addEventListener('click', (e) => {
                // Only trigger if hero hasn't already transitioned
                if (!heroSection.classList.contains('transitioned') &&
                    !heroSection.dataset.chatAnimated) {
                    // Skip the chat animation sequence and go straight to hero content
                    heroSection.dataset.chatAnimated = 'true';
                    
                    // Show all messages immediately
                    const messages = chatView.querySelectorAll('.message, .delivered-status, .time-transition');
                    messages.forEach(msg => msg.classList.add('visible'));
                    
                    // Hide typing indicator
                    const typingIndicator = chatView.querySelector('.typing-indicator');
                    if (typingIndicator) {
                        typingIndicator.style.display = 'none';
                    }
                    
                    // Update time
                    const chatTime = chatView.querySelector('.chat-time');
                    if (chatTime) {
                        chatTime.textContent = '8:12 AM';
                    }
                    
                    // Trigger transition immediately
                    setTimeout(() => {
                        triggerHeroTransition();
                    }, 100);
                }
            });
        }
    }
    
    // Hide chat when scrolling down (only if not transitioned)
    function handleChatOnScroll() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection || heroSection.classList.contains('transitioned')) return;
        
        const chatView = heroSection.querySelector('.hero-chat-view');
        if (!chatView) return;
        
        const scrollY = window.scrollY;
        const scrollThreshold = 100; // Hide chat after scrolling 100px down
        
        if (scrollY > scrollThreshold) {
            // Hide chat view when user scrolls down
            if (!chatView.dataset.scrollHidden) {
                chatView.dataset.scrollHidden = 'true';
                chatView.style.opacity = '0';
                chatView.style.pointerEvents = 'none';
                chatView.style.transition = 'opacity 0.5s ease';
            }
        } else {
            // Show chat view when scrolling back to top
            if (chatView.dataset.scrollHidden) {
                delete chatView.dataset.scrollHidden;
                chatView.style.opacity = '1';
                chatView.style.pointerEvents = 'auto';
            }
        }
    }
    
    // Throttled scroll handler for navbar and parallax
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbar();
                parallaxScroll();
                handleScrollHint();
                handleChatOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Replay button functionality
    const replayBtn = document.querySelector('.chat-replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            replayChatSequence();
        });
    }
    
    // Initialize parallax elements
    parallaxElements = Array.from(document.querySelectorAll('.parallax'));
    
    // Detect mobile and disable parallax
    const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice) {
        isParallaxEnabled = false;
    }
    
    // Handle window resize with debouncing
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            
            isParallaxEnabled = !isMobile;
            if (isMobile) {
                parallaxElements.forEach(el => {
                    el.style.transform = '';
                });
            }
        }, 250);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Add click listener to phone mockup to restart animation
    const phoneMockup = document.querySelector('.phone-simple');
    if (phoneMockup) {
        phoneMockup.addEventListener('click', () => {
            triggerPhoneAnimation();
        });
    }
    
    // Add click listener to solution phone mockup to replay animation
    const phoneMockupSolution = document.querySelector('.phone-mockup-solution');
    if (phoneMockupSolution) {
        phoneMockupSolution.addEventListener('click', () => {
            const solutionSection = document.querySelector('#solution');
            if (solutionSection) {
                solutionSection.dataset.animated = 'false';
            }
            triggerSolutionPhoneAnimation();
        });
    }
    
    // Check for reduced motion preference
    if (prefersReducedMotion) {
        isParallaxEnabled = false;
        document.body.classList.add('reduced-motion');
    }
}); 