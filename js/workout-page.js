// Renders and drives the gamified "This Week's Workouts" grid on workout.html:
// mark-done clicks, XP/streak updates, celebration popup + confetti, week reset.
// Depends on fitness-state.js (loaded before this script).

function renderWorkoutGrid(state) {
  var grid = document.getElementById('workout-cards-grid');
  if (!grid) return;

  grid.innerHTML = state.workouts.map(function (w) {
    return (
      '<div class="workout-card ' + (w.done ? 'is-done' : '') + '" data-workout-id="' + w.id + '">' +
        '<div class="workout-card-image" style="background-image:url(\'' + w.image + '\')"></div>' +
        '<div class="workout-card-body">' +
          '<h3>' + w.name + '</h3>' +
          '<span class="workout-xp-tag">+' + w.xp + ' XP</span>' +
          '<button type="button" class="btn ' + (w.done ? 'btn-outline' : 'btn-primary') + ' btn-sm mark-done-btn" ' + (w.done ? 'disabled' : '') + '>' +
            (w.done ? 'Completed ✓' : 'Mark Done') +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  grid.querySelectorAll('.mark-done-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.workout-card');
      var workoutId = card.getAttribute('data-workout-id');
      handleMarkDone(workoutId);
    });
  });

  renderDashboardSummary(state);
}

function renderDashboardSummary(state) {
  var xpEl = document.getElementById('dashboard-total-xp');
  var streakEl = document.getElementById('dashboard-streak');
  var levelEl = document.getElementById('dashboard-level');
  var level = getCurrentLevel(state.totalXP);
  if (xpEl) xpEl.textContent = state.totalXP + ' XP';
  if (streakEl) streakEl.textContent = state.streak.count + ' day' + (state.streak.count === 1 ? '' : 's');
  if (levelEl) levelEl.textContent = level.name;
}

function handleMarkDone(workoutId) {
  var state = loadDashboardState();
  var workout = state.workouts.filter(function (w) { return w.id === workoutId; })[0];
  if (!workout || workout.done) return;

  var levelBefore = getCurrentLevel(state.totalXP).name;

  workout.done = true;
  state.totalXP += workout.xp;
  state.totalCompletedAllTime += 1;
  updateStreakOnCompletion(state);

  var newlyUnlocked = evaluateAchievements(state);
  saveDashboardState(state);

  renderWorkoutGrid(state);

  var levelAfter = getCurrentLevel(state.totalXP).name;
  if (levelAfter !== levelBefore) {
    showCelebration('Level Up!', 'You reached ' + levelAfter + ' level!');
  } else if (newlyUnlocked.length > 0) {
    var achievement = newlyUnlocked[0];
    showCelebration('Achievement Unlocked!', achievement.icon + ' ' + achievement.title);
  } else {
    showCelebration('Nice Work!', '+' + workout.xp + ' XP earned.');
  }
}

function showCelebration(title, message) {
  var modal = document.getElementById('celebration-modal');
  if (!modal) return;
  document.getElementById('celebration-title').textContent = title;
  document.getElementById('celebration-message').textContent = message;
  modal.classList.remove('hidden');
  triggerConfetti();
}

function triggerConfetti() {
  var container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  var colors = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#ffffff'];
  for (var i = 0; i < 40; i++) {
    var piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.4) + 's';
    piece.style.animationDuration = (1.5 + Math.random() * 1) + 's';
    container.appendChild(piece);
  }
  setTimeout(function () { container.innerHTML = ''; }, 2500);
}

function wireCelebrationClose() {
  var closeBtn = document.getElementById('celebration-close-btn');
  var modal = document.getElementById('celebration-modal');
  if (!closeBtn || !modal) return;
  closeBtn.addEventListener('click', function () {
    modal.classList.add('hidden');
  });
}

function wireResetWeek() {
  var resetBtn = document.getElementById('reset-week-btn');
  if (!resetBtn) return;
  resetBtn.addEventListener('click', function () {
    var state = loadDashboardState();
    state.workouts.forEach(function (w) { w.done = false; });
    saveDashboardState(state);
    renderWorkoutGrid(state);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('workout-cards-grid')) return;
  var state = loadDashboardState();
  renderWorkoutGrid(state);
  wireCelebrationClose();
  wireResetWeek();
});
