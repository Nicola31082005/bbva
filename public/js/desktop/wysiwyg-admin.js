// WYSIWYG Admin Mode JavaScript
let editMode = true;
let pendingChanges = new Map();
let currentEditor = null;

// Initialize WYSIWYG mode when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelector('.wysiwyg-mode')) {
    initializeWysiwygMode();
  }
});

function initializeWysiwygMode() {
  console.log("🎨 WYSIWYG Admin Mode initialized");
  
  // Add changes indicator
  addChangesIndicator();
  
  // Add click handlers to editable elements
  setupEditableElements();
  
  // Add keyboard shortcuts
  setupKeyboardShortcuts();
}

function addChangesIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'wysiwyg-changes-indicator';
  indicator.id = 'changesIndicator';
  indicator.innerHTML = `
    <span>💾</span>
    <span id="changesCount">0</span>
    <span>unsaved changes</span>
  `;
  document.body.appendChild(indicator);
}

function setupEditableElements() {
  const editableElements = document.querySelectorAll('.editable');
  
  editableElements.forEach(element => {
    element.addEventListener('click', function(e) {
      if (!editMode) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      openInlineEditor(this);
    });
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Escape key - close editor
    if (e.key === 'Escape' && currentEditor) {
      closeInlineEditor();
    }
    
    // Ctrl+S - save all changes
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveAllChanges();
    }
    
    // Ctrl+E - toggle edit mode
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      toggleEditMode();
    }
  });
}

function openInlineEditor(element) {
  // Close existing editor
  if (currentEditor) {
    closeInlineEditor();
  }
  
  const field = element.dataset.field;
  const page = element.dataset.page;
  const type = element.dataset.type;
  const id = element.dataset.id;
  const currentValue = element.textContent.trim();
  
  // Mark element as editing
  element.classList.add('editing');
  
  // Create editor
  const editor = document.createElement('div');
  editor.className = 'inline-editor';
  editor.innerHTML = `
    <div class="inline-editor-header">
      <span class="inline-editor-title">Edit ${field}</span>
      <button class="inline-editor-close" onclick="closeInlineEditor()">×</button>
    </div>
    <div class="inline-editor-body">
      ${type === 'textarea' 
        ? `<textarea class="inline-editor-textarea" placeholder="Enter ${field}...">${currentValue}</textarea>`
        : `<input type="text" class="inline-editor-input" placeholder="Enter ${field}..." value="${currentValue}">`
      }
      <div class="inline-editor-actions">
        <button class="inline-editor-btn inline-editor-btn-cancel" onclick="closeInlineEditor()">Cancel</button>
        <button class="inline-editor-btn inline-editor-btn-save" onclick="saveInlineEdit()">Save</button>
      </div>
    </div>
  `;
  
  // Position editor near the element
  const rect = element.getBoundingClientRect();
  editor.style.left = Math.min(rect.left, window.innerWidth - 350) + 'px';
  editor.style.top = (rect.bottom + 10) + 'px';
  
  document.body.appendChild(editor);
  currentEditor = {
    element: editor,
    targetElement: element,
    field: field,
    page: page,
    type: type,
    id: id,
    originalValue: currentValue
  };
  
  // Focus input
  const input = editor.querySelector('.inline-editor-input, .inline-editor-textarea');
  input.focus();
  input.select();
  
  // Handle Enter key for text inputs
  if (type !== 'textarea') {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveInlineEdit();
      }
    });
  }
}

function closeInlineEditor() {
  if (!currentEditor) return;
  
  // Remove editing class
  currentEditor.targetElement.classList.remove('editing');
  
  // Remove editor
  currentEditor.element.remove();
  currentEditor = null;
}

function saveInlineEdit() {
  if (!currentEditor) return;
  
  const input = currentEditor.element.querySelector('.inline-editor-input, .inline-editor-textarea');
  const newValue = input.value.trim();
  
  if (newValue === currentEditor.originalValue) {
    closeInlineEditor();
    return;
  }
  
  // Update the element
  currentEditor.targetElement.textContent = newValue;
  
  // Store the change
  const changeKey = currentEditor.id 
    ? `${currentEditor.page}-${currentEditor.id}-${currentEditor.field}`
    : `${currentEditor.page}-${currentEditor.field}`;
    
  pendingChanges.set(changeKey, {
    page: currentEditor.page,
    field: currentEditor.field,
    id: currentEditor.id,
    value: newValue,
    element: currentEditor.targetElement
  });
  
  // Update changes indicator
  updateChangesIndicator();
  
  // Close editor
  closeInlineEditor();
  
  // Show success feedback
  showToast(`${currentEditor.field} updated`, 'success');
}

