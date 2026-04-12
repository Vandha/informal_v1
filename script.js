/**
 * Academic Journal - Interactive JavaScript with Content Switching
 * Handles user interactions, content switching, and dynamic functionality
 */

// ============================================
// CONTENT SWITCHING FUNCTIONALITY
// ============================================

/**
 * Switch content sections based on menu selection
 * @param {string} contentId - ID of content section to display
 * @param {Event} event - Click event
 */
function switchContent(contentId, event) {
    if (event) {
        event.preventDefault();
    }

    // Hide all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected content section
    const selectedSection = document.getElementById(contentId + '-section');
    if (selectedSection) {
        selectedSection.classList.add('active');
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav link
    updateActiveNavLink(contentId);
}

/**
 * Update active navigation link
 * @param {string} contentId - Content ID
 */
function updateActiveNavLink(contentId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Find and activate the matching nav link
    const navLink = document.querySelector(`[onclick*="switchContent('${contentId}'"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
}

/**
 * Toggle dropdown menu
 * @param {Event} event - Click event
 */
function toggleDropdown(event) {
    event.preventDefault();
    const dropdown = event.target.closest('.dropdown');
    if (dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            const isVisible = menu.style.visibility === 'visible';
            menu.style.visibility = isVisible ? 'hidden' : 'visible';
            menu.style.opacity = isVisible ? '0' : '1';
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Show toast notification
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// AUTHENTICATION HANDLERS
// ============================================

/**
 * Handle authentication actions (login/register)
 * @param {string} action - 'login' or 'register'
 */
function handleAuth(action) {
    if (action === 'login') {
        showToast('Redirecting to login page...', 'info');
        setTimeout(() => {
            console.log('Login page would load here');
        }, 500);
    } else if (action === 'register') {
        showToast('Redirecting to registration page...', 'info');
        setTimeout(() => {
            console.log('Registration page would load here');
        }, 500);
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

/**
 * Handle search functionality
 */
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
        showToast('Please enter a search query', 'warning');
        return;
    }
    
    if (query.length < 3) {
        showToast('Search query must be at least 3 characters', 'warning');
        return;
    }
    
    showToast(`Searching for: "${query}"`, 'info');
    console.log('Search query:', query);
    
    setTimeout(() => {
        showToast(`Found results for: "${query}"`, 'success');
    }, 1000);
}

/**
 * Handle search input with debouncing
 */
const debouncedSearch = debounce(function() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query.length >= 3) {
        console.log('Performing live search for:', query);
    }
}, 500);

// Add event listener to search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});

// ============================================
// ARTICLE INTERACTIONS
// ============================================

/**
 * View article
 * @param {string} articleId - Article identifier
 * @param {Event} event - Click event
 */
function viewArticle(articleId, event) {
    if (event) {
        event.preventDefault();
    }
    showToast(`Opening article ${articleId}...`, 'info');
    setTimeout(() => {
        showToast('Article loaded successfully', 'success');
    }, 1000);
}

/**
 * Download PDF
 * @param {string} articleId - Article identifier
 * @param {Event} event - Click event
 */
function downloadPDF(articleId, event) {
    if (event) {
        event.preventDefault();
    }
    showToast(`Downloading PDF for article ${articleId}...`, 'info');
    setTimeout(() => {
        showToast('PDF downloaded successfully', 'success');
    }, 1500);
}

/**
 * Add click handlers to article cards
 */
function initializeArticleCards() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ============================================
// SUBMISSION HANDLING
// ============================================

/**
 * Handle submission button click
 */
function handleSubmission() {
    showToast('Redirecting to submission form...', 'info');
    console.log('Submission form would load here');
    
    setTimeout(() => {
        showToast('Submission form is ready', 'success');
    }, 1000);
}

// ============================================
// VIEW ALL ISSUES
// ============================================

/**
 * Handle view all issues button
 */
function handleViewAllIssues() {
    showToast('Loading all issues...', 'info');
    console.log('All issues page would load here');
    
    setTimeout(() => {
        showToast('Archives page loaded', 'success');
        switchContent('archives', null);
    }, 1000);
}

// ============================================
// NAVIGATION INTERACTIONS
// ============================================

/**
 * Initialize navigation links
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.classList.contains('dropdown-toggle')) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                menu.style.opacity = menu.style.opacity === '0' ? '1' : '0';
                menu.style.visibility = menu.style.visibility === 'hidden' ? 'visible' : 'hidden';
            });
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                }
            });
        }
    });
}

/**
 * Initialize sidebar links
 */
function initializeSidebarLinks() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = link.textContent.trim();
            showToast(`Loading: ${text}`, 'info');
            console.log('Sidebar link clicked:', text);
        });
    });
}

/**
 * Initialize footer links
 */
function initializeFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-section a');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.onclick && link.onclick.toString().includes('switchContent')) {
                return;
            }
            e.preventDefault();
            const text = link.textContent.trim();
            showToast(`Loading: ${text}`, 'info');
            console.log('Footer link clicked:', text);
        });
    });
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

/**
 * Initialize smooth scroll for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                smoothScroll(href.substring(1));
            }
        });
    });
}

// ============================================
// RESPONSIVE BEHAVIOR
// ============================================

/**
 * Handle responsive navigation
 */
function handleResponsiveNavigation() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log('Mobile view detected');
    } else {
        console.log('Desktop view detected');
    }
}

/**
 * Listen for window resize
 */
window.addEventListener('resize', () => {
    handleResponsiveNavigation();
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close dropdowns
        if (e.key === 'Escape') {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
        }
    });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

/**
 * Log page performance metrics
 */
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all interactive elements when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Academic Journal interface...');
    
    // Initialize all components
    initializeArticleCards();
    initializeNavigation();
    initializeDropdowns();
    initializeSidebarLinks();
    initializeFooterLinks();
    initializeSmoothScroll();
    initializeKeyboardNavigation();
    handleResponsiveNavigation();
    
    // Log performance
    logPerformanceMetrics();
    
    // Show welcome message
    console.log('Academic Journal interface ready!');
    showToast('Welcome to Academic Journal', 'success', 2000);
    
    // Set home as default active section
    const homeSection = document.getElementById('home-section');
    if (homeSection) {
        homeSection.classList.add('active');
    }
});

// ============================================
// UTILITY: ARTICLE STATISTICS
// ============================================

/**
 * Update article statistics (for demonstration)
 */
function updateArticleStats() {
    const articles = document.querySelectorAll('.article-card');
    articles.forEach((article, index) => {
        const stats = article.querySelector('.stats');
        if (stats) {
            const views = Math.floor(Math.random() * 100) + 20;
            const downloads = Math.floor(Math.random() * 80) + 10;
            stats.textContent = `Abstract views: ${views} | PDF downloads: ${downloads}`;
        }
    });
}

// ============================================
// UTILITY: THEME SWITCHING (Future Enhancement)
// ============================================

/**
 * Toggle theme (light/dark mode)
 */
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    showToast(`Theme switched to ${newTheme} mode`, 'info');
    console.log('Theme switched to:', newTheme);
}

// ============================================
// UTILITY: PRINT FUNCTIONALITY
// ============================================

/**
 * Print article or page
 */
function printContent() {
    window.print();
    showToast('Print dialog opened', 'info');
}

// ============================================
// UTILITY: SHARE FUNCTIONALITY
// ============================================

/**
 * Share article
 * @param {string} platform - Social media platform
 * @param {string} articleTitle - Article title
 */
function shareArticle(platform, articleTitle) {
    const url = window.location.href;
    const text = `Check out this article: ${articleTitle}`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        default:
            showToast('Platform not supported', 'warning');
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    showToast(`Sharing on ${platform}...`, 'info');
}

// ============================================
// EXPORT: Make functions globally available
// ============================================

// These functions are already globally available through direct function calls
// This comment serves as documentation of the public API
