// Desktop Accounts and Cards Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Bizum toggle functionality
    const bizumToggle = document.querySelector('.bizum-toggle');
    if (bizumToggle) {
        bizumToggle.addEventListener('click', function() {
            // Toggle functionality would be implemented here
            console.log('Bizum section toggled');
        });
    }

    // Cards section toggle
    const cardsHeader = document.querySelector('.cards-section .section-header');
    if (cardsHeader) {
        cardsHeader.addEventListener('click', function() {
            // Toggle functionality would be implemented here
            console.log('Cards section toggled');
        });
    }

    // Activate card button
    const activateBtn = document.querySelector('.card-actions .btn-primary');
    if (activateBtn) {
        activateBtn.addEventListener('click', function() {
            alert('Card activation process would start here');
        });
    }

    // Request appointment button
    const appointmentBtn = document.querySelector('.request-appointment-btn');
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function() {
            alert('Appointment request would be processed here');
        });
    }

    // View transfers button
    const viewBtn = document.querySelector('.view-btn');
    if (viewBtn) {
        viewBtn.addEventListener('click', function() {
            alert('Scheduled transfers view would open here');
        });
    }

    // Product selector
    const enterBtn = document.querySelector('.enter-btn');
    const productSelect = document.querySelector('.product-selector select');
    
    if (enterBtn && productSelect) {
        enterBtn.addEventListener('click', function() {
            const selectedProduct = productSelect.value;
            if (selectedProduct && selectedProduct !== 'Select the product family') {
                alert(`Product application for ${selectedProduct} would start here`);
            } else {
                alert('Please select a product family first');
            }
        });
    }

    // Print and export buttons
    const printBtn = document.querySelector('.header-actions .btn-icon[title="Print"]');
    const exportBtn = document.querySelector('.header-actions .btn-icon[title="Export"]');
    
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Export functionality would be implemented here');
        });
    }
});
