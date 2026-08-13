# E_Commerce Project Documentation

## Overview
A simple Next.js 13+ e-commerce boilerplate built with React 19, Tailwind CSS, and MongoDB (Mongoose). It includes client-side registration and login, notification toasts, basic navigation, and form components.

## Table of Contents
- Project setup
- Architecture
- Key folders and files
- Components
- Context and state
- Services (API interactions)
- Workflows
- Scripts
- Styling and assets
- Known issues and fixes
- How to extend

## Project setup
Prerequisites:
- Node.js 18+ recommended
- npm

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```


## Architecture
- Next.js app router under `src/app/`.
- Client components (``"use client"``) used for interactive parts like forms and toasts.
- Global context in `src/context/index.js` for auth and global UI state.
- Services under `src/services/` for server/API calls (register, login, etc.).
- `src/components/` for reusable UI pieces.
- `src/models/` contains Mongoose models.
- `src/database/` initializes DB connection.

## Key folders and files
- `src/app/` — Next app router pages and layouts
  - `page.js` — root page
  - `register/page.js` — registration page
  - `login/page.js` — login page
  - `api/` — serverless route handlers (login/register)
- `src/components/` — UI components
  - `Notification/` — wrapper for `react-toastify`
  - `FormElements/` — `InputComponent`, `SelectComponent`
  - `Loader/` — `componentLevelLoader`
  - `navbar/` — top navigation
- `src/context/index.js` — GlobalContext provider
- `src/services/` — `register/index.js`, `login/index.js` to call API
- `src/utils/index.js` — form controls, navigation options
- `src/models/user.js` — Mongoose user model
- `src/database/index.js` — MongoDB connection logic
- `src/app/globals.css` — global styles and Tailwind import

## Components (detailed)
- Notification (`src/components/Notification/index.js`)
  - Client component wrapping `react-toastify`'s `ToastContainer`.
  - Usage: include `<Notification />` in pages to enable toasts.

- InputComponent (`src/components/FormElements/InputComponent/index.js`)
  - Controlled input used by forms. Props: `type`, `placeholder`, `label`, `value`, `onChange`.

- SelectComponent (`src/components/FormElements/SelectComponent/index.js`)
  - Renders `<select>` with `options` array entries. Each option should have an `id` and `label`.

- componentLevelLoader (`src/components/Loader/componentLevelLoader/index.js`)
  - Small spinner/loader used inside buttons while submitting forms.

- Navbar (`src/components/navbar/index.js`)
  - Uses `navOptions` and `adminNavOptions` from `src/utils`.
  - Renders `ActionButtons` and `NavItems`.

## Context and state
`src/context/index.js` exposes a `GlobalContext` with:
- `isAuthUser` (boolean) — whether the user is authenticated
- `user` — user object
- `pageLevelLoader` / `setPageLevelLoader` — boolean for page-level loading
- `componentLevelLoader` / `setComponentLevelLoader` — object for component-level loading states
- `showNavModal` / `setShowNavModal` — controls mobile nav modal

Wrap the app in `GlobalContext.Provider` in `src/app/layout.js`.

## Services (API interactions)
- `src/services/register/index.js` — posts registration data to `/api/register/route.js`.
- `src/services/login/index.js` — posts login data to `/api/login/route.js`.

Server routes in `src/app/api/*/route.js` handle incoming requests and interact with `src/models/user.js` and `src/database/index.js`.

## Workflows
- Registration page (`/register`):
  - User fills form built from `registrationFormControls` in `src/utils`.
  - On submit, `registerNewUser(formData)` is called.
  - On success: toast success shown, form reset, `isRegistered` toggled to show a Login button.

- Login page (`/login`):
  - User fills login form (from `loginFormControls`).
  - On submit, `login(FormData)` is called.
  - On success: show toast, set `isAuthUser`, `user`, store token in cookie, store user in localStorage.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm start` — run built app

## Styling and assets
- Tailwind CSS configured via `postcss.config.mjs` and `tailwindcss` dependency.
- Global CSS in `src/app/globals.css`.

## Known issues & recent fixes
- Removed invalid CSS at-rule `@theme inline` in `src/app/globals.css` (caused compile error).
- `Notification` component must be a client component; added `"use client"` to `src/components/Notification/index.js`.
- Avoid referencing `toast.POSITION` — use string positions like `"top-right"`.
- Mapping lists must include `key` props (fixed in `src/app/register/page.js`).
- Avoid naming collisions with browser `Notification` constructor — import local `Notification` component where used (fixed in `src/app/login/page.js`).

## How to extend
- Add product pages under `src/app/product/...`.
- Add orders, cart, checkout services and components.
- Integrate real Stripe checkout using server-side routes.

## Tests and validation
- No automated tests included. Add Jest + React Testing Library for component tests.

## Contact / Next steps
If you'd like, I can:
- Commit these documentation and code fixes.
- Add automated tests for forms.
- Harden authentication and error handling.


---
Generated by an automated code assistant. If anything is missing or you'd like a different structure, tell me what to include.
