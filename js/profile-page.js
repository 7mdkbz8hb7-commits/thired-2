// Drives the view <-> edit toggle and edit-form submit on profile.html.
// Self-initializes independently of app.js's router (see CLAUDE.md's two page-init patterns).

document.addEventListener('DOMContentLoaded', function () {
  var editSection = document.getElementById('profile-edit-section');
  if (!editSection) return; // not on profile.html

  var viewSection = document.getElementById('profile-view');
  var editBtn = document.getElementById('edit-profile-btn');
  var cancelBtn = document.getElementById('cancel-edit-btn');
  var editForm = document.getElementById('profile-edit-form');

  function prefillEditForm() {
    var profile = getStoredProfile();
    if (!profile || !editForm) return;
    editForm.fullName.value = profile.fullName || '';
    editForm.height.value = profile.heightCm || '';
    editForm.weight.value = profile.weightKg || '';
    editForm.age.value = profile.age || '';
    editForm.gender.value = profile.gender || '';
    editForm.goal.value = profile.goal || '';
    editForm.activityLevel.value = profile.activityLevel || '';
  }

  if (editBtn) {
    editBtn.addEventListener('click', function () {
      prefillEditForm();
      viewSection.classList.add('hidden');
      editSection.classList.remove('hidden');
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      editSection.classList.add('hidden');
      viewSection.classList.remove('hidden');
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var userData = readFormUserData(editForm);
      saveProfile(userData);
      initProfilePage();
      editSection.classList.add('hidden');
      viewSection.classList.remove('hidden');
    });
  }
});
