// File: js/supabase-client.js
// Initialize Supabase with proper configuration handling
// Updated to use window.APP_CONFIG instead of window.ENV

console.log('🔄 Initializing Supabase client...');

// Configuration - now using the correct variable name
const config = {
  supabaseUrl: window.APP_CONFIG?.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE',
  supabaseAnonKey: window.APP_CONFIG?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE'
};

console.log('📋 Supabase config check:', {
  urlConfigured: config.supabaseUrl !== 'YOUR_SUPABASE_URL_HERE',
  keyConfigured: config.supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE',
  hasAppConfig: !!window.APP_CONFIG
});

// Validate configuration
if (config.supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
  console.error('❌ Supabase URL not configured. Please check your SUPABASE_URL environment variable.');
  console.info('📝 Make sure your .env file contains SUPABASE_URL and run npm run build');
}

if (config.supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.error('❌ Supabase anon key not configured. Please check your SUPABASE_ANON_KEY environment variable.');
  console.info('📝 Make sure your .env file contains SUPABASE_ANON_KEY and run npm run build');
}

// Initialize Supabase with error handling
let supabase;
try {
  if (typeof window.supabase === 'undefined') {
    throw new Error('Supabase library not loaded. Make sure the CDN script is included.');
  }
  supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase:', error);
  // Create a mock client to prevent app crashes
  supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: { message: 'Supabase not configured' } })
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ data: [], error: { message: 'Supabase not configured' } }) }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
      delete: () => ({ eq: () => ({ error: { message: 'Supabase not configured' } }) })
    })
  };
}