function updateChangesIndicator() {
  const indicator = document.getElementById('changesIndicator');
  const count = pendingChanges.size;
  
  if (count > 0) {
    indicator.classList.add('show');
    document.getElementById('changesCount').textContent = count;
  } else {
    indicator.classList.remove('show');
  }
}

async function saveAllChanges() {
  if (pendingChanges.size === 0) {
    showToast('No changes to save', 'info');
    return;
  }
  
  const saveButton = document.querySelector('[onclick="saveAllChanges()"]');
  const originalText = saveButton.innerHTML;
  saveButton.innerHTML = '<i class="icon">⏳</i><span>Saving...</span>';
  saveButton.disabled = true;
  
  try {
    // Group changes by page and type
    const changesByPage = new Map();
    
    for (const [key, change] of pendingChanges) {
      const pageKey = change.page;
      if (!changesByPage.has(pageKey)) {
        changesByPage.set(pageKey, []);
      }
      changesByPage.get(pageKey).push(change);
    }
    
    // Save each group
    for (const [pageKey, changes] of changesByPage) {
      if (pageKey === 'mainPage') {
        await saveMainPageChanges(changes);
      } else if (pageKey === 'operations') {
        await saveOperationsChanges(changes);
      } else if (pageKey === 'mortgageProducts') {
        await saveMortgageProductsChanges(changes);
      }
    }
    
    // Clear pending changes
    pendingChanges.clear();
    updateChangesIndicator();
    
    showToast('All changes saved successfully!', 'success');
    
  } catch (error) {
    console.error('Error saving changes:', error);
    showToast('Error saving changes: ' + error.message, 'error');
  } finally {
    saveButton.innerHTML = originalText;
    saveButton.disabled = false;
  }
}

async function saveMainPageChanges(changes) {
  const formData = { page: 'mainPage' };
  
  // Only include fields that were actually changed
  changes.forEach(change => {
    if (change.field === 'welcomeMessage') formData.welcomeMessage = change.value;
    else if (change.field === 'lastConnection') formData.lastConnection = change.value;
    else if (change.field === 'totalBalance') formData.totalBalance = change.value;
    else if (change.field === 'contactTeam') formData.contactTeam = change.value;
    else if (change.field === 'contactPhone') formData.contactPhone = change.value;
    else if (change.field === 'appointmentText') formData.appointmentText = change.value;
    else if (change.field === 'balanceLabel') formData.balanceLabel = change.value;
    else if (change.field === 'fastTransactionsTitle') formData.fastTransactionsTitle = change.value;
    else if (change.field === 'operationsTitle') formData.operationsTitle = change.value;
    else if (change.field === 'operationsSubtitle') formData.operationsSubtitle = change.value;
  });
  
  console.log('📤 Sending main page changes:', formData);
  
  const response = await fetch('/api/desktop-content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save main page changes');
  }
  
  console.log('✅ Main page changes saved successfully');
}

async function saveOperationsChanges(changes) {
  // Group changes by operation ID
  const changesByOperation = new Map();
  
  changes.forEach(change => {
    if (!changesByOperation.has(change.id)) {
      changesByOperation.set(change.id, {});
    }
    changesByOperation.get(change.id)[change.field] = change.value;
  });
  
  // Save each operation
  for (const [operationId, operationChanges] of changesByOperation) {
    const response = await fetch(`/api/desktop-operations/${operationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operationChanges)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to save operation ${operationId}`);
    }
  }
}

async function saveMortgageProductsChanges(changes) {
  // Group changes by product ID
  const changesByProduct = new Map();
  
  changes.forEach(change => {
    if (!changesByProduct.has(change.id)) {
      changesByProduct.set(change.id, {});
    }
    changesByProduct.get(change.id)[change.field] = change.value;
  });
  
  // Save each product
  for (const [productId, productChanges] of changesByProduct) {
    const response = await fetch(`/api/desktop-mortgage-products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productChanges)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to save mortgage product ${productId}`);
    }
  }
}

function toggleEditMode() {
  editMode = !editMode;
  const btn = document.getElementById('editModeBtn');
  
  if (editMode) {
    btn.innerHTML = '<i class="icon">✏️</i><span>Edit Mode: ON</span>';
    document.body.classList.remove('edit-mode-off');
  } else {
    btn.innerHTML = '<i class="icon">👁️</i><span>Edit Mode: OFF</span>';
    document.body.classList.add('edit-mode-off');
    closeInlineEditor();
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10002;
    font-weight: 500;
    animation: slideInRight 0.3s ease;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  .edit-mode-off .editable {
    cursor: default !important;
  }
  .edit-mode-off .editable:hover {
    background: none !important;
    box-shadow: none !important;
  }
  .edit-mode-off .editable::after {
    display: none !important;
  }
`;
document.head.appendChild(style);

console.log("🎨 WYSIWYG Admin JavaScript loaded successfully");
