// Header functionality - Menu dropdown

// Global variables
let isMenuOpen = false;
let dropdownOverlay = null;

// Initialize header functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create overlay element for closing dropdown
    createDropdownOverlay();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const menuDropdown = document.querySelector('.menu-dropdown');
        const dropdownMenu = document.getElementById('dropdownMenu');
        
        if (menuDropdown && dropdownMenu && isMenuOpen) {
            if (!menuDropdown.contains(e.target)) {
                closeMenu();
            }
        }
    });
    
    // Close dropdown with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
});

// Toggle menu function
function toggleMenu() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (!dropdownMenu) return;
    
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

// Open menu function
function openMenu() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (!dropdownMenu) return;
    
    dropdownMenu.classList.add('show');
    dropdownOverlay.classList.add('show');
    isMenuOpen = true;
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
}

// Close menu function
function closeMenu() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (!dropdownMenu) return;
    
    dropdownMenu.classList.remove('show');
    dropdownOverlay.classList.remove('show');
    isMenuOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Create overlay element
function createDropdownOverlay() {
    dropdownOverlay = document.createElement('div');
    dropdownOverlay.className = 'dropdown-overlay';
    dropdownOverlay.onclick = closeMenu;
    document.body.appendChild(dropdownOverlay);
}

// Highlight current page in dropdown menu
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    dropdownItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.style.backgroundColor = 'var(--bbva-light-blue)';
            item.style.color = 'var(--bbva-blue)';
        }
    });
}

// Call highlight function when DOM is loaded
document.addEventListener('DOMContentLoaded', highlightCurrentPage);
