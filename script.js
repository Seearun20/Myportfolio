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
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.skills-grid').forEach(section => {
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

// Initialize retry mechanism
setupRetryMechanism();