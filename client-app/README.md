🌿 Grean Client App
==================

This is the client-facing Ionic React app for the Grean platform —  
used by residential and business users to request, view, and manage recycling pickups.


🧩 Architecture Overview
-----------------------

Layer | Purpose
------|---------
main.tsx | Application entry point — initializes Ionic and mounts the React tree.
AppProviders.tsx | Wraps all global context providers (Auth, Profile, Pickups, etc.).
App.tsx | Root Ionic app container and router entry.
AppContent.tsx | Handles route definitions and page rendering.
AppLayout.tsx | Global layout wrapper (Navbar + Footer).
features/ | Feature-based modules (auth, profile, pickups, etc.).
components/ui/ | Shared UI elements (BaseModal, loaders, etc.).
context/ | React contexts for global state management.


🏗 App Flow
-----------

index.html
└── main.tsx
    └── <AppProviders>
        └── <App>
            └── <AppContent>
                └── <AppLayout>
                    └── Page (e.g. Landing)


⚙️ Commands
------------

Command | Description
--------|-------------
npm run dev | Start the development server.
npm run build | Build the production bundle.
npm run lint | Run ESLint checks.
npm run format | Format source files using Prettier.
npm run clean | Remove dependencies and reinstall.


🌱 Development Notes
--------------------

- The app uses Ionic + React Router v5.
- Ionic core CSS is initialized once in main.tsx.
- Context providers (Auth, Profile, Pickups) are defined in /context/.
- Feature pages are wrapped with AppLayout to include a global Navbar and Footer.
- Reusable UI elements (e.g., modals, loaders) live in components/ui/.


🧠 Future Improvements
-----------------------

- Migrate to a feature-based folder structure.
- Centralize common logic into /shared.
- Improve modal consistency using the BaseModal component.
- Add E2E tests for critical user flows (sign in, pickups, profile).


“Build clean, iterate fast, and stay recyclable.” ♻️