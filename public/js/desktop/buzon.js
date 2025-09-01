// Desktop Inbox/Buzon Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize star rating functionality
    initializeStarRating();
    
    // Initialize search functionality
    initializeSearchMessages();
    
    // Initialize quick actions
    initializeQuickActions();
    
    // Initialize message filters
    initializeMessageFilters();
    
    console.log('📨 Desktop inbox scripts loaded');
});

// Star rating functionality
function initializeStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');
    let currentRating = 5; // Default 5 stars
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
        
        star.addEventListener('mouseleave', () => {
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', () => {
            currentRating = index + 1;
            highlightStars(currentRating);
            showToast(`¡Gracias por tu valoración de ${currentRating} estrellas!`, 'success');
        });
    });
    
    // Set initial rating
    highlightStars(currentRating);
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#fbbf24';
        } else {
            star.style.color = '#e5e7eb';
        }
    });
}

// Search messages functionality
function initializeSearchMessages() {
    const searchBtn = document.querySelector('.header-actions .btn-secondary');
    if (searchBtn && searchBtn.textContent.includes('Search')) {
        searchBtn.addEventListener('click', () => {
            openSearchModal();
        });
    }
}

function openSearchModal() {
    // Create search modal
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Search Messages</h3>
                <button class="close-btn" onclick="closeSearchModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="search-form">
                    <input type="text" placeholder="Enter search terms..." class="search-input" />
                    <div class="search-filters">
                        <label>
                            <input type="checkbox" value="accounts" checked> Accounts
                        </label>
                        <label>
                            <input type="checkbox" value="transfers" checked> Transfers
                        </label>
                        <label>
                            <input type="checkbox" value="cards" checked> Cards
                        </label>
                        <label>
                            <input type="checkbox" value="receipts"> Receipts
                        </label>
                    </div>
                    <button class="btn btn-primary" onclick="performSearch()">Search</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.querySelector('#search-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'search-modal-styles';
        styles.textContent = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .search-modal .modal-content {
                background: white;
                border-radius: 12px;
                padding: 0;
                width: 500px;
                max-width: 90vw;
            }
            
            .search-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px 16px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .search-modal .modal-header h3 {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .search-modal .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
            }
            
            .search-modal .modal-body {
                padding: 20px 24px 24px;
            }
            
            .search-form .search-input {
                width: 100%;
                padding: 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                margin-bottom: 16px;
                font-size: 1rem;
            }
            
            .search-filters {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .search-filters label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.9rem;
                cursor: pointer;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    modal.querySelector('.search-input').focus();
}

function closeSearchModal() {
    const modal = document.querySelector('.search-modal');
    if (modal) {
        modal.remove();
    }
}

function performSearch() {
    const input = document.querySelector('.search-modal .search-input');
    const checkboxes = document.querySelectorAll('.search-filters input[type="checkbox"]:checked');
    
    if (input && input.value.trim()) {
        const query = input.value.trim();
        const categories = Array.from(checkboxes).map(cb => cb.value);
        
        showToast(`Searching for "${query}" in: ${categories.join(', ')}`, 'info');
        
        // In a real app, this would make an API call
        setTimeout(() => {
            showToast('Search completed - 12 results found', 'success');
            closeSearchModal();
        }, 1500);
    } else {
        showToast('Please enter search terms', 'warning');
    }
}

// Quick actions functionality
function initializeQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action');
    
    quickActions.forEach(action => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            const actionText = action.querySelector('span').textContent;
            
            switch(actionText) {
                case 'Compose Message':
                    openComposeModal();
                    break;
                case 'Manage Preferences':
                    openPreferencesModal();
                    break;
                case 'Schedule Reminder':
                    openReminderModal();
                    break;
                default:
                    showToast(`${actionText} functionality coming soon`, 'info');
            }
        });
    });
}

function openComposeModal() {
    showToast('Opening compose message modal...', 'info');
    // In a real app, this would open a compose modal
}

function openPreferencesModal() {
    showToast('Opening preferences modal...', 'info');
    // In a real app, this would open preferences settings
}

function openReminderModal() {
    showToast('Opening reminder scheduler...', 'info');
    // In a real app, this would open reminder settings
}

// Message filters functionality
function initializeMessageFilters() {
    const messageItems = document.querySelectorAll('.message-item');
    
    messageItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const messageText = item.querySelector('.message-text').textContent;
            const count = item.querySelector('.message-count');
            
            if (count) {
                showToast(`Viewing ${messageText} (${count.textContent} items)`, 'info');
            } else {
                showToast(`Opening ${messageText}`, 'info');
            }
            
            // In a real app, this would navigate to the specific message category
        });
    });
    
    // Activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const activityText = item.querySelector('.activity-text').textContent;
            showToast(`Opening ${activityText}`, 'info');
        });
    });
}

// Feedback submission
function submitFeedback() {
    const stars = document.querySelectorAll('.star-rating .star');
    const rating = Array.from(stars).filter(star => 
        star.style.color === 'rgb(251, 191, 36)'
    ).length;
    
    if (rating > 0) {
        showToast(`Thank you for your ${rating}-star feedback!`, 'success');
        
        // In a real app, this would send the feedback to the server
        setTimeout(() => {
            showToast('Your feedback has been recorded', 'success');
        }, 1000);
    } else {
        showToast('Please select a rating first', 'warning');
    }
}

// Configure notifications
function configureNotifications() {
    showToast('Opening notification settings...', 'info');
    
    // In a real app, this would open notification configuration
    setTimeout(() => {
        showToast('Notification preferences updated', 'success');
    }, 2000);
}

// Export functions for global access
window.closeSearchModal = closeSearchModal;
window.performSearch = performSearch;
window.submitFeedback = submitFeedback;
window.configureNotifications = configureNotifications;
