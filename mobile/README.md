# Skyntrix Admin — Mobile

React Native (Expo) rewrite of the admin panel (`client/src/admin`), talking to the same backend (`server/`).

## Run it

```bash
cd mobile
npm start        # Expo dev server — scan the QR with Expo Go, or press a/i for emulator
npm run android
npm run ios
```

By default the app talks to `https://skyntrix.onrender.com/api`. To point at a different backend
(e.g. a local server), set `EXPO_PUBLIC_API_URL` before starting:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:5000/api npm start
```

(Use your machine's LAN IP, not `localhost` — a physical phone/emulator can't reach your host's `localhost`.)

## What's implemented

- **Auth**: login, session restore, logout — JWT stored in `expo-secure-store` (`src/context/AuthContext.js`).
- **Dashboard**: stat cards + recent activity, pull-to-refresh (`src/screens/DashboardScreen.js`).
- **Generic CRUD** (mirrors `CrudPage.jsx` + `crud.factory.js`): Services, Portfolio, Team, Testimonials, Blog —
  list, search, paginate, create/edit with image upload, delete, cycle status (`src/screens/crud/`).
- **Leads**: list, search, paginate, convert-to-lead-contact, and a detail screen with status updates + activity timeline
  (`src/screens/leads/`).
- **Careers** and **Newsletter**: read/search/paginate/status-cycle/delete (`src/screens/careers`, `src/screens/newsletter`).

## What's a placeholder (`ComingSoon`)

Pipeline board, Lead Contacts (WhatsApp/email outreach), Quotations, Invoices, Receipts, Requirements, Settings, Admins.
These involve PDF generation, multi-step forms, or role management that weren't ported yet — they render a
"managed from the web admin panel for now" screen so the app stays navigable. See `src/navigation/AppDrawer.js`.

## Structure

```
src/
  api/client.js          axios instance, same interceptor behavior as client/src/admin/api.js
  config/env.js           API_URL (override via EXPO_PUBLIC_API_URL)
  context/                AuthContext, ToastContext
  theme/colors.js          mirrors client/tailwind.config.js
  components/              shared UI (Ui.js, Screen.js, ComingSoon.js)
  navigation/              RootNavigator -> AppDrawer -> per-module stacks
  screens/                 one folder per module
  utils/pipeline.js        lead stage labels (ported from client/src/admin/utils/pipeline.js)
```
