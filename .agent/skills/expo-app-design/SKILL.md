---
name: expo-app-design
description: Expo app design and delivery patterns including Expo Router, app.config.ts, EAS build profiles, and OTA update strategy.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Expo App Design Skill

## 1. Expo Router (File-based Routing)

- Use the Next.js-style `app/` directory instead of writing navigation code manually.
- **Root Layout:** `app/_layout.tsx` is the wrapper for the entire application (Providers, Error Boundaries should be placed here).
- **Tabs and Stacks:** Create `app/(tabs)/_layout.tsx` for automatic tab menus. Screens reside in this folder as `index.tsx`, `settings.tsx`, etc.
- **Unknown Route (404):** Use `app/+not-found.tsx` for catch-all routing.

## 2. Using app.config.ts

- Do not use static `app.json`. Instead use `app.config.ts` which is type-safe and can execute logic.
- Read environment variables to dynamically generate app name, bundle ID (`com.my.app` vs `com.my.app-dev`), icon, and other properties per environment. (e.g., `name: process.env.APP_ENV === 'production' ? 'My App' : 'My App (DEV)'`).
- Third-party package Expo Plugins are added to the `plugins: []` array in this file.

## 3. Environment Variables (.env)

- Only variables with the `EXPO_PUBLIC_` prefix are included in the client-side JS bundle.
- Correct usage: `EXPO_PUBLIC_API_URL=https://api.example.com`.
- Secrets like API keys that must remain secure should NOT be placed in `.env`; use EAS Secrets for server-side handling.

## 4. EAS Build and Profile Management

- **eas.json:** Manages your build processes. Always have 3 base profiles: `development` (for simulator/device triggers), `preview` (TestFlight / internal testing), `production` (Store).
- Each profile should define its own environment variable set as `env: { APP_ENV: "production" }`. This feeds `app.config.ts` during EAS cloud builds.

## 5. EAS Update (OTA)

- Use the `expo-updates` library to push instant JavaScript updates without waiting for app store review.
- Set up a channel strategy: test users on the `preview` profile receive updates from the "preview" channel, while "production" stays separate.

## 6. Prebuild (Bare Workflow Transition)

- By default, `ios` and `android` folders do not exist on disk (Managed Workflow). If you need to add an SDK that requires custom C++/Java code and has no Expo plugin, convert the project to bare workflow with `npx expo prebuild`.
- After running prebuild once, prefer writing Expo Config Plugins instead of manually modifying iOS/Android directories (this way changes are preserved when the project is deleted and rebuilt).
