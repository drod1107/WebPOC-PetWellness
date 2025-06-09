// UI Component builders
const components = {
    // Create bottom navigation
    createBottomNav(activeTab = 'home') {
        return `
            <div class="bottom-nav">
                <a href="#" class="nav-item ${activeTab === 'home' ? 'active' : ''}" data-page="home">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-label" data-translate="home">${t('home')}</span>
                </a>
                <a href="#" class="nav-item ${activeTab === 'profile' ? 'active' : ''}" data-page="profile">
                    <span class="nav-icon">🐾</span>
                    <span class="nav-label" data-translate="profile">${t('profile')}</span>
                </a>
                <a href="#" class="nav-item ${activeTab === 'settings' ? 'active' : ''}" data-page="settings">
                    <span class="nav-icon">⚙️</span>
                    <span class="nav-label" data-translate="settings">${t('settings')}</span>
                </a>
            </div>
        `;
    },
    
    // Create pet card
    createPetCard(pet) {
  const speciesIcon = pet.species === 'dog' ? '🐕' : '🐈';
  const age = this.calculateAge(pet.birth_date);
  return `
    <div class="card pet-card" data-pet-id="${pet.id}">
      <div class="pet-avatar">
        ${pet.avatar_url ? `<img src="${pet.avatar_url}" alt="${pet.name}">` : speciesIcon}
      </div>
      <div class="pet-info">
        <div class="pet-name">${pet.name}</div>
        <div class="pet-details">${t(pet.species)} • ${age}</div>
      </div>
      <span class="arrow">→</span>
    </div>
  `;
},
    
    // Create mood selector
    createMoodSelector() {
        const moods = [
            { id: 'happy', emoji: '😊', color: '#4CAF50' },
            { id: 'content', emoji: '😌', color: '#2196F3' },
            { id: 'neutral', emoji: '😐', color: '#9E9E9E' },
            { id: 'anxious', emoji: '😰', color: '#FFB300' },
            { id: 'sad', emoji: '😢', color: '#FF9800' },
            { id: 'angry', emoji: '😠', color: '#F44336' }
        ];
        
        return moods.map(mood => `
            <div class="mood-item" data-mood="${mood.id}">
                <div class="mood-icon" style="background-color: ${mood.color}20;">
                    ${mood.emoji}
                </div>
                <div class="mood-label" data-translate="${mood.id}">${t(mood.id)}</div>
            </div>
        `).join('');
    },
    
    // Calculate age from birth date
    calculateAge(birthDate) {
        if (!birthDate) return t('unknownAge');
        
        const birth = new Date(birthDate);
        const now = new Date();
        const years = now.getFullYear() - birth.getFullYear();
        const months = now.getMonth() - birth.getMonth() + (years * 12);
        
        if (months < 12) {
            return `${months} ${t('monthsOld')}`;
        } else {
            return `${Math.floor(months / 12)} ${t('yearsOld')}`;
        }
    },
    
    // Format date for display
    formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString(currentLang === 'it' ? 'it-IT' : 'en-US');
    },
    
    // Show toast message
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `${type}-message`;
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.zIndex = '9999';
        toast.style.animation = 'slideDown 0.3s ease';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // Create loading button
    createLoadingButton(text) {
        return `
            <button class="btn btn-primary btn-block" disabled>
                <span class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></span>
                ${text}
            </button>
        `;
    }
};

// Add animations
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);