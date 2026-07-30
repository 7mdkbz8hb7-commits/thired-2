# CLAUDE.md

test


This file documents the current state of this repository exactly as it exists today. It is a
descriptive reference, not a set of instructions — nothing in this file was changed to produce it.

## Project Overview

"Fitness Insights" (page titles also say "Fitness Recommendation App") is a client-side-only fitness
web app. A user fills in a short profile form (height, weight, age, gender, goal, activity level) and
the app computes a BMI, a workout plan, nutrition advice, a daily calorie target, and a weekly schedule
from a static local dataset. On top of that, a separate gamification layer lets users mark workouts as
done to earn XP, build a daily streak, level up (Bronze → Silver → Gold → Diamond), and unlock
achievements.

The repository contains two unrelated codebases:

1. **Root (`/`)** — the real product described above: static HTML/CSS/JS, no framework, no build step.
2. **`react-app/`** — a separate, much earlier-stage Vite + React + TypeScript + Tailwind scaffold. It
   renders a single demo component and shares no code, routes, or storage with the root app.

## Purpose

Give a visitor a personalized, easy-to-read fitness/nutrition starting point based on a few basic
inputs, entirely in the browser (no account server, no database), and keep them coming back with a
lightweight game-like progress system (XP/streaks/levels/achievements) around weekly workout completion.

## Tech Stack

**Root app:**
- Plain HTML5 (one `.html` file per page, no templating)
- Plain CSS3 — hand-written, custom properties for theming, no Sass/PostCSS/Tailwind
- Plain JavaScript (ES6+) — no modules (`import`/`export`), no bundler, no framework; every script is a
  global-scope `<script src="...">` include
- Persistence: browser `localStorage` only — no backend, no API, no database
- No package manager, no build tool, no linter, no test framework, no CI config

**`react-app/`:**
- Vite 5, React 18, TypeScript 5, Tailwind CSS 3
- `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge` (shadcn-style UI
  primitives), `framer-motion`, `lucide-react`
- Scripts: `npm run dev` (Vite dev server), `npm run build` (`tsc -b && vite build`), `npm run preview`

## Folder Structure

```
Fitness-App/
├── calories.html
├── exercises.html
├── home.html
├── index.html
├── level.html
├── login.html
├── logo.js
├── logo.svg
├── nutrition.html
├── profile.html
├── register.html
├── result.html
├── schedule.html
├── workout.html
├── css/
│   ├── style.css         # design tokens + all shared component styles
│   ├── responsive.css    # media-query overrides only (1024/768/480px)
│   ├── home.css          # home.html-only layout
│   └── dashboard.css     # workout.html / level.html gamification UI ("glass-card" style)
├── js/
│   ├── data.js            # FitnessData — static workout/nutrition/exercise/motivation catalog
│   ├── bmi.js              # calculateBMI, getBMICategory
│   ├── recommendation.js   # generateRecommendation, calculateWaterIntake
│   ├── utils.js            # formatGoalLabel, getStoredGoal (used by exercises.js)
│   ├── app.js               # shared bootstrap + page router + profile/auth localStorage helpers
│   ├── fitness-state.js    # gamification state (XP, streak, levels, achievements)
│   ├── profile-page.js     # profile.html edit-in-place behavior
│   ├── exercises.js         # exercises.html card rendering + exercise detail data
│   ├── calories.js          # calories.html BMR/calorie calculations + rendering
│   ├── workout-page.js      # workout.html "this week's workouts" completion + celebrations
│   ├── workout-editor.js    # workout.html editable weekly exercise plan
│   ├── level-page.js        # level.html commitment ring / stats / achievements rendering
│   └── doc/                 # empty directory
└── react-app/               # unrelated Vite + React + TS scaffold (see below)
```

(`.git`, `.DS_Store` also present at the root; not part of the app.)

## Main Features

- **Onboarding form** (`index.html`) — collects name, height, weight, age, gender, goal, activity level.
- **Login / Register** (`login.html`) — login form plus an inline register-form toggled via a "Create
  Account" button; `register.html` is a second, visually different standalone registration page.
- **Result page** (`result.html`) — BMI + category, workout title/description, weekly schedule,
  recommended exercises, cardio advice, nutrition advice, water intake, a weekly plan list, and a
  randomized motivational quote.
- **Home dashboard** (`home.html`) — welcome/intro panel plus a grid of quick-link cards to every
  section of the app.
