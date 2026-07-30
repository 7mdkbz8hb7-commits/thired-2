// Renders and drives the separate, user-editable weekly exercise plan on workout.html.
// Own catalog + own storage key (fitnessWorkoutPlan:<email|guest>), independent of
// the fitnessDashboard:<email|guest> gamification state in fitness-state.js.

var EXERCISE_CATALOG = [
  { name: 'Push-ups', icon: '💪' },
  { name: 'Squats', icon: '🦵' },
  { name: 'Lunges', icon: '🦵' },
  { name: 'Plank', icon: '🧘' },
  { name: 'Jumping Jacks', icon: '🤸' },
  { name: 'Mountain Climbers', icon: '🏃' },
  { name: 'Burpees', icon: '🔥' },
  { name: 'Glute Bridges', icon: '🍑' },
  { name: 'Bicep Curls', icon: '💪' },
  { name: 'Shoulder Press', icon: '🏋️' }
];

function getWorkoutPlanStorageKey() {
  var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  var idPart = (user && user.email) ? user.email.trim().toLowerCase() : 'guest';
  return 'fitnessWorkoutPlan:' + idPart;
}

function iconForExercise(name) {
  var found = EXERCISE_CATALOG.filter(function (e) { return e.name === name; })[0];
  return found ? found.icon : '⭐';
}

function buildDefaultPlanFromProfile() {
  var profile = (typeof getStoredProfile === 'function') ? getStoredProfile() : null;
  var goal = (profile && profile.goal) || 'maintain';
  var plan = FitnessData.workoutPlans[goal] || FitnessData.workoutPlans['maintain'];

  return plan.exercises.map(function (name, index) {
    return {
      id: 'ex' + index,
      name: name,
      icon: iconForExercise(name),
      sets: 3,
      reps: 12,
      rest: 60
    };
  });
}

function loadWorkoutPlan() {
  var key = getWorkoutPlanStorageKey();
  try {
    var raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  var fresh = buildDefaultPlanFromProfile();
  saveWorkoutPlan(fresh);
  return fresh;
}

function saveWorkoutPlan(plan) {
  localStorage.setItem(getWorkoutPlanStorageKey(), JSON.stringify(plan));
}

function renderExerciseOptions(selectedName) {
  return EXERCISE_CATALOG.map(function (e) {
    return '<option value="' + e.name + '" ' + (e.name === selectedName ? 'selected' : '') + '>' + e.icon + ' ' + e.name + '</option>';
  }).join('');
}

function renderWorkoutPlanEditor(plan) {
  var list = document.getElementById('workout-plan-list');
  if (!list) return;

  list.innerHTML = plan.map(function (item) {
    return (
      '<div class="plan-row" data-exercise-id="' + item.id + '">' +
        '<span class="plan-icon">' + item.icon + '</span>' +
        '<select class="plan-exercise-select">' + renderExerciseOptions(item.name) + '</select>' +
        '<label>Sets <input type="number" min="1" max="10" class="plan-sets-input" value="' + item.sets + '"></label>' +
        '<label>Reps <input type="number" min="1" max="50" class="plan-reps-input" value="' + item.reps + '"></label>' +
        '<label>Rest (s) <input type="number" min="0" max="300" step="15" class="plan-rest-input" value="' + item.rest + '"></label>' +
        '<button type="button" class="btn btn-outline btn-sm plan-remove-btn">Remove</button>' +
      '</div>'
    );
  }).join('');

  wirePlanRowEvents(plan);
}

function wirePlanRowEvents(plan) {
  var list = document.getElementById('workout-plan-list');
  if (!list) return;

  list.querySelectorAll('.plan-row').forEach(function (row) {
    var id = row.getAttribute('data-exercise-id');
    var item = plan.filter(function (p) { return p.id === id; })[0];
    if (!item) return;

    row.querySelector('.plan-exercise-select').addEventListener('change', function (e) {
      item.name = e.target.value;
      item.icon = iconForExercise(item.name);
      saveWorkoutPlan(plan);
      renderWorkoutPlanEditor(plan);
    });

    row.querySelector('.plan-sets-input').addEventListener('change', function (e) {
      item.sets = parseInt(e.target.value, 10) || 1;
      saveWorkoutPlan(plan);
    });

    row.querySelector('.plan-reps-input').addEventListener('change', function (e) {
      item.reps = parseInt(e.target.value, 10) || 1;
      saveWorkoutPlan(plan);
    });

    row.querySelector('.plan-rest-input').addEventListener('change', function (e) {
      item.rest = parseInt(e.target.value, 10) || 0;
      saveWorkoutPlan(plan);
    });

    row.querySelector('.plan-remove-btn').addEventListener('click', function () {
      var index = plan.indexOf(item);
      if (index !== -1) plan.splice(index, 1);
      saveWorkoutPlan(plan);
      renderWorkoutPlanEditor(plan);
    });
  });
}

function wireAddExerciseButton(plan) {
  var addBtn = document.getElementById('add-exercise-btn');
  if (!addBtn) return;
  addBtn.addEventListener('click', function () {
    var nextId = 'ex' + Date.now();
    plan.push({ id: nextId, name: EXERCISE_CATALOG[0].name, icon: EXERCISE_CATALOG[0].icon, sets: 3, reps: 12, rest: 60 });
    saveWorkoutPlan(plan);
    renderWorkoutPlanEditor(plan);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('workout-plan-list')) return;
  var plan = loadWorkoutPlan();
  renderWorkoutPlanEditor(plan);
  wireAddExerciseButton(plan);
});
