// Admin Panel JavaScript Functions

// Global variables
let currentEditId = null;
let currentEditType = null;

// Initialize admin panel
document.addEventListener("DOMContentLoaded", function () {
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

  // Set default date for transaction form
  const transactionDateInput = document.getElementById("transactionDate");
  if (transactionDateInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    transactionDateInput.value = now.toISOString().slice(0, 16);
  }
});

// Tab switching function
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Update sections
  document.querySelectorAll(".admin-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(tabName).classList.add("active");
}

// Setup form submissions
function setupFormSubmissions() {
  // User form
  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();
    saveUser();
  });

  // Account form
  document
    .getElementById("accountForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      saveAccount();
    });

  // Card form
  document.getElementById("cardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    saveCard();
  });

  // Transaction form
  document
    .getElementById("transactionForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      saveTransaction();
    });
}

// Modal functions
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
    document.getElementById("transactionModalTitle").textContent =
      "Editar Transacción";
    loadTransactionData(id);
  } else {
    document.getElementById("transactionModalTitle").textContent =
      "Agregar Transacción";
    document.getElementById("transactionForm").reset();
    document.getElementById("transactionId").value = "";

    // Set default date
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById("transactionDate").value = now
      .toISOString()
      .slice(0, 16);
  }

  showModal("transactionModal");
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("show");
  modal.style.display = "flex";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("show");
  modal.style.display = "none";
  currentEditId = null;
  currentEditType = null;
}

// Close modal when clicking outside
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    const modalId = e.target.id;
    closeModal(modalId);
  }
});

