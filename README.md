# 📑 Smart Bookmark App

A professional-grade, full-stack bookmark management application built to demonstrate production-ready workflows, real-time data synchronization, and secure cloud authentication.

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20Supabase%20|%20Tailwind-blue?style=for-the-badge)](https://github.com/)

---

## 🚀 Live Demo
**View the deployed application here:** [https://smart-bookmark-app-three-murex.vercel.app](https://smart-bookmark-app-three-murex.vercel.app)

---

## ✨ Features

* 🔐 **Google OAuth** – Secure, passwordless login via Supabase Auth.
* 👤 **Multi-User Isolation** – Row Level Security (RLS) ensures your bookmarks are private to you.
* ⚡ **Real-Time Sync** – Updates reflect instantly across all open browser tabs without refreshing.
* ➕ **Quick Management** – Seamlessly add and delete bookmarks with a single click.
* 🎨 **Modern UI** – Responsive design built with Tailwind CSS and animated toast notifications.
* 🚀 **CI/CD** – Automated deployment pipeline via Vercel and GitHub.

---

## 🏗 Architecture Overview

The app utilizes a modern **BaaS (Backend-as-a-Service)** architecture to minimize server overhead while maximizing security.

**User** → **Google OAuth** → **Supabase Auth** **Supabase** → **PostgreSQL Database (RLS Enabled)** **Next.js App** → **Vercel Deployment** ---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL, Realtime CDC) |
| **Auth** | Google OAuth via Supabase |
| **Deployment** | Vercel |
| **Version Control** | GitHub (SSH-based authentication) |

---

## 📂 Project Structure

```text
app/
 ├── auth/
 │   └── callback/
 │       └── route.ts      # Handles OAuth exchange and session storage
 ├── dashboard/
 │   └── page.tsx          # Main application interface (Protected)
 ├── layout.tsx            # Global providers and styles
 └── page.tsx              # Landing page and Login entry
lib/
 └── supabaseClient.ts     # Supabase client initialization
 ```

## 🧠 Technical Challenges & Solutions

### 1️⃣ Production OAuth Redirects
Problem: Login redirects were defaulting to ```localhost:3000``` even after deployment.

Solution: Dynamically derived the origin from the request URL to support both local and production environments:

```TypeScript
const origin = new URL(request.url).origin;
return NextResponse.redirect(`${origin}/dashboard`);
```

### 2️⃣ Secure Data Access (RLS)
Problem: Ensuring users cannot view or delete bookmarks belonging to others.

Solution: Implemented Row Level Security (RLS) in PostgreSQL.

```sql
-- Policy: Allow users to only see rows where user_id matches their Auth UID
auth.uid() = user_id
```

### 3️⃣ Real-time Synchronization
Problem: Changes in one tab (e.g., deleting a bookmark) weren't showing in another tab.

Solution: Integrated Supabase's Realtime channel to listen for ```INSERT``` and ```DELETE``` events.

```typescript
supabase
  .channel("bookmarks-changes")
  .on("postgres_changes", { event: "*", schema: "public", table: "bookmarks" }, fetchBookmarks)
  .subscribe();
  ```
--- 

### ⚙️ Environment Variables
To run this project locally, create a ```.env.local``` file with the following:

```Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🔮 Future Roadmap
- [ ] Edit Functionality – Modify existing bookmark titles and URLs.

- [ ] Search Bar – Filter bookmarks by keyword or domain.

- [ ] Categorization – Organize links into custom folders or tags.

- [ ] Dark Mode – Add a toggle for low-light environments.

---

### 👨‍💻 Developer
Name: Nikunj Bhardwaj 

Email: bhardwajrana123@gmail.com

GitHub: https://github.com/nikunjbhardwaj

Live API: https://smart-bookmark-app-three-murex.vercel.app