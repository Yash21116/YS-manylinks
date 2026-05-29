# Yash — Projects Landing Page & Admin Console

A premium, high-aesthetic landing page and project showcase. It features a real-time WebGL liquid-sheen background, a glassmorphic dashboard interface, and an admin editor to update projects and profile details on the fly.

![Aesthetic Preview]![alt text](image-2.png)

You can see the dashboard live at: https://ys-landing.vercel.app/
---

## ✨ Features

- **Aesthetic UI/UX**: Designed with deep charcoal backdrops, liquid-glass cards, sleek typography (Archivo + Space Grotesk), smooth micro-animations, and responsive grids.
- **WebGL Background**: Powered by a custom WebGL shader program rendering a responsive, interactive, linen-textured slate-charcoal flow.
- **Admin Console (`/admin.html`)**: An integrated editor where you can customize:
  - Initials, Name, Role, Bio.
  - Profile Image (via local image upload converted to data URL, or direct URL).
  - Social Links (GitHub, LinkedIn, Twitter/X).
  - Project Cards (add, delete, reorder, and toggle full-width vs. half-width layouts).
- **Persistent Data**: Changes made in the Admin Console are persisted in browser `localStorage` for immediate live updates.
- **Secure Access**: The Admin Console is protected by a hashed secret configuration.

---

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla JavaScript, CSS3
- **Graphics**: WebGL (fragment shaders)
- **Local Server**: Node.js (`http` & `fs` modules, zero external dependencies)
- **Deployment**: Vercel Serverless Functions

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yash21116/-----manylinks.git
   cd Landing page
   ```

2. **Configure your environment**:
   Create a `.env` file at the root:
   ```bash
   ADMIN_SECRET_HASH=your_memorable_secret
   ```

3. **Start the local server**:
   ```bash
   node server.js
   ```
   Open:
   - Live Page: [http://localhost:3333](http://localhost:3333)
   - Admin Console: [http://localhost:3333/admin.html](http://localhost:3333/admin.html)

### Production Deployment (Vercel)

1. Deploy the directory using Vercel.
2. In your **Vercel Project Dashboard**, navigate to **Settings** → **Environment Variables**.
3. Add the following environment variable:
   - **Key**: `ADMIN_SECRET_HASH`
   - **Value**: `your_memorable_secret`
4. Redeploy the application. The Vercel Serverless function (`/api/config.js`) will automatically serve the secret hash to the admin login gate.

---

## 🔑 Security & Configuration

The local `config.js` file is untracked by Git to prevent your credentials from being exposed in public repositories. 

- **Local Server**: Serves `.env` dynamically on the fly to bypass static config files.
- **Production Server (Vercel)**: Rewrites requests to `/config.js` to `/api/config.js` which dynamically injects your Vercel Environment Variables.
