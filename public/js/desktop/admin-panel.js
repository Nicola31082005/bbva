// Desktop Admin Panel JavaScript Functions

// Global variables
let currentEditId = null;
let currentEditType = null;

// Initialize admin panel
document.addEventListener("DOMContentLoaded", function () {
  console.log("🖥️ Desktop Admin Panel initialized");
  
  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".admin-section");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      switchTab(tabName);
    });
  });

  // Form submissions
  setupFormSubmissions();

  // Set default dates for forms
  setDefaultDates();
  
  // Setup modal close handlers
  setupModalHandlers();
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Set desktop-content as the default active tab
  setTimeout(() => switchTab('desktop-content'), 100);
});

// Tab switching function with animation
function switchTab(tabName) {
  console.log(`🔄 Switching to tab: ${tabName}`);
  
  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Update sections with fade effect
  document.querySelectorAll(".admin-section").forEach((section) => {
    if (section.classList.contains("active")) {
      section.style.opacity = "0";
      setTimeout(() => {
        section.classList.remove("active");
        section.style.opacity = "1";
      }, 150);
    }
  });
  
  setTimeout(() => {
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
      targetSection.classList.add("active");
      targetSection.style.opacity = "0";
      setTimeout(() => {
        targetSection.style.opacity = "1";
      }, 50);
    }
  }, 150);
}

// Setup form submissions
function setupFormSubmissions() {
  // User form
  const userForm = document.getElementById("userForm");
  if (userForm) {
    userForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveUser();
    });
  }

  // Account form
  const accountForm = document.getElementById("accountForm");
  if (accountForm) {
    accountForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveAccount();
    });
  }

  // Card form
  const cardForm = document.getElementById("cardForm");
  if (cardForm) {
    cardForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveCard();
    });
  }

  // Transaction form
  const transactionForm = document.getElementById("transactionForm");
  if (transactionForm) {
    transactionForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveTransaction();
    });
  }

  // Transfer form
  const transferForm = document.getElementById("transferForm");
  if (transferForm) {
    transferForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveTransfer();
    });
  }
}

// Set default dates for forms
function setDefaultDates() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultDateTime = now.toISOString().slice(0, 16);
  
  const transactionDateInput = document.getElementById("transactionDate");
  if (transactionDateInput) {
    transactionDateInput.value = defaultDateTime;
  }

  const transferDateInput = document.getElementById("transferDate");
  if (transferDateInput) {
    transferDateInput.value = defaultDateTime;
  }
}

// Setup modal handlers
function setupModalHandlers() {
  // Close modal when clicking outside
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      const modalId = e.target.id;
      closeModal(modalId);
    }
  });
  
  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal.show");
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + number keys for tab switching
    if ((e.ctrlKey || e.metaKey) && e.key >= "1" && e.key <= "5") {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      const tabs = ["users", "accounts", "cards", "transactions", "transfers"];
      if (tabs[tabIndex]) {
        switchTab(tabs[tabIndex]);
      }
    }
  });
}

// Enhanced modal functions with better UX
function openUserModal(id = null) {
  currentEditId = id;
  currentEditType = "user";

  if (id) {
    document.getElementById("userModalTitle").textContent = "Editar Usuario";
    loadUserData(id);
  } else {
    document.getElementById("userModalTitle").textContent = "Agregar Usuario";
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
  }

  showModal("userModal");
}

function openAccountModal(id = null) {
  currentEditId = id;
  currentEditType = "account";

  if (id) {
    document.getElementById("accountModalTitle").textContent = "Editar Cuenta";
    loadAccountData(id);
  } else {
    document.getElementById("accountModalTitle").textContent = "Agregar Cuenta";
    document.getElementById("accountForm").reset();
    document.getElementById("accountId").value = "";
  }

  showModal("accountModal");
}

function openCardModal(id = null) {
  currentEditId = id;
  currentEditType = "card";

  if (id) {
    document.getElementById("cardModalTitle").textContent = "Editar Tarjeta";
    loadCardData(id);
  } else {
    document.getElementById("cardModalTitle").textContent = "Agregar Tarjeta";
    document.getElementById("cardForm").reset();
    document.getElementById("cardId").value = "";
  }

  showModal("cardModal");
}

