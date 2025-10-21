# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GOCG Permutas is a full-stack React + TypeScript + Firebase application for managing service swap requests (permutas) for GOCG military personnel. The app features authentication, real-time data synchronization, an administrative dashboard for approving/rejecting requests, and document generation capabilities. Deployed on Vercel.

## Development Commands

```bash
# Install dependencies
npm install

# Migrate initial data to Firebase (run once)
npm run migrate

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Environment Setup

The app requires Firebase credentials in `.env.local`. Copy `.env.example` to `.env.local` and fill in your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Migration**: Run `npm run migrate` once to populate Firestore with the initial 93 militares from `constants.ts`.

## Architecture

### Backend (Firebase)

- **Firestore Database**: NoSQL database with two collections:
  - `militares`: Military personnel records (RG as document ID)
  - `permutas`: Swap requests with references to militares by RG
- **Real-time Sync**: Uses Firestore `onSnapshot` listeners for real-time updates
- **Authentication**: Custom authentication using Firestore (not Firebase Auth)

### State Management

The application uses React Context API with two main contexts:

1. **AppContext** (contexts/AppContext.tsx): Core application state
   - Listens to Firestore `militares` and `permutas` collections in real-time via `onSnapshot`
   - Converts Firestore data (RG references) to UI data (full militar objects)
   - All CRUD operations are async and interact with Firestore
   - Uses `useMemo` for efficient militar lookup by RG number via `militarMap`
   - Provides loading state during initial data fetch

2. **AuthContext** (contexts/AuthContext.tsx): Authentication state
   - Implements RG + password login (validates against Firestore)
   - Supports user signup (creates new militar in Firestore)
   - Persists session to localStorage
   - Restores session on mount
   - Provides loading state during auth operations

**Important**: Provider nesting in index.tsx: AppProvider → AuthProvider → App. AuthContext is independent and does NOT depend on AppContext.

### Component Structure

- **App.tsx**: Root component with conditional rendering logic:
  - Loading screen (while appLoading or authLoading)
  - LoginScreen (if no currentUser)
  - DocumentView (if documentData exists)
  - AdminDashboard or UserDashboard (based on role)
  - Modal overlays (PermutaRequestModal, MilitarAdminModal, PermutaViewModal)

- **LoginScreen**: Tab-based interface with:
  - Login tab: RG + password authentication
  - Cadastrar tab: User signup form (creates new militar in Firestore)

- **Dashboards**:
  - AdminDashboard: Shows pending requests and history with approve/reject controls
  - UserDashboard: Shows user's own permuta requests

- **Key Modals**:
  - PermutaRequestModal: Form to create swap requests. Supports batch creation (multiple rows). Regular users have their own militar auto-filled as "Militar que SAI" (militarSai) and locked. Async submission to Firestore.
  - MilitarAdminModal: Admin-only interface for managing militar database. All operations async with Firestore.
  - PermutaViewModal: View details of a permuta request. Admin can approve/reject (async Firestore update).

- **DocumentView**: Generates printable/PDF service schedule alteration documents (Nota GOCG format) with formatted table layout

### Data Models (types.ts)

- **Militar**: Personnel record with RG (unique identifier), grad, quadro, nome, unidade, senha (password), role ('admin' | 'user')
- **Permuta**: UI representation with full militar objects (militarEntra, militarSai)
- **PermutaFirestore**: Database representation with RG references (militarEntraRg, militarSaiRg)
- **Funcao**: Three service roles defined in constants.ts

**Data Flow**: AppContext listens to Firestore `permutas` collection, receives PermutaFirestore documents, resolves RG references using militarMap, converts to Permuta objects for UI consumption.

### Styling

Uses Tailwind CSS via CDN (not PostCSS). Custom brand colors configured inline in index.html:
- brand-blue family: Primary navy blues
- brand-accent: Light blue
- brand-bg: Light gray background
- brand-text: Dark text colors

Print styles are defined inline in DocumentView for PDF generation.

## Key Implementation Patterns

### Militar Lookup
When entering RG numbers in forms (e.g., PermutaRequestModal), the app uses `findMilitarByRg()` on blur to auto-populate militar details. If not found in database, users can manually enter details which creates a new ad-hoc Militar object (not persisted to militares list unless explicitly added).

### Form Validation
Multi-row forms (PermutaRequestModal) validate all rows before submission. All fields are required. Errors displayed inline.

### ID Generation
Permutas use Firestore auto-generated IDs via `addDoc()`. After creation, the document is updated with its own ID for easy reference.

### Date Formatting
DocumentView formats dates in Brazilian format (pt-BR) with UTC timezone to prevent date shifts.

### Authentication Flow
1. User enters RG + password on LoginScreen
2. AuthContext fetches militar document from Firestore by RG (document ID)
3. Password is verified (plaintext comparison - see security note below)
4. On success, user data stored in currentUser state and persisted to localStorage
5. Session restored from localStorage on page reload

### Security Note
⚠️ Passwords are stored in plaintext in Firestore for educational purposes. In production, implement password hashing (bcrypt, argon2) and consider using Firebase Authentication instead of custom auth.

## Initial Data

The app ships with 93 pre-loaded military personnel in MILITARES_INICIAIS (constants.ts). Run `npm run migrate` to populate Firestore. All militares get:
- Default password = their RG number
- Default role = 'user' (except RG 12961 which gets 'admin')
