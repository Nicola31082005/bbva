// Desktop Apply Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  console.log("Apply page loaded");

  // Initialize product cards interaction
  initProductCards();

  // Initialize animations
  initAnimations();
});

function initProductCards() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    // Add click event listener to each product card
    card.addEventListener("click", function () {
      const productName = this.querySelector(".product-name").textContent;
      console.log(`Product clicked: ${productName}`);

      // Add visual feedback for click
      this.style.transform = "translateY(-4px) scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      // Here you could add navigation to specific product application pages
      // For now, we'll just show an alert
      showProductInfo(productName);
    });

    // Add keyboard support for accessibility
    card.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });

    // Make cards focusable for keyboard navigation
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `Apply for ${card.querySelector(".product-name").textContent}`
    );
  });
}

function showProductInfo(productName) {
  // Create a simple modal or notification
  const notification = document.createElement("div");
  notification.className = "product-notification";
  notification.innerHTML = `
        <div class="notification-content">
            <h3>📋 Application for ${productName}</h3>
            <p>You selected to apply for <strong>${productName}</strong>. This would typically navigate to the application form.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">Close</button>
        </div>
    `;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

  const content = notification.querySelector(".notification-content");
  content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;

  const button = content.querySelector(".notification-close");
  button.style.cssText = `
        background: #004481;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 1rem;
        font-weight: 500;
        transition: background 0.3s ease;
    `;

  button.addEventListener("mouseover", () => {
    button.style.background = "#003366";
  });

  button.addEventListener("mouseout", () => {
    button.style.background = "#004481";
  });

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    content.style.transform = "scale(1)";
  }, 10);

  // Close on background click
  notification.addEventListener("click", function (e) {
    if (e.target === notification) {
      this.remove();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && notification.parentElement) {
      notification.remove();
    }
  });
}

function initAnimations() {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  // Observe all product cards
  document.querySelectorAll(".product-card").forEach((card) => {
    card.style.animationPlayState = "paused";
    observer.observe(card);
  });
}

// Smooth scroll function for any internal links
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Export functions for potential use by other scripts
window.ApplyPage = {
  showProductInfo,
  smoothScroll,
};
