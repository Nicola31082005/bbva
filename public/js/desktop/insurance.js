// Desktop Insurance Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ Insurance page loaded');

    // Initialize insurance page features
    initializeInsuranceCalculator();
    initializeProductCards();
    initializeQuickActions();
    initializeWysiwygMode();
});

// Insurance Calculator functionality
function initializeInsuranceCalculator() {
    const calculateBtn = document.querySelector('.calculate-btn');
    const insuranceSelect = document.querySelector('.form-select');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const selectedType = insuranceSelect.value;
            
            if (!selectedType) {
                alert('Please select an insurance type first.');
                return;
            }

            // Simulate calculation
            const premiums = {
                life: { min: 15, max: 150 },
                home: { min: 25, max: 200 },
                auto: { min: 35, max: 300 },
                health: { min: 45, max: 250 }
            };

            const premium = premiums[selectedType];
            if (premium) {
                const estimatedPremium = Math.floor(Math.random() * (premium.max - premium.min + 1)) + premium.min;
                alert(`Estimated premium for ${selectedType} insurance: €${estimatedPremium}/month\n\nThis is a rough estimate. Contact our insurance specialists for a detailed quote.`);
            }
        });
    }
}

// Product cards interactions
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const getQuoteBtn = card.querySelector('.btn-primary');
        const learnMoreBtn = card.querySelector('.btn-secondary');
        const productType = card.dataset.type;

        if (getQuoteBtn) {
            getQuoteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const productTitle = card.querySelector('h3').textContent;
                console.log(`Getting quote for: ${productTitle}`);
                
                // Show a simulated quote request
                alert(`Quote request for ${productTitle}\n\nOur insurance specialists will contact you within 24 hours to discuss your ${productType} insurance needs.`);
            });
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const productTitle = card.querySelector('h3').textContent;
                console.log(`Learning more about: ${productTitle}`);
                
                // Show more information
                showProductDetails(productType, productTitle);
            });
        }

        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Show detailed product information
function showProductDetails(productType, productTitle) {
    const details = {
        life: {
            coverage: "Up to €1,000,000 coverage",
            benefits: "Family protection, tax advantages, flexible premiums",
            exclusions: "Pre-existing conditions may apply"
        },
        home: {
            coverage: "Building and contents protection",
            benefits: "24/7 emergency assistance, natural disaster coverage",
            exclusions: "Flood damage may require additional coverage"
        },
        auto: {
            coverage: "Comprehensive and third-party protection",
            benefits: "Breakdown assistance, accident forgiveness",
            exclusions: "Racing and commercial use excluded"
        },
        health: {
            coverage: "Private healthcare access",
            benefits: "Dental, optical, and specialist coverage",
            exclusions: "Waiting periods apply for certain treatments"
        },
        travel: {
            coverage: "Medical and trip protection abroad",
            benefits: "Emergency medical, trip cancellation, luggage protection",
            exclusions: "High-risk activities may require additional coverage"
        },
        liability: {
            coverage: "Up to €300,000 personal liability",
            benefits: "Legal expense coverage, family protection",
            exclusions: "Professional activities excluded"
        }
    };

    const detail = details[productType];
    if (detail) {
        alert(`${productTitle} - Detailed Information\n\nCoverage: ${detail.coverage}\nBenefits: ${detail.benefits}\nImportant: ${detail.exclusions}\n\nContact our insurance team for personalized advice.`);
    }
}

// Quick actions functionality
function initializeQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.querySelector('span').textContent;
            console.log(`Quick action: ${actionText}`);
            
            // Simulate different actions
            switch(actionText) {
                case 'View Policy Documents':
                    alert('Policy Documents\n\nYour policy documents will be available in your secure document vault. You will receive an email notification once they are ready for download.');
                    break;
                case '24/7 Emergency Support':
                    alert('Emergency Support\n\nEmergency Hotline: 900 123 456\n\nOur emergency support team is available 24/7 for urgent insurance matters and claims assistance.');
                    break;
                case 'Update Coverage':
                    alert('Update Coverage\n\nTo update your coverage, please contact your insurance specialist or use our online portal. Changes may affect your premium rates.');
                    break;
                default:
                    alert(`${actionText}\n\nThis feature will redirect you to the appropriate section or contact our support team.`);
            }
        });
    });
}

// Service items interactions
function initializeServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        const btn = item.querySelector('.btn-outline');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const serviceTitle = item.querySelector('h3').textContent;
                console.log(`Service action: ${serviceTitle}`);
                
                if (serviceTitle.includes('Claims')) {
                    alert('File a Claim\n\nTo file a claim, you will need:\n- Policy number\n- Incident details\n- Supporting documentation\n\nYou can file online or call our claims hotline.');
                } else if (serviceTitle.includes('Coverage')) {
                    alert('View Coverage\n\nYour coverage details include:\n- Policy limits\n- Deductibles\n- Covered events\n- Exclusions\n\nAccess your full policy documents online.');
                }
            });
        }
    });
}

