// File: js/modals.js
// Modal system for Pet Wellness Tracker

const ModalSystem = {
  // Create and show add pet modal
  showAddPetModal() {
    const modal = this.createModal('add-pet-modal', 'Add Pet', `
      <form id="add-pet-form">
        <div class="form-group">
          <label class="form-label">Pet Name *</label>
          <input type="text" class="form-input" id="pet-name" required maxlength="100">
        </div>
        
        <div class="form-group">
          <label class="form-label">Species *</label>
          <select class="form-select" id="pet-species" required>
            <option value="">Select a species...</option>
            <option value="dog">🐕 Dog</option>
            <option value="cat">🐈 Cat</option>
            <option value="bird">🐦 Bird</option>
            <option value="rabbit">🐰 Rabbit</option>
            <option value="hamster">🐹 Hamster</option>
            <option value="fish">🐠 Fish</option>
            <option value="other">🐾 Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Breed <span class="text-secondary">(Optional)</span></label>
          <input type="text" class="form-input" id="pet-breed" maxlength="100">
        </div>
        
        <div class="form-group">
          <label class="form-label">Birth Date <span class="text-secondary">(Optional)</span></label>
          <input type="date" class="form-input" id="pet-birth-date">
        </div>
        
        <div class="form-group">
          <label class="form-label">Weight (kg) <span class="text-secondary">(Optional)</span></label>
          <input type="number" class="form-input" id="pet-weight" step="0.1" min="0" max="999.99">
        </div>
        
        <div class="form-group">
          <label class="form-label">Notes <span class="text-secondary">(Optional)</span></label>
          <textarea class="form-textarea" id="pet-notes" rows="3" maxlength="1000"></textarea>
        </div>
        
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary btn-block">Add Pet</button>
          <button type="button" class="btn btn-secondary btn-block mt-2" onclick="ModalSystem.closeModal('add-pet-modal')">
            Cancel
          </button>
        </div>
      </form>
    `);

    // Add form submit handler
    document.getElementById('add-pet-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const petData = {
        name: document.getElementById('pet-name').value.trim(),
        species: document.getElementById('pet-species').value,
        breed: document.getElementById('pet-breed').value.trim() || null,
        birth_date: document.getElementById('pet-birth-date').value || null,
        weight: parseFloat(document.getElementById('pet-weight').value) || null,
        notes: document.getElementById('pet-notes').value.trim() || null,
      };

      // Validation
      if (!petData.name) {
        this.showToast('Pet name is required', 'error');
        return;
      }

      if (!petData.species) {
        this.showToast('Please select a species', 'error');
        return;
      }

      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitButton.innerHTML;
      submitButton.innerHTML = '<span class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px; margin-right: 8px;"></span>Creating...';
      submitButton.disabled = true;

      try {
        const { data, error } = await db.createPet(petData);

        if (error) {
          throw new Error(error.message);
        }

        this.showToast('Pet added successfully!', 'success');
        this.closeModal('add-pet-modal');
        
        // Refresh the dashboard if we're on the dashboard page
        if (typeof loadDashboard === 'function') {
          await loadDashboard();
        } else if (typeof app !== 'undefined' && app.loadDashboard) {
          await app.loadDashboard();
        }
        
      } catch (error) {
        console.error('Error creating pet:', error);
        this.showToast(error.message || 'Failed to add pet', 'error');
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
      }
    });

    return modal;
  },

  // Create and show edit pet modal
  showEditPetModal(pet) {
    if (!pet) {
      this.showToast('No pet data provided', 'error');
      return;
    }

    const modal = this.createModal('edit-pet-modal', 'Edit Pet', `
      <form id="edit-pet-form">
        <div class="form-group">
          <label class="form-label">Pet Name *</label>
          <input type="text" class="form-input" id="edit-pet-name" value="${pet.name || ''}" required maxlength="100">
        </div>
        
        <div class="form-group">
          <label class="form-label">Species *</label>
          <select class="form-select" id="edit-pet-species" required>
            <option value="dog" ${pet.species === 'dog' ? 'selected' : ''}>🐕 Dog</option>
            <option value="cat" ${pet.species === 'cat' ? 'selected' : ''}>🐈 Cat</option>
            <option value="bird" ${pet.species === 'bird' ? 'selected' : ''}>🐦 Bird</option>
            <option value="rabbit" ${pet.species === 'rabbit' ? 'selected' : ''}>🐰 Rabbit</option>
            <option value="hamster" ${pet.species === 'hamster' ? 'selected' : ''}>🐹 Hamster</option>
            <option value="fish" ${pet.species === 'fish' ? 'selected' : ''}>🐠 Fish</option>
            <option value="other" ${pet.species === 'other' ? 'selected' : ''}>🐾 Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Breed <span class="text-secondary">(Optional)</span></label>
          <input type="text" class="form-input" id="edit-pet-breed" value="${pet.breed || ''}" maxlength="100">
        </div>
        
        <div class="form-group">
          <label class="form-label">Birth Date <span class="text-secondary">(Optional)</span></label>
          <input type="date" class="form-input" id="edit-pet-birth-date" 
                 value="${pet.birth_date ? pet.birth_date.split('T')[0] : ''}">
        </div>
        
        <div class="form-group">
          <label class="form-label">Weight (kg) <span class="text-secondary">(Optional)</span></label>
          <input type="number" class="form-input" id="edit-pet-weight" 
                 value="${pet.weight || ''}" step="0.1" min="0" max="999.99">
        </div>
        
        <div class="form-group">
          <label class="form-label">Notes <span class="text-secondary">(Optional)</span></label>
          <textarea class="form-textarea" id="edit-pet-notes" rows="3" maxlength="1000">${pet.notes || ''}</textarea>
        </div>
        
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
          <button type="button" class="btn btn-secondary btn-block mt-2" onclick="ModalSystem.closeModal('edit-pet-modal')">
            Cancel
          </button>
          <button type="button" class="btn btn-secondary mt-2" style="color: #e74c3c;" onclick="ModalSystem.confirmDeletePet('${pet.id}')">
            🗑️ Delete Pet
          </button>
        </div>
      </form>
    `);

    // Add form submit handler
    document.getElementById('edit-pet-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const updates = {
        name: document.getElementById('edit-pet-name').value.trim(),
        species: document.getElementById('edit-pet-species').value,
        breed: document.getElementById('edit-pet-breed').value.trim() || null,
        birth_date: document.getElementById('edit-pet-birth-date').value || null,
        weight: parseFloat(document.getElementById('edit-pet-weight').value) || null,
        notes: document.getElementById('edit-pet-notes').value.trim() || null,
      };

      // Validation
      if (!updates.name) {
        this.showToast('Pet name is required', 'error');
        return;
      }

      if (!updates.species) {
        this.showToast('Please select a species', 'error');
        return;
      }

      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitButton.innerHTML;
      submitButton.innerHTML = '<span class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px; margin-right: 8px;"></span>Saving...';
      submitButton.disabled = true;

      try {
        const { data, error } = await db.updatePet(pet.id, updates);

        if (error) {
          throw new Error(error.message);
        }

        this.showToast('Pet updated successfully!', 'success');
        this.closeModal('edit-pet-modal');
        
        // Update current pet data if available
        if (typeof currentPet !== 'undefined' && currentPet?.id === pet.id) {
          currentPet = data;
        }
        
        // Refresh the current page
        if (typeof loadDashboard === 'function') {
          await loadDashboard();
        } else if (typeof loadPetProfile === 'function') {
          await loadPetProfile(pet.id);
        } else if (typeof app !== 'undefined' && app.loadDashboard) {
          await app.loadDashboard();
        }
        
      } catch (error) {
        console.error('Error updating pet:', error);
        this.showToast(error.message || 'Failed to update pet', 'error');
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
      }
    });

    return modal;
  },

  // Create and show mood logging modal
  showMoodModal(pet) {
    if (!pet) {
      this.showToast('No pet selected', 'error');
      return;
    }

    const petName = pet.name || 'your pet';
    
    const modal = this.createModal('mood-modal', `How is ${petName} feeling?`, `
      <div class="mood-selector">
        <div class="mood-item" data-mood="happy">
          <div class="mood-icon" style="background-color: #4CAF5020;">😊</div>
          <div class="mood-label">Happy</div>
        </div>
        <div class="mood-item" data-mood="content">
          <div class="mood-icon" style="background-color: #2196F320;">😌</div>
          <div class="mood-label">Content</div>
        </div>
        <div class="mood-item" data-mood="neutral">
          <div class="mood-icon" style="background-color: #9E9E9E20;">😐</div>
          <div class="mood-label">Neutral</div>
        </div>
        <div class="mood-item" data-mood="anxious">
          <div class="mood-icon" style="background-color: #FFB30020;">😰</div>
          <div class="mood-label">Anxious</div>
        </div>
        <div class="mood-item" data-mood="sad">
          <div class="mood-icon" style="background-color: #FF980020;">😢</div>
          <div class="mood-label">Sad</div>
        </div>
        <div class="mood-item" data-mood="angry">
          <div class="mood-icon" style="background-color: #F4433620;">😠</div>
          <div class="mood-label">Angry</div>
        </div>
      </div>
      
      <form id="mood-form">
        <div class="form-group">
          <label class="form-label">Add a note <span class="text-secondary">(Optional)</span></label>
          <textarea class="form-textarea" id="mood-note" rows="3" 
                    placeholder="How was ${petName} today? Any special activities or observations..." maxlength="500"></textarea>
        </div>
        
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary btn-block">Log Mood</button>
          <button type="button" class="btn btn-secondary btn-block mt-2" onclick="ModalSystem.closeModal('mood-modal')">
            Cancel
          </button>
        </div>
      </form>
    `);

    let selectedMood = null;

    // Add mood selection handlers
    modal.querySelectorAll('.mood-item').forEach(item => {
      item.addEventListener('click', () => {
        // Remove previous selection
        modal.querySelectorAll('.mood-item').forEach(m => m.classList.remove('selected'));
        
        // Add selection to clicked item
        item.classList.add('selected');
        selectedMood = item.getAttribute('data-mood');
        
        console.log('Selected mood:', selectedMood);
      });
    });

    // Add form submit handler
    document.getElementById('mood-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!selectedMood) {
        this.showToast('Please select a mood first', 'error');
        return;
      }

      const note = document.getElementById('mood-note').value.trim() || null;
      
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitButton.innerHTML;
      submitButton.innerHTML = '<span class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px; margin-right: 8px;"></span>Logging...';
      submitButton.disabled = true;

      try {
        const { data, error } = await db.logMood(pet.id, selectedMood, note);

        if (error) {
          throw new Error(error.message);
        }

        this.showToast('Mood logged successfully!', 'success');
        this.closeModal('mood-modal');
        
        // Refresh today's mood if function exists
        if (typeof loadTodaysMood === 'function') {
          await loadTodaysMood();
        }
        
      } catch (error) {
        console.error('Error logging mood:', error);
        this.showToast(error.message || 'Failed to log mood', 'error');
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
      }
    });

    return modal;
  },

  // Confirm delete pet
  confirmDeletePet(petId) {
    const confirmModal = this.createModal('confirm-delete-modal', 'Delete Pet', `
      <div style="text-align: center; margin: 20px 0;">
        <div style="font-size: 60px; margin-bottom: 16px;">⚠️</div>
        <p><strong>Are you sure you want to delete this pet?</strong></p>
        <p class="text-secondary">This action cannot be undone. All mood logs and data for this pet will be permanently deleted.</p>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary btn-block" onclick="ModalSystem.closeModal('confirm-delete-modal')">
          Cancel
        </button>
        <button type="button" class="btn btn-primary btn-block mt-2" style="background-color: #e74c3c;" onclick="ModalSystem.deletePet('${petId}')">
          Yes, Delete Pet
        </button>
      </div>
    `);
    
    return confirmModal;
  },

  // Actually delete the pet
  async deletePet(petId) {
    const deleteButton = document.querySelector('[onclick*="deletePet"]');
    const originalHTML = deleteButton.innerHTML;
    deleteButton.innerHTML = '<span class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px; margin-right: 8px;"></span>Deleting...';
    deleteButton.disabled = true;

    try {
      const { error } = await db.deletePet(petId);

      if (error) {
        throw new Error(error.message);
      }

      this.showToast('Pet deleted successfully', 'success');
      this.closeModal('confirm-delete-modal');
      this.closeModal('edit-pet-modal');
      
      // Redirect to dashboard
      if (window.location.pathname.includes('pet-profile.html')) {
        window.location.href = 'dashboard.html';
      } else if (typeof loadDashboard === 'function') {
        await loadDashboard();
      }
      
    } catch (error) {
      console.error('Error deleting pet:', error);
      this.showToast(error.message || 'Failed to delete pet', 'error');
      deleteButton.innerHTML = originalHTML;
      deleteButton.disabled = false;
    }
  },

  // Create base modal structure
  createModal(id, title, content) {
    // Remove existing modal if it exists
    this.closeModal(id);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = id;
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="modal-close" onclick="ModalSystem.closeModal('${id}')">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(id);
      }
    });

    // Close modal on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(id);
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    return modal;
  },

  // Close modal
  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.remove();
    }
  },

  // Show toast notification
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${type === 'error' ? '#e74c3c' : '#27ae60'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideDown 0.3s ease;
      max-width: 90vw;
      text-align: center;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Add CSS for modal improvements
const modalStyles = document.createElement('style');
modalStyles.textContent = `
  .modal-actions {
    margin-top: 24px;
  }
  
  .mood-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 24px 0;
  }
  
  .mood-item {
    padding: 12px 8px;
    border-radius: 12px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }
  
  .mood-item:hover {
    transform: scale(1.05);
  }
  
  .mood-item.selected {
    border-color: var(--primary-color);
    background-color: rgba(107, 78, 230, 0.05);
  }
  
  .mood-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto 8px;
  }
  
  .mood-label {
    font-size: 12px;
    font-weight: 500;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
  }
  
  @media (max-width: 480px) {
    .mood-selector {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
document.head.appendChild(modalStyles);

// Make ModalSystem globally available
window.ModalSystem = ModalSystem;