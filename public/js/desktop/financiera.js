// Desktop Financial Health/Financiera Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab functionality
    initializeTabs();
    
    // Initialize asset management
    initializeAssetManagement();
    
    // Initialize financial goals
    initializeFinancialGoals();
    
    // Initialize charts and visualizations
    initializeCharts();
    
    // Initialize quick actions
    initializeQuickActions();
    
    // Initialize health score
    initializeHealthScore();
    
    console.log('📊 Desktop financial health scripts loaded');
});

// Tab functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            
            const tabText = btn.textContent;
            showToast(`Switched to ${tabText} view`, 'info');
            
            // In a real app, this would show/hide different content sections
            if (tabText === 'Financial Coach') {
                showFinancialCoachContent();
            } else {
                showNetWorthContent();
            }
        });
    });
}

function showFinancialCoachContent() {
    showToast('Financial Coach features coming soon!', 'info');
    // In a real app, this would show financial coaching content
}

function showNetWorthContent() {
    // This is the default view, no action needed
    console.log('Net Worth view active');
}

// Asset management functionality
function initializeAssetManagement() {
    const addAssetBtns = document.querySelectorAll('.add-asset-btn');
    const assetCards = document.querySelectorAll('.asset-card');
    const exploreInvestmentBtn = document.querySelector('.opportunity-prompt .btn-primary');
    
    addAssetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const assetType = btn.querySelector('span').textContent;
            openAssetAddModal(assetType);
        });
    });
    
    assetCards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('investment-opportunity') && 
                !card.classList.contains('property-placeholder') && 
                !card.classList.contains('vehicle-placeholder')) {
                const assetTitle = card.querySelector('h3').textContent;
                showAssetDetails(assetTitle);
            }
        });
    });
    
    if (exploreInvestmentBtn) {
        exploreInvestmentBtn.addEventListener('click', () => {
            openInvestmentExplorer();
        });
    }
}

