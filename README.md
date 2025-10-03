# Habit Tracker 👋

A cross-platform habit tracking app built with [Expo](https://expo.dev), [React Native](https://reactnative.dev), and [Supabase](https://supabase.com/). This project uses file-based routing and supports authentication, persistent storage, and a modern UI.

## Features

- 📱 Universal app: Android, iOS, and Web
- 🔒 Protected routes with authentication ([`useAuthContext`](lib/auth-context.ts))
- 🗄️ Persistent storage ([`useStorage`](hooks/useStorage.ts))
- 🎨 Tailwind CSS styling ([tailwind.config.js](tailwind.config.js))
- 🎨 Supabase for BAAS ([Supbase](https://supabase.com/))
- 🛠️ Prisma ORM for schema definition ([prisma/schema.prisma](prisma/schema.prisma))
- 🚀 Fast development with Expo


## Project Structure
- app/: Main app code and routes
- useStorage.ts: Persistent storage hook
- lib/auth-context.ts: Authentication context
- prisma/: Prisma schema and generated client
- assets/: Images and CSS


## Get started

1. Fork & clone this repo

   ```bash
   git clone [project url]
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```



