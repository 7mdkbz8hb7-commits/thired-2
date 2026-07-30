// Renders the exercise card gallery on exercises.html. Self-initializes,
// independent of app.js's router. Depends on FitnessData (data.js) and
// formatGoalLabel/getStoredGoal (utils.js), which load before this script.

var exerciseProfiles = {
  'Push-ups': { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80', description: 'A bodyweight press that builds the chest, shoulders, and triceps.', metric: '3 x 12-15 reps', focus: 'Chest / Triceps', icon: '💪' },
  'Squats': { image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=80', description: 'A compound lower-body movement targeting the quads, glutes, and hamstrings.', metric: '3 x 15 reps', focus: 'Legs', icon: '🦵' },
  'Lunges': { image: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=500&q=80', description: 'A unilateral leg exercise that also improves balance and coordination.', metric: '3 x 12 reps / leg', focus: 'Legs / Glutes', icon: '🦵' },
  'Plank': { image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&q=80', description: 'An isometric hold that builds core stability and endurance.', metric: '3 x 30-45 sec', focus: 'Core', icon: '🧘' },
  'Jumping Jacks': { image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=500&q=80', description: 'A full-body cardio movement that raises your heart rate quickly.', metric: '3 x 45 sec', focus: 'Cardio', icon: '🤸' },
  'Mountain Climbers': { image: 'https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=500&q=80', description: 'A dynamic plank variation that combines core work with cardio.', metric: '3 x 30 sec', focus: 'Core / Cardio', icon: '🏃' },
  'Burpees': { image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80', description: 'A high-intensity full-body movement combining a squat, plank, and jump.', metric: '3 x 10 reps', focus: 'Full Body', icon: '🔥' },
  'Glute Bridges': { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80', description: 'A hip-hinge movement that isolates the glutes and lower back.', metric: '3 x 15 reps', focus: 'Glutes', icon: '🍑' },
  'Bicep Curls': { image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80', description: 'An isolation move for the biceps using dumbbells or a band.', metric: '3 x 12 reps', focus: 'Arms', icon: '💪' },
  'Shoulder Press': { image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80', description: 'An overhead press that builds the shoulders and triceps.', metric: '3 x 10 reps', focus: 'Shoulders', icon: '🏋️' }
};

function renderExerciseCards() {
  var container = document.getElementById('exercise-list');
  if (!container) return;

  var goal = getStoredGoal();
  var plan = FitnessData.workoutPlans[goal] || FitnessData.workoutPlans['maintain'];
  var goalLabelEl = document.getElementById('exercises-goal-label');
  if (goalLabelEl) goalLabelEl.textContent = formatGoalLabel(goal);

  container.innerHTML = plan.exercises.map(function (name) {
    var profile = exerciseProfiles[name] || {
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
      description: FitnessData.exerciseLibrary[name] || '',
      metric: '3 x 12 reps',
      focus: 'General',
      icon: '⭐'
    };
    return (
      '<div class="exercise-card">' +
        '<div class="exercise-card-image" style="background-image:url(\'' + profile.image + '\')"></div>' +
        '<div class="exercise-card-body">' +
          '<span class="exercise-focus-tag">' + profile.icon + ' ' + profile.focus + '</span>' +
          '<h3>' + name + '</h3>' +
          '<p>' + profile.description + '</p>' +
          '<span class="exercise-metric">' + profile.metric + '</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('exercise-list')) return;
  renderExerciseCards();
});
