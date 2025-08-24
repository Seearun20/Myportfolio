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

// Scroll progress indicator
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        nav.style.background = 'rgba(15, 23, 42, 0.9)';
    }
});

// EmailJS form submission
document.querySelector('#contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    emailjs.sendForm('service_ilay5q8', 'template_f03f7mm', this)
        .then(() => {
            alert('Message sent successfully!');
            this.reset();
        }, (error) => {
            console.error('EmailJS Error:', error);
            alert('Failed to send message. Please try again.');
        });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// Skill bars animation
// ...existing code...
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width') || bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 300);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.skills-grid').forEach(section => {
    // Set data-width attribute for animation
    section.querySelectorAll('.skill-progress').forEach(bar => {
        bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0%';
    });
    skillObserver.observe(section);
});

// Mobile menu toggle
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.innerHTML = '☰';
mobileMenuBtn.style.cssText = `
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
`;

// Add mobile menu button
document.querySelector('.nav-container').appendChild(mobileMenuBtn);

// Mobile responsive menu
const mediaQuery = window.matchMedia('(max-width: 768px)');

function handleMobileMenu(e) {
    if (e.matches) {
        mobileMenuBtn.style.display = 'block';
        document.querySelector('.nav-links').style.display = 'none';
    } else {
        mobileMenuBtn.style.display = 'none';
        document.querySelector('.nav-links').style.display = 'flex';
    }
}

mediaQuery.addListener(handleMobileMenu);
handleMobileMenu(mediaQuery);

// Particle effect on mouse move
document.addEventListener('mousemove', (e) => {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        width: 4px;
        height: 4px;
        background: rgba(99, 102, 241, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particleFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
});

// Add particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        typeWriter(heroTitle, 'ArunKumar', 150);
    }, 500);
});

// ========================
// CODING PLATFORMS API FUNCTIONS
// ========================

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('last-updated').textContent = `Last updated: ${timeString}`;
}

// Show loading state
function showLoading(platform) {
    const countElement = document.getElementById(`${platform}-count`);
    countElement.textContent = '...';
    countElement.style.color = '#6366f1';
}

// Show error state
function showError(platform, message = 'Error') {
    const countElement = document.getElementById(`${platform}-count`);
    countElement.textContent = message;
    countElement.style.color = '#ef4444';
}

// Show success state
function showSuccess(platform, count) {
    const countElement = document.getElementById(`${platform}-count`);
    countElement.textContent = count;
    countElement.style.color = '#10b981';
}

// Fetch Codeforces data
async function fetchCodeforces() {
    const username = 'seearun';
    showLoading('codeforces');
    
    try {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'OK') {
            throw new Error(data.comment || 'API Error');
        }
        
        // Count unique solved problems
        const solvedProblems = new Set();
        data.result.forEach(submission => {
            if (submission.verdict === 'OK') {
                const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
                solvedProblems.add(problemId);
            }
        });
        
        showSuccess('codeforces', solvedProblems.size);
        updateLastUpdated();
        
    } catch (error) {
        console.error('Codeforces fetch error:', error);
        showError('codeforces', 'Failed');
    }
}

// Fetch LeetCode data using GraphQL API
async function fetchLeetCode() {
    const username = 'arun20004';
    showLoading('leetcode');
    
    try {
        // LeetCode GraphQL endpoint
        const query = `
            query userProblemsSolved($username: String!) {
                allQuestionsCount {
                    difficulty
                    count
                }
                matchedUser(username: $username) {
                    problemsSolvedBeatsStats {
                        difficulty
                        percentage
                    }
                    submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
            }
        `;
        
        const response = await fetch('https://leetcode.com/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            },
            body: JSON.stringify({
                query: query,
                variables: { username: username }
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }
        
        if (!data.data.matchedUser) {
            throw new Error('User not found');
        }
        
        const totalSolved = data.data.matchedUser.submitStatsGlobal.acSubmissionNum
            .reduce((total, item) => total + item.count, 0);
        
        showSuccess('leetcode', totalSolved);
        updateLastUpdated();
        
    } catch (error) {
        console.error('LeetCode fetch error:', error);
        // Fallback: try alternative method or show error
        try {
            // Alternative: scrape public profile (this might not work due to CORS)
            const fallbackResponse = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
            const fallbackData = await fallbackResponse.json();
            
            if (fallbackData.totalSolved !== undefined) {
                showSuccess('leetcode', fallbackData.totalSolved);
                updateLastUpdated();
            } else {
                throw new Error('No data available');
            }
        } catch (fallbackError) {
            console.error('LeetCode fallback error:', fallbackError);
            showError('leetcode', 'Failed');
        }
    }
}

// Fetch CodeChef data
async function fetchCodeChef() {
    const username = 'seearuncf'; // Replace with actual username
    showLoading('codechef');
    
    try {
        // CodeChef doesn't have a public API, so we'll use a third-party service or scraping
        // This is a placeholder - you might need to implement server-side scraping
        
        // Option 1: Use a third-party API service (if available)
        const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('codechef', data.totalSolved || 0);
            updateLastUpdated();
        } else {
            throw new Error('API returned error');
        }
        
    } catch (error) {
        console.error('CodeChef fetch error:', error);
        // Since CodeChef doesn't have official API, show a placeholder
        showError('codechef', 'N/A');
    }
}

// Auto-fetch data when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add small delay to ensure page is fully loaded
    setTimeout(() => {
        fetchCodeforces();
        fetchLeetCode();
        fetchCodeChef(); // Uncomment when you have the username
    }, 1000);
});

// Refresh all stats function
function refreshAllStats() {
    fetchCodeforces();
    fetchLeetCode();
    fetchCodeChef();
}

