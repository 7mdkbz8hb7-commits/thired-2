// Small shared helpers used by exercises.js. Loaded before page-specific scripts,
// so it reads localStorage directly rather than depending on app.js's helpers.

function formatGoalLabel(goal) {
  return (FitnessData.goalLabels && FitnessData.goalLabels[goal]) || 'General Fitness';
}

function getStoredGoal() {
  try {
    var raw = localStorage.getItem('fitnessUserData');
    if (raw) {
      var data = JSON.parse(raw);
      if (data && data.goal) return data.goal;
    }
  } catch (e) {}
  return 'maintain';
}