// Database helpers with improved error handling and validation
const db = {
  // Auth methods
  async signUp(email, password, name) {
    try {
      console.log('🔄 Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) {
        console.error('❌ Sign up error:', error);
      } else {
        console.log('✅ Sign up successful');
      }
      
      return { data, error };
    } catch (err) {
      console.error('❌ Unexpected sign up error:', err);
      return { data: null, error: { message: 'Network error. Please try again.' } };
    }
  },

  async signIn(email, password) {
    try {
      console.log('🔄 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { data, error };
    } catch (err) {
      console.error('❌ Unexpected sign in error:', err);
      return { data: null, error: { message: 'Network error. Please try again.' } };
    }
  },

  async signOut() {
    try {
      console.log('🔄 Attempting sign out');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Sign out successful');
      }
      
      return { error };
    } catch (err) {
      console.error('❌ Unexpected sign out error:', err);
      return { error: { message: 'Network error during sign out.' } };
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (error) {
        // Handle AuthSessionMissingError gracefully
        if (error.name === "AuthSessionMissingError" || error.message?.includes("Auth session missing")) {
          return null;
        }
        console.error('❌ Get user error:', error);
        return null;
      }

      return user;
    } catch (err) {
      // Also handle unexpected errors
      if (err.name === "AuthSessionMissingError" || err.message?.includes("Auth session missing")) {
        return null;
      }
      console.error('❌ Unexpected get user error:', err);
      return null;
    }
  },

  // Pet management
  async getPets() {
    const user = await this.getCurrentUser();
    if (!user) return { data: [], error: { message: "Not authenticated" } };

    try {
      console.log('🔄 Loading pets for user:', user.id);
      
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('❌ Get pets error:', error);
      } else {
        console.log('✅ Pets loaded:', data?.length || 0);
      }

      return { data: data || [], error };
    } catch (err) {
      console.error('❌ Unexpected get pets error:', err);
      return { data: [], error: { message: 'Network error while fetching pets.' } };
    }
  },

  async createPet(petData) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: { message: "Not authenticated" } };

    // Input validation
    if (!petData.name?.trim()) {
      return { data: null, error: { message: "Pet name is required" } };
    }

    if (!petData.species) {
      return { data: null, error: { message: "Species is required" } };
    }

    try {
      console.log('🔄 Creating pet:', petData.name);
      
      const { data, error } = await supabase
        .from("pets")
        .insert({
          ...petData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Create pet error:', error);
      } else {
        console.log('✅ Pet created successfully');
      }

      return { data, error };
    } catch (err) {
      console.error('❌ Unexpected create pet error:', err);
      return { data: null, error: { message: 'Network error while creating pet.' } };
    }
  },

  async updatePet(petId, updates) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: { message: "Not authenticated" } };

    // Input validation
    if (!petId) {
      return { data: null, error: { message: "Pet ID is required" } };
    }

    if (updates.name !== undefined && !updates.name?.trim()) {
      return { data: null, error: { message: "Pet name cannot be empty" } };
    }

    try {
      console.log('🔄 Updating pet:', petId);
      
      const { data, error } = await supabase
        .from("pets")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", petId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Update pet error:', error);
      } else {
        console.log('✅ Pet updated successfully');
      }

      return { data, error };
    } catch (err) {
      console.error('❌ Unexpected update pet error:', err);
      return { data: null, error: { message: 'Network error while updating pet.' } };
    }
  },

  async deletePet(petId) {
    const user = await this.getCurrentUser();
    if (!user) return { error: { message: "Not authenticated" } };

    if (!petId) {
      return { error: { message: "Pet ID is required" } };
    }

    try {
      console.log('🔄 Deleting pet:', petId);
      
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId)
        .eq("user_id", user.id);

      if (error) {
        console.error('❌ Delete pet error:', error);
      } else {
        console.log('✅ Pet deleted successfully');
      }

      return { error };
    } catch (err) {
      console.error('❌ Unexpected delete pet error:', err);
      return { error: { message: 'Network error while deleting pet.' } };
    }
  },

  // Mood logging
  async getMoodLogs(petId, limit = 30) {
    const user = await this.getCurrentUser();
    if (!user) return { data: [], error: { message: "Not authenticated" } };

    if (!petId) {
      return { data: [], error: { message: "Pet ID is required" } };
    }

    try {
      console.log('🔄 Loading mood logs for pet:', petId);
      
      const { data, error } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Get mood logs error:', error);
      } else {
        console.log('✅ Mood logs loaded:', data?.length || 0);
      }

      return { data: data || [], error };
    } catch (err) {
      console.error('❌ Unexpected get mood logs error:', err);
      return { data: [], error: { message: 'Network error while fetching mood logs.' } };
    }
  },

  async logMood(petId, mood, note = null) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: { message: "Not authenticated" } };

    // Input validation
    if (!petId) {
      return { data: null, error: { message: "Pet ID is required" } };
    }

    if (!mood) {
      return { data: null, error: { message: "Mood is required" } };
    }

    const validMoods = ['happy', 'content', 'neutral', 'anxious', 'sad', 'angry'];
    if (!validMoods.includes(mood)) {
      return { data: null, error: { message: "Invalid mood selected" } };
    }

    try {
      console.log('🔄 Logging mood for pet:', petId, 'mood:', mood);
      
      const { data, error } = await supabase
        .from("mood_logs")
        .insert({
          pet_id: petId,
          user_id: user.id,
          mood,
          note: note?.trim() || null,
          logged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Log mood error:', error);
      } else {
        console.log('✅ Mood logged successfully');
      }

      return { data, error };
    } catch (err) {
      console.error('❌ Unexpected log mood error:', err);
      return { data: null, error: { message: 'Network error while logging mood.' } };
    }
  },

  async getTodaysMood(petId) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: { message: "Not authenticated" } };

    if (!petId) {
      return { data: null, error: { message: "Pet ID is required" } };
    }

    try {
      console.log('🔄 Getting today\'s mood for pet:', petId);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .gte("logged_at", today.toISOString())
        .order("logged_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Get today\'s mood error:', error);
        return { data: null, error };
      }

      const todaysMood = data && data[0] ? data[0] : null;
      console.log('✅ Today\'s mood:', todaysMood ? todaysMood.mood : 'none');

      return { data: todaysMood, error };
    } catch (err) {
      console.error('❌ Unexpected get today\'s mood error:', err);
      return { data: null, error: { message: 'Network error while fetching today\'s mood.' } };
    }
  },
};

// Connection test on load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test the connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message.includes('Invalid API key')) {
      console.error('❌ Invalid Supabase configuration. Please check your API keys.');
    } else if (config.supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
      console.warn('⚠️ Supabase not configured - using mock client');
    } else {
      console.log('✅ Supabase connection established');
    }
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err);
  }
});

