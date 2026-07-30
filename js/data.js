// FitnessData: static content catalog used by js/recommendation.js and page scripts.
// Goals in use across the app: 'lose-weight', 'gain-muscle', 'maintain', 'endurance'.

var FitnessData = {
  goalLabels: {
    'lose-weight': 'Lose Weight',
    'gain-muscle': 'Gain Muscle',
    'maintain': 'Maintain Weight',
    'endurance': 'Improve Endurance'
  },

  activityLabels: {
    'sedentary': 'Sedentary (little or no exercise)',
    'light': 'Lightly Active (1-3 days/week)',
    'moderate': 'Moderately Active (3-5 days/week)',
    'active': 'Active (6-7 days/week)',
    'very-active': 'Very Active (hard exercise daily)'
  },

  activityMultipliers: {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  },

  workoutPlans: {
    'lose-weight': {
      title: 'Fat-Burning Circuit Plan',
      description: 'A mix of full-body strength circuits and cardio intervals designed to maximize calorie burn while preserving lean muscle.',
      schedule: [
        { day: 'Monday', focus: 'Full-Body Circuit' },
        { day: 'Tuesday', focus: 'Cardio Intervals' },
        { day: 'Wednesday', focus: 'Active Recovery / Walk' },
        { day: 'Thursday', focus: 'Lower Body Circuit' },
        { day: 'Friday', focus: 'HIIT Cardio' },
        { day: 'Saturday', focus: 'Upper Body Circuit' },
        { day: 'Sunday', focus: 'Rest' }
      ],
      exercises: ['Jumping Jacks', 'Squats', 'Push-ups', 'Mountain Climbers', 'Burpees', 'Plank', 'Lunges'],
      cardio: 'Aim for 25-30 minutes of moderate-to-high intensity cardio (cycling, brisk walking, or jump rope) at least 3 times a week to accelerate fat loss.'
    },
    'gain-muscle': {
      title: 'Progressive Strength Builder',
      description: 'A split routine focused on progressive overload across major muscle groups to build lean muscle mass.',
      schedule: [
        { day: 'Monday', focus: 'Chest & Triceps' },
        { day: 'Tuesday', focus: 'Back & Biceps' },
        { day: 'Wednesday', focus: 'Rest / Mobility' },
        { day: 'Thursday', focus: 'Legs & Glutes' },
        { day: 'Friday', focus: 'Shoulders & Core' },
        { day: 'Saturday', focus: 'Full-Body Strength' },
        { day: 'Sunday', focus: 'Rest' }
      ],
      exercises: ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Glute Bridges', 'Bicep Curls', 'Shoulder Press'],
      cardio: 'Keep cardio light (10-15 minutes, 2 times a week) so it does not interfere with muscle recovery and growth.'
    },
    'maintain': {
      title: 'Balanced Maintenance Plan',
      description: 'A well-rounded routine balancing strength, cardio, and flexibility to maintain your current fitness level.',
      schedule: [
        { day: 'Monday', focus: 'Full-Body Strength' },
        { day: 'Tuesday', focus: 'Cardio / Cycling' },
        { day: 'Wednesday', focus: 'Yoga / Flexibility' },
        { day: 'Thursday', focus: 'Full-Body Strength' },
        { day: 'Friday', focus: 'Cardio / Swimming' },
        { day: 'Saturday', focus: 'Active Recreation' },
        { day: 'Sunday', focus: 'Rest' }
      ],
      exercises: ['Squats', 'Push-ups', 'Plank', 'Lunges', 'Jumping Jacks', 'Glute Bridges'],
      cardio: '20 minutes of moderate cardio, 2-3 times a week, is enough to maintain your current cardiovascular fitness.'
    },
    'endurance': {
      title: 'Endurance & Stamina Builder',
      description: 'Progressive cardio training combined with light strength work to build stamina and cardiovascular capacity.',
      schedule: [
        { day: 'Monday', focus: 'Steady-State Run' },
        { day: 'Tuesday', focus: 'Interval Training' },
        { day: 'Wednesday', focus: 'Strength (Legs & Core)' },
        { day: 'Thursday', focus: 'Cycling / Swimming' },
        { day: 'Friday', focus: 'Tempo Run' },
        { day: 'Saturday', focus: 'Long Distance Cardio' },
        { day: 'Sunday', focus: 'Rest / Stretching' }
      ],
      exercises: ['Jumping Jacks', 'Mountain Climbers', 'Squats', 'Plank', 'Lunges', 'Burpees'],
      cardio: 'Build weekly cardio volume gradually - aim for 40-60 minutes of continuous cardio at a conversational pace at least twice a week.'
    }
  },

  exerciseLibrary: {
    'Push-ups': 'A bodyweight chest, shoulder, and triceps exercise performed from a plank position.',
    'Squats': 'A lower-body compound movement that builds strength in the quads, glutes, and hamstrings.',
    'Lunges': 'A unilateral leg exercise that improves balance and builds the quads and glutes.',
    'Plank': 'An isometric core hold that builds stability through the abs, back, and shoulders.',
    'Jumping Jacks': 'A full-body cardio movement that raises heart rate and warms up the whole body.',
    'Mountain Climbers': 'A dynamic core and cardio exercise performed from a plank position.',
    'Burpees': 'A high-intensity full-body movement combining a squat, plank, and jump.',
    'Glute Bridges': 'A hip-hinge exercise that targets the glutes and lower back.',
    'Bicep Curls': 'An isolation exercise for the biceps, performed with dumbbells or a resistance band.',
    'Shoulder Press': 'An overhead pressing movement that builds the shoulders and triceps.'
  },

  nutritionAdvice: {
    'lose-weight': {
      summary: 'Focus on a moderate calorie deficit with high protein intake to preserve muscle while losing fat.',
      tips: [
        'Prioritize lean proteins (chicken, fish, tofu, legumes) at every meal.',
        'Fill half your plate with non-starchy vegetables to stay full on fewer calories.',
        'Limit sugary drinks and processed snacks.',
        'Drink a glass of water before meals to help control portions.'
      ]
    },
    'gain-muscle': {
      summary: 'Eat in a slight calorie surplus with a strong emphasis on protein to fuel muscle growth.',
      tips: [
        'Aim for roughly 1.6-2.2g of protein per kg of bodyweight per day.',
        'Include complex carbs (rice, oats, potatoes) around workouts for energy.',
        'Do not skip healthy fats (nuts, olive oil, avocado) - they support hormone production.',
        'Eat every 3-4 hours to keep amino acids available for muscle repair.'
      ]
    },
    'maintain': {
      summary: 'Eat at roughly your maintenance calories with a balanced mix of protein, carbs, and fats.',
      tips: [
        'Keep portions consistent and listen to hunger/fullness cues.',
        'Include a variety of whole foods across all food groups.',
        'Allow yourself planned treats in moderation - consistency matters more than perfection.',
        'Stay hydrated and keep alcohol intake moderate.'
      ]
    },
    'endurance': {
      summary: 'Prioritize carbohydrates for glycogen stores along with steady protein for recovery.',
      tips: [
        'Eat a carb-rich meal 2-3 hours before long cardio sessions.',
        'Rehydrate with electrolytes after sessions longer than 60 minutes.',
        'Include iron-rich foods (leafy greens, lean red meat) to support oxygen transport.',
        'Refuel with a protein + carb snack within an hour after long workouts.'
      ]
    }
  },

  motivationalMessages: {
    'lose-weight': [
      'Every workout brings you one step closer to a healthier you - keep going!',
      'Progress, not perfection. Small consistent choices add up to big results.',
      'Your future self will thank you for the effort you put in today.'
    ],
    'gain-muscle': [
      'Strength is built rep by rep - trust the process.',
      'Fuel your body, train with intent, and the gains will follow.',
      'Discipline today builds the physique of tomorrow.'
    ],
    'maintain': [
      'Consistency is the secret - you are doing great by showing up.',
      'Maintaining your health is just as much a win as building it.',
      'A balanced lifestyle is a sustainable lifestyle. Keep it steady!'
    ],
    'endurance': [
      'Endurance is built one mile, one minute, one rep at a time.',
      'Your stamina today is stronger than it was yesterday.',
      'Push through the discomfort - that is where growth happens.'
    ]
  }
};
