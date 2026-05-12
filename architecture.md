# PadhakuPortal Architecture

PadhakuPortal is a modern Single Page Application (SPA) designed to provide a robust, scalable, and responsive platform for college students. It operates on a Serverless / Backend-as-a-Service (BaaS) architecture, meaning there is no traditional backend server to maintain.

## 1. Technology Stack

*   **Frontend Framework:** React 19 built with **Vite** for incredibly fast hot-module reloading and optimized production builds. 
*   **Language:** **TypeScript** for strict type-checking, which minimizes runtime errors and improves developer experience.
*   **Styling:** **Tailwind CSS** handles all the styling. We use custom design tokens (like the Deep Navy and Orange palette) defined in `tailwind.config.js`.
*   **Routing:** **React Router v7** (`react-router-dom`) manages the navigation between different pages without reloading the browser.

## 2. Backend & Cloud Infrastructure

Instead of a custom Node.js/Express backend, PadhakuPortal leverages a combination of cloud services:

*   **Database & Authentication (Firebase):** 
    *   **Firebase Auth** handles the secure Admin login logic.
    *   **Firestore** (a NoSQL document database) stores all application metadata for PYQs, Notes, and Announcements in real-time.
*   **File Storage (Supabase):** The application relies on **Supabase Storage** for managing heavy assets. When PDFs or documents are uploaded, they are pushed to Supabase, and the resulting public URL is saved into the Firebase database.
*   **AI Engine (Google Gemini):** The AI Tutor feature connects directly to the **Gemini 3 Flash** model using the `@google/genai` SDK. The API key is injected securely via Vite environment variables during the build process.

## 3. Directory Structure

The project follows a strict React standard where everything lives inside the `src/` directory to separate source code from configuration files:

```text
PadhakuPortal/
├── .env.local                 # Local environment variables (e.g., Gemini API keys)
├── vite.config.ts             # Vite bundler configuration and aliases
├── tailwind.config.js         # Design system & CSS rules
├── tsconfig.json              # TypeScript compiler options
└── src/
    ├── App.tsx                # Main entry point; defines all React Routes
    ├── index.tsx              # Mounts the React App to the DOM
    ├── supabaseClient.ts      # Initializes the Supabase Storage connection
    ├── constants.ts           # Global data like Department lists and mock data
    ├── components/            # Reusable UI building blocks
    │   ├── Layout.tsx         # The main wrapper (Navbar + Footer)
    │   ├── ScrollToTop.tsx    # Handles scroll position resets on navigation
    │   └── ThemeToggle.tsx    # Light/Dark mode switcher
    ├── context/               # Global State Management
    │   ├── AuthContext.tsx    # Tracks if the Admin is logged in
    │   └── ThemeContext.tsx   # Tracks dark/light mode preferences
    ├── pages/                 # Full application views
    │   ├── Home.tsx           # The landing page dashboard
    │   ├── AIChat.tsx         # The Gemini-powered AI Tutor
    │   ├── AdminDashboard.tsx # Upload/manage resources (Protected Route)
    │   └── PYQList.tsx        # Displays the database of past papers
    └── utils/
        └── firebase.ts        # Initializes Firebase Auth & Firestore
```

## 4. Example Data Flow (Uploading a Note)

1. **User Action:** The Admin authenticates via `AdminLogin.tsx` (Firebase Auth).
2. **Global State:** `AuthContext.tsx` detects the successful login and grants access to the protected `AdminDashboard.tsx`.
3. **Storage:** The Admin selects a PDF document. The application uploads that PDF directly to **Supabase Storage**.
4. **Database:** Supabase returns a public URL for the successfully uploaded PDF. The application takes that URL, combines it with the Note's metadata (title, department, semester), and saves it as a new document in **Firebase Firestore**.
5. **UI Update:** Real-time listeners (like the one in `NotesList.tsx`) detect the new Firestore document instantly and update the UI for all students browsing the site.
