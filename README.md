# 🩺 Pulse - Your Preventive Health Companion

<div align="center">

![Pulse Logo](https://img.shields.io/badge/Pulse-Health%20Companion-84CC16?style=for-the-badge&logo=heartbeat)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

**Pulse is an AI-powered preventive health monitoring app that helps users track daily wellness metrics, detect concerning health patterns early, and take proactive action through seamless clinic booking and personalized AI insights.**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-features)
- [Demo Story](#-demo-story)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the App](#running-the-app)
- [Project Structure](#-project-structure)
- [Core Concepts](#-core-concepts)
- [API Documentation](#-api-documentation)
- [Demo Script](#-demo-script)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Pulse addresses a critical gap in healthcare: **early detection through consistent self-monitoring**. Many health issues escalate because warning signs are brushed off individually. Pulse connects the dots by:

1. **Daily Check-ins**: Simple 9-card wellness assessment (energy, sleep, symptoms, mood, etc.)
2. **AI Pattern Recognition**: Google Gemini-powered analysis that spots concerning trends over 14+ days
3. **Proactive Recommendations**: Actionable insights with automatic clinic booking when patterns warrant attention
4. **Feedback Loops**: Track outcomes to improve AI accuracy (true/false positive validation)
5. **Gamified Adherence**: Streak tracking with progressive discount rewards (10%-80% off checkups)

### The Problem

- **Silent Decline**: Gradual health deterioration goes unnoticed (e.g., energy dropping from 4/5 to 2/5 over 2 weeks)
- **Scattered Data**: Symptoms, sleep, mood tracked separately without pattern correlation
- **Delayed Care**: By the time users seek help, conditions have worsened
- **Low Adherence**: Health tracking apps fail due to lack of motivation/rewards

### The Solution

Pulse combines:
- **Simplicity**: 60-second daily check-in
- **Intelligence**: AI connects symptoms, family history, lifestyle
- **Action**: Direct clinic booking with partner network discounts
- **Motivation**: Streak-based rewards make prevention profitable

---

## ✨ Features

### 🔥 Core Features

#### 1. Daily Check-in System
- **9 Wellness Cards**: Energy, Sleep, Symptoms, Respiratory, Temperature, Mood, Appetite, Lifestyle, Open-Ended
- Swipeable interface with smooth animations
- Streak tracking with visual indicators
- Completion rewards (discount tier progression)

#### 2. AI-Powered Analysis
- **Pattern Detection**: 14-day rolling window analysis
- **Contextual Insights**: Considers family history, medications, last checkup date
- **Dual Analysis**:
  - **Overview**: Quick summary with concern level
  - **Detailed Breakdown**: Day-by-day citations with reasoning
- **Pre-generated Results**: No waiting—analysis ready when check-in completes

#### 3. Nudge & Auto-Booking System
- **Smart Nudges**: AI recommends checkup when patterns concerning
- **Escalation Logic**: 
  - 1st nudge: 40% discount
  - 2nd nudge: 60% discount  
  - 3rd+ nudge: 100% FREE auto-booking
- **Nudge Tracking**: Persistent localStorage with badge indicators

#### 4. Feedback Loop
- **Outcome Validation**: "Did you book? Did you go?"
- **Report Upload**: Optional doctor report for AI accuracy tracking
- **True/False Positive**: Refine recommendations over time

#### 5. AI Chat Interface
- **Full Health Context**: Aware of 14-day history, profile, current concerns
- **Streaming Responses**: Real-time Gemini API integration
- **Chat Detection**: Extracts symptoms, medications, lifestyle changes from conversations
- **Context Banner**: Shows detected health insights count

#### 6. Clinic Partner Network
- **12+ Mock Clinics**: With specialties, ratings, distance, pricing
- **Advanced Filtering**: Distance, rating, specialty chips
- **Sorting**: By distance, rating, or discount tier
- **Context-Aware**: Highlights recommended specialties from AI analysis

#### 7. Gamification & Rewards
- **Streak System**: Daily check-in consistency tracking
- **Discount Tiers**:
  - Basic (7 days): 10% off
  - Regular (14 days): 20% off
  - Silver (30 days): 40% off
  - Gold (60 days): 60% off
  - Platinum (90 days): 80% off
- **Auto-Booking Eligibility**: 100% FREE after 3 ignored nudges

### 🚀 Additional Features

- **Detailed Analysis Modal**: JSON-like structured breakdown with day citations
- **Day Carousel Navigation**: Jump to any of last 14 days with data display
- **Theme Support**: Dark/light mode with system preference detection
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Smooth Animations**: Framer Motion throughout for polished UX

---

## 🎬 Demo Story

Our demo showcases **Amara's health journey**—a 28-year-old woman whose 14-day check-in pattern reveals a concerning decline:

### The Pattern
- **Days 1-3**: Baseline normal (energy 4/5, 7-8hrs sleep, positive mood)
- **Days 4-7**: Mild decline (energy 3/5, sleep reduces, neutral mood, occasional headaches)
- **Days 8-11**: Concerning signals (energy 2/5, poor sleep, low mood, abdomen discomfort appears Day 10)
- **Days 12-14**: Escalation (recurring abdomen ache, reduced appetite, social withdrawal)
- **Day 15 (Today)**: Critical combination (energy 2/5, 4.5hrs sleep, moderate abdomen pain, **fever**, very low appetite)

### AI Recommendation
> "Over the past 14 days, we've noticed a consistent and escalating pattern... Given your family history of hypertension and diabetes, plus the fact that your last checkup was 14 months ago, this combination warrants medical attention."

**Result**: Amara books a gynecology checkup through Pulse with 60% discount.

📄 **Full demo script**: [demo-script.md](demo-script.md)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (alpha)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion 11.0.0](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/) (for analytics view)

### AI & Backend
- **AI Model**: [Google Gemini API](https://ai.google.dev/)
- **Streaming**: Gemini's streaming API for real-time chat responses
- **Mock Data**: TypeScript interfaces for demo (prepared for backend integration)

### State Management
- **Local State**: React hooks (useState, useEffect, useRef)
- **Persistence**: localStorage for nudge tracking, user preferences
- **Future**: Zustand/Redux for complex state when backend integrated

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky (planned)
- **Version Control**: Git + GitHub

---

## 🏗 Architecture

### Component Structure

```
app/
├── layout.tsx          # Root layout with theme provider
├── page.tsx            # Main dashboard orchestrator
└── globals.css         # Tailwind base styles

components/
├── pulse/
│   ├── dashboard.tsx                    # Main app shell with tab navigation
│   ├── splash-screen.tsx                # Onboarding splash
│   ├── onboarding-modal.tsx             # Health profile collection
│   ├── day-carousel.tsx                 # 14-day navigation selector
│   ├── analysis-modal.tsx               # AI overview with action buttons
│   ├── detailed-analysis-modal.tsx      # Structured detailed breakdown
│   ├── feedback-loop-modal.tsx          # Checkup outcome tracking
│   ├── chat-box.tsx                     # AI assistant with health context
│   ├── checkin/
│   │   ├── energy-card.tsx              # Energy level (1-5)
│   │   ├── sleep-card.tsx               # Hours + quality
│   │   ├── symptoms-card.tsx            # Body area + severity
│   │   ├── respiratory-card.tsx         # Breathing issues
│   │   ├── temperature-card.tsx         # Fever tracking
│   │   ├── mood-card.tsx                # Emotional state
│   │   ├── appetite-card.tsx            # Eating patterns
│   │   ├── lifestyle-card.tsx           # Activity + social
│   │   └── open-flag-card.tsx           # Additional notes
│   └── views/
│       ├── home-view.tsx                # Streak, carousel, check-in CTA
│       ├── check-in-view.tsx            # Card stack navigator
│       ├── clinics-view.tsx             # Partner clinic search/filter
│       ├── profile-view.tsx             # User health profile
│       ├── history-view.tsx             # Past check-ins log
│       ├── billing-view.tsx             # Subscription & payments
│       └── analysis-view.tsx            # Analytics/visualizations
└── ui/                                  # shadcn/ui components (40+ components)

lib/
├── gemini.ts                            # Gemini API service
├── weather.ts                           # Weather context service
├── utils.ts                             # Utility functions
├── amara-story-data.ts                  # 15-day mock check-in data
└── mock-data-extended.ts                # Clinics, subscriptions, appointments

hooks/
├── use-nudge-tracking.ts                # Nudge state management
├── use-toast.ts                         # Toast notifications
└── use-mobile.ts                        # Mobile detection
```

### Data Flow

1. **Check-in Submission**:
   ```
   User fills 9 cards → CheckInView collects data → 
   AI analysis triggered (Gemini API) → 
   Overview + Detailed analysis stored → 
   Home screen updates with results
   ```

2. **Nudge Escalation**:
   ```
   AI flags concern → Nudge count increments → 
   Badge shown on analysis card → 
   3rd nudge triggers auto-booking card → 
   100% discount applied
   ```

3. **Feedback Loop**:
   ```
   Next check-in opens modal → 
   "Did you book/go?" → 
   Report upload (optional) → 
   Nudge reset or increment → 
   AI accuracy tracking
   ```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (install via `npm install -g pnpm`)
- **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Basit-Balogun10/pulse-app.git
   cd pulse-app
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

### Environment Setup

1. **Create `.env.local`** in the root directory:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Optional environment variables**:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   ```

### Running the App

**Development mode**:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

**Production build**:
```bash
pnpm build
pnpm start
```

**Linting**:
```bash
pnpm lint
```

---

## 📁 Project Structure

```
pulse/
├── app/                      # Next.js app directory
├── components/
│   ├── pulse/                # Core health tracking components
│   └── ui/                   # Reusable UI primitives (shadcn)
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities, services, mock data
├── public/                   # Static assets
├── styles/                   # Global styles
├── .env.local                # Environment variables (gitignored)
├── components.json           # shadcn/ui config
├── demo-script.md            # Complete demo presentation script
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies
├── pnpm-lock.yaml            # Lockfile
├── postcss.config.mjs        # PostCSS config
├── README.md                 # This file
├── requirements.md           # Project requirements
├── spec.md                   # Technical specifications
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 💡 Core Concepts

### Check-in Cards
Each card captures a specific health dimension. Cards are designed to be:
- **Quick**: < 10 seconds per card
- **Non-intrusive**: Optional skip for most cards
- **Contextual**: Smart defaults based on history

### AI Analysis Approach
1. **Pre-generation**: Analysis completes when check-in submitted (not on-demand)
2. **Dual Format**:
   - **Overview**: 2-3 sentence summary for home card
   - **Detailed**: Structured JSON-like breakdown with day citations
3. **Context-Aware**: Considers:
   - 14-day rolling window
   - Family health history
   - Current medications
   - Last checkup date
   - Weather (for respiratory/mood context)

### Nudge Philosophy
- **Non-aggressive**: Max 1 nudge per 3 days
- **Escalating value**: Discount increases with ignored nudges
- **Safety net**: Auto-booking at 3+ nudges prevents procrastination
- **Reset on action**: Nudge count clears when user books/completes checkup

### Gamification Strategy
- **Intrinsic motivation**: Health improvement
- **Extrinsic reward**: Real monetary value (discounts)
- **Social proof**: Streak display, tier badges
- **Loss aversion**: Breaking streak shows "days lost"

---

## 🔌 API Documentation

### Gemini Integration

**Service**: `lib/gemini.ts`

```typescript
// Stream responses for chat interface
streamGeminiResponse(
  prompt: string,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void>

// Generate check-in analysis (overview + detailed)
generateCheckInAnalysis(
  checkInData: CheckInEntry,
  userProfile: UserProfile,
  history: CheckInEntry[]
): Promise<{ overview: string; detailed: DetailedAnalysis }>
```

**Example Usage**:
```typescript
import { streamGeminiResponse } from '@/lib/gemini';

await streamGeminiResponse(
  "What do my symptoms mean?",
  (chunk) => setResponse(prev => prev + chunk), // Streaming callback
  () => setLoading(false),                      // Complete callback
  (err) => console.error(err)                   // Error callback
);
```

### Mock Data API

**Amara's Story Data**: `lib/amara-story-data.ts`

```typescript
// 15 days of check-in data
export const amaraFullStory: CheckInEntry[];

// User profile
export const amaraProfile: {
  age: number;
  gender: string;
  familyHistory: string[];
  existingConditions: string[];
  medications: string[];
  lastCheckup: string;
};

// Day 15 detailed analysis
export const amaraDay15DetailedAnalysis: DetailedAnalysis;

// Nudge history
export const amaraNudges: NudgeRecord[];

// Chat detections
export const amaraChatDetections: ChatDetection[];
```

**Clinic Data**: `lib/mock-data-extended.ts`

```typescript
// 12 partner clinics
export const mockClinics: Clinic[];

// Subscription tiers
export const subscriptionTiers: SubscriptionTier[];

// Discount calculation
export const calculateDiscountTier: (streakDays: number) => SubscriptionTier;
```

---

## 📖 Demo Script

The complete hackathon demo presentation is documented in **[demo-script.md](demo-script.md)**, covering:

1. **Scene 1**: User Onboarding
2. **Scene 2**: Home Screen with Historical Data
3. **Scene 3**: Today's Daily Check-in
4. **Scene 4**: AI Analysis with Concern & Recommendation
5. **Scene 5**: Detailed Analysis Modal
6. **Scene 6**: Booking Clinic Visit
7. **Scene 7**: Feedback Loop Demo
8. **Scene 8**: Auto-Booking Agent
9. **Scene 9**: Chat Interface with Health Context
10. **Scene 10**: Profile Screen & Health Profile Updates
11. **Scene 11**: Billing & Subscription Screens
12. **Scene 12**: Clinic Partner Dashboard
13. **Scene 13**: Analytics & Visualizations View
14. **Scene 14**: Final Summary

Each scene includes:
- User story
- Step-by-step screenplay
- Visual/behavior notes
- Implementation notes

---

## 🗺 Roadmap

### ✅ Completed (v1.0 - Demo Ready)
- [x] Daily check-in card stack
- [x] Nudge tracking with localStorage persistence
- [x] Feedback loop modal with report upload
- [x] AI analysis modal (overview + detailed)
- [x] Enhanced chat interface with health context
- [x] Chat detection tracking
- [x] 14-day mock data (Amara's story)
- [x] Day carousel navigation
- [x] Clinic partner network (mock data)

### 🚧 In Progress (v1.1)
- [ ] Editable health profile form
- [ ] Billing & subscription view
- [ ] Analytics/visualizations view (Recharts graphs)
- [ ] Context banner in clinics view
- [ ] Payment processing mock UI

### 🔮 Planned (v2.0)
- [ ] Clinic partner dashboard
- [ ] Geocoding & map features
- [ ] Backend API (Node.js + PostgreSQL)
- [ ] Real-time notifications (push)
- [ ] Medication reminder system
- [ ] Integration with wearables (Fitbit, Apple Health)
- [ ] Telemedicine video consultations
- [ ] Export health reports (PDF)
- [ ] Multi-language support

### 🌟 Future Enhancements
- [ ] Machine learning model for personalized risk scores
- [ ] Community features (anonymous health forums)
- [ ] Insurance integration
- [ ] Family health tracking (dependents)
- [ ] Mental health resources integration

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add new analytics chart"
   git commit -m "fix: resolve nudge reset bug"
   git commit -m "docs: update API documentation"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feat/your-feature-name
   ```
6. **Open a Pull Request**

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build process or tooling changes

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Use Prettier (config included)
- **Naming**:
  - Components: PascalCase (`CheckInCard.tsx`)
  - Hooks: camelCase with `use` prefix (`useNudgeTracking.ts`)
  - Utils: camelCase (`calculateDiscountTier`)
- **File Organization**:
  - One component per file
  - Co-locate tests with components
  - Group related components in folders

### Areas We Need Help
- 🎨 **UI/UX**: Animations, accessibility improvements
- 🧪 **Testing**: Unit tests, E2E tests
- 📱 **Mobile**: React Native version
- 🌐 **i18n**: Multi-language support
- 🔒 **Security**: HIPAA compliance review
- 📊 **Analytics**: Advanced health metrics

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Built with ❤️ by the Pulse Team**

- **Lead Developer**: [@Basit-Balogun10](https://github.com/Basit-Balogun10)

### Acknowledgments

- Google Gemini for AI capabilities
- shadcn for beautiful UI components
- Radix UI for accessible primitives
- Framer Motion for smooth animations
- The Next.js team for an amazing framework

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Basit-Balogun10/pulse-app/issues)
- **Discussions**: [Community forum](https://github.com/Basit-Balogun10/pulse-app/discussions)
- **Email**: [support@pulse-health.app](mailto:support@pulse-health.app) *(coming soon)*

---

## 🎯 Quick Links

- [📖 Demo Script](demo-script.md) - Complete hackathon presentation
- [📋 Requirements](requirements.md) - Project requirements doc
- [🔧 Technical Spec](spec.md) - Architecture & design decisions
- [🎨 UI Components](components/ui/) - Reusable component library

---

<div align="center">

**⭐ If you find Pulse useful, please star the repo!**

**Made with 💚 for preventive healthcare**

</div>
