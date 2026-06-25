# MMJ Driving School

Modern, interactive React + Vite website for MMJ Driving School in Germiston, South Africa.

## Features

- Modern, responsive UI with smooth animations
- Car-themed animations in hero section
- Supabase authentication (Sign In / Sign Up)
- Supabase Storage for gallery images with descriptions
- Admin Dashboard for photo uploads and message management
- React Router for page navigation
- Context-based authentication state management
- Mobile-responsive design

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Supabase** - Authentication and database
- **CSS** - Custom styling with CSS variables

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon/public key from Settings > API

### 2. Create Database Tables

In your Supabase project's SQL Editor, run the following:

```sql
-- Gallery table for storing photo metadata
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  uploaded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploader TEXT
);

-- Messages table for contact form submissions
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  course TEXT,
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Set Up Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `MMJ Pictures`
3. Make the bucket public (or configure RLS policies as needed)

### 4. Configure Row Level Security (RLS)

Enable RLS and add policies:

```sql
-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Gallery policies
CREATE POLICY "Public read access for gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Admin insert for gallery" ON gallery
  FOR INSERT WITH CHECK (auth.email() IN ('admin@mmjdriving.co.za', 'jimmy@mmjdriving.co.za'));

CREATE POLICY "Admin delete for gallery" ON gallery
  FOR DELETE USING (auth.email() IN ('admin@mmjdriving.co.za', 'jimmy@mmjdriving.co.za'));

-- Messages policies
CREATE POLICY "Public insert for messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read for messages" ON messages
  FOR SELECT USING (auth.email() IN ('admin@mmjdriving.co.za', 'jimmy@mmjdriving.co.za'));
```

### 5. Update Configuration

Update the configuration in `src/lib/supabase.js` with your credentials:

```javascript
const SUPABASE_URL = "https://your-project.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "your-publishable-key"
const SUPABASE_BUCKET = "MMJ Pictures"
```

## Pages

- **/** - Home page with hero, about, services, gallery, reviews, and contact sections
- **/signin** - Sign in page with Supabase authentication
- **/signup** - Sign up page with Supabase authentication
- **/admin** - Admin dashboard (only accessible to admin emails)

## Admin Access

To access the admin panel:
1. Sign up/sign in with an email listed in the `ADMIN_EMAILS` array in `src/lib/supabase.js`
2. The admin panel will automatically appear in the navbar
3. Default admin emails: `admin@mmjdriving.co.za`, `jimmy@mmjdriving.co.za`

## Project Structure

```
mmj-driving-school/
├── src/
│   ├── components/      # Reusable components (Navbar, Footer)
│   ├── context/         # React Context (AuthContext)
│   ├── lib/            # Utilities (Supabase client)
│   ├── pages/          # Page components (Home, SignIn, SignUp, Admin)
│   ├── App.jsx         # Main app with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── README.md          # This file
```

## Deployment

This Vite + React app can be deployed to:
- **Netlify** - Connect your Git repo and enable Vite build
- **Vercel** - Import project and it auto-detects Vite
- **GitHub Pages** - Use `gh-pages` package
- Any static hosting service

For Netlify/Vercel, set the build command to `npm run build` and publish directory to `dist`.

## Customization

- Update colors in `src/index.css` `:root` variables
- Modify `ADMIN_EMAILS` in `src/lib/supabase.js` for admin access
- Edit the `REVIEWS` array in `src/pages/Home.jsx` to update testimonials
- Customize page content in respective page components

