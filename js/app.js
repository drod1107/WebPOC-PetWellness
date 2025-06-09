// Main application logic
const app = {
  currentPage: "home",
  currentPet: null,

  // Initialize app
  async init() {
    // Check authentication
    const isAuthenticated = await auth.checkAuth();

    // Hide splash screen with safe checks
    setTimeout(() => {
      const splash = document.querySelector(".splash-screen");
      if (splash) { 
        splash.style.opacity = "0";
        setTimeout(() => {
          // Only hide if still present
          const splashElement = document.querySelector(".splash-screen");
          if (splashElement) splashElement.style.display = "none";
        }, 300);
      }
    }, 1500);

    if (!isAuthenticated) {
      this.showLoginPage();
    } else {
      this.loadDashboard();
    }

    // Set up language switcher
    this.setupLanguageSwitcher();

    // Set up navigation
    this.setupNavigation();
  },

  // Setup language switcher
  setupLanguageSwitcher() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("lang-btn")) {
        const lang = e.target.getAttribute("data-lang");
        setLanguage(lang);
        document.querySelectorAll(".lang-btn").forEach((btn) => {
          btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
        });
        this.refreshCurrentPage();
      }
    });
  },

  // Setup navigation
  setupNavigation() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".nav-item")) {
        e.preventDefault();
        const page = e.target.closest(".nav-item").getAttribute("data-page");
        this.navigateToPage(page);
      }
    });
  },

  // Navigate to page
  navigateToPage(page) {
    this.currentPage = page;
    switch (page) {
      case "home":
        this.loadDashboard();
        break;
      case "profile":
        if (this.currentPet) {
          this.showPetProfile(this.currentPet);
        }
        break;
      case "settings":
        this.showSettings();
        break;
    }
  },

  // Refresh current page
  refreshCurrentPage() {
    this.navigateToPage(this.currentPage);
  },

  // Show login page
  showLoginPage() {
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="auth-container">
                <div class="language-switcher">
                    <button class="lang-btn ${
                      currentLang === "en" ? "active" : ""
                    }" data-lang="en">EN</button>
                    <button class="lang-btn ${
                      currentLang === "it" ? "active" : ""
                    }" data-lang="it">IT</button>
                </div>
                <div class="auth-card">
                    <div class="auth-logo">🐾</div>
                    <h1 class="auth-title" data-translate="welcomeBack">${t(
                      "welcomeBack"
                    )}</h1>
                    <p class="auth-subtitle" data-translate="signInToContinue">${t(
                      "signInToContinue"
                    )}</p>
                    
                    <form id="login-form">
                        <div class="form-group">
                            <input type="email" class="form-input" id="email" required
                                placeholder="${t(
                                  "email"
                                )}" data-translate-placeholder="email">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-input" id="password" required
                                placeholder="${t(
                                  "password"
                                )}" data-translate-placeholder="password">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" data-translate="signIn">
                            ${t("signIn")}
                        </button>
                    </form>
                    
                    <div class="text-center mt-3">
                        <span data-translate="dontHaveAccount">${t(
                          "dontHaveAccount"
                        )}</span>
                        <a href="#" class="btn-text" id="show-register" data-translate="signUp">${t(
                          "signUp"
                        )}</a>
                    </div>
                </div>
            </div>
        `;

    // Add event listeners
    document
      .getElementById("login-form")
      .addEventListener("submit", this.handleLogin.bind(this));
    document.getElementById("show-register").addEventListener("click", (e) => {
      e.preventDefault();
      this.showRegisterPage();
    });
  },

  // Show register page
  showRegisterPage() {
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="auth-container">
                <div class="language-switcher">
                    <button class="lang-btn ${
                      currentLang === "en" ? "active" : ""
                    }" data-lang="en">EN</button>
                    <button class="lang-btn ${
                      currentLang === "it" ? "active" : ""
                    }" data-lang="it">IT</button>
                </div>
                <div class="auth-card">
                    <div class="auth-logo">🐾</div>
                    <h1 class="auth-title" data-translate="createAccount">${t(
                      "createAccount"
                    )}</h1>
                    <p class="auth-subtitle" data-translate="startJourney">${t(
                      "startJourney"
                    )}</p>
                    
                    <form id="register-form">
                        <div class="form-group">
                            <input type="text" class="form-input" id="name" required
                                placeholder="${t(
                                  "fullName"
                                )}" data-translate-placeholder="fullName">
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-input" id="email" required
                                placeholder="${t(
                                  "email"
                                )}" data-translate-placeholder="email">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-input" id="password" required
                                placeholder="${t(
                                  "password"
                                )}" data-translate-placeholder="password">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-input" id="confirm-password" required
                                placeholder="${t(
                                  "confirmPassword"
                                )}" data-translate-placeholder="confirmPassword">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" data-translate="createAccount">
                            ${t("createAccount")}
                        </button>
                    </form>
                    
                    <div class="text-center mt-3">
                        <span data-translate="alreadyHaveAccount">${t(
                          "alreadyHaveAccount"
                        )}</span>
                        <a href="#" class="btn-text" id="show-login" data-translate="signIn">${t(
                          "signIn"
                        )}</a>
                    </div>
                </div>
            </div>
        `;

    // Add event listeners
    document
      .getElementById("register-form")
      .addEventListener("submit", this.handleRegister.bind(this));
    document.getElementById("show-login").addEventListener("click", (e) => {
      e.preventDefault();
      this.showLoginPage();
    });
  },

  // Handle login
  async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Validate
    if (!auth.validateEmail(email)) {
      components.showToast(t("invalidEmail"), "error");
      return;
    }

    if (!auth.validatePassword(password)) {
      components.showToast(t("passwordTooShort"), "error");
      return;
    }

    // Show loading
    const originalHTML = submitButton.innerHTML;
    submitButton.innerHTML = components.createLoadingButton(t("loading"));
    submitButton.disabled = true;

    try {
      await auth.handleSignIn(email, password);
      this.loadDashboard();
    } catch (error) {
      components.showToast(error.message, "error");
      submitButton.innerHTML = originalHTML;
      submitButton.disabled = false;
    }
  },

  // Handle register
  async handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Validate
    if (!name.trim()) {
      components.showToast(t("nameRequired"), "error");
      return;
    }

    if (!auth.validateEmail(email)) {
      components.showToast(t("invalidEmail"), "error");
      return;
    }

    if (!auth.validatePassword(password)) {
      components.showToast(t("passwordTooShort"), "error");
      return;
    }

    if (password !== confirmPassword) {
      components.showToast(t("passwordsDontMatch"), "error");
      return;
    }

    // Show loading
    const originalHTML = submitButton.innerHTML;
    submitButton.innerHTML = components.createLoadingButton(t("loading"));
    submitButton.disabled = true;

    try {
      await auth.handleSignUp(email, password, name);
      components.showToast(t("accountCreated"), "success");
      this.loadDashboard();
    } catch (error) {
      components.showToast(error.message, "error");
      submitButton.innerHTML = originalHTML;
      submitButton.disabled = false;
    }
  },

  // Load dashboard
  async loadDashboard() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = `
            <div class="container">
                <div class="app-bar">
                    <h1 class="app-bar-title" data-translate="appTitle">${t("appTitle")}</h1>
                    <div class="app-bar-actions">
                        <button class="btn btn-icon" onclick="app.handleSignOut()">
                            <span>🚪</span>
                        </button>
                    </div>
                </div>
                
                <div id="dashboard-content">
                    <div class="loading-spinner" style="margin: 50px auto;"></div>
                </div>
            </div>
            ${components.createBottomNav("home")}
        `;

    // Load pets from database
    const { data: pets, error } = await db.getPets();

    if (error) {
      components.showToast(t("somethingWentWrong"), "error");
      return;
    }

    const dashboardContent = document.getElementById("dashboard-content");
    if (!dashboardContent) {
      // Safety check: if the container is missing, stop here to avoid errors
      console.error("Dashboard content container not found.");
      return;
    }

    if (pets.length === 0) {
      // Show empty state (no pets)
      dashboardContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🐾</div>
                    <h2 class="empty-title" data-translate="noPetsYet">${t("noPetsYet")}</h2>
                    <p class="empty-message" data-translate="addFirstPet">${t("addFirstPet")}</p>
                    <button class="btn btn-primary" onclick="app.showAddPetModal()">
                        <span data-translate="addPet">${t("addPet")}</span>
                    </button>
                </div>
            `;
    } else {
      // Show all pets and quick actions
      this.currentPet = pets[0];
      // Create pet cards for each pet
      const petCardsHTML = pets.map((pet) => components.createPetCard(pet)).join("");
      dashboardContent.innerHTML = `
                ${petCardsHTML}
                <h2 class="mt-3" data-translate="quickActions">${t("quickActions")}</h2>
                <div class="quick-actions">
                    <div class="action-card action-card-primary" onclick="app.showMoodModal()">
                        <span class="action-icon">😊</span>
                        <span class="action-label" data-translate="logMood">${t("logMood")}</span>
                    </div>
                </div>
                <div class="card mt-3">
                    <h3 data-translate="todaysMood">${t("todaysMood")}</h3>
                    <div id="todays-mood-content">
                        <div class="loading-spinner" style="margin: 20px auto;"></div>
                    </div>
                </div>
            `;

      // Attach click handler to each pet card to open that pet's profile
      document.querySelectorAll(".pet-card").forEach((card) => {
        card.addEventListener("click", () => {
          const petId = card.getAttribute("data-pet-id");
          const pet = pets.find((p) => p.id === petId);
          if (pet) {
            this.currentPet = pet;
            this.showPetProfile(pet);
          }
        });
      });

      // Load today's mood for the current pet (defaulting to the first pet)
      this.loadTodaysMood();
    }

    // Add FAB (floating action button) for adding pets if at least one pet exists
    if (pets.length > 0) {
      const fab = document.createElement("button");
      fab.className = "fab";
      fab.innerHTML = "+";
      fab.onclick = () => this.showAddPetModal();
      appContainer.appendChild(fab);
    }
  },

  // Load today's mood for the current pet
  async loadTodaysMood() {
    const { data: mood, error } = await db.getTodaysMood(this.currentPet.id);
    const container = document.getElementById("todays-mood-content");

    if (error) {
      container.innerHTML = `<p class="text-center text-secondary">${t("somethingWentWrong")}</p>`;
      return;
    }

    if (!mood) {
      container.innerHTML = `
                <p class="text-center text-secondary" data-translate="noMoodLogged">${t("noMoodLogged")}</p>
                <div class="text-center mt-2">
                    <button class="btn btn-primary" onclick="app.showMoodModal()">
                        <span data-translate="logMood">${t("logMood")}</span>
                    </button>
                </div>
            `;
    } else {
      const moodEmojis = {
        happy: "😊",
        content: "😌",
        neutral: "😐",
        anxious: "😰",
        sad: "😢",
        angry: "😠",
      };

      const moodColors = {
        happy: "#4CAF50",
        content: "#2196F3",
        neutral: "#9E9E9E",
        anxious: "#FFB300",
        sad: "#FF9800",
        angry: "#F44336",
      };

      container.innerHTML = `
                <div class="mood-status">
                    <div class="mood-status-icon" style="background-color: ${
                      moodColors[mood.mood]
                    }20;">
                        ${moodEmojis[mood.mood]}
                    </div>
                    <div class="mood-status-info">
                        <div class="mood-status-label" data-translate="${mood.mood}">${t(
        mood.mood
      )}</div>
                        <div class="mood-status-time">${components.formatDate(
                          mood.logged_at
                        )}</div>
                        ${
                          mood.note
                            ? `<div class="text-small text-secondary mt-1">${mood.note}</div>`
                            : ""
                        }
                    </div>
                </div>
            `;
    }
  },

  // Show pet profile page
  async showPetProfile(pet) {
    this.currentPage = "profile";
    const appContainer = document.getElementById("app");

    appContainer.innerHTML = `
            <div class="container">
                <div class="app-bar">
                    <button class="btn btn-icon" onclick="app.loadDashboard()">
                        <span>←</span>
                    </button>
                    <h1 class="app-bar-title">${pet.name}</h1>
                    <div class="app-bar-actions">
                        <button class="btn btn-icon" onclick="app.showEditPetModal()">
                            <span>✏️</span>
                        </button>
                    </div>
                </div>
                
                <div class="profile-header">
                    <div class="pet-avatar profile-avatar">
                        ${
                          pet.avatar_url
                            ? `<img src="${pet.avatar_url}" alt="${pet.name}">`
                            : pet.species === "dog"
                            ? "🐕"
                            : "🐈"
                        }
                    </div>
                    <h1 class="profile-name">${pet.name}</h1>
                    <p class="profile-details">${t(pet.species)} • ${components.calculateAge(
      pet.birth_date
    )}</p>
                </div>
                
                <div class="card">
                    <h2 class="info-title" data-translate="basicInformation">${t(
                      "basicInformation"
                    )}</h2>
                    ${
                      pet.breed
                        ? `
                        <div class="info-row">
                            <span class="info-icon">🏷️</span>
                            <span class="info-label" data-translate="breed">${t(
                              "breed"
                            )}:</span>
                            <span class="info-value">${pet.breed}</span>
                        </div>
                    `
                        : ""
                    }
                    ${
                      pet.birth_date
                        ? `
                        <div class="info-row">
                            <span class="info-icon">🎂</span>
                            <span class="info-label" data-translate="birthDate">${t(
                              "birthDate"
                            )}:</span>
                            <span class="info-value">${components.formatDate(
                              pet.birth_date
                            )}</span>
                        </div>
                    `
                        : ""
                    }
                    ${
                      pet.weight
                        ? `
                        <div class="info-row">
                            <span class="info-icon">⚖️</span>
                            <span class="info-label" data-translate="weight">${t(
                              "weight"
                            )}:</span>
                            <span class="info-value">${pet.weight} kg</span>
                        </div>
                    `
                        : ""
                    }
                    ${
                      pet.notes
                        ? `
                        <div class="mt-2">
                            <div class="info-label" data-translate="notes">${t(
                              "notes"
                            )}:</div>
                            <p class="text-secondary">${pet.notes}</p>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
            ${components.createBottomNav("profile")}
        `;
  },

  // Show settings page
  showSettings() {
    const appContainer = document.getElementById("app");
    appContainer.innerHTML = `
            <div class="container">
                <div class="app-bar">
                    <h1 class="app-bar-title" data-translate="settings">${t(
                      "settings"
                    )}</h1>
                </div>
                
                <div class="card">
                    <h3>Language / Lingua</h3>
                    <div class="mt-2">
                        <button class="btn ${
                          currentLang === "en" ? "btn-primary" : "btn-secondary"
                        } mb-2" onclick="setLanguage('en'); app.showSettings();">
                            English
                        </button>
                        <button class="btn ${
                          currentLang === "it" ? "btn-primary" : "btn-secondary"
                        }" onclick="setLanguage('it'); app.showSettings();">
                            Italiano
                        </button>
                    </div>
                </div>
                
                <div class="card">
                    <button class="btn btn-secondary btn-block" onclick="app.handleSignOut()">
                        <span data-translate="signOut">${t("signOut")}</span>
                    </button>
                </div>
            </div>
            ${components.createBottomNav("settings")}
        `;
  },

  // Show add pet modal
  showAddPetModal() {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" data-translate="addPet">${t("addPet")}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                
                <form id="add-pet-form">
                    <div class="form-group">
                        <label class="form-label" data-translate="petName">${t("petName")} *</label>
                        <input type="text" class="form-input" id="pet-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" data-translate="species">${t("species")} *</label>
                        <select class="form-select" id="pet-species" required>
                            <option value="dog" data-translate="dog">${t("dog")}</option>
                            <option value="cat" data-translate="cat">${t("cat")}</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="breed">${t("breed")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <input type="text" class="form-input" id="pet-breed">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="birthDate">${t("birthDate")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <input type="date" class="form-input" id="pet-birth-date">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="weight">${t("weight")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <input type="number" class="form-input" id="pet-weight" step="0.1" min="0">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="notes">${t("notes")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <textarea class="form-textarea" id="pet-notes"></textarea>
                    </div>
                    
                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary btn-block" data-translate="save">
                            ${t("save")}
                        </button>
                        <button type="button" class="btn btn-secondary btn-block mt-2" onclick="this.closest('.modal').remove()">
                            <span data-translate="cancel">${t("cancel")}</span>
                        </button>
                    </div>
                </form>
            </div>
        `;

    document.body.appendChild(modal);

    // Add form submit handler
    document.getElementById("add-pet-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      const petData = {
        name: document.getElementById("pet-name").value,
        species: document.getElementById("pet-species").value,
        breed: document.getElementById("pet-breed").value || null,
        birth_date: document.getElementById("pet-birth-date").value || null,
        weight: parseFloat(document.getElementById("pet-weight").value) || null,
        notes: document.getElementById("pet-notes").value || null,
      };

      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitButton.innerHTML;
      submitButton.innerHTML = components.createLoadingButton(t("loading"));
      submitButton.disabled = true;

      try {
        const { data, error } = await db.createPet(petData);
        if (error) throw new Error(error);
        components.showToast(t("petAdded"), "success");
        modal.remove();
        this.loadDashboard();
      } catch (error) {
        components.showToast(error.message, "error");
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
      }
    });
  },

  // Show mood logging modal
  showMoodModal() {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${t("howIsFeeling", { name: this.currentPet.name })}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                
                <div class="mood-selector">
                    ${components.createMoodSelector()}
                </div>
                
                <form id="mood-form">
                    <div class="form-group">
                        <label class="form-label" data-translate="addNote">${t("addNote")}</label>
                        <textarea class="form-textarea" id="mood-note" rows="3"></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block" data-translate="logMoodButton">
                        ${t("logMoodButton")}
                    </button>
                </form>
            </div>
        `;

    document.body.appendChild(modal);

    // Mood selection handler
    let selectedMood = null;
    modal.querySelectorAll(".mood-item").forEach((item) => {
      item.addEventListener("click", () => {
        modal.querySelectorAll(".mood-item").forEach((m) => m.classList.remove("selected"));
        item.classList.add("selected");
        selectedMood = item.getAttribute("data-mood");
      });
    });

    // Add form submit handler
    document.getElementById("mood-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!selectedMood) {
        components.showToast(t("selectMood"), "error");
        return;
      }

      const note = document.getElementById("mood-note").value;
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitButton.innerHTML;
      submitButton.innerHTML = components.createLoadingButton(t("loading"));
      submitButton.disabled = true;

      try {
        const { data, error } = await db.logMood(this.currentPet.id, selectedMood, note || null);
        if (error) throw new Error(error);
        components.showToast(t("moodLoggedSuccess"), "success");
        modal.remove();
        this.loadTodaysMood();  // Refresh today's mood display
      } catch (error) {
        components.showToast(error.message, "error");
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
      }
    });
  },

  // Show edit pet modal
  showEditPetModal() {
    const pet = this.currentPet;
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" data-translate="editPet">${t("editPet")}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                
                <form id="edit-pet-form">
                    <div class="form-group">
                        <label class="form-label" data-translate="petName">${t("petName")} *</label>
                        <input type="text" class="form-input" id="pet-name" value="${pet.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" data-translate="species">${t("species")} *</label>
                        <select class="form-select" id="pet-species" required>
                            <option value="dog" ${
                              pet.species === "dog" ? "selected" : ""
                            } data-translate="dog">${t("dog")}</option>
                            <option value="cat" ${
                              pet.species === "cat" ? "selected" : ""
                            } data-translate="cat">${t("cat")}</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="breed">${t("breed")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <input type="text" class="form-input" id="pet-breed" value="${pet.breed || ""}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="birthDate">${t("birthDate")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <input type="date" class="form-input" id="pet-birth-date" value="${
                          pet.birth_date ? pet.birth_date.split("T")[0] : ""
                        }">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="weight">${t("weight")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <input type="number" class="form-input" id="pet-weight" value="${pet.weight || ""}" step="0.1" min="0">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">
                            <span data-translate="notes">${t("notes")}</span>
                            <span class="text-secondary">(<span data-translate="optional">${t("optional")}</span>)</span>
                        </label>
                        <textarea class="form-textarea" id="pet-notes">${pet.notes || ""}</textarea>
                    </div>
                    
                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary btn-block" data-translate="save">
                            ${t("save")}
                        </button>
                        <button type="button" class="btn btn-secondary btn-block mt-2" onclick="this.closest('.modal').remove()">
                            <span data-translate="cancel">${t("cancel")}</span>
                        </button>
                    </div>
                </form>
            </div>
        `;

    document.body.appendChild(modal);

    // Add form submit handler
    document.getElementById("edit-pet-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      const updates = {
        name: document.getElementById("pet-name").value,
        species: document.getElementById("pet-species").value,
        breed: document.getElementById("pet-breed").value || null,
        birth_date: document.getElementById("pet-birth-date").value || null,
        weight: parseFloat(document.getElementById("pet-weight").value) || null,
        notes: document.getElementById("pet-notes").value || null,
      };

      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitButton.innerHTML;
      submitButton.innerHTML = components.createLoadingButton(t("loading"));
      submitButton.disabled = true;

      try {
        const { data, error } = await db.updatePet(pet.id, updates);
        if (error) throw new Error(error);
        this.currentPet = data;
        components.showToast(t("petUpdated"), "success");
        modal.remove();
        this.showPetProfile(data);
      } catch (error) {
        components.showToast(error.message, "error");
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
      }
    });
  },

  // Handle sign out
  async handleSignOut() {
    if (confirm(t("confirmSignOut"))) {
      try {
        await auth.handleSignOut();
        // After signing out, return to login page
        this.currentPet = null;
        this.showLoginPage();
      } catch (error) {
        components.showToast(error.message, "error");
      }
    }
  },
};

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