function openAssetAddModal(assetType) {
    showToast(`Opening ${assetType} form...`, 'info');
    
    // Create asset add modal
    const modal = document.createElement('div');
    modal.className = 'asset-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${assetType}</h3>
                <button class="close-btn" onclick="closeAssetModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form class="asset-form">
                    ${getAssetFormFields(assetType)}
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeAssetModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Asset</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.querySelector('#asset-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'asset-modal-styles';
        styles.textContent = `
            .asset-modal {
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
            
            .asset-modal .modal-content {
                background: white;
                border-radius: 12px;
                padding: 0;
                width: 500px;
                max-width: 90vw;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .asset-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px 16px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .asset-modal .modal-header h3 {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .asset-modal .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
            }
            
            .asset-modal .modal-body {
                padding: 20px 24px 24px;
            }
            
            .asset-form .form-group {
                margin-bottom: 16px;
            }
            
            .asset-form label {
                display: block;
                margin-bottom: 4px;
                font-weight: 500;
                color: #374151;
            }
            
            .asset-form input,
            .asset-form select {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            .form-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('.asset-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitAssetForm(assetType);
    });
}

function getAssetFormFields(assetType) {
    switch(assetType) {
        case 'Add property to your portfolio':
            return `
                <div class="form-group">
                    <label>Property Address</label>
                    <input type="text" name="address" required>
                </div>
                <div class="form-group">
                    <label>Property Type</label>
                    <select name="type" required>
                        <option value="">Select type</option>
                        <option value="primary">Primary Residence</option>
                        <option value="secondary">Secondary Home</option>
                        <option value="investment">Investment Property</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Current Value (€)</label>
                    <input type="number" name="value" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Purchase Date</label>
                    <input type="date" name="purchaseDate">
                </div>
            `;
            
        case 'Add vehicle to your portfolio':
            return `
                <div class="form-group">
                    <label>Vehicle Make & Model</label>
                    <input type="text" name="model" required>
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="number" name="year" min="1900" max="2025" required>
                </div>
                <div class="form-group">
                    <label>Current Value (€)</label>
                    <input type="number" name="value" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>License Plate</label>
                    <input type="text" name="licensePlate">
                </div>
            `;
            
        default:
            return `
                <div class="form-group">
                    <label>Asset Name</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Current Value (€)</label>
                    <input type="number" name="value" min="0" step="0.01" required>
                </div>
            `;
    }
}

function closeAssetModal() {
    const modal = document.querySelector('.asset-modal');
    if (modal) {
        modal.remove();
    }
}

function submitAssetForm(assetType) {
    showToast(`Adding ${assetType.toLowerCase()}...`, 'info');
    
    // In a real app, this would send the data to the server
    setTimeout(() => {
        showToast('Asset added successfully!', 'success');
        closeAssetModal();
        // Refresh the page or update the asset display
    }, 1500);
}

function showAssetDetails(assetTitle) {
    showToast(`Viewing ${assetTitle} details...`, 'info');
    // In a real app, this would show detailed asset information
}

function openInvestmentExplorer() {
    showToast('Opening investment options...', 'info');
    
    // In a real app, this would navigate to investment products
    setTimeout(() => {
        showToast('Investment explorer loaded', 'success');
    }, 2000);
}

// Financial goals functionality
function initializeFinancialGoals() {
    const createGoalBtn = document.querySelector('.goals-empty-state .btn-primary');
    
    if (createGoalBtn) {
        createGoalBtn.addEventListener('click', () => {
            openGoalCreator();
        });
    }
}

function openGoalCreator() {
    showToast('Opening financial goal creator...', 'info');
    
    // In a real app, this would open a goal creation interface
    setTimeout(() => {
        showToast('Goal creator ready', 'success');
    }, 1500);
}

// Charts and visualizations
function initializeCharts() {
    const canvas = document.getElementById('networthChart');
    if (canvas) {
        // In a real app, this would initialize Chart.js or similar
        console.log('Chart canvas found - would initialize real chart here');
        
        // Simulate chart loading
        setTimeout(() => {
            showToast('Net worth chart updated', 'success');
        }, 2000);
    }
    
    // Initialize score circle animation
    animateScoreCircle();
}

function animateScoreCircle() {
    const scoreCircle = document.querySelector('.score-circle circle:last-child');
    const scoreValue = document.querySelector('.score-value');
    
    if (scoreCircle && scoreValue) {
        const score = parseFloat(scoreValue.textContent);
        const maxScore = 10;
        const percentage = (score / maxScore) * 100;
        const circumference = 2 * Math.PI * 40; // radius = 40
        const offset = circumference - (percentage / 100) * circumference;
        
        // Animate the score circle
        setTimeout(() => {
            scoreCircle.style.strokeDashoffset = offset;
        }, 500);
        
        // Animate the score value
        animateScoreValue(0, score, 1000);
    }
}

function animateScoreValue(start, end, duration) {
    const scoreValue = document.querySelector('.score-value');
    if (!scoreValue) return;
    
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        
        scoreValue.textContent = current.toFixed(1);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Quick actions functionality
function initializeQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action');
    
    quickActions.forEach(action => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            const actionText = action.querySelector('span').textContent;
            
            switch(actionText) {
                case 'Start Investing':
                    openInvestmentExplorer();
                    break;
                case 'Create Budget':
                    openBudgetCreator();
                    break;
                case 'Set Goals':
                    openGoalCreator();
                    break;
                case 'Generate Report':
                    generateFinancialReport();
                    break;
                default:
                    showToast(`${actionText} functionality coming soon`, 'info');
            }
        });
    });
    
    // Configuration buttons
    const configureBtn = document.querySelector('.header-actions .btn-secondary');
    const viewEvolutionBtn = document.querySelector('.header-actions .btn-primary');
    
    if (configureBtn) {
        configureBtn.addEventListener('click', () => {
            openConfiguration();
        });
    }
    
    if (viewEvolutionBtn) {
        viewEvolutionBtn.addEventListener('click', () => {
            viewEvolution();
        });
    }
}

function openBudgetCreator() {
    showToast('Opening budget creation tool...', 'info');
    // In a real app, this would open budget management
}

function generateFinancialReport() {
    showToast('Generating financial report...', 'info');
    
    // In a real app, this would generate and download a report
    setTimeout(() => {
        showToast('Financial report generated successfully', 'success');
    }, 3000);
}

function openConfiguration() {
    showToast('Opening financial health configuration...', 'info');
    // In a real app, this would open configuration settings
}

function viewEvolution() {
    showToast('Loading financial evolution chart...', 'info');
    // In a real app, this would show detailed evolution charts
}

// Health score functionality
function initializeHealthScore() {
    const improveBtn = document.querySelector('.health-score-card .btn-secondary');
    
    if (improveBtn) {
        improveBtn.addEventListener('click', () => {
            showHealthScoreDetails();
        });
    }
}

function showHealthScoreDetails() {
    const improvements = [
        'Increase your savings rate to 20%',
        'Diversify your investment portfolio',
        'Consider emergency fund planning',
        'Review insurance coverage'
    ];
    
    showToast(`Score improvement tips: ${improvements.join(' - ')}`, 'info', 8000);
}

// Tips functionality
function initializeTips() {
    const viewAllTipsLink = document.querySelector('.view-all-tips');
    
    if (viewAllTipsLink) {
        viewAllTipsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllTips();
        });
    }
}

function showAllTips() {
    showToast('Loading all financial tips...', 'info');
    // In a real app, this would show a comprehensive tips section
}

// Export functions for global access
window.closeAssetModal = closeAssetModal;
window.openInvestmentExplorer = openInvestmentExplorer;
window.openGoalCreator = openGoalCreator;
window.generateFinancialReport = generateFinancialReport;
