# 🌿 Serenity

**A University-Integrated Mental Health Platform**

> "A space built for trust, not performance."

Serenity is a modern, compassionate mental health platform designed specifically for university environments. It prioritizes emotional safety, privacy, and proactive care through a "Soft Organic Minimalism" design philosophy, moving away from clinical or corporate aesthetics to create a digital sanctuary for students.

[**Live Demo**](https://serenity-dfh43d1f1-rishabhs-projects-2cd9f0dc.vercel.app/)

---

## ✨ The Vision

Serenity acknowledges the unique pressures of university life. It bridges the gap between students, psychologists, and university administration by providing a unified yet strictly isolated ecosystem for mental wellbeing.

- **Trust First**: Radical transparency about data usage and strict isolation of personal health data.
- **Micro-Reflection**: Encouraging small, regular check-ins instead of overwhelming surveys.
- **Human Connection**: Facilitating warm, asynchronous communication between students and their care teams.

---

## 🎨 Design Philosophy: Soft Organic Minimalism

We believe that the user interface is the first step in care.
- **Palette**: Earthy sage greens, warm creams, and soft clays.
- **Typography**: Refined serifs (Lora) for display to evoke trust and wisdom; modern sans-serifs (DM Sans) for clarity.
- **Motion**: Subtle, purposeful animations that respond to user presence without causing distraction.

---

## 🏗️ Core Portals & Capabilities

### 🎓 Student Portal
- **Daily Mood Check-ins**: Simple, emoji-based tracking to monitor emotional trends.
- **Guided Reflections**: Weekly step-by-step prompts for self-discovery.
- **Goal Tracking**: Wellbeing goals (e.g., "Practice mindfulness", "Social connection") with progress visualization.
- **Async Messaging**: Secure, non-urgent communication with assigned mentors.

### 🩺 Psychologist Portal
- **Case Management**: Student overview with status indicators (*Improving*, *Stable*, *Needs Care*).
- **Care History**: Viewing longitudinal student check-in data and reflection trends.
- **Session Notes**: Confidential, encrypted documentation for professional use.

### 📊 Admin Portal
- **Privacy-Preserving Analytics**: High-level, aggregated university health metrics.
- **Trust Architecture**: Administration has ZERO access to individual student data, reflections, or notes.

---

## 🔐 Architecture & Authentication

Serenity has been upgraded from a static prototype to a production-ready authentication flow using **Supabase Auth**.

- **Next.js Middleware**: All core routes (`/student`, `/psychologist`, `/admin`) are fully protected. Unauthenticated users are securely redirected to the login flow.
- **Role-Based Routing**: Upon signing in, Supabase `user_metadata` determines your role and automatically routes you to your dedicated, role-specific dashboard.
- **Dynamic User Sessions**: The dashboards dynamically fetch and display the real signed-in user's name from the secure session token, and offer contextual empty states until real database records are populated.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with RLS, Server-side Auth)
- **Deployment**: [Vercel](https://vercel.com)
- **Styling**: Vanilla CSS Modules & Design Tokens
- **Animations**: CSS Keyframes + Framer Motion (planned)
- **Visualization**: Recharts
- **Typography**: Google Fonts (Lora, DM Sans)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (Latest LTS)
- npm or yarn
- A Supabase Project

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ris-git/Serenity.git
   cd Serenity
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *Fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.*
4. Run the development server:
   ```bash
   npm run dev
   ```

---


