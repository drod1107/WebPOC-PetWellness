# Pet Wellness Tracker - Web POC

A Flutter-inspired web application for tracking pet wellness, built with vanilla JavaScript and Supabase.

## 🚀 Features

- **Multi-pet Management**: Add, edit, and manage multiple pets
- **Mood Tracking**: Log daily moods for each pet with notes
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Secure Authentication**: Email/password signup and login
- **Real-time Data**: Powered by Supabase for instant updates
- **Multilingual**: English and Italian language support

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Hosting**: Netlify
- **Build**: Node.js build script for environment variables

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **Git**: For version control

## 🔧 Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd WebPOC-PetWellness
npm install
```

### 2. Supabase Setup

#### Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for the project to be created (2-3 minutes)

#### Get Your Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**

#### Set Up Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the entire SQL schema from the artifact above
3. Click "Run" to create all tables and security policies

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
NODE_ENV=development
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

### 4. Build and Run

```bash
# Build the app (generates config.js with environment variables)
npm run build

# Start local development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔑 Authentication Setup

The app uses Supabase Auth with email/password authentication:

1. **Email Confirmation**: By default, Supabase requires email confirmation
   - For development: Go to **Authentication** → **Settings** → Disable "Enable email confirmations"
   - For production: Keep email confirmations enabled for security

2. **Password Requirements**: Minimum 8 characters (configurable in Supabase)

## 📱 Usage

### First Time Setup

1. Open the app and click "Sign Up"
2. Create an account with email and password
3. Sign in to access the dashboard
4. Add your first pet using the "Add Pet" button

### Adding Pets

- Click the "+" FAB button or "Add Pet"
- Fill in pet details (name and species are required)
- Save to create the pet profile

### Logging Moods

- Click "Log Mood" on the dashboard
- Select an emoji representing your pet's mood
- Add optional notes about their behavior
- Save the mood entry

### Managing Pets

- Click on a pet card to view their profile
- Use the edit button (✏️) to update pet information
- Delete pets from the edit modal (this removes all associated data)

## 🚀 Deployment to Netlify

### Option 1: Git-based Deployment (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Choose your repository
   - Set build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.` (root)

3. **Add Environment Variables**:
   - Go to **Site settings** → **Environment variables**
   - Add:
     - `SUPABASE_URL` = your Supabase project URL
     - `SUPABASE_ANON_KEY` = your Supabase anon key
     - `NODE_ENV` = `production`

4. **Deploy**:
   - Click "Deploy site"
   - Your app will be live at `https://your-site-name.netlify.app`

### Option 2: Manual Deployment

1. **Build locally**:

   ```bash
   npm run build
   ```

2. **Deploy folder**:
   - Zip the entire project folder
   - Go to Netlify dashboard
   - Drag and drop the zip file

## 🔒 Security Considerations

### Row Level Security (RLS)

The database schema includes RLS policies that ensure:

- Users can only see their own pets and mood logs
- All operations are scoped to the authenticated user
- No cross-user data access is possible

### Environment Variables

- Never commit `.env` files to version control
- Use Netlify's environment variables for production
- The build script safely injects vars into `config.js`

### Supabase Security

- The anon key is safe to expose in client-side code
- All database access is protected by RLS policies
- Auth tokens are automatically managed by Supabase

## 🐛 Troubleshooting

### Common Issues

#### 1. "Invalid API key" Error

- **Problem**: Wrong Supabase credentials
- **Solution**: Double-check your `.env` file and run `npm run build`

#### 2. Infinite Loading Screen

- **Problem**: Supabase connection failure
- **Solution**: Check browser console for errors, verify network connection

#### 3. "Table doesn't exist" Error

- **Problem**: Database schema not created
- **Solution**: Run the SQL schema in Supabase SQL Editor

#### 4. Sign-up Not Working

- **Problem**: Email confirmations enabled
- **Solution**: Disable email confirmations in Supabase Auth settings (dev only)

#### 5. Build Command Fails

- **Problem**: Missing environment variables
- **Solution**: Create `.env` file with correct Supabase credentials

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
DEBUG=true
```

Then check the browser console for detailed logs.

## 📁 File Structure

```bash
WebPOC-PetWellness/
├── index.html              # Main app entry point
├── styles.css               # Global styles and theme
├── js/
│   ├── config.js           # Generated config (don't edit)
│   ├── app.js              # Main application logic
│   ├── auth.js             # Authentication helpers
│   ├── supabase-client.js  # Database and API calls
│   ├── components.js       # UI component builders
│   ├── translations.js     # Internationalization
│   └── modals.js           # Modal system (new)
├── pages/
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── dashboard.html      # Main dashboard
│   └── pet-profile.html    # Pet detail view
├── package.json            # Dependencies and scripts
├── build.js                # Build script for env vars
├── netlify.toml            # Netlify configuration
├── .env.example            # Environment template
└── README.md               # This file
```

## 🔄 Development Workflow

1. **Make changes** to your code
2. **Test locally** with `npm run dev`
3. **Build** with `npm run build` (regenerates config)
4. **Commit and push** to trigger Netlify deployment
5. **Verify** on your live site

## 📈 Next Steps

Potential enhancements for the POC:

- [ ] Photo uploads for pet avatars
- [ ] Activity logging (walks, meals, vet visits)
- [ ] Calendar view for scheduling
- [ ] Export data functionality
- [ ] Push notifications
- [ ] Progressive Web App (PWA) features

## 🆘 Support

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify Supabase configuration** in the dashboard
3. **Test database connection** by running simple queries in SQL Editor
4. **Review this README** for setup steps

## 📄 License

This project is for internal use only. All rights reserved.

---

**Made with ❤️ for pet wellness tracking**
