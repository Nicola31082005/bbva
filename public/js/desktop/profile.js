// Profile Page JavaScript
console.log("Profile page loaded");

document.addEventListener("DOMContentLoaded", function () {
  initializeProfilePage();
});

function initializeProfilePage() {
  console.log("Initializing profile page...");

  // Initialize profile tabs
  initializeProfileTabs();

  // Initialize profile navigation
  initializeProfileNavigation();

  // Initialize form interactions
  initializeFormInteractions();

  // Initialize branch sections
  initializeBranchSections();
}

function initializeProfileTabs() {
  const tabs = document.querySelectorAll(".profile-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      console.log("Profile tab switched:", this.textContent);
    });
  });
}

function initializeProfileNavigation() {
  const navItems = document.querySelectorAll(".profile-nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"));

      // Add active class to clicked nav item
      this.classList.add("active");

      // Get the target section
      const targetId = this.getAttribute("href").substring(1);
      console.log("Profile navigation clicked:", targetId);

      // Scroll to section (if sections exist)
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function initializeFormInteractions() {
  // Initialize language dropdowns
  const selects = document.querySelectorAll(".form-select");
  selects.forEach((select) => {
    select.addEventListener("change", function () {
      console.log("Language changed:", this.value);
    });
  });

  // Initialize change buttons
  const changeButtons = document.querySelectorAll(".btn-link");
  changeButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Change button clicked:", this.textContent);

      // Add your change functionality here
      showChangeModal(this);
    });
  });

  // Initialize primary buttons
  const primaryButtons = document.querySelectorAll(".btn-primary");
  primaryButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      console.log("Primary button clicked:", this.textContent);

      if (this.textContent.trim() === "Add") {
        e.preventDefault();
        showAddPhoneModal();
      } else if (this.textContent.includes("Add new address")) {
        e.preventDefault();
        showAddAddressModal();
      }
    });
  });

  // Initialize delete buttons
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Delete button clicked");

      if (confirm("Are you sure you want to delete this item?")) {
        // Add delete functionality here
        this.closest(".phone-number-display").remove();
      }
    });
  });

  // Initialize unhide button
  const unhideButton = document.querySelector(".unhide-section .btn-secondary");
  if (unhideButton) {
    unhideButton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Unhide button clicked");

      // Toggle visibility of masked information
      togglePersonalDataVisibility();
    });
  }
}

function initializeBranchSections() {
  const branchExpandButtons = document.querySelectorAll(".branch-expand");

  branchExpandButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Branch expand clicked:", this.textContent);

      // Toggle the expanded state
      const isExpanded = this.textContent.startsWith("-");

      if (isExpanded) {
        this.textContent = this.textContent.replace("-", "+");
        // Hide branch details (if any)
      } else {
        this.textContent = this.textContent.replace("+", "-");
        // Show branch details (if any)
      }
    });
  });
}

function showChangeModal(button) {
  // Create a simple modal for demonstration
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Change Information</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p>This functionality would allow you to change your personal information.</p>
                <p>In a real application, this would show a form to edit the specific field.</p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">Save</button>
            </div>
        </div>
    `;

  // Add modal styles
  const style = document.createElement("style");
  style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .modal-content {
            background: white;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e8ecf0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-header h3 {
            margin: 0;
            color: #072146;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        .modal-body {
            padding: 1.5rem;
        }
        .modal-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid #e8ecf0;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
    `;

  document.head.appendChild(style);
  document.body.appendChild(modal);
}

function showAddPhoneModal() {
  console.log("Show add phone modal");
  showChangeModal(null);
}

function showAddAddressModal() {
  console.log("Show add address modal");
  showChangeModal(null);
}

function togglePersonalDataVisibility() {
  // Find masked elements and toggle their visibility
  const maskedElements = document.querySelectorAll(
    ".phone-number, .email-address"
  );

  maskedElements.forEach((element) => {
    const currentText = element.textContent;

    if (currentText.includes("****")) {
      // Show full information (this is just a demo)
      if (element.classList.contains("phone-number")) {
        if (currentText.includes("2902")) {
          element.textContent = "+34 944 23 29 02";
        } else if (currentText.includes("7959")) {
          element.textContent = "+34 944 23 79 59";
        }
      } else if (element.classList.contains("email-address")) {
        element.textContent = "tasio2012@GMAIL.COM";
      }
    } else {
      // Hide information again
      if (element.classList.contains("phone-number")) {
        if (element.textContent.includes("29 02")) {
          element.textContent = "****2902";
        } else if (element.textContent.includes("79 59")) {
          element.textContent = "****7959";
        }
      } else if (element.classList.contains("email-address")) {
        element.textContent = "****2012@GMAIL.COM";
      }
    }
  });

  // Toggle button text
  const unhideButton = document.querySelector(".unhide-section .btn-secondary");
  if (unhideButton) {
    const isHidden = unhideButton.textContent.includes("Unhide");
    unhideButton.innerHTML = isHidden ? "👁 Hide" : "👁 Unhide";
  }
}
