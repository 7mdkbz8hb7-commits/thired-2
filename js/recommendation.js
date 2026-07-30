// generateRecommendation(userData) assembles the full recommendation payload from FitnessData.
// calculateWaterIntake / getMotivationalMessage are small helpers used by several pages.

function calculateWaterIntake(weightKg, activityLevel) {
  var base = weightKg * 33; // ml per kg of bodyweight
  var extra = 0;
  if (activityLevel === 'moderate') extra = 350;
  if (activityLevel === 'active') extra = 550;
  if (activityLevel === 'very-active') extra = 750;
  var totalMl = base + extra;
  return Math.round((totalMl / 1000) * 10) / 10; // liters, 1 decimal
}

function getMotivationalMessage(goal) {
  var pool = (FitnessData.motivationalMessages[goal] || FitnessData.motivationalMessages['maintain']);
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateRecommendation(userData) {
  var goal = userData.goal || 'maintain';
  var plan = FitnessData.workoutPlans[goal] || FitnessData.workoutPlans['maintain'];
  var nutrition = FitnessData.nutritionAdvice[goal] || FitnessData.nutritionAdvice['maintain'];
  var bmi = calculateBMI(userData.weightKg, userData.heightCm);
  var bmiCategory = getBMICategory(bmi);

  return {
    bmi: bmi,
    bmiCategory: bmiCategory,
    workoutTitle: plan.title,
    workoutDescription: plan.description,
    schedule: plan.schedule,
    exercises: plan.exercises,
    cardio: plan.cardio,
    nutrition: nutrition,
    waterIntake: calculateWaterIntake(userData.weightKg, userData.activityLevel),
    motivation: getMotivationalMessage(goal)
  };
}
