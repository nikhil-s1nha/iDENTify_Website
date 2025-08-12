// Particle System Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#3b82f6', '#8b5cf6', '#06b6d4']
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.3,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#3b82f6',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 4,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 0.3
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 6,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Voice Recognition System
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

// Voice Command Functions
function startVoiceRecognition() {
    if (recognition) {
        recognition.start();
        document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-microphone-slash"></i>';
        document.getElementById('voiceBtn').style.background = '#ff00ff';
    }
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
        document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-microphone"></i>';
        document.getElementById('voiceBtn').style.background = 'rgba(0, 255, 255, 0.1)';
    }
}

// Voice Command Event Listeners
if (recognition) {
    recognition.onstart = () => {
        console.log('Voice recognition started');
        showNotification('Listening...', 'info');
    };

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', command);
        
        if (command.includes('hey identify') || command.includes('hello identify')) {
            showNotification('Hello! How can I help you?', 'success');
            toggleChat();
        } else if (command.includes('go to problem') || command.includes('show problem')) {
            scrollToSection('problem');
        } else if (command.includes('go to solution') || command.includes('show solution')) {
            scrollToSection('solution');
        } else if (command.includes('go to demo') || command.includes('show demo')) {
            scrollToSection('demo');
        } else if (command.includes('go to contact') || command.includes('show contact')) {
            scrollToSection('contact');
        } else if (command.includes('download pitch') || command.includes('get pitch deck')) {
            downloadPitch();
        } else if (command.includes('launch demo') || command.includes('start demo')) {
            launchDemo();
        } else {
            showNotification(`Command not recognized: ${command}`, 'error');
        }
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        showNotification('Voice recognition error', 'error');
    };

    recognition.onend = () => {
        console.log('Voice recognition ended');
        document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-microphone"></i>';
        document.getElementById('voiceBtn').style.background = 'rgba(0, 255, 255, 0.1)';
    };
}

// Voice Button Event Listeners
document.getElementById('voiceBtn').addEventListener('click', () => {
    if (recognition && recognition.state === 'inactive') {
        startVoiceRecognition();
    } else {
        stopVoiceRecognition();
    }
});

// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.body;
    const icon = document.querySelector('#themeToggle i');
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        icon.className = 'fas fa-moon';
        showNotification('Dark theme activated', 'info');
    } else {
        body.classList.add('light-theme');
        icon.className = 'fas fa-sun';
        showNotification('Light theme activated', 'info');
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to Section Function
function scrollToSection(sectionId) {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Animate Numbers on Scroll
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateNumber(stat, 0, target);
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

function animateNumber(element, start, end) {
    const duration = 2000;
    const startTime = performance.now();
    
    const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutQuart(progress);
        
        if (element.textContent.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (element.textContent.includes('s')) {
            element.textContent = Math.floor(current) + 's';
        } else if (element.textContent.includes('B')) {
            element.textContent = Math.floor(current) + 'B';
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    };
    
    requestAnimationFrame(updateNumber);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Glitch Effect
function addGlitchEffect() {
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px ${Math.random() * 20}px #00ffff,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px ${Math.random() * 20}px #ff00ff
            `;
        }, 100);
    }
}

// Hologram Effects
function addHologramEffects() {
    const holoRings = document.querySelectorAll('.holo-ring');
    holoRings.forEach((ring, index) => {
        ring.style.animationDelay = `${index * 0.5}s`;
    });
}

// Demo Functions
function launchDemo() {
    showNotification('Launching demo...', 'info');
    setTimeout(() => {
        scrollToSection('demo');
        showNotification('Demo section loaded!', 'success');
    }, 1000);
}

function simulateScan() {
    const scanBtn = document.querySelector('.scan-btn');
    const resultCard = document.getElementById('resultCard');
    
    // Disable button and show scanning
    scanBtn.disabled = true;
    scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
    
    // Simulate scanning process
    setTimeout(() => {
        // Show results
        resultCard.innerHTML = `
            <h3>Scan Results</h3>
            <div class="result-content">
                <div style="text-align: center; margin-bottom: 1rem;">
                    <i class="fas fa-tooth" style="font-size: 3rem; color: #00ff00;"></i>
                </div>
                <h4 style="color: #00ff00; margin-bottom: 0.5rem;">Healthy Teeth Detected</h4>
                <p style="color: #ccc; margin-bottom: 1rem;">No cavities or gingivitis found</p>
                <div style="background: rgba(0, 255, 0, 0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(0, 255, 0, 0.3);">
                    <strong>Confidence:</strong> 99.2%<br>
                    <strong>Scan Time:</strong> 1.8 seconds<br>
                    <strong>Recommendation:</strong> Continue current oral hygiene routine
                </div>
            </div>
        `;
        
        // Re-enable button
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<i class="fas fa-camera"></i> Scan Again';
        
        showNotification('Scan completed successfully!', 'success');
    }, 3000);
}

// AI Chat Functions
function toggleChat() {
    const chat = document.getElementById('aiChat');
    if (chat.style.display === 'none' || chat.style.display === '') {
        chat.style.display = 'flex';
        chat.style.animation = 'slideInUp 0.3s ease';
    } else {
        chat.style.display = 'none';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage('user', message);
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessage('ai', response);
        }, 1000);
    }
}

function addMessage(type, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatar = type === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${content}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'Hello! I\'m your iDENTify AI assistant. How can I help you today?';
    } else if (lowerMessage.includes('cavity') || lowerMessage.includes('cavities')) {
        return 'Our AI can detect cavities with 99.2% accuracy using just an iPhone photo with the Invisalign smile lens. Early detection prevents expensive dental procedures!';
    } else if (lowerMessage.includes('gingivitis')) {
        return 'Gingivitis detection is one of our core features. We can spot early signs before they become visible to the naked eye, helping prevent periodontitis.';
    } else if (lowerMessage.includes('accuracy') || lowerMessage.includes('precise')) {
        return 'Our AI model has been trained on millions of dental images and achieves 99.2% accuracy in disease detection. It\'s FDA-cleared and HIPAA compliant.';
    } else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
        return 'The consumer app is $9.99/month, dental practices pay $299/month, and we offer enterprise API access starting at $0.50 per scan.';
    } else if (lowerMessage.includes('market') || lowerMessage.includes('size')) {
        return 'The global dental market is $150 billion, with our target segments including consumer ($45B), dental practices ($65B), insurance ($25B), and pharmaceutical ($15B).';
    } else if (lowerMessage.includes('team') || lowerMessage.includes('founder')) {
        return 'Our team includes dental professionals, AI/ML experts from Google, and healthcare product leaders. We have advisors from Stanford and top-tier VCs.';
    } else {
        return 'That\'s an interesting question! Our AI-powered dental monitoring technology can detect oral diseases early, prevent emergencies, and save money. Would you like to know more about a specific aspect?';
    }
}

// Download Functions
function downloadPitch() {
    showNotification('Downloading pitch deck...', 'info');
    // Simulate download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'resources/iDENTify_Pitch.pdf';
        link.download = 'iDENTify_Pitch_Deck.pdf';
        link.click();
        showNotification('Pitch deck downloaded!', 'success');
    }, 1500);
}

// Version Switcher
function switchVersion(version) {
    if (version === 'classic') {
        window.location.href = 'versions/classic.html';
    } else if (version === 'crazy') {
        window.location.href = 'index.html';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const colors = {
        success: '#00ff00',
        error: '#ff0000',
        info: '#00ffff'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-weight: 600;
        border: 2px solid #000;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax Effects
function addParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hologram-effects, .energy-waves');
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Interactive Elements
function addInteractiveEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.problem-card, .feature-highlight, .benefit');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn, .scan-btn, .submit-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                scrollToSection('hero');
                break;
            case '2':
                e.preventDefault();
                scrollToSection('problem');
                break;
            case '3':
                e.preventDefault();
                scrollToSection('solution');
                break;
            case '4':
                e.preventDefault();
                scrollToSection('demo');
                break;
            case '5':
                e.preventDefault();
                scrollToSection('contact');
                break;
            case 'd':
                e.preventDefault();
                downloadPitch();
                break;
            case 'c':
                e.preventDefault();
                toggleChat();
                break;
        }
    }
    
    // Space bar to pause/resume animations
    if (e.code === 'Space') {
        e.preventDefault();
        const body = document.body;
        if (body.style.animationPlayState === 'paused') {
            body.style.animationPlayState = 'running';
            showNotification('Animations resumed', 'info');
        } else {
            body.style.animationPlayState = 'paused';
            showNotification('Animations paused', 'info');
        }
    }
    
    // Escape key to close chat
    if (e.key === 'Escape') {
        const chat = document.getElementById('aiChat');
        if (chat.style.display === 'flex') {
            toggleChat();
        }
    }
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showNotification('Message sent successfully!', 'success');
        e.target.reset();
    }, 2000);
});

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 iDENTify Crazy Version Loaded!');
    
    // Initialize all features
    animateNumbers();
    addGlitchEffect();
    addHologramEffects();
    addParallaxEffects();
    addInteractiveEffects();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to iDENTify! Say "Hey iDENTify" to activate voice commands', 'info');
    }, 2000);
    
    // Add some random fun effects
    setInterval(() => {
        const randomElements = document.querySelectorAll('.problem-card, .feature-highlight');
        const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
        if (randomElement) {
            randomElement.style.transform = 'scale(1.02)';
            setTimeout(() => {
                randomElement.style.transform = 'scale(1)';
            }, 200);
        }
    }, 5000);
});

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 KONAMI CODE ACTIVATED! You found the secret!', 'success');
        
        // Add some crazy effects
        document.body.style.animation = 'rainbow 2s infinite';
        document.querySelectorAll('.btn').forEach(btn => {
            btn.style.animation = 'bounce 0.5s infinite';
        });
        
        // Reset after 5 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            document.querySelectorAll('.btn').forEach(btn => {
                btn.style.animation = '';
            });
        }, 5000);
        
        konamiCode = [];
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 