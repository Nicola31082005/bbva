// Main page functionality
let currentSlide = 0;
let totalSlides = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeTabs();
});

function initializeCarousel() {
    const carouselContainer = document.getElementById('carouselContainer');
    const slideCounter = document.getElementById('slideCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!carouselContainer) return;
    
    const slides = carouselContainer.querySelectorAll('.product-card');
    totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // Show only the first slide initially
    slides.forEach((slide, index) => {
        slide.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Update counter
    updateSlideCounter();
    
    // Update button states
    updateNavigationButtons();
}

function changeSlide(direction) {
    const carouselContainer = document.getElementById('carouselContainer');
    if (!carouselContainer) return;
    
    const slides = carouselContainer.querySelectorAll('.product-card');
    
    if (slides.length === 0) return;
    
    // Hide current slide
    slides[currentSlide].style.display = 'none';
    
    // Calculate new slide index
    currentSlide += direction;
    
    // Handle wrapping
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    // Show new slide
    slides[currentSlide].style.display = 'block';
    
    // Update UI
    updateSlideCounter();
    updateNavigationButtons();
}

function updateSlideCounter() {
    const slideCounter = document.getElementById('slideCounter');
    if (slideCounter && totalSlides > 0) {
        slideCounter.textContent = `${currentSlide + 1} de ${totalSlides}`;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        // Enable/disable buttons based on current position
        prevBtn.disabled = totalSlides <= 1;
        nextBtn.disabled = totalSlides <= 1;
        
        // Add visual feedback
        prevBtn.style.opacity = totalSlides <= 1 ? '0.5' : '1';
        nextBtn.style.opacity = totalSlides <= 1 ? '0.5' : '1';
    }
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.classList.add('inactive');
            });
            
            // Add active class to clicked tab
            this.classList.remove('inactive');
            this.classList.add('active');
            
            // Here you could add logic to show/hide different content
            // based on which tab is selected
            handleTabChange(this.textContent.trim());
        });
    });
}

function handleTabChange(tabName) {
    console.log('Tab changed to:', tabName);
    
    // You can add logic here to show different content based on the tab
    // For example:
    // - "Destacado" could show the current view
    // - "Tus productos" could show a different set of products or a different layout
    
    if (tabName === 'Tus productos') {
        // Could show all products in a different layout
        showAllProducts();
    } else if (tabName === 'Destacado') {
        // Show the default highlighted view
        showHighlightedView();
    }
}

function showAllProducts() {
    // This could modify the carousel to show all products at once
    // or change the layout entirely
    console.log('Showing all products view');
}

function showHighlightedView() {
    // Reset to the default carousel view
    console.log('Showing highlighted view');
}

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (event.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Touch/swipe support for mobile
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(event) {
    startX = event.touches[0].clientX;
});

document.addEventListener('touchend', function(event) {
    endX = event.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 50; // Minimum swipe distance
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swiped left - go to next slide
            changeSlide(1);
        } else {
            // Swiped right - go to previous slide
            changeSlide(-1);
        }
    }
}
