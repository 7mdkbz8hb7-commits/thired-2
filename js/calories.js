// Drives calories.html. Deliberately keeps its own profile-read path
// (getProfileFromStorage) instead of using app.js's getProfileData()/getStoredProfile().

function getProfileFromStorage() {
  try {
    var currentUserRaw = localStorage.getItem('fitnessCurrentUser');
    if (currentUserRaw) {
      var currentUser = JSON.parse(currentUserRaw);
      var email = (currentUser.email || '').trim().toLowerCase();
      if (email) {
        var byEmail = localStorage.getItem(email);
        if (byEmail) return JSON.parse(byEmail);
      }
    }
  } catch (e) {}

  try {
    var fallback = localStorage.getItem('fitnessUserData');
    if (fallback) return JSON.parse(fallback);
  } catch (e) {}

  return null;
}

function calculateDailyCalories(profile) {
  var weight = profile.weightKg;
  var height = profile.heightCm;
  var age = profile.age;
  var isMale = profile.gender === 'male';

  var bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
  bmr = Math.round(bmr);

  var multiplier = FitnessData.activityMultipliers[profile.activityLevel] || 1.2;
  var maintenance = Math.round(bmr * multiplier);

  return {
    bmr: bmr,
    maintenance: maintenance,
    loss: maintenance - 500,
    gain: maintenance + 500
  };
}

function renderCaloriesPage() {
  var profile = getProfileFromStorage();
  if (!profile) {
    window.location.href = 'index.html?mode=profile-setup';
    return;
  }

  var calories = calculateDailyCalories(profile);
  var bmi = calculateBMI(profile.weightKg, profile.heightCm);

  document.getElementById('calories-bmr').textContent = calories.bmr + ' kcal';
  document.getElementById('calories-maintenance').textContent = calories.maintenance + ' kcal';
  document.getElementById('calories-loss').textContent = calories.loss + ' kcal';
  document.getElementById('calories-gain').textContent = calories.gain + ' kcal';
  document.getElementById('calories-weight').textContent = profile.weightKg + ' kg';
  document.getElementById('calories-height').textContent = profile.heightCm + ' cm';
  document.getElementById('calories-bmi').textContent = bmi;
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('calories-bmr')) return;
  renderCaloriesPage();
});
