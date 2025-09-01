// Desktop Main Page JavaScript

// Quick action functions
function openTransferModal() {
    showToast('Abriendo formulario de transferencia...', 'info');
    // In a real app, this would open a transfer modal
    setTimeout(() => {
        window.location.href = '/transfers';
    }, 1000);
}

function openPaymentModal() {
    showToast('Función de pagos próximamente disponible', 'info');
    // Placeholder for payment functionality
}

function openDepositModal() {
    showToast('Función de depósitos próximamente disponible', 'info');
    // Placeholder for deposit functionality
}

function openNewTransferModal() {
    openTransferModal();
}

function openScheduledTransferModal() {
    showToast('Función de transferencias programadas próximamente disponible', 'info');
    // Placeholder for scheduled transfers
}

// Account actions
function viewAccountDetails(accountId) {
    showToast(`Viendo detalles de la cuenta ${accountId}`, 'info');
    // In a real app, this would show account details
}

function transferFromAccount(accountId) {
    showToast(`Iniciando transferencia desde cuenta ${accountId}`, 'info');
    setTimeout(() => {
        window.location.href = `/transfers?from=${accountId}`;
    }, 1000);
}

// Card actions
function viewCardDetails(cardId) {
    showToast(`Viendo detalles de la tarjeta ${cardId}`, 'info');
    // In a real app, this would show card details
}

function blockCard(cardId) {
    if (confirm('¿Estás seguro de que quieres bloquear esta tarjeta?')) {
        showToast('Tarjeta bloqueada correctamente', 'success');
        // In a real app, this would make an API call to block the card
    }
}

// Transaction actions
function viewTransactionDetails(transactionId) {
    showToast(`Viendo detalles de la transacción ${transactionId}`, 'info');
    // In a real app, this would show transaction details
}

// Admin mode functions (if admin mode is enabled)
function exitAdminMode() {
    if (confirm('¿Salir del modo de administración?')) {
        fetch('/api/exit-admin-mode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Saliendo del modo admin...', 'info');
                setTimeout(() => {
                    window.location.href = '/main-page';
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error al salir del modo admin', 'error');
        });
    }
}

// Dashboard animations
function animateCounters() {
    const counters = document.querySelectorAll('.balance-amount, .limit-amount, .amount-value');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent.replace(/[^\d.-]/g, ''));
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number
            const formatted = current.toFixed(2).replace('.', ',');
            counter.textContent = counter.textContent.replace(/[\d,.-]+/, formatted);
        }, 20);
    });
}

// Refresh dashboard data
function refreshDashboard() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        setButtonLoading(refreshBtn, true);
    }
    
    showToast('Actualizando datos...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        if (refreshBtn) {
            setButtonLoading(refreshBtn, false);
        }
        showToast('Datos actualizados correctamente', 'success');
        // In a real app, this would fetch fresh data from the server
        location.reload();
    }, 2000);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    const debouncedSearch = debounce((query) => {
        if (query.length < 2) return;
        
        // Filter transactions based on search query
        const transactions = document.querySelectorAll('.transaction-item');
        transactions.forEach(transaction => {
            const description = transaction.querySelector('.transaction-description').textContent.toLowerCase();
            const isMatch = description.includes(query.toLowerCase());
            transaction.style.display = isMatch ? 'flex' : 'none';
        });
        
        // Show/hide empty state
        const visibleTransactions = Array.from(transactions).filter(t => t.style.display !== 'none');
        const emptyState = document.querySelector('.transactions-empty-state');
        if (emptyState) {
            emptyState.style.display = visibleTransactions.length === 0 ? 'block' : 'none';
        }
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// Initialize dashboard functionality
function initializeDashboard() {
    // Animate counters on page load
    setTimeout(animateCounters, 500);
    
    // Initialize search
    initializeSearch();
    
    // Add click handlers for account items
    const accountItems = document.querySelectorAll('.account-item');
    accountItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.account-actions')) return;
            const accountId = item.dataset.accountId;
            if (accountId) {
                viewAccountDetails(accountId);
            }
        });
    });
    
    // Add click handlers for card items
    const cardItems = document.querySelectorAll('.card-item');
    cardItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions')) return;
            const cardId = item.dataset.cardId;
            if (cardId) {
                viewCardDetails(cardId);
            }
        });
    });
    
    // Add click handlers for transaction items
    const transactionItems = document.querySelectorAll('.transaction-item');
    transactionItems.forEach(item => {
        item.addEventListener('click', () => {
            const transactionId = item.dataset.transactionId;
            if (transactionId) {
                viewTransactionDetails(transactionId);
            }
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + T for new transfer
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            openTransferModal();
        }
        
        // Ctrl/Cmd + R for refresh (prevent default browser refresh)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshDashboard();
        }
    });
}

// Financial health score animation
function animateHealthScore() {
    const scoreElement = document.querySelector('.score-value');
    if (!scoreElement) return;
    
    const targetScore = parseInt(scoreElement.textContent);
    let currentScore = 0;
    
    const interval = setInterval(() => {
        currentScore += 2;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }
        scoreElement.textContent = currentScore;
    }, 50);
}

// Sidebar functionality
function initializeSidebar() {
    // Add hover effects to quick action buttons
    const quickActions = document.querySelectorAll('.quick-action-btn');
    quickActions.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
    
    // Add click handlers for support links
    const supportLinks = document.querySelectorAll('.support-link');
    supportLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.querySelector('span').textContent;
            showToast(`Abriendo ${linkText}...`, 'info');
            // In a real app, this would open the appropriate support section
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeSidebar();
    
    // Animate health score after a delay
    setTimeout(animateHealthScore, 1000);
    
    // Show welcome message for new users (example)
    const isFirstVisit = !localStorage.getItem('hasVisited');
    if (isFirstVisit) {
        setTimeout(() => {
            showToast('¡Bienvenido a tu banca digital BBVA!', 'success', 5000);
            localStorage.setItem('hasVisited', 'true');
        }, 2000);
    }
    
    // Auto-refresh data every 5 minutes (in a real app)
    // setInterval(refreshDashboard, 5 * 60 * 1000);
});

// Export functions for global access
window.openTransferModal = openTransferModal;
window.openPaymentModal = openPaymentModal;
window.openDepositModal = openDepositModal;
window.exitAdminMode = exitAdminMode;
window.refreshDashboard = refreshDashboard;

console.log('🏠 Desktop main page scripts loaded');
