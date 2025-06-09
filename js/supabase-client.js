// Initialize Supabase with environment variables
// Note: For a simple POC, we'll use a basic config object approach
// In production, use proper serverless functions to hide sensitive keys

// Configuration - replace these with your actual Supabase values
const config = {
  supabaseUrl: window.ENV?.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE',
  supabaseAnonKey: window.ENV?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE'
};

// Validate configuration
if (config.supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || config.supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.error('⚠️ Supabase configuration not set. Please check your environment variables.');
  console.info('📝 Create a config.js file or set window.ENV with your Supabase credentials.');
}

const supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);

// Database helpers with improved error handling
const db = {
  // Auth
  async signUp(email, password, name) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return { data: null, error: { message: 'Network error. Please try again.' } };
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      return { data: null, error: { message: 'Network error. Please try again.' } };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
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
        console.error('Get user error:', error);
        return null;
      }
      
      return user;
    } catch (err) {
      console.error('Unexpected get user error:', err);
      return null;
    }
  },

  // Pets
  async getPets() {
    const user = await this.getCurrentUser();
    if (!user) return { data: [], error: { message: "Not authenticated" } };

    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Get pets error:', error);
      }

      return { data: data || [], error };
    } catch (err) {
      console.error('Unexpected get pets error:', err);
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
        console.error('Create pet error:', error);
      }

      return { data, error };
    } catch (err) {
      console.error('Unexpected create pet error:', err);
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
        console.error('Update pet error:', error);
      }

      return { data, error };
    } catch (err) {
      console.error('Unexpected update pet error:', err);
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
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId)
        .eq("user_id", user.id);

      if (error) {
        console.error('Delete pet error:', error);
      }

      return { error };
    } catch (err) {
      console.error('Unexpected delete pet error:', err);
      return { error: { message: 'Network error while deleting pet.' } };
    }
  },

  // Mood logs
  async getMoodLogs(petId, limit = 30) {
    const user = await this.getCurrentUser();
    if (!user) return { data: [], error: { message: "Not authenticated" } };

    if (!petId) {
      return { data: [], error: { message: "Pet ID is required" } };
    }

    try {
      const { data, error } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get mood logs error:', error);
      }

      return { data: data || [], error };
    } catch (err) {
      console.error('Unexpected get mood logs error:', err);
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
        console.error('Log mood error:', error);
      }

      return { data, error };
    } catch (err) {
      console.error('Unexpected log mood error:', err);
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
        console.error('Get today\'s mood error:', error);
        return { data: null, error };
      }

      return { data: data && data[0] ? data[0] : null, error };
    } catch (err) {
      console.error('Unexpected get today\'s mood error:', err);
      return { data: null, error: { message: 'Network error while fetching today\'s mood.' } };
    }
  },
};

// Connection test on load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Test the connection
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('Invalid API key')) {
      console.error('❌ Invalid Supabase configuration. Please check your API keys.');
    } else {
      console.log('✅ Supabase connection established');
    }
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err);
  }
});