// Add keyboard shortcut to refresh stats (Ctrl+R or Cmd+R)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        refreshAllStats();
    }
});

// Periodic auto-refresh (every 5 minutes)
setInterval(() => {
    refreshAllStats();
}, 5 * 60 * 1000);

// Add visual feedback for refresh buttons
document.querySelectorAll('.refresh-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'rotate(360deg)';
        this.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 500);
    });
});

// Add error retry mechanism
function setupRetryMechanism() {
    const retryButtons = document.querySelectorAll('.refresh-btn');
    
    retryButtons.forEach(btn => {
        btn.addEventListener('dblclick', function() {
            const platform = this.closest('.stat-card').dataset.platform;
            console.log(`Force retry for ${platform}`);
            
            // Clear any existing error state
            const countElement = document.getElementById(`${platform}-count`);
            countElement.style.color = '';
            
            // Retry the fetch
            switch(platform) {
                case 'codeforces':
                    fetchCodeforces();
                    break;
                case 'leetcode':
                    fetchLeetCode();
                    break;
                case 'codechef':
                    fetchCodeChef();
                    break;
            }
        });
    });
}

 function openStatsPopup() {
            document.getElementById('statsPopup').classList.add('active');
            document.body.style.overflow = 'hidden';
            // Auto-fetch data when popup opens
            setTimeout(() => {
                fetchCodeforces();
                fetchLeetCode();
                fetchCodeChef();
            }, 300);
        }

        function closeStatsPopup() {
            document.getElementById('statsPopup').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Close popup when clicking outside
        document.getElementById('statsPopup').addEventListener('click', function(e) {
            if (e.target === this) {
                closeStatsPopup();
            }
        });

        // Close popup with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeStatsPopup();
            }
        });

// ...existing code...

function openResumePopup() {
    const fileId = '1QHwJBF75hg1-VNUq_gxg4pK1UaVX1exe';
    // Check if popup already exists
    if (document.getElementById('resumePopup')) {
        document.getElementById('resumePopup').classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }

    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.id = 'resumePopup';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(15,23,42,0.85)';
    overlay.style.zIndex = '99999';

    // Create popup content
    const content = document.createElement('div');
    content.className = 'popup-content';
    content.style.background = '#181e2a';
    content.style.padding = '0';
    content.style.borderRadius = '12px';
    content.style.width = '90vw';
    content.style.height = '90vh';
    content.style.maxWidth = '100vw';
    content.style.maxHeight = '100vh';
    content.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
    content.style.position = 'relative';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.alignItems = 'stretch';
    content.style.overflow = 'hidden';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '50px';
    closeBtn.style.fontSize = '2rem';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#fff';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '2';
    closeBtn.onclick = closeResumePopup;

    // Download button
   const downloadBtn = document.createElement('a');
    downloadBtn.href = `https://drive.google.com/uc?export=download&id=${fileId}`;
    downloadBtn.download = 'ArunKumar_Resume.pdf';
    downloadBtn.textContent = '⬇️ Download Resume';
    downloadBtn.className = 'btn btn-primary';
    downloadBtn.style.position = 'absolute';
    downloadBtn.style.top = '10px';
    downloadBtn.style.left = '20px';
    downloadBtn.style.zIndex = '2';
    downloadBtn.style.background = '#6366f1';
    downloadBtn.style.color = '#fff';
    downloadBtn.style.padding = '0.5rem 1rem';
    downloadBtn.style.borderRadius = '6px';
    downloadBtn.style.textDecoration = 'none';
    downloadBtn.style.fontWeight = 'bold';
    downloadBtn.style.fontSize = '1rem';

    const iframe = document.createElement('iframe');
    iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = '#fff';
    iframe.style.borderRadius = '0';

    // Append elements
    content.appendChild(closeBtn);
    content.appendChild(downloadBtn);
    content.appendChild(iframe);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeResumePopup();
    });

    // Close on Escape key
    document.addEventListener('keydown', escResumeHandler);

    // Add active class for possible CSS transitions
    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeResumePopup() {
    const popup = document.getElementById('resumePopup');
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 200);
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', escResumeHandler);
    }
}

function escResumeHandler(e) {
    if (e.key === 'Escape') closeResumePopup();
}

// ...existing code...
setupRetryMechanism();


// ...existing code...

// Water ripple effect across the whole screen
// Water ripple effect across the whole screen
(function() {
    const canvas = document.getElementById('water-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let ripples = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function addRipple(x, y) {
        ripples.push({
            x, y,
            radius: 0,
            max: Math.random() * 120 + 180, // Even broader ripples
            alpha: 0.18, // Lower alpha for realism
            speed: Math.random() * 0.25 + 0.18 // Much slower speed
        });
    }

    let lastMove = 0;
    document.addEventListener('mousemove', e => {
        // Only add ripple if mouse moved enough pixels or enough time passed
        if (Date.now() - lastMove > 18) {
            addRipple(e.clientX, e.clientY);
            lastMove = Date.now();
        }
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(99,102,241,${r.alpha})`;
            ctx.lineWidth = 2 + r.radius * 0.025; // Thinner lines for realism
            ctx.stroke();
            r.radius += r.speed;
            r.alpha *= 0.985; // Fade slower
            if (r.radius > r.max || r.alpha < 0.02) {
                ripples.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();
function openProject(element) {
    const link = element.getAttribute('data-link');
    if (link) {
        // Add click animation
        element.style.transform = 'translateY(-5px) scale(0.95)';
        
        setTimeout(() => {
            window.open(link, '_blank');
            element.style.transform = '';
        }, 150);
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('project-card')) {
            e.preventDefault();
            openProject(focusedElement);
        }
    }
});

// Make project cards focusable for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open project: ${card.querySelector('h3').textContent}`);
    });
});


