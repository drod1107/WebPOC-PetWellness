const translations = {
    en: {
        // App
        appTitle: 'Pet Wellness Tracker',
        loading: 'Loading...',
        
        // Auth
        welcomeBack: 'Welcome Back!',
        signInToContinue: 'Sign in to continue tracking your pet\'s wellness',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        createAccount: 'Create Account',
        startJourney: 'Start your pet wellness journey today',
        fullName: 'Full Name',
        confirmPassword: 'Confirm Password',
        dontHaveAccount: 'Don\'t have an account?',
        alreadyHaveAccount: 'Already have an account?',
        
        // Navigation
        home: 'Home',
        profile: 'Profile',
        settings: 'Settings',
        
        // Dashboard
        noPetsYet: 'No Pets Yet',
        addFirstPet: 'Add your first pet to start tracking their wellness',
        addPet: 'Add Pet',
        quickActions: 'Quick Actions',
        logMood: 'Log Mood',
        todaysMood: 'Today\'s Mood',
        noMoodLogged: 'No mood logged today',
        
        // Pet form
        petName: 'Pet Name',
        species: 'Species',
        dog: 'Dog',
        cat: 'Cat',
        breed: 'Breed',
        birthDate: 'Birth Date',
        weight: 'Weight (kg)',
        notes: 'Notes',
        optional: 'Optional',
        save: 'Save',
        cancel: 'Cancel',
        
        // Pet profile
        basicInformation: 'Basic Information',
        age: 'Age',
        yearsOld: 'years old',
        monthsOld: 'months old',
        unknownAge: 'Unknown age',
        
        // Mood
        howIsFeeling: 'How is {name} feeling?',
        happy: 'Happy',
        content: 'Content',
        neutral: 'Neutral',
        anxious: 'Anxious',
        sad: 'Sad',
        angry: 'Angry',
        addNote: 'Add a note (optional)',
        logMoodButton: 'Log Mood',
        moodLoggedSuccess: 'Mood logged successfully',
        
        // Errors
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        invalidEmail: 'Please enter a valid email',
        passwordTooShort: 'Password must be at least 8 characters',
        passwordsDontMatch: 'Passwords do not match',
        petNameRequired: 'Pet name is required',
        somethingWentWrong: 'Something went wrong. Please try again.',
    },
    
    it: {
        // App
        appTitle: 'Tracciatore Benessere Animali',
        loading: 'Caricamento...',
        
        // Auth
        welcomeBack: 'Bentornato!',
        signInToContinue: 'Accedi per continuare a monitorare il benessere del tuo animale',
        email: 'Email',
        password: 'Password',
        signIn: 'Accedi',
        signUp: 'Registrati',
        createAccount: 'Crea account',
        startJourney: 'Inizia oggi il tuo percorso di benessere per animali',
        fullName: 'Nome completo',
        confirmPassword: 'Conferma password',
        dontHaveAccount: 'Non hai un account?',
        alreadyHaveAccount: 'Hai già un account?',
        
        // Navigation
        home: 'Home',
        profile: 'Profilo',
        settings: 'Impostazioni',
        
        // Dashboard
        noPetsYet: 'Nessun animale ancora',
        addFirstPet: 'Aggiungi il tuo primo animale per iniziare a monitorare il suo benessere',
        addPet: 'Aggiungi animale',
        quickActions: 'Azioni rapide',
        logMood: 'Registra umore',
        todaysMood: 'Umore di oggi',
        noMoodLogged: 'Nessun umore registrato oggi',
        
        // Pet form
        petName: 'Nome dell\'animale',
        species: 'Specie',
        dog: 'Cane',
        cat: 'Gatto',
        breed: 'Razza',
        birthDate: 'Data di nascita',
        weight: 'Peso (kg)',
        notes: 'Note',
        optional: 'Opzionale',
        save: 'Salva',
        cancel: 'Annulla',
        
        // Pet profile
        basicInformation: 'Informazioni di base',
        age: 'Età',
        yearsOld: 'anni',
        monthsOld: 'mesi',
        unknownAge: 'Età sconosciuta',
        
        // Mood
        howIsFeeling: 'Come si sente {name}?',
        happy: 'Felice',
        content: 'Contento',
        neutral: 'Neutrale',
        anxious: 'Ansioso',
        sad: 'Triste',
        angry: 'Arrabbiato',
        addNote: 'Aggiungi una nota (opzionale)',
        logMoodButton: 'Registra umore',
        moodLoggedSuccess: 'Umore registrato con successo',
        
        // Errors
        emailRequired: 'Email richiesta',
        passwordRequired: 'Password richiesta',
        invalidEmail: 'Inserisci un\'email valida',
        passwordTooShort: 'La password deve essere di almeno 8 caratteri',
        passwordsDontMatch: 'Le password non corrispondono',
        petNameRequired: 'Nome dell\'animale richiesto',
        somethingWentWrong: 'Qualcosa è andato storto. Riprova.',
    }
};

// Translation helper
let currentLang = localStorage.getItem('language') || 'en';

function t(key, params = {}) {
    let text = translations[currentLang][key] || translations['en'][key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updateUILanguage();
}

function updateUILanguage() {
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = t(key);
    });
    
    // Update all placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = t(key);
    });
}