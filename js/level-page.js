// Renders every widget on level.html from the shared fitnessDashboard state:
// commitment ring, level badge/XP bar, streak, stats, progress bars, achievements.
// Depends on fitness-state.js (loaded before this script).

var RING_RADIUS = 54;
var RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function renderCommitmentRing(percent) {
  var circle = document.getElementById('commitment-ring-progress');
  var label = document.getElementById('commitment-ring-label');
  if (!circle) return;
  var clamped = Math.max(0, Math.min(100, percent));
  var offset = RING_CIRCUMFERENCE * (1 - clamped / 100);
  circle.style.strokeDasharray = RING_CIRCUMFERENCE;
  circle.style.strokeDashoffset = RING_CIRCUMFERENCE;
  requestAnimationFrame(function () {
    circle.style.transition = 'stroke-dashoffset 1s ease';
    circle.style.strokeDashoffset = offset;
  });
  if (label) label.textContent = Math.round(clamped) + '%';
}

function renderLevelBadge(state) {
  var level = getCurrentLevel(state.totalXP);
  var nextLevel = getNextLevel(state.totalXP);

  var nameEl = document.getElementById('level-badge-name');
  if (nameEl) nameEl.textContent = level.name;

  var xpTextEl = document.getElementById('level-xp-text');
  var xpBar = document.getElementById('level-xp-bar-fill');

  if (nextLevel) {
    var span = nextLevel.minXP - level.minXP;
    var progressed = state.totalXP - level.minXP;
    var pct = span > 0 ? Math.round((progressed / span) * 100) : 100;
    if (xpTextEl) xpTextEl.textContent = state.totalXP + ' / ' + nextLevel.minXP + ' XP to ' + nextLevel.name;
    if (xpBar) xpBar.style.width = pct + '%';
  } else {
    if (xpTextEl) xpTextEl.textContent = state.totalXP + ' XP - Max Level!';
    if (xpBar) xpBar.style.width = '100%';
  }
}

function renderStreak(state) {
  var el = document.getElementById('streak-count');
  if (el) el.textContent = state.streak.count + ' day' + (state.streak.count === 1 ? '' : 's');
}

function renderStats(state) {
  var totalWorkouts = state.workouts.length;
  var completedThisWeek = state.workouts.filter(function (w) { return w.done; }).length;
  var remaining = totalWorkouts - completedThisWeek;
  var caloriesBurned = state.totalCompletedAllTime * 250;

  setText('stat-completed', completedThisWeek);
  setText('stat-remaining', remaining);
  setText('stat-calories', caloriesBurned + ' kcal');
  setText('stat-total-xp', state.totalXP + ' XP');

  renderCommitmentRing(totalWorkouts > 0 ? (completedThisWeek / totalWorkouts) * 100 : 0);
  renderProgressBar('weekly-progress-bar', completedThisWeek, totalWorkouts);
  renderProgressBar('monthly-progress-bar', state.totalCompletedAllTime % MONTHLY_GOAL, MONTHLY_GOAL);

  var level = getCurrentLevel(state.totalXP);
  var nextLevel = getNextLevel(state.totalXP);
  if (nextLevel) {
    renderProgressBar('xp-progress-bar', state.totalXP - level.minXP, nextLevel.minXP - level.minXP);
  } else {
    renderProgressBar('xp-progress-bar', 1, 1);
  }
}

function renderProgressBar(id, value, max) {
  var el = document.getElementById(id);
  if (!el) return;
  var pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  el.style.width = pct + '%';
}

function renderAchievements(state) {
  var grid = document.getElementById('achievements-grid');
  if (!grid) return;

  grid.innerHTML = DASHBOARD_ACHIEVEMENTS.map(function (achievement) {
    var unlocked = state.unlockedAchievements.indexOf(achievement.id) !== -1;
    return (
      '<div class="achievement-card ' + (unlocked ? 'is-unlocked' : 'is-locked') + '">' +
        '<span class="achievement-icon">' + achievement.icon + '</span>' +
        '<h4>' + achievement.title + '</h4>' +
        '<p>' + achievement.description + '</p>' +
      '</div>'
    );
  }).join('');
}

function renderLevelPage() {
  if (!getProfileData()) return;
  var state = loadDashboardState();
  renderLevelBadge(state);
  renderStreak(state);
  renderStats(state);
  renderAchievements(state);
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('commitment-ring-progress')) return;
  renderLevelPage();
});
