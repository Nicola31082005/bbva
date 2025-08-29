// Inline Editor for Admin Mode
// Handles click-to-edit functionality with auto-save

class InlineEditor {
  constructor() {
    this.currentEditElement = null;
    this.originalValue = null;
    this.saveTimeout = null;
    this.isEditing = false;

    this.init();
  }

  init() {
    console.log("🛠️ Admin Inline Editor initialized");
    console.log("📍 Current page:", window.location.href);
    console.log("🔗 Base URL:", window.location.origin);

    // Add event listeners
    this.addEventListeners();

    // Test API connectivity
    this.testApiConnectivity();

    // Show initial toast
    this.showToast(
      "Modo de edición activado. Haz clic en cualquier elemento para editarlo. Usa los botones Guardar/Cancelar.",
      "success"
    );
  }

  addEventListeners() {
    // Click events for editable fields
    document.addEventListener("click", (e) => {
      const editableField = e.target.closest(".editable-field");

      if (editableField && !this.isEditing) {
        e.preventDefault();
        e.stopPropagation();
        this.startEdit(editableField);
      } else if (this.isEditing && !e.target.closest(".editable-field")) {
        // Click outside - save current edit
        this.finishEdit();
      }
    });

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (this.isEditing) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.finishEdit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          this.cancelEdit();
        }
      }
    });

    // Remove auto-save - now using manual save buttons
    // document.addEventListener("input", (e) => {
    //   if (e.target.classList.contains("editable-field")) {
    //     // Auto-save removed per user request
    //   }
    // });
  }

  startEdit(element) {
    // Finish any existing edit first
    if (this.currentEditElement) {
      this.finishEdit();
    }

    this.currentEditElement = element;
    this.originalValue = this.getElementValue(element);
    this.isEditing = true;

    // Visual feedback
    element.classList.add("editing");
    element.setAttribute("contenteditable", "true");

    // Focus and select text
    element.focus();
    this.selectAllText(element);

    // Add save/cancel buttons
    this.addEditControls(element);

    console.log("📝 Started editing:", {
      entity: element.dataset.entity,
      id: element.dataset.id,
      field: element.dataset.field,
      value: this.originalValue,
    });
  }

  finishEdit() {
    if (!this.currentEditElement || !this.isEditing) return;

    const element = this.currentEditElement;
    const newValue = this.getElementValue(element);

    // Clear timeouts
    clearTimeout(this.saveTimeout);

    // Save if changed
    if (newValue !== this.originalValue) {
      this.saveField(element, newValue);
    }

    // Clean up
    this.cleanupEdit(element);
  }

  cancelEdit() {
    if (!this.currentEditElement || !this.isEditing) return;

    const element = this.currentEditElement;

    // Restore original value
    this.setElementValue(element, this.originalValue);

    // Clean up
    this.cleanupEdit(element);

    this.showToast("Edición cancelada", "warning");
  }

  cleanupEdit(element) {
    element.classList.remove("editing");
    element.setAttribute("contenteditable", "false");
    element.blur();

    // Remove edit controls
    this.removeEditControls(element);

    this.currentEditElement = null;
    this.originalValue = null;
    this.isEditing = false;
  }

  async testApiConnectivity() {
    try {
      const testUrl = new URL("/api/test", window.location.origin);
      console.log("🧪 Testing API connectivity to:", testUrl.toString());

      const response = await fetch(testUrl);
      if (response.ok) {
        const result = await response.json();
        console.log("✅ API connectivity test passed:", result);
      } else {
        console.error("❌ API connectivity test failed:", response.status);
      }
    } catch (error) {
      console.error("❌ API connectivity test error:", error);
    }
  }

  // autoSave method removed - using manual save buttons now

  async saveField(element, value) {
    const entity = element.dataset.entity;
    const id = element.dataset.id;
    const field = element.dataset.field;

    console.log("💾 Saving field:", { entity, id, field, rawValue: value });

    if (!entity || !id || !field) {
      console.error("Missing required data attributes:", { entity, id, field });
      this.showToast("Error: Faltan atributos de datos", "error");
      return false;
    }

    const processedValue = this.processValue(field, value);
    console.log("🔄 Processed value:", {
      original: value,
      processed: processedValue,
    });

    // Show saving state
    this.showSavingState(element, true);

    try {
      const apiUrl = new URL("/api/update-field", window.location.origin);
      console.log("🌐 API URL:", apiUrl.toString());

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity,
          id: parseInt(id),
          field,
          value: processedValue,
        }),
      });

      console.log("📡 Response status:", response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Field saved successfully:", result);

        // Update original value
        this.originalValue = value;

        // Visual feedback
        this.showSuccessAnimation(element);
        this.showToast(
          `Guardado: ${result.newValue || processedValue}`,
          "success"
        );

        return true;
      } else {
        console.error(
          "❌ Response not OK:",
          response.status,
          response.statusText
        );
        const responseText = await response.text();
        console.error("📄 Response body:", responseText);

        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        } catch (parseError) {
          throw new Error(
            `Server returned HTML instead of JSON. Status: ${response.status}. Possible redirect or authentication issue.`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error saving field:", error);
      this.showToast(`Error al guardar: ${error.message}`, "error");

      // Revert to original value
      this.setElementValue(element, this.originalValue);

      return false;
    } finally {
      this.showSavingState(element, false);
    }
  }

  getElementValue(element) {
    // Get text content and clean it up
    let value = element.textContent.replace(/✏️/g, "").trim();

    // Remove currency symbols and extra whitespace for numeric fields
    const field = element.dataset.field;
    if (field && ["balance", "limit", "amount"].includes(field)) {
      // Remove common currency symbols and extra spaces
      value = value
        .replace(/[€$£¥]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    console.log("📖 Getting element value:", {
      field: field,
      raw: element.textContent,
      cleaned: value,
    });
    return value;
  }

  setElementValue(element, value) {
    const editIndicator = element.querySelector(".edit-indicator");

    // Format numeric values for display
    const field = element.dataset.field;
    let displayValue = value;

    if (field && ["balance", "limit", "amount"].includes(field)) {
      // Format numbers with 2 decimal places using Spanish format
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        displayValue = numValue.toFixed(2).replace(".", ",");
      }
    }

    element.textContent = displayValue;
    console.log("✏️ Setting element value:", {
      field: field,
      original: value,
      display: displayValue,
    });

    // Re-add edit indicator if it existed
    if (editIndicator) {
      element.appendChild(editIndicator);
    }
  }

  processValue(field, value) {
    // Handle numeric fields
    if (["balance", "limit", "amount"].includes(field)) {
      // Handle both Spanish format (comma as decimal) and English format (period as decimal)
      let numericValue = value;

      // If it contains both comma and period, assume comma is thousands separator
      if (numericValue.includes(",") && numericValue.includes(".")) {
        // Format like "1,234.56" - remove comma (thousands separator)
        numericValue = numericValue.replace(/,/g, "");
      } else if (numericValue.includes(",") && !numericValue.includes(".")) {
        // Format like "400,01" - replace comma with period (decimal separator)
        numericValue = numericValue.replace(",", ".");
      }

      const parsed = parseFloat(numericValue);
      console.log("🔢 Number parsing:", {
        original: value,
        cleaned: numericValue,
        parsed: parsed,
      });
      return isNaN(parsed) ? 0 : parsed;
    }

    // Handle ID fields
    if (field.endsWith("Id")) {
      return parseInt(value) || null;
    }

    // Handle date fields
    if (field === "date") {
      return new Date(value).toISOString();
    }

    return value;
  }

  selectAllText(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  addEditControls(element) {
    // Remove any existing controls first
    this.removeEditControls(element);

    const controlsDiv = document.createElement("div");
    controlsDiv.className = "edit-controls";

    const saveBtn = document.createElement("button");
    saveBtn.className = "edit-btn save-btn";
    saveBtn.innerHTML = "💾 Guardar";
    saveBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.finishEdit();
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "edit-btn cancel-btn";
    cancelBtn.innerHTML = "❌ Cancelar";
    cancelBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.cancelEdit();
    };

    controlsDiv.appendChild(saveBtn);
    controlsDiv.appendChild(cancelBtn);

    // Insert controls after the element
    element.parentNode.insertBefore(controlsDiv, element.nextSibling);
  }

  removeEditControls(element) {
    const controls = element.parentNode.querySelector(".edit-controls");
    if (controls) {
      controls.remove();
    }
  }

  addSavingIndicator(element) {
    const indicator = document.createElement("span");
    indicator.className = "saving-indicator";
    element.parentNode.insertBefore(indicator, element.nextSibling);
  }

  removeSavingIndicator(element) {
    const indicator = element.parentNode.querySelector(".saving-indicator");
    if (indicator) {
      indicator.remove();
    }
  }

  showSavingState(element, isSaving) {
    const indicator = element.parentNode.querySelector(".saving-indicator");
    if (indicator) {
      indicator.classList.toggle("visible", isSaving);
    }
  }

  showSuccessAnimation(element) {
    element.classList.add("edit-success");
    setTimeout(() => {
      element.classList.remove("edit-success");
    }, 600);
  }

  showToast(message, type = "success") {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll(".admin-toast");
    existingToasts.forEach((toast) => toast.remove());

    // Create new toast
    const toast = document.createElement("div");
    toast.className = `admin-toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add("show"), 100);

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Admin utility functions
function exitAdminMode() {
  if (confirm("¿Estás seguro de que quieres salir del modo de edición?")) {
    // Redirect to main page without admin parameter to exit admin mode
    window.location.href = "/main-page?admin=false";
  }
}

// Initialize inline editor when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if in admin mode
  if (document.querySelector('[data-admin-mode="true"]')) {
    window.inlineEditor = new InlineEditor();
  }
});

// Make functions globally available
window.exitAdminMode = exitAdminMode;
