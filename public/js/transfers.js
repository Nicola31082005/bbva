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

// Show all transactions (now requires phone verification)
function showAllTransactions() {
    // Open phone verification modal first
    openModal('phoneVerificationModal');
    resetPhoneVerificationModal();
}

// Reset phone verification modal to initial state
function resetPhoneVerificationModal() {
    document.getElementById('phoneRequestStep').style.display = 'block';
    document.getElementById('codeVerificationStep').style.display = 'none';
    document.getElementById('verificationSuccessStep').style.display = 'none';
    
    // Reset form
    const form = document.getElementById('verificationCodeForm');
    if (form) {
        form.reset();
    }
}

// Send verification code (simulated)
function sendVerificationCode() {
    // Hide phone request step and show code verification step
    document.getElementById('phoneRequestStep').style.display = 'none';
    document.getElementById('codeVerificationStep').style.display = 'block';
    
    // Generate a random 6-digit code for simulation
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    console.log('Simulated verification code:', verificationCode); // In real app, this would be sent via SMS
    
    // Store the code for verification (in real app, this would be server-side)
    window.currentVerificationCode = verificationCode;
    
    // Start countdown timer
    startCountdown();
    startResendCountdown();
    
    // Focus on the input field
    setTimeout(() => {
        document.getElementById('verificationCode').focus();
    }, 100);
}

// Start countdown timer for code expiration
function startCountdown() {
    let timeLeft = 60;
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownElement.textContent = '0';
            // In a real app, you might disable the form or show an expired message
        }
    }, 1000);
}

// Start countdown for resend button
function startResendCountdown() {
    let timeLeft = 30;
    const resendBtn = document.getElementById('resendCodeBtn');
    const resendCountdown = document.getElementById('resendCountdown');
    
    resendBtn.disabled = true;
    
    const timer = setInterval(() => {
        timeLeft--;
        resendCountdown.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.innerHTML = 'Reenviar código';
        }
    }, 1000);
}

// Resend verification code
function resendVerificationCode() {
    sendVerificationCode();
}

// Go back to phone step
function goBackToPhoneStep() {
    document.getElementById('codeVerificationStep').style.display = 'none';
    document.getElementById('phoneRequestStep').style.display = 'block';
}

// Proceed to show all transactions after successful verification
function proceedToAllTransactions() {
    // Close the verification modal
    closeModal('phoneVerificationModal');
    
    // Show all transfer items that might be hidden
    const transferItems = document.querySelectorAll('.movement-item');
    transferItems.forEach(item => {
        item.style.display = 'flex';
    });
    
    // Update the section header to indicate all transactions are shown
    const sectionHeader = document.querySelector('.section-header h2');
    if (sectionHeader) {
        sectionHeader.textContent = 'Todas las transferencias';
    }
    
    // Optional: You could also make an AJAX call to fetch more transactions
    // fetchAllTransactions();
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
    const verificationCodeForm = document.getElementById('verificationCodeForm');
    
    // Handle verification code form submission
    if (verificationCodeForm) {
        verificationCodeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const enteredCode = document.getElementById('verificationCode').value;
            const correctCode = window.currentVerificationCode;
            
            if (enteredCode === correctCode.toString()) {
                // Verification successful
                document.getElementById('codeVerificationStep').style.display = 'none';
                document.getElementById('verificationSuccessStep').style.display = 'block';
            } else {
                // Verification failed
                alert('Código incorrecto. Por favor, inténtalo de nuevo.');
                document.getElementById('verificationCode').value = '';
                document.getElementById('verificationCode').focus();
            }
        });
    }
    
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
