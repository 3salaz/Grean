# 🧑‍💻 Contributing to Grean Monorepo

Welcome to the **Grean Monorepo** — the dual-app platform for client and driver recycling management, built with **React + Ionic + Firebase**.  
This guide explains how we collaborate, branch, commit, and deploy consistently across the `client-app`, `driver-app`, and `shared` packages.

---

## 🏗 Project Overview

| Package | Description |
|----------|--------------|
| `client-app` | User-facing web and mobile app for recycling pickup requests |
| `driver-app` | Driver-facing app for route scheduling and pickups |
| `shared` | Shared logic, utilities, constants, and types used across both apps |

---

## 🌿 Branch Strategy

We use a **lightweight, feature-based branching model**.

| Branch | Purpose |
|---------|----------|
| `main` | Always stable and deployable (production) |
| `root-setup` | Current base configuration and monorepo setup |
| `feature/*` | New features, fixes, or refactors |
| `hotfix/*` | Critical production fixes |

### Examples
```bash
git checkout -b feature/#25-category-filtering
git checkout -b fix/profile-update-bug
```

> **Note:** Branches should be short-lived (1–3 days max) and merged via pull request into `main`.

---

## 🧱 Commit Guidelines (Conventional Commits)

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

**Format**
```
<type>(scope): short summary
```

### Common Types
| Type | Meaning |
|------|----------|
| `feat` | Add a new feature |
| `fix` | Fix a bug |
| `refactor` | Code cleanup or restructure |
| `style` | UI or formatting changes |
| `docs` | Documentation updates |
| `chore` | Maintenance tasks or dependency updates |

### Example
```
feat(pickup): add validation for disclaimer acceptance
fix(profile): update Firestore writes after edit
```

---

## 🔁 Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/#40-audit-monorepo-structure
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the app(s)**
   ```bash
   npm run dev:client
   npm run dev:driver
   ```
4. **Commit + push**
   ```bash
   git add .
   git commit -m "feat(form): add pickup disclaimer modal"
   git push origin feature/#40-audit-monorepo-structure
   ```
5. **Open a Pull Request**
   - Base: `main`
   - Compare: your branch  
   - Title example: `✨ Feature: Pickup disclaimer modal (#40)`

---

## 🧩 Scripts Reference (Root)

| Command | Description |
|----------|--------------|
| `npm run dev:client` | Start client app locally |
| `npm run dev:driver` | Start driver app locally |
| `npm run dev:both` | Run both apps concurrently |
| `npm run build` | Build both apps |
| `npm run deploy` | Deploy both hosting targets to Firebase |
| `npm run clean` | Remove all node_modules and reinstall |
| `npm run lint` | Run linting on both apps |
| `npm run format` | Format all files using Prettier |

---

## 🧠 Shared Code Standards

- Place all reusable logic, constants, and types in `/shared`
- Avoid duplicate utilities in `client-app` and `driver-app`
- Use consistent imports:
  ```js
  import { validatePickup } from "@shared/utils/validation";
  ```
  _(configure aliases later via `tsconfig` or Vite config)_

---

## 🎨 UI & Theming Guidelines

- Define all colors and typography tokens in `/shared/theme/`
- Maintain consistency between Ionic and Tailwind theme variables
- Prefer semantic color naming:
  ```js
  primary: "#75B657"
  success: "#05A43D"
  warning: "#F4D35E"
  ```

---

## 🔐 Environment Variables

Each app has its own `.env` file:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```
- Never commit `.env` files.
- Keep structure consistent across environments.

---

## 🚀 Deployment

We deploy both apps via Firebase Hosting.

```bash
npm run deploy:client
npm run deploy:driver
```

Hosting targets are defined in `firebase.json`.  
If adding a new target, run:
```bash
firebase target:apply hosting <target-name> <project-id>
```

---

## 🧾 Labels (GitHub Issues)

| Label | Description |
|--------|-------------|
| `bug` | Something isn’t working |
| `feature` | New functionality |
| `refactor` | Code improvements |
| `documentation` | Docs or README updates |
| `Setup` | Environment or configuration work |
| `Infrastructure` | Firebase or deployment-related tasks |

---

## ❤️ Developer Notes

- Use **draft PRs** early to show progress.
- Keep PRs atomic and focused.
- Write descriptive commit messages — they become your project history.
- Run `npm run clean` if builds act weird between apps.

---

> _"Code like someone else will maintain it — because future you will."_ 🧠