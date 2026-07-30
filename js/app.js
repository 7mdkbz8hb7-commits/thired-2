// Shared bootstrap: auth/profile localStorage helpers, nav rendering, and the
// page router. Loaded on almost every page, after data/bmi/recommendation and
// any page-specific script, before logo.js.

// ---------- Auth / session helpers ----------

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function getProfileStorageKey(email) {
  return 'fitnessProfile:' + normalizeEmail(email);
}

function getLegacyProfileStorageKey(email) {
  return normalizeEmail(email);
}

function getCurrentUser() {
  try {
    var raw = localStorage.getItem('fitnessCurrentUser');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function persistCurrentUser(user) {
  localStorage.setItem('fitnessCurrentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('fitnessCurrentUser');
}

function getRegisteredUser() {
  try {
    var raw = localStorage.getItem('fitnessRegisteredUser');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// ---------- Profile persistence (three keys kept in sync, see CLAUDE.md) ----------

function saveProfile(userData) {
  var user = getCurrentUser();
  var email = (user && user.email) || userData.email || 'guest';
  var bmi = calculateBMI(userData.weightKg, userData.heightCm);
  var bmiCategory = getBMICategory(bmi);

  var profile = {
    fullName: userData.fullName || (user && user.fullName) || '',
    email: email,
    heightCm: userData.heightCm,
    weightKg: userData.weightKg,
    age: userData.age,
    gender: userData.gender,
    goal: userData.goal,
    activityLevel: userData.activityLevel,
    bmi: bmi,
    bmiCategory: bmiCategory,
    updatedAt: new Date().toISOString()
  };

  var json = JSON.stringify(profile);
  localStorage.setItem(getProfileStorageKey(email), json);
  localStorage.setItem(getLegacyProfileStorageKey(email), json);
  localStorage.setItem('fitnessUserData', json);

  return profile;
}

function getStoredProfile() {
  var user = getCurrentUser();
  var email = user && user.email;

  if (email) {
    try {
      var raw = localStorage.getItem(getProfileStorageKey(email));
      if (raw) return JSON.parse(raw);
      var legacyRaw = localStorage.getItem(getLegacyProfileStorageKey(email));
      if (legacyRaw) return JSON.parse(legacyRaw);
    } catch (e) {}
  }

  try {
    var fallbackRaw = localStorage.getItem('fitnessUserData');
    if (fallbackRaw) return JSON.parse(fallbackRaw);
  } catch (e) {}

  return null;
}

function getProfileData() {
  var profile = getStoredProfile();
  if (!profile) {
    window.location.href = 'index.html?mode=profile-setup';
    return null;
  }
  return profile;
}

// ---------- Nav rendering (top-nav badge + hamburger + active link) ----------

function getInitials(fullName) {
  if (!fullName) return '?';
  var parts = fullName.trim().split(/\s+/);
  var initials = parts[0].charAt(0);
  if (parts.length > 1) initials += parts[parts.length - 1].charAt(0);
  return initials.toUpperCase();
}

function renderNavBadge() {
  var badge = document.getElementById('nav-user-badge');
  if (!badge) return;
  var user = getCurrentUser();
  if (!user) {
    badge.innerHTML = '<a href="login.html" class="btn btn-outline btn-sm">Log In</a>';
    return;
  }
  badge.innerHTML =
    '<span class="nav-avatar">' + getInitials(user.fullName) + '</span>' +
    '<span class="nav-username">' + user.fullName + '</span>' +
    '<button type="button" class="nav-logout" id="nav-logout-btn" title="Log out">⎋</button>';

  var logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      clearCurrentUser();
      window.location.href = 'login.html';
    });
  }
}

function wireNavToggle() {
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
}

function highlightActiveNavLink() {
  var page = document.body.getAttribute('data-page');
  if (!page) return;
  var links = document.querySelectorAll('.top-nav a[href], .bottom-nav a[href]');
  links.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.indexOf(page + '.html') === 0) {
      link.classList.add('active');
    }
  });
}

// ---------- Page init functions ----------

function readFormUserData(form) {
  return {
    fullName: form.fullName ? form.fullName.value.trim() : '',
    heightCm: parseFloat(form.height.value),
    weightKg: parseFloat(form.weight.value),
    age: parseInt(form.age.value, 10),
    gender: form.gender.value,
    goal: form.goal.value,
    activityLevel: form.activityLevel.value
  };
}

function initFormPage() {
  var form = document.getElementById('fitness-form');
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var isProfileSetup = params.get('mode') === 'profile-setup';
  var titleEl = document.getElementById('form-title');
  if (isProfileSetup && titleEl) {
    titleEl.textContent = 'Complete Your Fitness Profile';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var userData = readFormUserData(form);

    var user = getCurrentUser();
    if (!user) {
      // Not logged in: per the app's flow, the form data is not saved here.
      // The user must log in / register, then fill the form again.
      window.location.href = 'login.html';
      return;
    }

    saveProfile(userData);
    window.location.href = 'result.html';
  });
}

