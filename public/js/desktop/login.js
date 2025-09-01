// Desktop Login JavaScript

// Password visibility toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput && eyeIcon) {
        const isPassword = passwordInput.type === 'password';
        
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Update icon
        if (isPassword) {
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    }
}

// Form validation
function validateLoginForm() {
    const userid = document.getElementById('userid');
    const password = document.getElementById('password');
    let isValid = true;
    
    // Clear previous errors
    clearFieldErrors();
    
    // Validate userid
    if (!userid.value.trim()) {
        showFieldError(userid, 'Por favor, introduce tu documento de identidad');
        isValid = false;
    }
    
    // Validate password
    if (!password.value.trim()) {
        showFieldError(password, 'Por favor, introduce tu clave de acceso');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class
        formGroup.classList.add('error');
        field.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }
}

// Clear field errors
function clearFieldErrors() {
    const errorFields = document.querySelectorAll('.form-group.error');
    errorFields.forEach(group => {
        group.classList.remove('error');
        const field = group.querySelector('input');
        if (field) field.classList.remove('error');
        const error = group.querySelector('.field-error');
        if (error) error.remove();
    });
}

// Handle form submission
function handleLoginSubmit(event) {
    const form = event.target;
    const submitBtn = form.querySelector('#loginBtn');
    
    // Validate form
    if (!validateLoginForm()) {
        event.preventDefault();
        return false;
    }
    
    // Show loading state
    if (submitBtn) {
        setButtonLoading(submitBtn, true);
    }
    
    // Form will submit normally
    return true;
}

// Auto-focus first empty field
function focusFirstEmptyField() {
    const fields = ['userid', 'password'];
    for (const fieldId of fields) {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.focus();
            break;
        }
    }
}

// Initialize login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const useridField = document.getElementById('userid');
    const passwordField = document.getElementById('password');
    
    // Add form submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Clear errors on input
    [useridField, passwordField].forEach(field => {
        if (field) {
            field.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                    this.classList.remove('error');
                    const error = formGroup.querySelector('.field-error');
                    if (error) error.remove();
                }
            });
        }
    });
    
    // Auto-focus first empty field
    setTimeout(focusFirstEmptyField, 100);
    
    // Handle Enter key in userid field
    if (useridField) {
        useridField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                if (passwordField) {
                    passwordField.focus();
                }
            }
        });
    }
    
    // Handle Enter key in password field
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                if (loginForm) {
                    loginForm.requestSubmit();
                }
            }
        });
    }
    
    // Add field error styles if not already present
    if (!document.querySelector('#login-error-styles')) {
        const styles = document.createElement('style');
        styles.id = 'login-error-styles';
        styles.textContent = `
            .form-group.error input {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
            }
            
            .field-error {
                color: #dc3545;
                font-size: 0.85rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .field-error::before {
                content: '⚠️';
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(styles);
    }
});

console.log('🔐 Desktop login scripts loaded');
