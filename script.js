/**
 * Academic Journal - Interactive JavaScript with Authentication & PDF Features
 * Handles user interactions, content switching, authentication, and PDF generation
 */

// ============================================
// GLOBAL STATE & STORAGE
// ============================================

// Dummy user database
const dummyUsers = [
    { email: 'demo@journal.com', password: 'demo123', name: 'Demo User' },
    { email: 'author@journal.com', password: 'author123', name: 'John Author' },
    { email: 'reviewer@journal.com', password: 'reviewer123', name: 'Jane Reviewer' }
];

// Current logged-in user
let currentUser = null;

// Current PDF being viewed
let currentPDFData = null;

// ============================================
// MODAL MANAGEMENT
// ============================================

/**
 * Open a modal
 * @param {string} modalId - ID of modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close a modal
 * @param {string} modalId - ID of modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Switch between modals
 * @param {string} closeModalId - Modal to close
 * @param {string} openModalId - Modal to open
 * @param {Event} event - Click event
 */
function switchModal(closeModalId, openModalId, event) {
    if (event) {
        event.preventDefault();
    }
    closeModal(closeModalId);
    openModal(openModalId);
}

/**
 * Close modal when clicking outside content
 */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        const modal = e.target;
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// ============================================
// AUTHENTICATION HANDLERS
// ============================================

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate inputs
    if (!email || !password) {
        showToast('Please fill in all fields', 'warning');
        return;
    }
    
    // Find user in dummy database
    const user = dummyUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { email: user.email, name: user.name };
        
        // Store in localStorage if remember me is checked
        if (rememberMe) {
            localStorage.setItem('journalUser', JSON.stringify(currentUser));
        }
        
        showToast(`Welcome, ${user.name}!`, 'success');
        closeModal('loginModal');
        updateAuthUI();
        
        // Clear form
        document.getElementById('loginForm').reset();
    } else {
        showToast('Invalid email or password', 'error');
    }
}

/**
 * Handle register form submission
 * @param {Event} event - Form submit event
 */
function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'warning');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'warning');
        return;
    }
    
    if (!agreeTerms) {
        showToast('You must agree to the terms and conditions', 'warning');
        return;
    }
    
    // Check if email already exists
    if (dummyUsers.some(u => u.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }
    
    // Add new user to dummy database
    dummyUsers.push({ email, password, name });
    
    // Auto-login the new user
    currentUser = { email, name };
    localStorage.setItem('journalUser', JSON.stringify(currentUser));
    
    showToast(`Account created successfully! Welcome, ${name}!`, 'success');
    closeModal('registerModal');
    updateAuthUI();
    
    // Clear form
    document.getElementById('registerForm').reset();
}

/**
 * Handle logout
 */
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('journalUser');
    showToast('You have been logged out', 'info');
    updateAuthUI();
}

/**
 * Update authentication UI based on login state
 */
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (!authButtons) return;
    
    if (currentUser) {
        authButtons.innerHTML = `
            <span class="user-info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${currentUser.name}
            </span>
            <button class="btn btn-outline" onclick="handleLogout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline" onclick="openModal('registerModal')">Register</button>
            <button class="btn btn-primary" onclick="openModal('loginModal')">Login</button>
        `;
    }
}

/**
 * Check for saved user on page load
 */
function checkSavedUser() {
    const saved = localStorage.getItem('journalUser');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            updateAuthUI();
        } catch (e) {
            console.error('Error loading saved user:', e);
        }
    }
}

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
        dropdown.classList.toggle('show');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.opacity = '';
            menu.style.visibility = '';
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
// PDF GENERATION & PREVIEW
// ============================================

/**
 * Generate dummy PDF content
 * @param {string} articleId - Article ID
 * @param {string} articleTitle - Article title
 * @returns {string} Base64 encoded PDF
 */
