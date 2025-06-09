// Authentication handling
const auth = {
    // Check if user is authenticated
    async checkAuth() {
        const user = await db.getCurrentUser();
        return user !== null;
    },
    
    // Handle sign up
    async handleSignUp(email, password, name) {
        const { data, error } = await db.signUp(email, password, name);
        
        if (error) {
            throw new Error(error.message);
        }
        
        return data;
    },
    
    // Handle sign in
    async handleSignIn(email, password) {
        const { data, error } = await db.signIn(email, password);
        
        if (error) {
            throw new Error(error.message);
        }
        
        return data;
    },
    
    // Handle sign out
    async handleSignOut() {
        const { error } = await db.signOut();
        
        if (error) {
            throw new Error(error.message);
        }
        
        window.location.href = '/';
    },
    
    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate password
    validatePassword(password) {
        return password.length >= 8;
    }
};