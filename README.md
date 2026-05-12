<div align="center">
  <br/>
  <h1>📚 Padhaku Portal</h1>
  <p><strong>A modern, AI-powered academic resource hub for students to access Notes, Previous Year Questions (PYQs), and study materials.</strong></p>
</div>

---

## ✨ Features

- **🎓 Comprehensive Resources**: Browse and download university/college notes, syllabi, and Previous Year Questions (PYQs) with ease.
- **🤖 AI Integration**: Integrated with Google's Gemini AI to assist students with quick summaries and intelligent query handling.
- **⚡ Lightning Fast UI**: Built with Vite and React for an incredibly fast, Single Page Application (SPA) experience.
- **☁️ Cloud Storage**: Securely hosts and streams study materials and PDFs using Supabase & Firebase.
- **📱 Fully Responsive**: A beautiful, modern interface crafted with Tailwind CSS that works seamlessly across desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide React (Icons)
- **Routing:** React Router v7
- **Backend/Storage:** Supabase & Firebase
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kishantakodara/PadhakuPortal.git
   cd PadhakuPortal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your required keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   # Add your Supabase/Firebase credentials here if applicable
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Visit `http://localhost:3000` in your browser.

---

## 📦 Deployment

This project is configured for seamless deployment on **Vercel**. 

1. Push your code to a GitHub repository.
2. Import the repository into Vercel.
3. Vercel will automatically detect Vite and configure the build settings. (The `vercel.json` file ensures routing works correctly and points to the `dist` directory).
4. Add your Environment Variables (`GEMINI_API_KEY`, etc.) in the Vercel dashboard.
5. Deploy!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Kishantakodara/PadhakuPortal/issues).

## 📄 License

This project is open-source and available to use for educational purposes.