function openTransactionModal(id = null) {
  currentEditId = id;
  currentEditType = "transaction";

  if (id) {
    document.getElementById("transactionModalTitle").textContent = "Editar Transacción";
    loadTransactionData(id);
  } else {
    document.getElementById("transactionModalTitle").textContent = "Agregar Transacción";
    document.getElementById("transactionForm").reset();
    document.getElementById("transactionId").value = "";
    
    // Set default date
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById("transactionDate").value = now.toISOString().slice(0, 16);
  }

  showModal("transactionModal");
}

function openTransferModal(id = null) {
  currentEditId = id;
  currentEditType = "transfer";

  if (id) {
    document.getElementById("transferModalTitle").textContent = "Editar Transferencia";
    loadTransferData(id);
  } else {
    document.getElementById("transferModalTitle").textContent = "Agregar Transferencia";
    document.getElementById("transferForm").reset();
    document.getElementById("transferId").value = "";
    
    // Set default date
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById("transferDate").value = now.toISOString().slice(0, 16);
  }

  showModal("transferModal");
}

// Enhanced modal show/hide with animations
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "flex";
    
    // Focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector("input:not([type='hidden']), select, textarea");
      if (firstInput) {
        firstInput.focus();
      }
    }, 300);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
    currentEditId = null;
    currentEditType = null;
  }
}

