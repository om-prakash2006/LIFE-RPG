# Life RPG — Gamified Productivity Web Application

> Turn mundane daily tasks into virtual progression. Complete real-world activities, earn Experience Points (XP) and Gold, level up character stats, maintain streaks, and purchase gear in the hero shop.

---

## 🌟 Core Architecture & Feature Matrix

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Authentication & Security** | Supabase Auth email/password with session management and Row Level Security (RLS). Users can only view and mutate their own tasks and character data. | ✅ Implemented |
| **Database Schema & CRUD** | Supabase PostgreSQL database tables: `profiles`, `characters`, and `user_quests`. Full Create, Read, Update, and Delete capabilities. | ✅ Implemented |
| **RPG Progression Engine** | Non-linear leveling curve where each subsequent level requires more XP: `nextLevelXp = Math.round(previous * 1.35)`. Level-up triggers celebratory particle confetti and stat boosts. | ✅ Implemented |
| **Gamified Stats & Categories** | Tasks are categorized into 5 core stats: **Intellect** (studying, coding), **Strength** (workouts, athletics), **Discipline** (chores, routine), **Vitality** (sleep, health), and **Knowledge** (reading, research). | ✅ Implemented |
| **Hero Economy & Shop** | Earn Gold bounties from completed quests to unlock items, avatars, potions, badges, and themes. Equipped loadout updates avatar defense and stat boosts. | ✅ Implemented |
| **Streak Tracking** | 7-day activity visualizer tracking consecutive daily completions. | ✅ Implemented |
| **Tactile Celebratory UI** | Micro-interactions, spring transitions (`motion`), canvas confetti on level-up and quest completion, optimistic updates, and sound feedback. | ✅ Implemented |
| **AI Quest Master (Gemini)** | Automatic natural language task analyzer and daily quest generator powered by Gemini 2.5 Flash. | ✅ Implemented |

---

## 🚀 Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion (`motion/react`), Lucide React
- **Database & Auth**: Supabase (PostgreSQL), Supabase Auth (`@supabase/supabase-js`)
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash)
- **Effects**: `canvas-confetti`

---

## 🛠️ Getting Started & Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or bun

### 2. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd life-rpg
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the values:
```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
GEMINI_API_KEY=<your-gemini-api-key>
```

### 4. Setup Supabase Database Tables
Run the SQL script located at `supabase/schema.sql` inside the Supabase SQL Editor:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. This creates `public.profiles`, `public.characters`, and `public.user_quests` with Row Level Security (RLS) policies.

> **Tip for Email Authentication**:
> In your Supabase Dashboard under **Authentication -> Providers -> Email**, you can toggle **Confirm email** off for instant login without waiting for email verification links during testing and video demonstrations.

### 5. Run Development Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

### 6. Build for Production
```bash
npm run build
```
Production static assets will be output to `dist/`.

---

## 📋 Database Schema Summary

- **`public.profiles`**: Stores username, email, and timestamps keyed to `auth.users.id`.
- **`public.characters`**: Stores level, XP, gold, and stat attributes (strength, intellect, discipline, vitality, knowledge).
- **`public.user_quests`**: Stores title, description, category, difficulty, xp_reward, gold_reward, completion status, and streaks.
