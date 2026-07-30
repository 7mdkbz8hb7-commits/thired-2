// Injects a fixed-position app logo/link into every page at runtime.
// Included last on every page.
(function () {
  var target = document.body.getAttribute('data-page') === 'index' ||
    document.body.getAttribute('data-page') === 'login' ||
    document.body.getAttribute('data-page') === 'register'
    ? 'index.html'
    : 'home.html';

  var html =
    '<a href="' + target + '" class="app-logo-badge" aria-label="Fitness Insights home">' +
      '<img src="logo.svg" alt="Fitness Insights logo">' +
    '</a>';

  document.body.insertAdjacentHTML('beforeend', html);
})();