// Enhanced data loading functions with better error handling
async function loadUserData(id) {
  try {
    showLoadingState("userModal");
    const response = await fetch(`/api/users`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const users = await response.json();
    const user = users.find((u) => u.id === id);

    if (user) {
      document.getElementById("userId").value = user.id;
      document.getElementById("userName").value = user.name || "";
      document.getElementById("userEmail").value = user.email || "";
      document.getElementById("userPhone").value = user.phone || "";
      document.getElementById("userStatus").value = user.status || "active";
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    showMessage("Error cargando los datos del usuario: " + error.message, "error");
  } finally {
    hideLoadingState("userModal");
  }
}

async function loadAccountData(id) {
  try {
    showLoadingState("accountModal");
    const response = await fetch(`/api/accounts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const accounts = await response.json();
    const account = accounts.find((a) => a.id === id);

    if (account) {
      document.getElementById("accountId").value = account.id;
      document.getElementById("accountUserId").value = account.userId || "";
      document.getElementById("accountNumber").value = account.accountNumber || "";
      document.getElementById("accountType").value = account.type || "";
      document.getElementById("accountBalance").value = account.balance || 0;
      document.getElementById("accountCurrency").value = account.currency || "";
      document.getElementById("accountStatus").value = account.status || "active";
    } else {
      throw new Error("Cuenta no encontrada");
    }
  } catch (error) {
    console.error("Error loading account data:", error);
    showMessage("Error cargando los datos de la cuenta: " + error.message, "error");
  } finally {
    hideLoadingState("accountModal");
  }
}

async function loadCardData(id) {
  try {
    showLoadingState("cardModal");
    const response = await fetch(`/api/cards`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cards = await response.json();
    const card = cards.find((c) => c.id === id);

    if (card) {
      document.getElementById("cardId").value = card.id;
      document.getElementById("cardUserId").value = card.userId || "";
      document.getElementById("cardNumber").value = card.cardNumber || "";
      document.getElementById("cardType").value = card.type || "";
      document.getElementById("cardLimit").value = card.limit || 0;
      document.getElementById("cardCurrency").value = card.currency || "";
      document.getElementById("cardStatus").value = card.status || "active";
    } else {
      throw new Error("Tarjeta no encontrada");
    }
  } catch (error) {
    console.error("Error loading card data:", error);
    showMessage("Error cargando los datos de la tarjeta: " + error.message, "error");
  } finally {
    hideLoadingState("cardModal");
  }
}

async function loadTransactionData(id) {
  try {
    showLoadingState("transactionModal");
    const response = await fetch(`/api/transactions`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const transactions = await response.json();
    const transaction = transactions.find((t) => t.id === id);

    if (transaction) {
      document.getElementById("transactionId").value = transaction.id;
      document.getElementById("transactionAccountId").value = transaction.accountId || "";
      document.getElementById("transactionType").value = transaction.type || "";
      document.getElementById("transactionDescription").value = transaction.description || "";
      document.getElementById("transactionAmount").value = Math.abs(transaction.amount || 0);
      document.getElementById("transactionCurrency").value = transaction.currency || "";

      // Format date for datetime-local input
      if (transaction.date) {
        const date = new Date(transaction.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        document.getElementById("transactionDate").value = date.toISOString().slice(0, 16);
      }
    } else {
      throw new Error("Transacción no encontrada");
    }
  } catch (error) {
    console.error("Error loading transaction data:", error);
    showMessage("Error cargando los datos de la transacción: " + error.message, "error");
  } finally {
    hideLoadingState("transactionModal");
  }
}

async function loadTransferData(id) {
  // For now, just show an alert since transfers are derived from transactions
  showMessage("Funcionalidad de edición de transferencias próximamente disponible", "info");
}

// Enhanced save functions with better validation and feedback
async function saveUser() {
  const formData = {
    name: document.getElementById("userName").value.trim(),
    email: document.getElementById("userEmail").value.trim(),
    phone: document.getElementById("userPhone").value.trim(),
    status: document.getElementById("userStatus").value,
  };

  // Validation
  if (!formData.name || !formData.email || !formData.phone) {
    showMessage("Por favor, completa todos los campos obligatorios", "error");
    return;
  }

  if (!isValidEmail(formData.email)) {
    showMessage("Por favor, ingresa un email válido", "error");
    return;
  }

  try {
    showLoadingState("userModal");
    let response;
    
    if (currentEditId) {
      response = await fetch(`/api/users/${currentEditId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    if (response.ok) {
      showMessage(
        `Usuario ${currentEditId ? "actualizado" : "agregado"} correctamente`,
        "success"
      );
      closeModal("userModal");
      setTimeout(() => location.reload(), 1500);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving user:", error);
    showMessage("Error al guardar el usuario: " + error.message, "error");
  } finally {
    hideLoadingState("userModal");
  }
}

async function saveAccount() {
  const formData = {
    userId: parseInt(document.getElementById("accountUserId").value),
    accountNumber: document.getElementById("accountNumber").value.trim(),
    type: document.getElementById("accountType").value,
    balance: parseFloat(document.getElementById("accountBalance").value),
    currency: document.getElementById("accountCurrency").value,
    status: document.getElementById("accountStatus").value,
  };

  // Validation
  if (!formData.userId || !formData.accountNumber || !formData.type || 
      isNaN(formData.balance) || !formData.currency) {
    showMessage("Por favor, completa todos los campos obligatorios", "error");
    return;
  }

  if (formData.balance < 0) {
    showMessage("El balance no puede ser negativo", "error");
    return;
  }

  try {
    showLoadingState("accountModal");
    let response;
    
    if (currentEditId) {
      response = await fetch(`/api/accounts/${currentEditId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    if (response.ok) {
      showMessage(
        `Cuenta ${currentEditId ? "actualizada" : "agregada"} correctamente`,
        "success"
      );
      closeModal("accountModal");
      setTimeout(() => location.reload(), 1500);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving account:", error);
    showMessage("Error al guardar la cuenta: " + error.message, "error");
  } finally {
    hideLoadingState("accountModal");
  }
}

async function saveCard() {
  const formData = {
    userId: parseInt(document.getElementById("cardUserId").value),
    cardNumber: document.getElementById("cardNumber").value.trim(),
    type: document.getElementById("cardType").value,
    limit: parseFloat(document.getElementById("cardLimit").value),
    currency: document.getElementById("cardCurrency").value,
    status: document.getElementById("cardStatus").value,
  };

  // Validation
  if (!formData.userId || !formData.cardNumber || !formData.type || 
      isNaN(formData.limit) || !formData.currency) {
    showMessage("Por favor, completa todos los campos obligatorios", "error");
    return;
  }

  if (formData.limit < 0) {
    showMessage("El límite no puede ser negativo", "error");
    return;
  }

  try {
    showLoadingState("cardModal");
    let response;
    
    if (currentEditId) {
      response = await fetch(`/api/cards/${currentEditId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    if (response.ok) {
      showMessage(
        `Tarjeta ${currentEditId ? "actualizada" : "agregada"} correctamente`,
        "success"
      );
      closeModal("cardModal");
      setTimeout(() => location.reload(), 1500);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving card:", error);
    showMessage("Error al guardar la tarjeta: " + error.message, "error");
  } finally {
    hideLoadingState("cardModal");
  }
}

async function saveTransaction() {
  let amount = parseFloat(document.getElementById("transactionAmount").value);
  const type = document.getElementById("transactionType").value;

  // Adjust amount based on type
  if (type === "debit" && amount > 0) {
    amount = -amount;
  }

  const formData = {
    accountId: parseInt(document.getElementById("transactionAccountId").value),
    type: type,
    description: document.getElementById("transactionDescription").value.trim(),
    amount: amount,
    currency: document.getElementById("transactionCurrency").value,
    date: document.getElementById("transactionDate").value,
  };

  // Validation
  if (!formData.accountId || !formData.type || !formData.description || 
      isNaN(formData.amount) || !formData.currency || !formData.date) {
    showMessage("Por favor, completa todos los campos obligatorios", "error");
    return;
  }

  if (Math.abs(formData.amount) <= 0) {
    showMessage("El monto debe ser mayor que 0", "error");
    return;
  }

  try {
    showLoadingState("transactionModal");
    let response;
    
    if (currentEditId) {
      response = await fetch(`/api/transactions/${currentEditId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    if (response.ok) {
      showMessage(
        `Transacción ${currentEditId ? "actualizada" : "agregada"} correctamente`,
        "success"
      );
      closeModal("transactionModal");
      setTimeout(() => location.reload(), 1500);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving transaction:", error);
    showMessage("Error al guardar la transacción: " + error.message, "error");
  } finally {
    hideLoadingState("transactionModal");
  }
}

async function saveTransfer() {
  const formData = {
    transferType: document.getElementById("transferType").value,
    fromAccountId: parseInt(document.getElementById("transferFromAccount").value),
    recipientName: document.getElementById("transferRecipientName").value.trim(),
    recipientAccount: document.getElementById("transferRecipientAccount").value.trim(),
    description: document.getElementById("transferDescription").value.trim(),
    amount: parseFloat(document.getElementById("transferAmount").value),
    currency: document.getElementById("transferCurrency").value,
    status: document.getElementById("transferStatus").value,
    date: document.getElementById("transferDate").value,
  };

  // Validation
  if (!formData.transferType || !formData.fromAccountId || !formData.recipientName || 
      !formData.recipientAccount || !formData.description || isNaN(formData.amount) || 
      !formData.currency || !formData.status || !formData.date) {
    showMessage("Por favor, completa todos los campos obligatorios", "error");
    return;
  }

  if (formData.amount <= 0) {
    showMessage("El monto debe ser mayor que 0", "error");
    return;
  }

  try {
    showLoadingState("transferModal");
    
    // For now, we'll just show a success message since transfers are derived from transactions
    // In a real application, you would have a separate transfers API endpoint
    showMessage(
      currentEditId
        ? "Transferencia actualizada exitosamente"
        : "Transferencia registrada exitosamente",
      "success"
    );
    closeModal("transferModal");
    
    // Simulate adding the transfer to the UI
    setTimeout(() => {
      console.log("Transfer data:", formData);
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.error("Error saving transfer:", error);
    showMessage("Error al guardar la transferencia: " + error.message, "error");
  } finally {
    hideLoadingState("transferModal");
  }
}

// Edit functions
function editUser(id) {
  openUserModal(id);
}

function editAccount(id) {
  openAccountModal(id);
}

function editCard(id) {
  openCardModal(id);
}

function editTransaction(id) {
  openTransactionModal(id);
}

function editTransfer(id) {
  openTransferModal(id);
}

// Enhanced delete functions with better confirmation
async function deleteUser(id) {
  if (await showConfirmDialog(
    "¿Estás seguro de que quieres eliminar este usuario?",
    "Esta acción no se puede deshacer y eliminará todos los datos asociados."
  )) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Usuario eliminado correctamente", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showMessage("Error al eliminar el usuario: " + error.message, "error");
    }
  }
}

async function deleteAccount(id) {
  if (await showConfirmDialog(
    "¿Estás seguro de que quieres eliminar esta cuenta?",
    "Esta acción no se puede deshacer y eliminará todas las transacciones asociadas."
  )) {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Cuenta eliminada correctamente", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showMessage("Error al eliminar la cuenta: " + error.message, "error");
    }
  }
}

async function deleteCard(id) {
  if (await showConfirmDialog(
    "¿Estás seguro de que quieres eliminar esta tarjeta?",
    "Esta acción no se puede deshacer."
  )) {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Tarjeta eliminada correctamente", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      showMessage("Error al eliminar la tarjeta: " + error.message, "error");
    }
  }
}

async function deleteTransaction(id) {
  if (await showConfirmDialog(
    "¿Estás seguro de que quieres eliminar esta transacción?",
    "Esta acción actualizará el balance de la cuenta asociada."
  )) {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Transacción eliminada correctamente", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showMessage("Error al eliminar la transacción: " + error.message, "error");
    }
  }
}

async function deleteTransfer(id) {
  if (await showConfirmDialog(
    "¿Estás seguro de que quieres eliminar esta transferencia?",
    "Esta acción no se puede deshacer."
  )) {
    // For now, just show a success message since transfers are derived from transactions
    showMessage("Transferencia eliminada exitosamente", "success");
    setTimeout(() => window.location.reload(), 1500);
  }
}

// Utility functions
function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".message");
  existingMessages.forEach((msg) => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 300);
  });

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `
    <i class="icon">${getMessageIcon(type)}</i>
    <span>${message}</span>
  `;

  // Insert at the top of the content area
  const contentArea = document.querySelector(".content-area");
  contentArea.insertBefore(messageDiv, contentArea.firstChild);

  // Animate in
  setTimeout(() => {
    messageDiv.style.opacity = "1";
  }, 100);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

function getMessageIcon(type) {
  switch (type) {
    case "success": return "✅";
    case "error": return "❌";
    case "warning": return "⚠️";
    case "info": return "ℹ️";
    default: return "📝";
  }
}

function showLoadingState(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const submitBtn = modal.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Guardando...';
    }
  }
}

function hideLoadingState(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const submitBtn = modal.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Guardar';
    }
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function showConfirmDialog(title, message) {
  return new Promise((resolve) => {
    const confirmed = confirm(`${title}\n\n${message}`);
    resolve(confirmed);
  });
}

// Update transaction amount input based on type
document.addEventListener("change", function (e) {
  if (e.target.id === "transactionType") {
    const amountInput = document.getElementById("transactionAmount");
    if (amountInput) {
      const currentValue = Math.abs(parseFloat(amountInput.value) || 0);
      amountInput.value = currentValue;
    }
  }
});

// Enhanced table interactions
document.addEventListener("DOMContentLoaded", function() {
  // Add hover effects to table rows
  const tableRows = document.querySelectorAll(".admin-table tbody tr");
  tableRows.forEach(row => {
    row.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.01)";
      this.style.transition = "transform 0.2s ease";
    });
    
    row.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
    });
  });
});

// Desktop Content Management Functions
function openDesktopContentModal() {
  showModal("desktopContentModal");
}

function editDesktopContent(page) {
  currentEditId = page;
  currentEditType = "desktopContent";
  
  document.getElementById("desktopContentModalTitle").textContent = `Editar Contenido - ${page}`;
  document.getElementById("desktopContentPage").value = page;
  
  // Load current data based on page
  loadDesktopContentData(page);
  showModal("desktopContentModal");
}

async function loadDesktopContentData(page) {
  try {
    // Fetch current desktop data from the server
    const response = await fetch('/api/desktop-data');
    const serverData = await response.json();
    
    let data = {};
    
    if (page === 'mainPage') {
      data = {
        welcomeMessage: serverData.desktopData.mainPage.welcomeMessage,
        lastConnection: serverData.desktopData.mainPage.lastConnection,
        totalBalance: serverData.desktopData.mainPage.totalBalance,
        contactPhone: serverData.desktopData.mainPage.contactPhone,
        contactTeam: serverData.desktopData.mainPage.contactTeam,
        appointmentText: serverData.desktopData.mainPage.appointmentText
      };
    } else if (page === 'accounts') {
      data = {
        welcomeMessage: serverData.desktopData.accounts.pageTitle,
        lastConnection: serverData.desktopData.accounts.accountNumber,
        totalBalance: serverData.desktopData.accounts.currentBalance,
        contactPhone: serverData.desktopData.accounts.contactPhone,
        contactTeam: serverData.desktopData.accounts.contactTeam,
        appointmentText: serverData.desktopData.accounts.appointmentText
      };
    } else if (page === 'mortgages') {
      data = {
        welcomeMessage: serverData.desktopData.mortgages.pageTitle,
        lastConnection: serverData.desktopData.mortgages.contactDescription,
        totalBalance: "-",
        contactPhone: serverData.desktopData.mortgages.contactPhone,
        contactTeam: "Mortgage Team",
        appointmentText: "Schedule an Appointment"
      };
    }
    
    document.getElementById("welcomeMessage").value = data.welcomeMessage || "";
    document.getElementById("lastConnection").value = data.lastConnection || "";
    document.getElementById("totalBalance").value = data.totalBalance || "";
    document.getElementById("contactPhone").value = data.contactPhone || "";
    document.getElementById("contactTeam").value = data.contactTeam || "";
    document.getElementById("appointmentText").value = data.appointmentText || "";
  } catch (error) {
    console.error("Error loading desktop content data:", error);
    showMessage("Error cargando los datos del contenido", "error");
  }
}

// Operations Management Functions
function openOperationModal(id = null) {
  currentEditId = id;
  currentEditType = "operation";

  if (id) {
    document.getElementById("operationModalTitle").textContent = "Editar Operación";
    loadOperationData(id);
  } else {
    document.getElementById("operationModalTitle").textContent = "Agregar Operación";
    document.getElementById("operationForm").reset();
    document.getElementById("operationId").value = "";
  }

  showModal("operationModal");
}

function editOperation(id) {
  openOperationModal(id);
}

async function loadOperationData(id) {
  try {
    // For now, we'll use mock data since we don't have a real API
    // In a real application, you would fetch this from an API
    const operations = [
      {
        id: 1,
        title: "Transfers to other banks and transfers within the bank",
        description: "You can make a domestic transfer and send your money immediately, on a one-off basis or scheduled.",
        linkText: "Make a transfer to another bank or transfer within the bank"
      },
      {
        id: 2,
        title: "Send / Request Bizum",
        description: "All you need is your cell phone to send money to a friend, shop online or donate to the cause of your choice.",
        linkText: "Go to Bizum"
      }
    ];
    
    const operation = operations.find(op => op.id === id);
    if (operation) {
      document.getElementById("operationId").value = operation.id;
      document.getElementById("operationTitle").value = operation.title;
      document.getElementById("operationDescription").value = operation.description;
      document.getElementById("operationLinkText").value = operation.linkText;
    }
  } catch (error) {
    console.error("Error loading operation data:", error);
    showMessage("Error cargando los datos de la operación", "error");
  }
}

async function deleteOperation(id) {
  if (await showConfirmDialog(
    "¿Estás seguro de que quieres eliminar esta operación?",
    "Esta acción no se puede deshacer."
  )) {
    try {
      const response = await fetch(`/api/desktop-operations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        showMessage("Operación eliminada correctamente", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting operation:", error);
      showMessage("Error al eliminar la operación: " + error.message, "error");
    }
  }
}

// Mortgage Products Management Functions
function openMortgageProductModal(id = null) {
  currentEditId = id;
  currentEditType = "mortgageProduct";

  if (id) {
    document.getElementById("mortgageProductModalTitle").textContent = "Editar Producto Hipotecario";
    loadMortgageProductData(id);
  } else {
    document.getElementById("mortgageProductModalTitle").textContent = "Agregar Producto Hipotecario";
    document.getElementById("mortgageProductForm").reset();
    document.getElementById("mortgageProductId").value = "";
  }

  showModal("mortgageProductModal");
}

function editMortgageProduct(id) {
  openMortgageProductModal(id);
}

async function loadMortgageProductData(id) {
  try {
    // For now, we'll use mock data since we don't have a real API
    const products = [
      {
        id: 1,
        title: "Home Mortgage",
        description: "Finance your dream home with competitive interest rates.",
        features: ["Up to 80% financing", "Fixed and variable rates", "Up to 30 years term"]
      },
      {
        id: 2,
        title: "Personal Loan",
        description: "Quick approval for your personal projects and needs.",
        features: ["Up to €60,000", "Fast approval process", "Flexible repayment terms"]
      }
    ];
    
    const product = products.find(p => p.id === id);
    if (product) {
      document.getElementById("mortgageProductId").value = product.id;
      document.getElementById("productTitle").value = product.title;
      document.getElementById("productDescription").value = product.description;
      document.getElementById("productFeatures").value = product.features.join(", ");
    }
  } catch (error) {
    console.error("Error loading mortgage product data:", error);
    showMessage("Error cargando los datos del producto", "error");
  }
}

async function deleteMortgageProduct(id) {
  if (await showConfirmDialog(
    "¿Estás seguro de que quieres eliminar este producto hipotecario?",
    "Esta acción no se puede deshacer."
  )) {
    try {
      const response = await fetch(`/api/desktop-mortgage-products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        showMessage("Producto hipotecario eliminado correctamente", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting mortgage product:", error);
      showMessage("Error al eliminar el producto: " + error.message, "error");
    }
  }
}

// Setup form submissions for new desktop-specific forms
document.addEventListener("DOMContentLoaded", function() {
  // Desktop content form
  const desktopContentForm = document.getElementById("desktopContentForm");
  if (desktopContentForm) {
    desktopContentForm.addEventListener("submit", function(e) {
      e.preventDefault();
      saveDesktopContent();
    });
  }

  // Operation form
  const operationForm = document.getElementById("operationForm");
  if (operationForm) {
    operationForm.addEventListener("submit", function(e) {
      e.preventDefault();
      saveOperation();
    });
  }

  // Mortgage product form
  const mortgageProductForm = document.getElementById("mortgageProductForm");
  if (mortgageProductForm) {
    mortgageProductForm.addEventListener("submit", function(e) {
      e.preventDefault();
      saveMortgageProduct();
    });
  }
});

// Save functions for desktop-specific data
async function saveDesktopContent() {
  const formData = {
    page: document.getElementById("desktopContentPage").value,
    welcomeMessage: document.getElementById("welcomeMessage").value.trim(),
    lastConnection: document.getElementById("lastConnection").value.trim(),
    totalBalance: document.getElementById("totalBalance").value.trim(),
    contactPhone: document.getElementById("contactPhone").value.trim(),
    contactTeam: document.getElementById("contactTeam").value.trim(),
    appointmentText: document.getElementById("appointmentText").value.trim()
  };

  // Validation
  if (!formData.welcomeMessage || !formData.contactPhone) {
    showMessage("Por favor, completa los campos obligatorios", "error");
    return;
  }

  try {
    showLoadingState("desktopContentModal");
    
    const response = await fetch('/api/desktop-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const result = await response.json();
      showMessage("Contenido desktop actualizado correctamente", "success");
      closeModal("desktopContentModal");
      setTimeout(() => location.reload(), 1500);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving desktop content:", error);
    showMessage("Error al guardar el contenido: " + error.message, "error");
  } finally {
    hideLoadingState("desktopContentModal");
  }
}

async function saveOperation() {
  const formData = {
    title: document.getElementById("operationTitle").value.trim(),
    description: document.getElementById("operationDescription").value.trim(),
    linkText: document.getElementById("operationLinkText").value.trim()
  };

  // Validation
  if (!formData.title || !formData.description || !formData.linkText) {
    showMessage("Por favor, completa todos los campos obligatorios", "error");
    return;
  }

  try {
    showLoadingState("operationModal");
    
    let response;
    if (currentEditId) {
      // Update existing operation
      response = await fetch(`/api/desktop-operations/${currentEditId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    } else {
      // Add new operation
      response = await fetch('/api/desktop-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    }

    if (response.ok) {
      const result = await response.json();
      showMessage(
        currentEditId ? "Operación actualizada correctamente" : "Operación agregada correctamente",
        "success"
      );
      closeModal("operationModal");
      setTimeout(() => location.reload(), 1500);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving operation:", error);
    showMessage("Error al guardar la operación: " + error.message, "error");
  } finally {
    hideLoadingState("operationModal");
  }
}

async function saveMortgageProduct() {
  const formData = {
    title: document.getElementById("productTitle").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
    features: document.getElementById("productFeatures").value.trim().split(",").map(f => f.trim()).filter(f => f)
  };

  // Validation
  if (!formData.title || !formData.description || formData.features.length === 0) {
    showMessage("Por favor, completa todos los campos obligatorios", "error");
    return;
  }

  try {
    showLoadingState("mortgageProductModal");
    
    let response;
    if (currentEditId) {
      // Update existing mortgage product
      response = await fetch(`/api/desktop-mortgage-products/${currentEditId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    } else {
      // Add new mortgage product
      response = await fetch('/api/desktop-mortgage-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    }

    if (response.ok) {
      const result = await response.json();
      showMessage(
        currentEditId ? "Producto hipotecario actualizado correctamente" : "Producto hipotecario agregado correctamente",
        "success"
      );
      closeModal("mortgageProductModal");
      setTimeout(() => location.reload(), 1500);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving mortgage product:", error);
    showMessage("Error al guardar el producto: " + error.message, "error");
  } finally {
    hideLoadingState("mortgageProductModal");
  }
}

console.log("🖥️ Desktop Admin Panel JavaScript loaded successfully");
