// Transfers page functionality

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

// Quick action functions
function openNewTransferModal() {
    openModal('newTransferModal');
}

function openScheduledTransferModal() {
    // For now, open the same modal - can be extended later
    openModal('newTransferModal');
}

function openBeneficiariesModal() {
    // Placeholder for beneficiaries modal
    alert('Funcionalidad de beneficiarios próximamente disponible');
}

// Filter transfers
function filterTransfers() {
    const typeFilter = document.getElementById('filterType').value;
    const periodFilter = document.getElementById('filterPeriod').value;
    const transferItems = document.querySelectorAll('.transfer-item');
    
    transferItems.forEach(item => {
        let showItem = true;
        
        // Filter by type
        if (typeFilter !== 'all') {
            const itemType = item.getAttribute('data-type');
            if (itemType !== typeFilter) {
                showItem = false;
            }
        }
        
        // Filter by period
        if (periodFilter !== 'all' && showItem) {
            const itemDate = new Date(item.getAttribute('data-date'));
            const now = new Date();
            
            switch (periodFilter) {
                case 'today':
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
                    if (itemDay.getTime() !== today.getTime()) {
                        showItem = false;
                    }
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (itemDate < weekAgo) {
                        showItem = false;
                    }
                    break;
                case 'month':
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    if (itemDate < monthAgo) {
                        showItem = false;
                    }
                    break;
            }
        }
        
        item.style.display = showItem ? 'flex' : 'none';
    });
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const newTransferForm = document.getElementById('newTransferForm');
    
    if (newTransferForm) {
        newTransferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                fromAccount: document.getElementById('fromAccount').value,
                recipientName: document.getElementById('recipientName').value,
                recipientAccount: document.getElementById('recipientAccount').value,
                amount: parseFloat(document.getElementById('transferAmount').value),
                currency: document.getElementById('transferCurrency').value,
                description: document.getElementById('transferDescription').value,
                date: new Date().toISOString()
            };
            
            // Validate form
            if (!formData.fromAccount || !formData.recipientName || !formData.recipientAccount || 
                !formData.amount || !formData.currency || !formData.description) {
                alert('Por favor, completa todos los campos');
                return;
            }
            
            if (formData.amount <= 0) {
                alert('El importe debe ser mayor que 0');
                return;
            }
            
            // Submit transfer (this would normally go to a server endpoint)
            submitTransfer(formData);
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
});

// Submit transfer function
function submitTransfer(transferData) {
    // Show loading state
    const submitBtn = document.querySelector('#newTransferForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Procesando...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real app, this would be an actual API call
        console.log('Transfer submitted:', transferData);
        
        // Show success message
        alert('Transferencia enviada exitosamente');
        
        // Reset form and close modal
        document.getElementById('newTransferForm').reset();
        closeModal('newTransferModal');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Optionally reload the page to show the new transfer
        // window.location.reload();
    }, 2000);
}

// Format amount for display
function formatAmount(amount) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