// Load data functions
async function loadUserData(id) {
  try {
    const response = await fetch(`/api/users`);
    const users = await response.json();
    const user = users.find((u) => u.id === id);

    if (user) {
      document.getElementById("userId").value = user.id;
      document.getElementById("userName").value = user.name;
      document.getElementById("userEmail").value = user.email;
      document.getElementById("userPhone").value = user.phone;
      document.getElementById("userStatus").value = user.status;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    showMessage("Error cargando los datos del usuario", "error");
  }
}

async function loadAccountData(id) {
  try {
    const response = await fetch(`/api/accounts`);
    const accounts = await response.json();
    const account = accounts.find((a) => a.id === id);

    if (account) {
      document.getElementById("accountId").value = account.id;
      document.getElementById("accountUserId").value = account.userId;
      document.getElementById("accountNumber").value = account.accountNumber;
      document.getElementById("accountType").value = account.type;
      document.getElementById("accountBalance").value = account.balance;
      document.getElementById("accountCurrency").value = account.currency;
      document.getElementById("accountStatus").value = account.status;
    }
  } catch (error) {
    console.error("Error loading account data:", error);
    showMessage("Error cargando los datos de la cuenta", "error");
  }
}

async function loadCardData(id) {
  try {
    const response = await fetch(`/api/cards`);
    const cards = await response.json();
    const card = cards.find((c) => c.id === id);

    if (card) {
      document.getElementById("cardId").value = card.id;
      document.getElementById("cardUserId").value = card.userId;
      document.getElementById("cardNumber").value = card.cardNumber;
      document.getElementById("cardType").value = card.type;
      document.getElementById("cardLimit").value = card.limit;
      document.getElementById("cardCurrency").value = card.currency;
      document.getElementById("cardStatus").value = card.status;
    }
  } catch (error) {
    console.error("Error loading card data:", error);
    showMessage("Error cargando los datos de la tarjeta", "error");
  }
}

async function loadTransactionData(id) {
  try {
    const response = await fetch(`/api/transactions`);
    const transactions = await response.json();
    const transaction = transactions.find((t) => t.id === id);

    if (transaction) {
      document.getElementById("transactionId").value = transaction.id;
      document.getElementById("transactionAccountId").value =
        transaction.accountId;
      document.getElementById("transactionType").value = transaction.type;
      document.getElementById("transactionDescription").value =
        transaction.description;
      document.getElementById("transactionAmount").value = Math.abs(
        transaction.amount
      );
      document.getElementById("transactionCurrency").value =
        transaction.currency;

      // Format date for datetime-local input
      const date = new Date(transaction.date);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      document.getElementById("transactionDate").value = date
        .toISOString()
        .slice(0, 16);
    }
  } catch (error) {
    console.error("Error loading transaction data:", error);
    showMessage("Error cargando los datos de la transacción", "error");
  }
}

// Save functions
async function saveUser() {
  const formData = {
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    phone: document.getElementById("userPhone").value,
    status: document.getElementById("userStatus").value,
  };

  try {
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
      setTimeout(() => location.reload(), 1000);
    } else {
      throw new Error("Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving user:", error);
    showMessage("Error al guardar el usuario", "error");
  }
}

async function saveAccount() {
  const formData = {
    userId: parseInt(document.getElementById("accountUserId").value),
    accountNumber: document.getElementById("accountNumber").value,
    type: document.getElementById("accountType").value,
    balance: parseFloat(document.getElementById("accountBalance").value),
    currency: document.getElementById("accountCurrency").value,
    status: document.getElementById("accountStatus").value,
  };

  try {
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
      setTimeout(() => location.reload(), 1000);
    } else {
      throw new Error("Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving account:", error);
    showMessage("Error al guardar la cuenta", "error");
  }
}

async function saveCard() {
  const formData = {
    userId: parseInt(document.getElementById("cardUserId").value),
    cardNumber: document.getElementById("cardNumber").value,
    type: document.getElementById("cardType").value,
    limit: parseFloat(document.getElementById("cardLimit").value),
    currency: document.getElementById("cardCurrency").value,
    status: document.getElementById("cardStatus").value,
  };

  try {
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
      setTimeout(() => location.reload(), 1000);
    } else {
      throw new Error("Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving card:", error);
    showMessage("Error al guardar la tarjeta", "error");
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
    description: document.getElementById("transactionDescription").value,
    amount: amount,
    currency: document.getElementById("transactionCurrency").value,
    date: document.getElementById("transactionDate").value,
  };

  try {
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
        `Transacción ${
          currentEditId ? "actualizada" : "agregada"
        } correctamente`,
        "success"
      );
      closeModal("transactionModal");
      setTimeout(() => location.reload(), 1000);
    } else {
      throw new Error("Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error saving transaction:", error);
    showMessage("Error al guardar la transacción", "error");
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

// Delete functions
async function deleteUser(id) {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
    )
  ) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Usuario eliminado correctamente", "success");
        setTimeout(() => location.reload(), 1000);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showMessage("Error al eliminar el usuario", "error");
    }
  }
}

async function deleteAccount(id) {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no se puede deshacer."
    )
  ) {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Cuenta eliminada correctamente", "success");
        setTimeout(() => location.reload(), 1000);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showMessage("Error al eliminar la cuenta", "error");
    }
  }
}

async function deleteCard(id) {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar esta tarjeta? Esta acción no se puede deshacer."
    )
  ) {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Tarjeta eliminada correctamente", "success");
        setTimeout(() => location.reload(), 1000);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      showMessage("Error al eliminar la tarjeta", "error");
    }
  }
}

async function deleteTransaction(id) {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar esta transacción? Esta acción actualizará el balance de la cuenta."
    )
  ) {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Transacción eliminada correctamente", "success");
        setTimeout(() => location.reload(), 1000);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showMessage("Error al eliminar la transacción", "error");
    }
  }
}

// Utility functions
function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".message");
  existingMessages.forEach((msg) => msg.remove());

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  // Insert at the top of the main content
  const adminMain = document.querySelector(".admin-main");
  adminMain.insertBefore(messageDiv, adminMain.firstChild);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Update transaction amount input based on type
document.addEventListener("change", function (e) {
  if (e.target.id === "transactionType") {
    const amountInput = document.getElementById("transactionAmount");
    const currentValue = Math.abs(parseFloat(amountInput.value) || 0);
    amountInput.value = currentValue;
  }
});
