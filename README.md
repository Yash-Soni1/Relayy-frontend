<img width="1898" height="827" alt="Screenshot 2025-09-22 001430" src="https://github.com/user-attachments/assets/fefc14b7-1985-41b7-9101-1feb502e153c" />




# Relayy – Frontend

This is the frontend for **Relayy**, a collaborative workspace app built with **React, Vite, TailwindCSS, and Supabase**.

## 🚀 Features

### 🔹 Home Page

* Landing page with an animated hero section.
* **Get Started** button → redirects to the authentication page.

### 🔹 Authentication

1. **Email + Password**

   * **Login** if the account already exists.
   * **Signup** if the user is new.
   * On signup, Supabase sends a **confirmation email** → users must verify their email before logging in.

2. **Google Authentication (OAuth)**

   * Users can sign up or log in with **Google** in one click.
   * **No email verification required** when using Google Auth.

3. **After Authentication**

   * Users are automatically redirected to the **Dashboard**.
   * The **Dashboard** is protected with a `ProtectedRoute` wrapper.

---

## 🛠️ Tech Stack

* **React 19 + Vite** – fast frontend framework.
* **TailwindCSS** – modern utility-first CSS.
* **Framer Motion** – animations for landing UI.
* **Supabase** – authentication + backend services.
* **React Router v7** – client-side routing.
* **React Hot Toast** – clean toast notifications.
* **Lucide Icons** – modern icon set.

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/relay-frontend.git
cd relay-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start the dev server

```bash
npm run dev
```

---

## 📂 Project Structure

```
frontend/
│── src/
│   ├── components/         # Reusable UI components (Card, Button, Input, etc.)
│   ├── lib/                # Supabase client setup
│   ├── pages/              # Home, Login, Dashboard
│   ├── App.tsx             # Router config + Protected routes
│   └── index.tsx           # React root
│
│── public/                 # Static assets
│── package.json
│── vite.config.ts
│── tailwind.config.js
```

---

## 🔐 Authentication Flow

1. User clicks **Get Started** → redirected to `/login`.
2. Options available:

   * **Login with Email/Password**
   * **Signup with Email/Password** → confirmation email sent.
   * **Continue with Google** (instant login/signup).
3. After successful login/signup → redirected to `/dashboard`.

---

## 📦 Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start local dev server   |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint checks        |

---

## 🌐 Deployment

* **Frontend** → can be deployed on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
* **Supabase** → hosted automatically by [Supabase](https://supabase.com).