function generateDummyPDF(articleId, articleTitle) {
    // Create a simple HTML content for PDF
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                h2 { color: #1f2937; margin-top: 30px; }
                .metadata { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .metadata p { margin: 5px 0; }
                p { text-align: justify; }
                .footer { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <h1>${articleTitle}</h1>
            
            <div class="metadata">
                <p><strong>Article ID:</strong> ${articleId}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Journal:</strong> Academic Journal - Informatics</p>
                <p><strong>e-ISSN:</strong> 2503-251X</p>
            </div>

            <h2>Abstract</h2>
            <p>This is a dummy PDF preview of the article "${articleTitle}". In a real system, this would contain the full peer-reviewed research article with all sections including introduction, methodology, results, discussion, and references. The PDF is generated dynamically for demonstration purposes.</p>

            <h2>Introduction</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <h2>Methodology</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <h2>Results</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

            <h2>Discussion</h2>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>

            <h2>Conclusion</h2>
            <p>Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>

            <div class="footer">
                <p>This is a demonstration PDF. For the complete article, please visit the journal website.</p>
                <p>&copy; 2026 Academic Journal. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;

    return htmlContent;
}

/**
 * Preview article PDF
 * @param {string} articleId - Article ID
 * @param {string} titleString - Article title passed from HTML
 * @param {Event} event - Click event
 */
function viewArticle(articleId, titleString, event) {
    // If it's called with only two arguments (old compatibility)
    if (event === undefined && titleString && typeof titleString.preventDefault === 'function') {
        event = titleString;
        titleString = null;
    }

    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    // Get article title from the argument or fallback to DOM
    let articleTitle = titleString;
    if (!articleTitle) {
        const articleCard = document.querySelector(`[onclick*="viewArticle('${articleId}'"]`)?.closest('.article-card');
        articleTitle = articleCard?.querySelector('.article-title')?.textContent || 'Article';
    }

    showToast('Loading article preview...', 'info');

    setTimeout(() => {
        // Generate dummy PDF HTML
        const pdfHTML = generateDummyPDF(articleId, articleTitle);
        
        // Store current PDF data
        currentPDFData = {
            id: articleId,
            title: articleTitle,
            html: pdfHTML
        };

        // Update modal title
        document.getElementById('pdfTitle').textContent = articleTitle;

        // Create a blob and object URL for the PDF
        const blob = new Blob([pdfHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Set iframe source
        document.getElementById('pdfViewer').src = url;

        // Open PDF modal
        openModal('pdfModal');
        showToast('Article preview loaded', 'success');
    }, 1000);
}

/**
 * Download PDF file
 * @param {string} articleId - Article ID
 * @param {string} titleString - Article title passed from HTML 
 * @param {Event} event - Click event
 */
function downloadPDF(articleId, titleString, event) {
    // Handling fallback if only 2 args are passed
    if (event === undefined && titleString && typeof titleString.preventDefault === 'function') {
        event = titleString;
        titleString = null;
    }

    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    // Get article title
    let articleTitle = titleString;
    if (!articleTitle) {
        const articleCard = document.querySelector(`[onclick*="downloadPDF('${articleId}'"]`)?.closest('.article-card');
        articleTitle = articleCard?.querySelector('.article-title')?.textContent || 'Article';
    }

    showToast('Preparing PDF download...', 'info');

    setTimeout(() => {
        // Generate PDF HTML
        const pdfHTML = generateDummyPDF(articleId, articleTitle);

        // Create blob and download
        const blob = new Blob([pdfHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${articleId}-${articleTitle.replace(/\s+/g, '-').toLowerCase()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('PDF downloaded successfully', 'success');
    }, 1500);
}

/**
 * Download PDF from preview modal
 */
function downloadPDFFile() {
    if (!currentPDFData) {
        showToast('No PDF to download', 'error');
        return;
    }

    showToast('Downloading PDF...', 'info');

    setTimeout(() => {
        const blob = new Blob([currentPDFData.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentPDFData.id}-${currentPDFData.title.replace(/\s+/g, '-').toLowerCase()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('PDF downloaded successfully', 'success');
    }, 500);
}

/**
 * Download FULL Issue
 * @param {Event} event - Click event
 */
function downloadFullIssue(event) {
    if (event) {
        event.preventDefault();
    }

    showToast('Preparing Full Issue PDF...', 'info');

    setTimeout(() => {
        showToast('Full Issue PDF downloaded successfully', 'success');
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
    // Check if user is logged in
    if (!currentUser) {
        showToast('Please login to submit articles', 'warning');
        openModal('loginModal');
        return;
    }

    showToast('Redirecting to submission form...', 'info');
    console.log('Submission form would load here');
    
    setTimeout(() => {
        showToast('Submission form is ready', 'success');
        switchContent('submissions', null);
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
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.opacity = '';
                    menu.style.visibility = '';
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

/**
 * Handle sticky header collapse on scroll
 */
function initializeStickyHeader() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('collapsed');
        } else {
            header.classList.remove('collapsed');
        }
    });
}

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
        
        // Escape to close dropdowns and modals
        if (e.key === 'Escape') {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });

            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
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
    
    // Check for saved user
    checkSavedUser();
    
    // Initialize all components
    initializeArticleCards();
    initializeNavigation();
    initializeDropdowns();
    initializeSidebarLinks();
    initializeFooterLinks();
    initializeSmoothScroll();
    initializeKeyboardNavigation();
    handleResponsiveNavigation();
    initializeStickyHeader();
    
    // Add search event listeners
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
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
