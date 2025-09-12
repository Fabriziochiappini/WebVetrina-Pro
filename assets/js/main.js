document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggleButton = document.querySelector('.nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if (toggleButton && mainNav) {
    toggleButton.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Dynamic year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Contact form -> mailto fallback
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(contactForm);
      var name = (formData.get('name') || '').toString();
      var email = (formData.get('email') || '').toString();
      var phone = (formData.get('phone') || '').toString();
      var message = (formData.get('message') || '').toString();
      var subject = 'Richiesta informazioni dal sito';
      var body = 'Nome: ' + name + '\n' + 'Email: ' + email + '\n' + (phone ? ('Telefono: ' + phone + '\n') : '') + '\n' + 'Messaggio:\n' + message;
      var mailto = 'mailto:info@studioaurora.it?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }
});