// WYSIWYG Mode functionality (similar to other pages)
function initializeWysiwygMode() {
    // Check if we're in WYSIWYG mode
    const wysiwygMode = document.querySelector('.wysiwyg-mode');
    if (!wysiwygMode) return;

    console.log('🎨 WYSIWYG mode detected for insurance page');

    // Initialize inline editing
    initializeInlineEditing();
}

// Inline editing functionality
function initializeInlineEditing() {
    const editableElements = document.querySelectorAll('.editable');
    let currentEditor = null;

    editableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Close any existing editor
            if (currentEditor) {
                closeInlineEditor();
            }

            // Open new editor for this element
            openInlineEditor(this);
        });
    });

    function openInlineEditor(element) {
        const field = element.dataset.field;
        const page = element.dataset.page;
        const type = element.dataset.type || 'text';
        const currentValue = element.textContent.trim();

        // Create editor
        const editor = document.createElement('div');
        editor.className = 'inline-editor';
        editor.innerHTML = `
            <div class="inline-editor-header">
                <span class="inline-editor-title">Edit ${field}</span>
                <button class="inline-editor-close">&times;</button>
            </div>
            <div class="inline-editor-body">
                ${type === 'textarea' ? 
                    `<textarea class="inline-editor-textarea" rows="4">${currentValue}</textarea>` :
                    `<input type="text" class="inline-editor-input" value="${currentValue}">`
                }
                <div class="inline-editor-actions">
                    <button class="inline-editor-btn inline-editor-btn-cancel">Cancel</button>
                    <button class="inline-editor-btn inline-editor-btn-save">Save</button>
                </div>
            </div>
        `;

        // Position editor
        const rect = element.getBoundingClientRect();
        editor.style.left = Math.min(rect.left, window.innerWidth - 350) + 'px';
        editor.style.top = (rect.bottom + 10) + 'px';

        document.body.appendChild(editor);
        currentEditor = editor;

        // Focus input
        const input = editor.querySelector('.inline-editor-input, .inline-editor-textarea');
        input.focus();
        input.select();

        // Add event listeners
        editor.querySelector('.inline-editor-close').addEventListener('click', closeInlineEditor);
        editor.querySelector('.inline-editor-btn-cancel').addEventListener('click', closeInlineEditor);
        editor.querySelector('.inline-editor-btn-save').addEventListener('click', () => saveChanges(element, field, page, input.value));

        // Save on Enter (for input fields)
        if (input.tagName === 'INPUT') {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveChanges(element, field, page, input.value);
                } else if (e.key === 'Escape') {
                    closeInlineEditor();
                }
            });
        }

        // Mark element as editing
        element.classList.add('editing');
    }

    function closeInlineEditor() {
        if (currentEditor) {
            currentEditor.remove();
            currentEditor = null;
        }
        // Remove editing class from all elements
        editableElements.forEach(el => el.classList.remove('editing'));
    }

    async function saveChanges(element, field, page, newValue) {
        if (newValue.trim() === element.textContent.trim()) {
            closeInlineEditor();
            return;
        }

        try {
            const response = await fetch('/api/desktop-content', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: page,
                    [field]: newValue
                })
            });

            if (response.ok) {
                element.textContent = newValue;
                console.log(`✅ Updated ${field} on ${page} page`);
                closeInlineEditor();
                
                // Show success feedback
                showFeedback('Changes saved successfully!', 'success');
            } else {
                console.error('❌ Failed to save changes');
                showFeedback('Failed to save changes', 'error');
            }
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            showFeedback('Error saving changes', 'error');
        }
    }

    // Close editor when clicking outside
    document.addEventListener('click', function(e) {
        if (currentEditor && !currentEditor.contains(e.target) && !e.target.classList.contains('editable')) {
            closeInlineEditor();
        }
    });
}

// Feedback system
function showFeedback(message, type = 'info') {
    const feedback = document.createElement('div');
    feedback.className = `feedback-toast feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10002;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(feedback);

    // Animate in
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateX(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Global functions for toolbar buttons (if needed)
window.toggleEditMode = function() {
    console.log('Toggle edit mode clicked');
    // Implementation would depend on specific requirements
};

window.saveAllChanges = function() {
    console.log('Save all changes clicked');
    showFeedback('All changes have been saved!', 'success');
};
