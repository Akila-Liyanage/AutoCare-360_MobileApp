# AutoCare 360 - Universal Vehicle Maintenance Record System

A centralized digital platform where vehicles have lifetime maintenance records, enabling vehicle owners, service garages, and authorized parties to manage and share verified vehicle maintenance histories securely.

---

## 📁 Project Architecture & Monorepo Structure

```text
AutoCare-360_MobileApp/
├── mobile/                      # Developer 1: React Native (Expo + TypeScript)
│   ├── assets/                  # App icon, splash screen, images
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── constants/           # Colors, themes, constant values
│   │   ├── context/             # React context & state management
│   │   ├── hooks/               # Custom React hooks
│   │   ├── navigation/          # React Navigation stacks / tabs
│   │   ├── screens/             # Application screens (Vehicle, History, Garage, etc.)
│   │   ├── services/            # API client / HTTP requests to backend
│   │   ├── types/               # TypeScript interfaces & types
│   │   └── utils/               # Helper functions
│   ├── App.tsx                  # Root mobile entry point
│   ├── app.json                 # Expo configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── .env.example             # Mobile environment variables template
│   └── package.json
│
├── backend/                     # Developer 2: Node.js (Express + TypeScript)
│   ├── src/
│   │   ├── config/              # Environment & DB configurations
│   │   ├── controllers/         # Request handlers
│   │   ├── middlewares/         # Auth, validation, error middlewares
│   │   ├── models/              # Database models / schemas
│   │   ├── routes/              # Express API route definitions
│   │   ├── services/            # Business logic
│   │   ├── types/               # TypeScript interfaces & types
│   │   ├── utils/               # Helper utilities & loggers
│   │   ├── app.ts               # Express application configuration
│   │   └── server.ts            # Server entrypoint
│   ├── tsconfig.json            # TypeScript configuration
│   ├── .env.example             # Backend environment variables template
│   └── package.json
│
├── package.json                 # Monorepo root scripts
├── .gitignore                   # Global git ignore configuration
├── .editorconfig                # Standard team coding conventions
└── README.md                    # Project setup & developer documentation
```

---

## 🚀 Quick Start for Developers

### Prerequisites
- **Node.js**: v18+ (Recommended v20+ / v22+)
- **npm**: v9+ (or yarn / pnpm)
- **Expo Go App**: Install on your iOS or Android device from App Store / Google Play (for testing the mobile app).

### 1. Install All Dependencies
From the repository root, install dependencies for both apps at once:
```bash
npm run install:all
```

---

## 📱 Developer 1: Mobile App Setup (React Native + Expo)

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Configure environment variables**:
   ```bash
   # Copy the sample environment file
   copy .env.example .env     # On Windows (cmd)
   # Or on PowerShell / Bash:
   cp .env.example .env
   ```
   > By default, `EXPO_PUBLIC_API_BASE_URL` is set to `http://localhost:5000` (or your local IP when testing with physical device).

3. **Start the development server**:
   ```bash
   npm start
   ```
   - Scan the QR code using the **Expo Go** app on your phone, or press:
     - `a` to open Android Emulator
     - `i` to open iOS Simulator (macOS only)
     - `w` to open web preview in browser

---

## 🖥️ Developer 2: Backend API Setup (Node.js + Express + TypeScript)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Configure environment variables**:
   ```bash
   # Copy the sample environment file
   copy .env.example .env     # On Windows (cmd)
   # Or on PowerShell / Bash:
   cp .env.example .env
   ```

3. **Start the development server with Hot Reload**:
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:5000`
   - Health check endpoint: `http://localhost:5000/health`

4. **Build and Production Run**:
   ```bash
   npm run build   # Compiles TypeScript into dist/
   npm start       # Runs compiled dist/server.js
   ```

---

## ⚡ Root Convenience Commands
You can also run both or either service directly from the root directory:

| Command | Action |
|---|---|
| `npm run install:all` | Installs dependencies for both `backend` and `mobile` |
| `npm run dev:backend` | Starts the Express backend server with hot-reload |
| `npm run build:backend` | Compiles the Express TypeScript backend |
| `npm run start:mobile` | Starts the Expo React Native Metro bundler |
| `npm run android` | Starts Expo and opens on Android emulator |
| `npm run ios` | Starts Expo and opens on iOS simulator |
| `npm run web` | Starts Expo on web browser |

---

## 🤝 Team Workflow & Branching Guidelines

To avoid merge conflicts between the 2 developers:
1. **Branch Naming**:
   - Mobile developer branches: `mobile/feature-name` (e.g. `mobile/auth-screens`, `mobile/vehicle-profile`)
   - Backend developer branches: `backend/feature-name` (e.g. `backend/auth-api`, `backend/service-records`)
2. **Never commit sensitive files**:
   - Never commit `.env` files (keep `.env.example` updated when adding new variables).
   - `node_modules/` and `dist/` are already globally ignored in `.gitignore`.
3. **Pull Requests**:
   - Always pull latest changes from `main` before starting new features: `git pull origin main`.
