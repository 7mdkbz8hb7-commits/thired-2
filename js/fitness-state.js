// Gamification state: XP, streak, levels, achievements.
// Storage key: fitnessDashboard:<email|guest>. Depends on getCurrentUser() from app.js
// (app.js is loaded before this script on workout.html and level.html).

var DASHBOARD_LEVELS = [
  { name: 'Bronze', minXP: 0 },
  { name: 'Silver', minXP: 200 },
  { name: 'Gold', minXP: 500 },
  { name: 'Diamond', minXP: 1000 }
];

var MONTHLY_GOAL = 20; // completed workouts/month target used by level.html progress bars

var DASHBOARD_ACHIEVEMENTS = [
  {
    id: 'first-workout',
    title: 'First Step',
    description: 'Complete your first workout.',
    icon: '🏁',
    check: function (state) { return state.totalCompletedAllTime >= 1; }
  },
  {
    id: 'streak-3',
    title: 'On a Roll',
    description: 'Reach a 3-day streak.',
    icon: '🔥',
    check: function (state) { return state.streak.count >= 3; }
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Reach a 7-day streak.',
    icon: '⚡',
    check: function (state) { return state.streak.count >= 7; }
  },
  {
    id: 'xp-200',
    title: 'Silver Status',
    description: 'Earn 200 total XP.',
    icon: '🥈',
    check: function (state) { return state.totalXP >= 200; }
  },
  {
    id: 'xp-500',
    title: 'Gold Status',
    description: 'Earn 500 total XP.',
    icon: '🥇',
    check: function (state) { return state.totalXP >= 500; }
  },
  {
    id: 'completed-10',
    title: 'Ten Down',
    description: 'Complete 10 workouts total.',
    icon: '💪',
    check: function (state) { return state.totalCompletedAllTime >= 10; }
  }
];

function getDashboardStorageKey() {
  var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  var idPart = (user && user.email) ? user.email.trim().toLowerCase() : 'guest';
  return 'fitnessDashboard:' + idPart;
}

function buildDefaultWorkouts() {
  return [
    { id: 'w1', name: 'Full-Body Circuit', xp: 30, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', done: false },
    { id: 'w2', name: 'Cardio Intervals', xp: 25, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', done: false },
    { id: 'w3', name: 'Upper Body Strength', xp: 30, image: 'https://images.unsplash.com/photo-1584863231364-2edc166de576?w=600&q=80', done: false },
    { id: 'w4', name: 'Lower Body Strength', xp: 30, image: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=600&q=80', done: false },
    { id: 'w5', name: 'Core & Abs', xp: 20, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', done: false },
    { id: 'w6', name: 'HIIT Session', xp: 35, image: 'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=600&q=80', done: false },
    { id: 'w7', name: 'Yoga & Flexibility', xp: 20, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', done: false },
    { id: 'w8', name: 'Active Recovery Walk', xp: 15, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80', done: false },
    { id: 'w9', name: 'Push Day', xp: 30, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80', done: false },
    { id: 'w10', name: 'Pull Day', xp: 30, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', done: false }
  ];
}

function createDefaultDashboardState() {
  return {
    workouts: buildDefaultWorkouts(),
    totalXP: 0,
    streak: { count: 0, lastDate: null },
    totalCompletedAllTime: 0,
    unlockedAchievements: []
  };
}

function loadDashboardState() {
  var key = getDashboardStorageKey();
  try {
    var raw = localStorage.getItem(key);
    if (!raw) {
      var fresh = createDefaultDashboardState();
      saveDashboardState(fresh);
      return fresh;
    }
    var state = JSON.parse(raw);
    if (!state.workouts || !state.workouts.length) state.workouts = buildDefaultWorkouts();
    if (!state.streak) state.streak = { count: 0, lastDate: null };
    if (typeof state.totalXP !== 'number') state.totalXP = 0;
    if (typeof state.totalCompletedAllTime !== 'number') state.totalCompletedAllTime = 0;
    if (!state.unlockedAchievements) state.unlockedAchievements = [];
    applyStreakDecay(state);
    return state;
  } catch (e) {
    return createDefaultDashboardState();
  }
}

function saveDashboardState(state) {
  var key = getDashboardStorageKey();
  localStorage.setItem(key, JSON.stringify(state));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(isoA, isoB) {
  var a = new Date(isoA + 'T00:00:00');
  var b = new Date(isoB + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}

function applyStreakDecay(state) {
  if (!state.streak.lastDate) return;
  var diff = daysBetween(state.streak.lastDate, todayISO());
  if (diff > 1) {
    state.streak.count = 0;
  }
}

function updateStreakOnCompletion(state) {
  var today = todayISO();
  if (state.streak.lastDate === today) {
    // already logged a completion today, streak unchanged
    return;
  }
  var diff = state.streak.lastDate ? daysBetween(state.streak.lastDate, today) : null;
  if (diff === 1) {
    state.streak.count += 1;
  } else {
    state.streak.count = 1;
  }
  state.streak.lastDate = today;
}

function getCurrentLevel(totalXP) {
  var current = DASHBOARD_LEVELS[0];
  for (var i = 0; i < DASHBOARD_LEVELS.length; i++) {
    if (totalXP >= DASHBOARD_LEVELS[i].minXP) current = DASHBOARD_LEVELS[i];
  }
  return current;
}

function getNextLevel(totalXP) {
  for (var i = 0; i < DASHBOARD_LEVELS.length; i++) {
    if (totalXP < DASHBOARD_LEVELS[i].minXP) return DASHBOARD_LEVELS[i];
  }
  return null; // already at max level
}

function evaluateAchievements(state) {
  var newlyUnlocked = [];
  DASHBOARD_ACHIEVEMENTS.forEach(function (achievement) {
    var already = state.unlockedAchievements.indexOf(achievement.id) !== -1;
    if (!already && achievement.check(state)) {
      state.unlockedAchievements.push(achievement.id);
      newlyUnlocked.push(achievement);
    }
  });
  return newlyUnlocked;
}
