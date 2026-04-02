<div align="center">

# 🏋️ Aarohan — आरोहण

### *Your AI-Powered Fitness Companion*

[![React Native](https://img.shields.io/badge/React_Native-0.81.4-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_53-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Aarohan** (आरोहण, Sanskrit for *"to ascend"*) is a cross-platform mobile application designed to revolutionise athlete performance tracking in India. It combines AI-powered pose detection, real-time rep counting, personalised fitness testing, and a bilingual experience to help every athlete — from school-level to elite — reach their peak.

</div>

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🖼️ App Screens](#️-app-screens)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#️-configuration)
- [🔌 API & Backend Services](#-api--backend-services)
- [🌐 Internationalisation](#-internationalisation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 🤖 AI-Powered Fitness Testing
- **Real-time pose detection** using MediaPipe & TensorFlow.js — tracks 33 body landmarks per frame
- Automated **rep counting** for squats, push-ups, and sit-ups with form analysis
- **Angle measurement** and confidence scoring displayed live during exercise
- **Vertical jump** height calculation from pose data
- **Running tracker** with step counting and distance estimation

### 📊 Athlete Performance Analytics
- Personal **performance history** across all fitness tests
- **Improvement percentage** tracking over time
- Category-based results: Strength · Agility · Endurance · Flexibility
- Detailed **test result** breakdowns with scores and timestamps

### 🏆 Gamification & Motivation
- **14+ achievement badges** (Speedster, Strength Champ, Endurance Pro, etc.)
- **Global leaderboards** ranked by sport and test category
- Dashboard stats: Tests Completed · Current Rank · Badges Earned

### 🤖 AI Fitness Chatbot
- RAG-powered (Retrieval-Augmented Generation) conversational assistant
- Answers questions on exercises, nutrition, recovery, and training tips
- Full **bilingual support** — English 🇬🇧 & Hindi 🇮🇳

### 📱 Social Community
- Athlete **social feed** — post updates, progress photos, and videos
- Like, comment, and flag/report posts
- Authenticated posting with image picker integration

### 🏫 Sports Ecosystem Integration
- **Khelo India** scheme support — athlete registration and opportunities
- **Academy Locator** — find nearby sports academies (with address, sports offered, and distance)
- Admin portal for coaches/officials to **manage athletes and verify submissions**

### 🎨 Polished UX
- **Light & Dark mode** throughout the app
- Smooth **splash screen** animation on launch
- **Haptic feedback** on tab navigation (iOS/Android)
- Custom **curved bottom navigation** bar
- Time-based greeting (Good Morning / Afternoon / Evening)

---

## 🖼️ App Screens

| Screen | Description |
|--------|-------------|
| **Landing / Login** | Role selection (Athlete / Admin), JWT authentication |
| **Sign Up** | Athlete registration with profile setup |
| **Home Dashboard** | Stats overview, quick actions, recent activity |
| **Fitness Tests** | 6 test categories — tap to start AI-guided sessions |
| **Camera / Pose Detector** | Live rep counting with MediaPipe landmarks |
| **Running Tracker** | GPS-assisted step and distance tracking |
| **Performance History** | Timeline of all past test results |
| **Leaderboards** | Global rankings by sport and test type |
| **Badges** | Achievement collection with unlock dates |
| **AI Chatbot** | Bilingual fitness Q&A assistant |
| **Social Feed** | Posts, likes, comments from the community |
| **Create Post** | Share updates with text, images, and media |
| **Profile Settings** | Edit personal info, preferences, and language |
| **Admin Dashboard** | Athlete management, submissions, verifications |
| **Academy Locator** | Map-integrated nearby academy finder |
| **Khelo India** | National sports scheme info and registration |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native 0.81.4 + Expo SDK 53 |
| **Language** | TypeScript 5.9 |
| **Routing** | Expo Router 6 (file-based) |
| **AI / Pose Detection** | TensorFlow.js 4.22, MediaPipe (`@thinksys/react-native-mediapipe`) |
| **Camera** | `react-native-vision-camera` 4, `expo-camera` |
| **Navigation** | `@react-navigation/bottom-tabs`, `@react-navigation/native` |
| **UI Components** | `react-native-paper`, `expo-linear-gradient`, `react-native-blur` |
| **Async Storage** | `@react-native-async-storage/async-storage` |
| **Maps** | `react-native-maps` |
| **Media** | `expo-av`, `expo-image`, `expo-image-picker` |
| **HTTP Client** | `axios` |
| **Location** | `expo-location` |
| **Haptics** | `expo-haptics` |
| **Build System** | EAS (Expo Application Services) |
| **Linting** | ESLint 9 with expo config |

---

## 📁 Project Structure

```
Aarohan/
├── app/                        # File-based routes (Expo Router)
│   ├── _layout.tsx             # Root layout — providers, navbar, splash
│   ├── index.tsx               # Entry redirect to loginSign
│   ├── loginSign.tsx           # Landing page
│   ├── login.tsx               # Authentication (JWT)
│   ├── signup.tsx              # User registration
│   ├── forgotPass.tsx          # Password recovery
│   ├── home.tsx                # Main dashboard
│   ├── test.tsx                # Fitness test selection
│   ├── camera.tsx              # Camera interface
│   ├── poseDetector.tsx        # AI pose detection & rep counting
│   ├── running.tsx             # Running tracker
│   ├── performance.tsx         # Performance history & analytics
│   ├── leaderboards.tsx        # Global rankings
│   ├── badges.tsx              # Achievement badges
│   ├── chatbot.tsx             # AI fitness chatbot
│   ├── socialmedia.tsx         # Social feed
│   ├── createpost.tsx          # Create a social post
│   ├── ProfileSettings.tsx     # User profile management
│   ├── sports.tsx              # Sport selection
│   ├── training.tsx            # Training programs
│   ├── kheloIndia.tsx          # Khelo India integration
│   ├── academylocater.tsx      # Nearby academy finder
│   ├── testResults.tsx         # Detailed test result view
│   ├── generateReports.tsx     # Performance report generator
│   ├── adminHome.tsx           # Admin dashboard
│   ├── athletesList.tsx        # Athlete list (admin)
│   ├── manageAthletes.tsx      # Athlete profile editor (admin)
│   ├── pendingVerification.tsx # Athlete verification (admin)
│   ├── reviewSubmissions.tsx   # Submission review (admin)
│   ├── submissionsReceived.tsx # Submissions list (admin)
│   ├── splashScreen.tsx        # 3-second animated splash
│   └── +not-found.tsx          # 404 page
│
├── components/                 # Reusable UI components
│   ├── CurverdNavbar.tsx       # Curved bottom navigation bar
│   ├── ExerciseTips.tsx        # Per-exercise do's, don'ts, safety tips
│   ├── parallax-scroll-view.tsx
│   ├── themed-view.tsx
│   ├── themed-text.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── external-link.tsx
│   └── ui/
│       ├── icon-symbol.tsx
│       ├── icon-symbol.ios.tsx
│       └── collapsible.tsx
│
├── contexts/
│   ├── LanguageContext.tsx     # i18n — English & Hindi (120+ keys)
│   └── AthleteContext.tsx      # Athlete profiles & submission state
│
├── hooks/
│   ├── use-theme-color.ts
│   ├── use-color-scheme.ts
│   └── use-color-scheme.web.ts
│
├── constants/
│   └── theme.ts                # Color palette & typography
│
├── types/
│   └── svg.d.ts
│
├── assets/
│   ├── images/                 # App icons, splash screens
│   └── fonts/                  # Custom fonts
│
├── scripts/
│   └── reset-project.js
│
├── App.js                      # Root entry point
├── app.json                    # Expo app config
├── eas.json                    # EAS build profiles
├── package.json
├── tsconfig.json
├── metro.config.js
└── eslint.config.js
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 18.x |
| npm | 9.x |
| Expo CLI | Latest |
| Android Studio *(optional)* | For Android emulator |
| Xcode *(optional, macOS only)* | For iOS simulator |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Adi-Yadav1/Aarohan..git
cd Aarohan.

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

### Running the App

After starting the dev server, choose your target:

| Option | Command / Action |
|--------|-----------------|
| **Expo Go** (quick preview) | Scan QR code in terminal with the Expo Go app |
| **Android Emulator** | Press `a` in terminal |
| **iOS Simulator** | Press `i` in terminal *(macOS only)* |
| **Web Browser** | Press `w` in terminal |
| **Development Build** | See [EAS docs](https://docs.expo.dev/develop/development-builds/introduction/) |

> **Note:** AI pose detection features require a **development build** (not Expo Go) because they use native modules (`react-native-vision-camera`, MediaPipe).

### Reset to Clean Slate

```bash
npm run reset-project
```

This moves starter code to `app-example/` and creates a blank `app/` directory.

---

## ⚙️ Configuration

### `app.json`
Core Expo configuration — app name, bundle identifiers, icons, and splash screen settings.

### `eas.json`
EAS Build profiles for development, preview, and production builds:
```json
{
  "build": {
    "development": { ... },
    "preview": { ... },
    "production": { ... }
  }
}
```

### Environment / API URLs
Backend URLs are currently hardcoded in screen files. Before deploying, update:

| File | Variable to Update |
|------|--------------------|
| `app/login.tsx` | Auth API base URL |
| `app/socialmedia.tsx` / `app/createpost.tsx` | Social API base URL |
| `app/chatbot.tsx` | RAG chatbot API URL |

---

## 🔌 API & Backend Services

Aarohan connects to three backend services:

| Service | Base URL | Purpose |
|---------|----------|---------|
| **Auth API** *(Django)* | `http://<server>/api/auth` | JWT login, token management |
| **Social API** | `https://sai-backend-3-1tq7.onrender.com/api/social` | Posts, likes, comments |
| **AI Chatbot API** | `https://<ngrok-url>/` | RAG-powered fitness Q&A |

### Auth Flow
1. POST `/api/auth/token/` with `email` + `password`
2. Receive JWT access token
3. Token stored in `AsyncStorage` and attached to all subsequent requests as `Authorization: Bearer <token>`

### Social API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Fetch all posts |
| POST | `/posts` | Create a new post |
| POST | `/posts/{postId}/like` | Like / unlike a post |

### Chatbot API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ask/{question}` | Ask a fitness question |
| GET | `/health` | Health check |
| GET | `/stats` | System statistics |
| POST | `/chat` | Chat message |

---

## 🌐 Internationalisation

Aarohan supports **English** and **Hindi** via `LanguageContext`.

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const { t, language, setLanguage } = useLanguage();

// Usage
<Text>{t('home')}</Text>          // "Home" or "होम"
<Text>{t('startFitnessTest')}</Text>  // "Start Fitness Test" or "फिटनेस टेस्ट शुरू करें"
```

- **120+ translation keys** covering navigation, exercise instructions, chatbot messages, dashboard stats, and more
- Language preference is **persisted** via `AsyncStorage`
- Switch languages from **Profile Settings**

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────┐
│                  Expo Router                   │
│         (File-based navigation stack)          │
└──────────┬─────────────────────────┬───────────┘
           │                         │
    ┌──────▼──────┐           ┌──────▼──────┐
    │  Contexts   │           │  Components │
    │ Language    │           │ CurvedNavbar│
    │ Athlete     │           │ ExerciseTips│
    └──────┬──────┘           └─────────────┘
           │
    ┌──────▼──────────────────────────────────┐
    │            Screen Layer (app/)           │
    │  Auth → Home → Tests → AI Camera        │
    │  Social → Chatbot → Admin → Analytics   │
    └──────┬──────────────────────────────────┘
           │
    ┌──────▼──────────────────────────────────┐
    │           Native / AI Layer              │
    │  MediaPipe  │  TensorFlow.js  │  Camera  │
    └──────┬──────────────────────────────────┘
           │
    ┌──────▼──────────────────────────────────┐
    │              Backend APIs                │
    │  Django Auth │ Social API │ RAG Chatbot  │
    └─────────────────────────────────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Code Style
- TypeScript is required for all new files in `app/`, `components/`, `contexts/`, and `hooks/`
- Run `npx eslint .` before submitting a PR
- Follow existing component and hook patterns

### Areas Open for Contribution
- [ ] Real GPS integration for the running tracker
- [ ] Backend connection for performance history (currently uses mock data)
- [ ] Additional language support beyond English & Hindi
- [ ] Unit and integration tests
- [ ] Accessibility improvements (screen reader support)
- [ ] Push notifications for training reminders

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Indian Athletes**

*Aarohan — Ascend to Your Peak*

</div>
