# CONTEXT.md

A snapshot of the current project state, its flows, and its data model — for future Claude sessions to
read before making changes. This is descriptive documentation only; nothing in the project was modified
to produce it.

## Current Project Status

The root app is a complete, working static prototype: every page renders and functions using only
`localStorage`, with no backend, no build step, no test suite, no linter, and no CI configuration.
`react-app/` is a separate, much earlier-stage Vite + React + TypeScript scaffold (a single demo
component, `CalorieTrackerDemo`) that is not wired into the root app in any way — different stack,
different storage, no shared routes.

## Existing Functionality

- Collect a user profile (name, height, weight, age, gender, goal, activity level) via a form.
- Calculate BMI and BMI category from height/weight.
- Look up a goal-based workout plan, exercise list, cardio advice, nutrition advice, and a randomized
  motivational message from a static local dataset (`FitnessData` in `js/data.js`).
- Calculate recommended daily water intake from weight + activity level.
- Calculate BMR and calorie targets (maintenance / loss / gain) via the Mifflin-St Jeor equation.
- Local, single-account login/registration (email + plaintext password stored in `localStorage`).
- View and edit a saved profile.
- View/edit a personal weekly exercise plan (sets, reps, rest, swap, remove).
- Mark workouts from a separate default "this week's workouts" list as done, earning XP and building a
  daily streak, with level-up and achievement celebration popups (confetti included).
- View a level/commitment dashboard: completion ring, level badge + XP progress, streak, lifetime
  stats, weekly/monthly/XP progress bars, and an achievement grid.

## User Flow

1. A first-time visitor lands on `index.html` (or is redirected there via `?mode=profile-setup`) and
   fills in the fitness form (name, height, weight, age, gender, goal, activity level).
2. On submit, `initFormPage()` (js/app.js) checks for a logged-in user; if none, it redirects to
   `login.html` **without saving the form data**.
3. On `login.html`, a new user clicks "Create Account" to reveal the inline register-form, submits
   full name/email/password, which is stored as `fitnessRegisteredUser` + `fitnessCurrentUser`, then is
   redirected to `index.html?mode=profile-setup` to fill in the profile form again, now logged in.
4. Submitting the profile form while logged in calls `saveProfile()` and redirects to `result.html`,
   which renders BMI, workout plan, nutrition, a weekly plan, and a motivational quote.
5. Returning users log in directly on `login.html`; if a saved profile exists they land on
   `profile.html`, otherwise they're sent to `index.html?mode=profile-setup`.
6. From `home.html` (the main hub) or the shared top-nav/bottom-nav present on every "app" page, the
   user can jump to Profile, Workout, Exercises, Nutrition, Calories, Schedule, or Level at any time —
   every one of these pages independently calls `getProfileData()` and redirects to
   `index.html?mode=profile-setup` if nothing is stored.
7. On `workout.html`, the user can (a) edit their personal weekly exercise plan and, separately, (b)
   mark cards in "This Week's Workouts" as done — each completion adds XP, updates the streak, and may
   queue a level-up or achievement celebration popup with confetti.
8. `level.html` visualizes accumulated progress computed from the same gamification state written on
   `workout.html`: completion ring, level badge + XP bar, streak, stats, progress bars, achievements.
9. `register.html` is a second, standalone registration page with its own layout, but no page in the
   app links to it — it's only reachable by typing its URL directly.

## Important Files and What They Do

