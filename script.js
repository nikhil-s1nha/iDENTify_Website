// Simple, clean JavaScript for iDENTify website

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

// Animate numbers on scroll
function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-number');
    
    numberElements.forEach(element => {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Handle decimal numbers properly
            if (target % 1 !== 0) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Launch demo function
function launchDemo() {
    // Scroll to demo section
    const demoSection = document.querySelector('#demo');
    if (demoSection) {
        demoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Simulate scan function
function simulateScan() {
    const scanButton = document.querySelector('.scan-button');
    const scanText = document.querySelector('.scan-text');
    
    // Show scanning state
    scanButton.textContent = 'Scanning...';
    scanButton.disabled = true;
    scanText.textContent = 'Analyzing...';
    
    // Simulate scan process
    setTimeout(() => {
        scanButton.textContent = 'Scan Complete!';
        scanText.textContent = 'Results: Healthy teeth detected';
        
        // Reset after 3 seconds
        setTimeout(() => {
            scanButton.textContent = 'Scan';
            scanButton.disabled = false;
            scanText.textContent = 'Ready to Scan';
        }, 3000);
    }, 2000);
}

// Interactive Demo Functions
let isScanning = false;
let scanProgress = 0;

function startScan() {
    if (isScanning) return;
    
    isScanning = true;
    const scanBtn = document.querySelector('.scan-btn');
    const status = document.querySelector('.status');
    const resultsContent = document.getElementById('resultsContent');
    
    // Update UI for scanning
    scanBtn.disabled = true;
    scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
    status.textContent = 'Scanning...';
    status.style.color = '#f59e0b';
    
    // Clear previous results
    resultsContent.innerHTML = '<div class="scan-result"><p>Scanning in progress...</p></div>';
    
    // Simulate scanning process
    const scanInterval = setInterval(() => {
        scanProgress += Math.random() * 15;
        
        if (scanProgress >= 100) {
            scanProgress = 100;
            clearInterval(scanInterval);
            completeScan();
        }
        
        // Update progress
        resultsContent.innerHTML = `
            <div class="scan-result">
                <p>Scanning: ${Math.floor(scanProgress)}%</p>
                <div style="background: #e5e7eb; height: 4px; border-radius: 2px; margin: 10px 0;">
                    <div style="background: #3b82f6; height: 100%; width: ${scanProgress}%; border-radius: 2px; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
    }, 100);
}

function completeScan() {
    const scanBtn = document.querySelector('.scan-btn');
    const status = document.querySelector('.status');
    const resultsContent = document.getElementById('resultsContent');
    
    // Generate realistic scan results
    const results = generateScanResults();
    
    // Update UI
    scanBtn.disabled = false;
    scanBtn.innerHTML = '<i class="fas fa-camera"></i> Scan Again';
    status.textContent = 'Complete';
    status.style.color = '#10b981';
    
    // Display results
    resultsContent.innerHTML = results;
    
    // Reset
    isScanning = false;
    scanProgress = 0;
}

function generateScanResults() {
    // Simulate different dental health scenarios
    const scenarios = [
        {
            name: 'Excellent',
            color: 'healthy',
            message: 'Your dental health is excellent! Continue your current oral hygiene routine.',
            results: {
                'Overall Health': 'Excellent',
                'Cavities Detected': '0',
                'Gingivitis Risk': 'Low',
                'Enamel Health': 'Strong',
                'Scan Confidence': '99.2%'
            }
        },
        {
            name: 'Good',
            color: 'healthy',
            message: 'Good dental health with minor areas for improvement.',
            results: {
                'Overall Health': 'Good',
                'Cavities Detected': '0',
                'Gingivitis Risk': 'Low',
                'Enamel Health': 'Good',
                'Scan Confidence': '97.8%'
            }
        },
        {
            name: 'Attention Needed',
            color: 'warning',
            message: 'Some areas need attention. Consider scheduling a dental checkup.',
            results: {
                'Overall Health': 'Fair',
                'Cavities Detected': '1-2',
                'Gingivitis Risk': 'Moderate',
                'Enamel Health': 'Good',
                'Scan Confidence': '95.1%'
            }
        }
    ];
    
    // Randomly select a scenario
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    let resultsHTML = `
        <div class="scan-result">
            <div class="health-status ${scenario.color}">
                <strong>${scenario.name}</strong><br>
                ${scenario.message}
            </div>
            <div style="margin-top: 1rem;">
    `;
    
    // Add result items
    Object.entries(scenario.results).forEach(([label, value]) => {
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">${label}</span>
                <span class="result-value">${value}</span>
            </div>
        `;
    });
    
    resultsHTML += '</div></div>';
    
    return resultsHTML;
}

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const company = formData.get('company');
            const interest = formData.get('interest');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !interest || !message) {
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
                console.log('Form submitted:', { name, email, company, interest, message });
            }, 2000);
        });
    }
    
    // Animate numbers when page loads
    animateNumbers();
});

// Simple scroll effect for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = 'none';
    }
});

// Add subtle animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for subtle animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}); 