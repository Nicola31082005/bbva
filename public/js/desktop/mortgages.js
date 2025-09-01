// Desktop Mortgages and Loans Page JavaScript

// Loan Calculator Function
function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    
    if (!loanAmount || !loanTerm || !interestRate) {
        alert('Please fill in all fields');
        return;
    }
    
    // Calculate monthly payment using standard loan formula
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalAmount = monthlyPayment * numPayments;
    const totalInterest = totalAmount - loanAmount;
    
    // Display results
    document.getElementById('monthlyPayment').textContent = '€' + monthlyPayment.toFixed(2);
    document.getElementById('totalInterest').textContent = '€' + totalInterest.toFixed(2);
    document.getElementById('totalAmount').textContent = '€' + totalAmount.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function() {
    // Apply buttons
    const applyButtons = document.querySelectorAll('.empty-state .btn-primary');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionTitle = this.closest('.section-card').querySelector('h2').textContent;
            alert(`Application for ${sectionTitle} would start here`);
        });
    });
    
    // Learn More buttons
    const learnMoreButtons = document.querySelectorAll('.product-item .btn-secondary');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productTitle = this.closest('.product-item').querySelector('h3').textContent;
            alert(`More information about ${productTitle} would be displayed here`);
        });
    });
    
    // Schedule Appointment button
    const appointmentBtn = document.querySelector('.contact-options .btn-primary');
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function() {
            alert('Appointment scheduling would open here');
        });
    }
    
    // Call button
    const callBtn = document.querySelector('.contact-options .btn-secondary');
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            alert('Calling 944 23 00 45...');
        });
    }
    
    // Auto-calculate when inputs change
    const calculatorInputs = document.querySelectorAll('#loanAmount, #loanTerm, #interestRate');
    calculatorInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Clear results when inputs change
            document.getElementById('monthlyPayment').textContent = '-';
            document.getElementById('totalInterest').textContent = '-';
            document.getElementById('totalAmount').textContent = '-';
        });
    });
});