| File | What it does |
|---|---|
| `js/data.js` | `FitnessData` — the entire static content catalog: workout plans per goal (title, description, 7-day schedule, exercises, cardio text), exercise library descriptions, nutrition advice per goal, motivational messages per goal, activity-level multipliers. |
| `js/bmi.js` | `calculateBMI(weightKg, heightCm)`, `getBMICategory(bmi)`. |
| `js/recommendation.js` | `generateRecommendation(userData)` assembles the full recommendation payload from `FitnessData` + the user's goal/weight/activity level; `calculateWaterIntake()`; `getMotivationalMessage()`. |
| `js/utils.js` | `formatGoalLabel(goal)`, `getStoredGoal()` — small helpers used by `exercises.js`. |
| `js/app.js` | The largest file. Holds the page router (`DOMContentLoaded` → `initXPage()` dispatch by element ID), all profile/session localStorage helpers (`getCurrentUser`, `getStoredProfile`, `saveProfile`, `persistCurrentUser`, `getProfileData`), the login/register form handlers, the nav user-badge renderer, and every `render*()`/`init*Page()` function for the pages that don't have their own dedicated script. |
| `js/fitness-state.js` | Gamification state: `loadDashboardState`/`saveDashboardState` (key `fitnessDashboard:<email|guest>`), `DASHBOARD_LEVELS`, `DASHBOARD_ACHIEVEMENTS`, streak logic (`updateStreakOnCompletion`, `applyStreakDecay`), `evaluateAchievements`, `buildDefaultWorkouts` (the 10 default "this week" workout cards, with hard-coded Unsplash images). |
| `js/workout-page.js` | Renders and drives the "This Week's Workouts" grid on `workout.html`: mark-done clicks, XP/streak updates, celebration popup queueing, confetti animation, week reset. |
| `js/workout-editor.js` | Renders and drives the separate, user-editable weekly exercise plan on `workout.html` (its own `EXERCISE_CATALOG`, its own `fitnessWorkoutPlan:<email|guest>` storage key via `getWorkoutPlanStorageKey()`). |
| `js/level-page.js` | Renders every widget on `level.html` from the shared dashboard state: commitment ring (SVG stroke animation), level badge/XP bar, streak, animated stat counters, progress bars, achievement grid. |
| `js/profile-page.js` | Drives the show/edit toggle on `profile.html` (`#profile-view` ↔ `#profile-edit-section`) and the profile edit form's submit handler. |
| `js/exercises.js` | Renders the exercise card gallery on `exercises.html`; contains its own `exerciseProfiles` detail map (image/description/metric/focus/icon per exercise name) used to enrich the plan's exercise list. |
| `js/calories.js` | Drives `calories.html`: its own `getProfileFromStorage()` (a separate read path from `app.js`'s), `calculateDailyCalories()` (Mifflin-St Jeor), and `renderCaloriesPage()`. |
| `logo.js` | IIFE that injects a fixed-position SDAIA logo/link into every page's `<body>` at runtime via `insertAdjacentHTML`. Included last on every page. |
| `css/style.css` | The entire design system (`:root` custom properties) plus every shared component style (nav, cards, buttons, forms, bottom-nav, auth pages, result page). |
| `css/responsive.css` | `@media` overrides only, at 1024px/768px/480px, loaded after `style.css` on every page. |
| `css/home.css` | Layout/typography for `home.html`'s two-column welcome-panel + card-grid layout, with its own 1024px/600px breakpoints. |
| `css/dashboard.css` | The "glass-card" frosted panel styling used only by `workout.html` and `level.html`. |

## Relationships Between Pages

- Every "app" page (`home`, `profile`, `workout`, `exercises`, `nutrition`, `calories`, `schedule`,
  `level`) shares the same top-nav (all 8 links) and bottom-nav (Home/Workouts/Exercises/Calories/
  Profile/Level — a 6-item subset) linking to each other.
- `index.html`, `login.html`, and `result.html` do **not** include the top-nav/bottom-nav — they sit
  outside the main app shell (onboarding/auth/first-result flow).
- `register.html` only links back to `login.html`; nothing links to `register.html`.
- `result.html`'s nav-brand and its "Back" button both point to `index.html`.
- `home.html`'s hero "Get Started" button points to `login.html`.
- Any page that requires profile data (`profile`, `workout`, `exercises`, `nutrition`, `calories`,
  `schedule`) redirects to `index.html?mode=profile-setup` if no profile is stored — this is the only
  path back to `index.html` from inside the main app shell.

## Data Flow

```
FitnessData (js/data.js, static)
        │
        ▼
generateRecommendation(userData)  [js/recommendation.js]
        │  looks up FitnessData.workoutPlans / nutritionAdvice / motivationalMessages
        │  by userData.goal, plus calculateWaterIntake(weight, activityLevel)
        ▼
{ workoutTitle, workoutDescription, schedule, exercises, cardio,
  nutrition, waterIntake, motivation }
        │
        ▼
render*() functions (js/app.js, per page)  →  DOM text content
```

User input flow:

```
Form submit (index.html / profile.html edit form)
        │
        ▼
calculateBMI() + getBMICategory()  [js/bmi.js]
        │
        ▼
saveProfile(userData)  [js/app.js]
        │  writes fitnessProfile:<email>, bare-<email> legacy key, and fitnessUserData
        ▼
localStorage
        │
        ▼
getProfileData() [js/app.js]  (or calories.js's own getProfileFromStorage())
        │
        ▼
generateRecommendation(userData) → render on the current page
```

Gamification flow (separate from the above):

```
workout.html mark-done click
        │
        ▼
markWorkoutDone(state, workoutId)  [js/workout-page.js]
        │  state.totalXP += workout.xp; updateStreakOnCompletion(state)
        ▼
saveDashboardState(state)  [js/fitness-state.js]  →  fitnessDashboard:<email|guest>
        │
        ▼
evaluateAchievements(state) → celebration popup / confetti (if newly unlocked)
        │
        ▼
level.html reads the same fitnessDashboard:<email|guest> key via loadDashboardState()
        and renders the ring/badge/stats/progress bars/achievements from it
```

## Local Storage Usage

| Key | Written by | Read by | Shape |
|---|---|---|---|
| `fitnessRegisteredUser` | `initRegisterPage()` (js/app.js) | `initLoginPage()`, `getCurrentUser()` (js/app.js) | `{ fullName, email, password }` (plaintext password) |
| `fitnessCurrentUser` | `persistCurrentUser()` (js/app.js) | `getCurrentUser()` and everything that depends on it | `{ fullName, email }` |
| `fitnessProfile:<normalized-email>` | `saveProfile()` (js/app.js) | `getStoredProfile()` (js/app.js) | full profile object (name, height, weight, age, gender, goal, activityLevel, bmi, bmiCategory, email, updatedAt) |
| `<normalized-email>` (bare key, legacy) | `saveProfile()` (js/app.js) | `getStoredProfile()` (js/app.js) fallback; also read directly by `js/calories.js`'s own `getProfileFromStorage()` | same shape as above |
| `fitnessUserData` | `saveProfile()` (js/app.js); also written directly inside `initLoginPage()` | `getProfileData()` fallback (js/app.js); `getStoredGoal()` (js/utils.js); `js/calories.js` fallback | same shape as above |
| `fitnessDashboard:<email|guest>` | `saveDashboardState()` (js/fitness-state.js) | `loadDashboardState()` — used by `workout-page.js` and `level-page.js` | `{ workouts[], totalXP, streak: { count, lastDate }, totalCompletedAllTime, unlockedAchievements[] }` |
| `fitnessWorkoutPlan:<email\|guest>` | `saveWorkoutPlan()` (js/workout-editor.js) | `loadWorkoutPlan()` (js/workout-editor.js) | array of `{ id, name, icon, sets, reps, rest }` |

Notes:
- The dashboard key and the workout-plan key use different email-fallback literals in code
  (`'guest'` in both, but derived independently in `fitness-state.js` and `workout-editor.js`).
- `fitnessProfile:<email>`, the bare `<email>` key, and `fitnessUserData` are always written together by
  `saveProfile()`, so in normal operation they stay in sync — but code exists that reads each of the
  three independently in different places.

## Navigation Flow

- **Top-nav** (all 8 links, present on `home`, `profile`, `workout`, `exercises`, `nutrition`,
  `calories`, `schedule`, `level`): Home · Profile · Workout · Exercises · Nutrition · Calories ·
  Schedule · Level, plus a nav-user badge (avatar + name) and a hamburger toggle below 760px.
- **Bottom-nav** (same 8 pages, 6 links): Home · Workouts · Exercises · Calories · Profile · Level.
- **Pages outside the nav shell:** `index.html` (onboarding form), `login.html` (auth),
  `result.html` (its own minimal in-page anchor nav to `#bmi-section`/`#workout-section`/etc.),
  `register.html` (brand link only).
- **Redirect-based navigation:** any profile-gated page → `index.html?mode=profile-setup` when no
  profile is stored; `initFormPage()` → `login.html` when submitting the form while logged out;
  successful login → `profile.html` (profile exists) or `index.html?mode=profile-setup` (no profile);
  successful registration (either form) → `index.html?mode=profile-setup`.

## Things Future Claude Sessions Should Know Before Making Changes

- **Script include order matters.** These are plain global-scope scripts with no module system — a
  page will throw a `ReferenceError` at runtime if a script that depends on `FitnessData`,
  `calculateBMI`, `getCurrentUser`, etc. is included before the script that defines it, or if the
  defining script is omitted entirely.
- **Two coexisting page-init patterns.** `js/app.js`'s central `DOMContentLoaded` router handles some
  pages; several other pages (`profile-page.js`, `exercises.js`, `calories.js`, `workout-page.js`,
  `workout-editor.js`, `level-page.js`) self-initialize with their own `DOMContentLoaded` listener and
  an element-ID guard. Check which pattern a page already uses before adding new init logic to it.
- **Profile data has three storage locations that must stay in sync** if you touch `saveProfile()` —
  see the Local Storage Usage table above.
- **`js/calories.js` has its own separate profile-read path** (`getProfileFromStorage()`) instead of
  using `app.js`'s `getProfileData()`/`getStoredProfile()` — a fix to one does not automatically apply
  to the other.
- **`register.html` is orphaned** (unreachable from any nav link); the actual registration UI users see
  is the inline form on `login.html`. Don't assume `register.html` is dead code without checking whether
  the task wants it wired in or removed.
- **Exercise descriptions exist in two places**: `FitnessData.exerciseLibrary` (js/data.js, short
  one-liners used on the result page) and `exerciseProfiles` inside `js/exercises.js` (richer cards with
  images, used on exercises.html). They are not derived from each other.
- **Auth is a single-account, plaintext-password toy implementation.** There is no hashing, no
  multi-user support, and no session expiry — don't assume any security properties that aren't there.
- **No tests, linter, or build step exist for the root app.** Changes can only be verified by opening
  the HTML files in a browser (or serving the folder) and exercising the UI manually.
- **`react-app/` is unrelated.** Don't cross-reference root `js/`/`css/` from inside `react-app/`, or
  vice versa — they don't share routes, components, or storage keys.
