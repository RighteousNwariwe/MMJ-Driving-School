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



## Pages

- **/** - Home page with hero, about, services, gallery, reviews, and contact sections
- **/signin** - Sign in page with Supabase authentication
- **/signup** - Sign up page with Supabase authentication
- **/admin** - Admin dashboard (only accessible to admin emails)



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