- **Profile** (`profile.html`) — read-only summary view with an inline "Edit Profile" form.
- **Workout** (`workout.html`) — two independent sections: an editable weekly exercise plan (change
  sets/reps/rest, replace or remove exercises) and a gamified "This Week's Workouts" grid where marking
  a card done awards XP, updates the streak, and can trigger a level-up/achievement celebration popup
  with confetti.
- **Exercises** (`exercises.html`) — goal-based curated exercise cards with image, description, sets/
  reps metric, and focus tag.
- **Nutrition** (`nutrition.html`) — goal-based nutrition advice and recommended daily water intake.
- **Calories** (`calories.html`) — BMR, maintenance, loss, and gain calorie targets via the
  Mifflin-St Jeor equation, plus the user's stored weight/height/BMI.
- **Schedule** (`schedule.html`) — the weekly day-by-day focus list plus a motivational message.
- **Level** (`level.html`) — commitment progress ring, level badge + XP bar, daily streak, lifetime
  stats (completed/remaining workouts, calories burned, total XP), weekly/monthly/XP progress bars, and
  an achievement grid.

## Coding Conventions Currently Used

- **No bundler or module system.** Every script attaches plain functions/consts to the global scope
  (no `import`/`export`, no IIFE wrapping except `logo.js`). Pages hand-pick which `<script src="js/...">`
  tags to include, in a consistent dependency order:
  `js/data.js → js/bmi.js → js/recommendation.js → [page-specific script(s)] → js/app.js → logo.js`
  (`js/utils.js` and `js/fitness-state.js` are pulled in only by the pages that need them).
- **Two different page-initialization patterns coexist:**
  - `js/app.js` has one `DOMContentLoaded` listener that detects the current page by checking for a
    specific element ID (`#fitness-form`, `#bmi-value`, `#summary-name`, `#workout-title`,
    `#exercise-list`, `#nutrition-advice`, `#calories-bmr`, `#schedule-list`, `#login-form`,
    `#register-form`) and calls a matching `initXPage()`.
  - Several page-specific scripts (`profile-page.js`, `exercises.js`, `calories.js`, `workout-page.js`,
    `workout-editor.js`, `level-page.js`) instead register their *own* `DOMContentLoaded` listener with
    an early-return guard on a page-unique element ID, independent of `app.js`'s router.
- **CSS** is hand-written, no preprocessor. The full design system is defined once as `:root` custom
  properties in `css/style.css`. Page-specific stylesheets (`home.css`, `dashboard.css`) are linked only
  by the pages that need them and loaded last so they win the cascade at equal specificity.
- **Layout skeleton** shared by every "app" page: `<nav class="top-nav">` → `<div class="container
  page-shell">...</div>` → `<nav class="bottom-nav">`, then scripts ending in `logo.js`, which injects a
  fixed-position SDAIA logo/link into the page at runtime via `insertAdjacentHTML`.
- **Naming:** camelCase for JS functions/variables, kebab-case for HTML element IDs/classes and CSS
  classes, PascalCase/SCREAMING_SNAKE only for the handful of global data constants (`FitnessData`,
  `EXERCISE_CATALOG`, `DASHBOARD_LEVELS`, `DASHBOARD_ACHIEVEMENTS`, `MONTHLY_GOAL`).
- **Recommendation data is centralized:** `generateRecommendation()` (js/recommendation.js) looks up
  `FitnessData.workoutPlans[userData.goal]` etc. generically — there is no per-goal branching logic in
  the recommendation code itself, only in the `FitnessData` object.

## UI Theme

- **Dark purple theme**, defined as CSS custom properties in `css/style.css`: `--color-bg: #0b0718`,
  `--color-primary: #6d28d9`, `--color-border: rgba(168, 85, 247, 0.18)`, soft purple/white text tones,
  plus shared radius/shadow/transition tokens.
- **Card style:** dark linear-gradient panels, a 1px translucent purple border, large border-radius
  (14–24px), soft purple-tinted box shadow.
- **Second "glass-card" variant** (`css/dashboard.css`), used only on `workout.html`/`level.html`:
  frosted-glass panels (`backdrop-filter: blur`) with purple borders, for the gamification dashboard UI.
- Animated radial-gradient background + two floating blurred "blob" pseudo-elements on `<body>`;
  `fadeUp`/`slideDown`/`floatBlob`/`liftIn` keyframe animations used throughout for entrance effects.