function initLoginPage() {
  var loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  var createAccountBtn = document.getElementById('show-register-btn');
  var registerSection = document.getElementById('inline-register-section');
  if (createAccountBtn && registerSection) {
    createAccountBtn.addEventListener('click', function () {
      registerSection.classList.toggle('hidden');
    });
  }

  var loginError = document.getElementById('login-error');
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = loginForm.email.value.trim();
    var password = loginForm.password.value;
    var registered = getRegisteredUser();

    if (!registered || normalizeEmail(registered.email) !== normalizeEmail(email) || registered.password !== password) {
      if (loginError) {
        loginError.textContent = 'Invalid email or password.';
        loginError.classList.remove('hidden');
      }
      return;
    }

    persistCurrentUser({ fullName: registered.fullName, email: registered.email });
    var profile = getStoredProfile();
    window.location.href = profile ? 'profile.html' : 'index.html?mode=profile-setup';
  });

  var inlineRegisterForm = document.getElementById('inline-register-form');
  if (inlineRegisterForm) {
    inlineRegisterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleRegisterSubmit(inlineRegisterForm);
    });
  }
}

function handleRegisterSubmit(form) {
  var fullName = form.fullName.value.trim();
  var email = form.email.value.trim();
  var password = form.password.value;

  var user = { fullName: fullName, email: email, password: password };
  localStorage.setItem('fitnessRegisteredUser', JSON.stringify(user));
  persistCurrentUser({ fullName: fullName, email: email });
  window.location.href = 'index.html?mode=profile-setup';
}

function initRegisterPage() {
  var form = document.getElementById('register-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleRegisterSubmit(form);
  });
}

function initHomePage() {
  var hero = document.getElementById('home-hero-name');
  if (!hero) return;
  var user = getCurrentUser();
  hero.textContent = user ? user.fullName : 'there';
}

function initProfilePage() {
  var nameEl = document.getElementById('summary-name');
  if (!nameEl) return;

  var profile = getProfileData();
  if (!profile) return;

  nameEl.textContent = profile.fullName || 'Guest';
  setText('summary-email', profile.email);
  setText('summary-height', profile.heightCm + ' cm');
  setText('summary-weight', profile.weightKg + ' kg');
  setText('summary-age', profile.age + ' yrs');
  setText('summary-gender', capitalize(profile.gender));
  setText('summary-goal', FitnessData.goalLabels[profile.goal] || profile.goal);
  setText('summary-activity', FitnessData.activityLabels[profile.activityLevel] || profile.activityLevel);
  setText('summary-bmi', profile.bmi);
  setText('summary-bmi-category', profile.bmiCategory);
}

function initResultPage() {
  var bmiValueEl = document.getElementById('bmi-value');
  if (!bmiValueEl) return;

  var profile = getProfileData();
  if (!profile) return;

  var rec = generateRecommendation(profile);

  setText('summary-name-result', profile.fullName);
  setText('bmi-value', rec.bmi);
  setText('bmi-category', rec.bmiCategory);
  setText('workout-title', rec.workoutTitle);
  setText('workout-description', rec.workoutDescription);
  setText('cardio-advice', rec.cardio);
  setText('nutrition-summary', rec.nutrition.summary);
  setText('water-intake', rec.waterIntake + ' L / day');
  setText('motivation-quote', rec.motivation);

  renderList('schedule-list', rec.schedule, function (item) {
    return '<li><span class="day-name">' + item.day + '</span><span class="day-focus">' + item.focus + '</span></li>';
  });

  renderList('exercise-list', rec.exercises, function (name) {
    var desc = FitnessData.exerciseLibrary[name] || '';
    return '<li><strong>' + name + '</strong><span>' + desc + '</span></li>';
  });

  renderList('nutrition-tips', rec.nutrition.tips, function (tip) {
    return '<li>' + tip + '</li>';
  });
}

function initWorkoutInfoPage() {
  var titleEl = document.getElementById('workout-title');
  if (!titleEl) return;
  // Guard: only run the "plan info" render on pages where this hasn't
  // already been populated by initResultPage (different pages, same ID pattern avoided by scope).
  var profile = getProfileData();
  if (!profile) return;

  var rec = generateRecommendation(profile);
  setText('workout-title', rec.workoutTitle);
  setText('workout-description', rec.workoutDescription);
  setText('cardio-advice', rec.cardio);
}

function initNutritionPage() {
  var el = document.getElementById('nutrition-advice');
  if (!el) return;
  var profile = getProfileData();
  if (!profile) return;

  var rec = generateRecommendation(profile);
  setText('nutrition-goal-label', FitnessData.goalLabels[profile.goal] || profile.goal);
  setText('nutrition-advice', rec.nutrition.summary);
  setText('water-intake', rec.waterIntake + ' L / day');
  renderList('nutrition-tips', rec.nutrition.tips, function (tip) {
    return '<li>' + tip + '</li>';
  });
}

function initSchedulePage() {
  var el = document.getElementById('schedule-list');
  if (!el) return;
  var profile = getProfileData();
  if (!profile) return;

  var rec = generateRecommendation(profile);
  setText('schedule-goal-label', FitnessData.goalLabels[profile.goal] || profile.goal);
  setText('schedule-motivation', rec.motivation);
  renderList('schedule-list', rec.schedule, function (item) {
    return '<li><span class="day-name">' + item.day + '</span><span class="day-focus">' + item.focus + '</span></li>';
  });
}

// ---------- Small render helpers ----------

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderList(id, items, renderItem) {
  var el = document.getElementById(id);
  if (!el || !items) return;
  el.innerHTML = items.map(renderItem).join('');
}

// ---------- Router ----------

document.addEventListener('DOMContentLoaded', function () {
  renderNavBadge();
  wireNavToggle();
  highlightActiveNavLink();

  initFormPage();
  initLoginPage();
  initRegisterPage();
  initHomePage();
  initProfilePage();
  initResultPage();
  initWorkoutInfoPage();
  initNutritionPage();
  initSchedulePage();
});
