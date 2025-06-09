// Initialize Supabase
const SUPABASE_URL = "YOUR_SUPABASE_URL"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // Replace with your anon key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helpers
const db = {
  // Auth
  async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  // Pets
  async getPets() {
    const user = await this.getCurrentUser();
    if (!user) return { data: [], error: "Not authenticated" };

    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return { data: data || [], error };
  },

  async createPet(petData) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: "Not authenticated" };

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

    return { data, error };
  },

  async updatePet(petId, updates) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: "Not authenticated" };

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

    return { data, error };
  },

  // Mood logs
  async getMoodLogs(petId, limit = 30) {
    const user = await this.getCurrentUser();
    if (!user) return { data: [], error: "Not authenticated" };

    const { data, error } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("pet_id", petId)
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(limit);

    return { data: data || [], error };
  },

  async logMood(petId, mood, note = null) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("mood_logs")
      .insert({
        pet_id: petId,
        user_id: user.id,
        mood,
        note,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  },

  async getTodaysMood(petId) {
    const user = await this.getCurrentUser();
    if (!user) return { data: null, error: "Not authenticated" };

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

    return { data: data && data[0] ? data[0] : null, error };
  },
};
