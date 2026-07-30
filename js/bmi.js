// calculateBMI, getBMICategory - pure functions used across index/result/profile/calories pages.

function calculateBMI(weightKg, heightCm) {
  var heightM = heightCm / 100;
  if (!heightM || !weightKg) return 0;
  var bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

function getBMICategory(bmi) {
  if (bmi <= 0) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