- Pill-shaped buttons and badges, gradient primary buttons, purple glow shadow on hover/focus.
- Responsive breakpoints at 1024px / 768px / 480px in `css/responsive.css`; `css/home.css` defines its
  own additional 1024px / 600px breakpoints specifically for the home page's two-column layout.

## Components / Pages

| Page | Purpose | Key scripts |
|---|---|---|
| `index.html` | Onboarding/profile form (also the redirect target when no profile exists) | data, bmi, recommendation, app |
| `login.html` | Login + inline toggleable register form | app |
| `register.html` | Standalone "Create Account" page (not linked from any nav) | app |
| `home.html` | Welcome panel + quick-link card grid | app |
| `profile.html` | View + inline edit of saved profile | data, bmi, app, profile-page |
| `result.html` | Full recommendation summary after onboarding | data, bmi, recommendation, app |
| `workout.html` | Editable weekly plan + gamified workout completion | data, bmi, recommendation, app, fitness-state, workout-page, workout-editor |
| `exercises.html` | Goal-based exercise card gallery | data, bmi, recommendation, utils, exercises, app |
| `nutrition.html` | Nutrition advice + water intake | data, bmi, recommendation, app |
| `calories.html` | BMR/calorie target calculator | data, bmi, recommendation, calories, app |
| `schedule.html` | Weekly schedule + motivation | data, bmi, recommendation, app |
| `level.html` | XP/level/streak/achievements dashboard | data, app, fitness-state, level-page |

## Important Implementation Notes

- There is no backend: all "auth" and persistence is `localStorage`; passwords are stored and compared
  in plaintext (a toy/demo auth scheme, not secure).
- Only one registered account can exist at a time — registering again overwrites `fitnessRegisteredUser`.
- Profile data is duplicated across three `localStorage` keys on every save
  (`fitnessProfile:<email>`, a bare `<email>` legacy key, and `fitnessUserData`) — see `saveProfile()`
  in `js/app.js`.
- `js/calories.js` does **not** use `app.js`'s `getProfileData()`/`getStoredProfile()` helpers; it has
  its own local `getProfileFromStorage()` that reads the bare-email legacy key and the `fitnessUserData`
  fallback directly — a separate read path over the same effective keys.
- `js/workout-editor.js` keeps a third, independent piece of state — the user's editable weekly
  exercise plan — under its own key via `getWorkoutPlanStorageKey()` (`fitnessWorkoutPlan:<email|guest>`),
  separate from the `fitnessDashboard:<email|guest>` gamification state in `js/fitness-state.js`.
- `register.html` exists but is not linked from anywhere in the app's navigation; the reachable
  registration flow is the inline register-form embedded in `login.html`, toggled via "Create Account".
- `index.html` doubles as both the first onboarding form for a brand-new visitor and the redirect
  target (`index.html?mode=profile-setup`) used by every page's "no profile found" guard.
- Exercise card content (images, descriptions, focus/metric tags) shown on `exercises.html` is
  hard-coded in a separate `exerciseProfiles` map inside `js/exercises.js`, distinct from the shorter
  one-line descriptions in `FitnessData.exerciseLibrary` (`js/data.js`) — the two can drift apart.
- Workout images (Unsplash URLs) are hard-coded directly in `js/fitness-state.js`'s
  `buildDefaultWorkouts()`.
- The `__MACOSX/` sibling folder and `.DS_Store` file (outside/inside this directory) are macOS
  zip-extraction artifacts, not part of the app.

## Future Improvement Ideas

(Observations only — nothing below has been acted on.)

- Unify the several parallel localStorage read paths (`app.js`'s `getProfileData`/`getStoredProfile`
  vs. `calories.js`'s own `getProfileFromStorage`) into one shared helper.
- Reduce the number of duplicate profile storage keys (`fitnessProfile:<email>`, the bare-email legacy
  key, `fitnessUserData`) to a single source of truth.
- Add a real backend/auth layer (hashed passwords, multi-user support) if the app needs to move beyond
  a single local demo account.
- Either link `register.html` from the app's navigation or remove it, since it's currently unreachable.
- Reconcile `js/data.js`'s `exerciseLibrary` with `js/exercises.js`'s `exerciseProfiles` so exercise
  descriptions live in one place.
- Consider a lightweight test setup (none exists today) if logic like `calculateBMI`,
  `calculateDailyCalories`, or `generateRecommendation` grows more complex.
- Consolidate the two page-initialization patterns (`app.js`'s central router vs. individual pages'
  own `DOMContentLoaded` listeners) into one consistent approach.
