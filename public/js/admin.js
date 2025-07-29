// JavaScript za administratorsko sučelje Tejo Nails

document.addEventListener("DOMContentLoaded", function () {
  // Inicijalizacija navigacije
  initNavigation();

  // Inicijalizacija mock grafikona (može se zamijeniti pravim grafikonima)
  initMockCharts();

  // Inicijalizacija modala ako postoje
  initModals();

  // Inicijalizacija dropdowna za korisnika
  initUserDropdown();

  // Inicijalizacija notifikacija
  initNotifications();
});

/**
 * Inicijalizacija navigacije
 */
function initNavigation() {
  const navLinks = document.querySelectorAll(".admin-nav a");
  const contentSections = document.querySelectorAll(".admin-content");

  // Sakrij sve sekcije osim one koja je aktivna
  contentSections.forEach((section) => {
    if (section.id !== "dashboard") {
      section.style.display = "none";
    }
  });

  // Postavi event listenere za navigaciju
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Ukloni aktivnu klasu sa svih linkova
      navLinks.forEach((navLink) => navLink.classList.remove("active"));

      // Dodaj aktivnu klasu na kliknuti link
      this.classList.add("active");

      // Dohvati ID sekcije koju treba prikazati
      const targetId = this.getAttribute("href").substring(1); // Ukloni #

      // Sakrij sve sekcije
      contentSections.forEach((section) => {
        section.style.display = "none";
      });

      // Prikaži ciljanu sekciju
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = "block";
      }
    });
  });
}

/**
 * Inicijalizacija mock grafikona
 */
function initMockCharts() {
  const chartPlaceholders = document.querySelectorAll(".chart-placeholder");

  chartPlaceholders.forEach((placeholder) => {
    // Ovdje se može inicijalizirati pravi grafikon (Chart.js, ApexCharts itd.)
    // Za sada samo postavljamo vizualni placeholder

    const canvas = document.createElement("canvas");
    canvas.width = placeholder.offsetWidth;
    canvas.height = placeholder.offsetHeight;
    const ctx = canvas.getContext("2d");

    // Crtaj jednostavni mock grafikon
    ctx.strokeStyle = "#ff6b81";
    ctx.lineWidth = 3;
    ctx.beginPath();

    // Počni od donjeg lijevog kuta
    ctx.moveTo(0, canvas.height - 50);

    // Nasumične točke za linijski grafikon
    const points = 12;
    const step = canvas.width / points;

    for (let i = 1; i <= points; i++) {
      const x = i * step;
      const height = Math.random() * (canvas.height - 100) + 50;
      const y = canvas.height - height;

      ctx.lineTo(x, y);
    }

    ctx.stroke();

    // Isprazni trenutni sadržaj placeholdera
    placeholder.innerHTML = "";
    placeholder.appendChild(canvas);
  });
}

/**
 * Inicijalizacija modala
 */
function initModals() {
  const modalTriggers = document.querySelectorAll("[data-modal]");
  const closeButtons = document.querySelectorAll(".modal-close");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal");
      const modal = document.getElementById(modalId);

      if (modal) {
        modal.classList.add("active");
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (modal) {
        modal.classList.remove("active");
      }
    });
  });

  // Zatvori modal klikom izvan sadržaja
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal") &&
      e.target.classList.contains("active")
    ) {
      e.target.classList.remove("active");
    }
  });
}

/**
 * Inicijalizacija korisničkog dropdowna
 */
function initUserDropdown() {
  const profileButton = document.querySelector(".admin-profile");

  if (profileButton) {
    const dropdown = document.createElement("div");
    dropdown.className = "user-dropdown";
    dropdown.innerHTML = `
      <ul>
        <li><a href="#profile"><i class="material-icons">person</i> Moj profil</a></li>
        <li><a href="#settings"><i class="material-icons">settings</i> Postavke</a></li>
        <li><a href="/logout"><i class="material-icons">exit_to_app</i> Odjava</a></li>
      </ul>
    `;

    dropdown.style.display = "none";
    profileButton.appendChild(dropdown);

    profileButton.addEventListener("click", function (e) {
      e.stopPropagation();
      const isVisible = dropdown.style.display === "block";
      dropdown.style.display = isVisible ? "none" : "block";
    });

    // Zatvori dropdown klikom izvan
    document.addEventListener("click", function () {
      dropdown.style.display = "none";
    });
  }
}

/**
 * Inicijalizacija notifikacija
 */
function initNotifications() {
  const notificationButton = document.querySelector(".admin-notifications");

  if (notificationButton) {
    const notificationsDropdown = document.createElement("div");
    notificationsDropdown.className = "notifications-dropdown";
    notificationsDropdown.innerHTML = `
      <div class="notifications-header">
        <h4>Obavijesti</h4>
        <a href="#" class="mark-all-read">Označi sve kao pročitano</a>
      </div>
      <ul class="notifications-list">
        <li class="notification-item unread">
          <div class="notification-icon"><i class="material-icons">event</i></div>
          <div class="notification-content">
            <p>Nova rezervacija: <strong>Ana Petrović</strong></p>
            <span class="notification-time">Prije 10 minuta</span>
          </div>
        </li>
        <li class="notification-item unread">
          <div class="notification-icon"><i class="material-icons">shopping_cart</i></div>
          <div class="notification-content">
            <p>Nova narudžba: <strong>#1024</strong></p>
            <span class="notification-time">Prije 25 minuta</span>
          </div>
        </li>
        <li class="notification-item">
          <div class="notification-icon"><i class="material-icons">star</i></div>
          <div class="notification-content">
            <p>Nova recenzija: <strong>4.8/5</strong></p>
            <span class="notification-time">Prije 2 sata</span>
          </div>
        </li>
      </ul>
      <div class="notifications-footer">
        <a href="#notifications">Prikaži sve obavijesti</a>
      </div>
    `;

    notificationsDropdown.style.display = "none";
    notificationButton.appendChild(notificationsDropdown);

    notificationButton.addEventListener("click", function (e) {
      e.stopPropagation();
      const isVisible = notificationsDropdown.style.display === "block";
      notificationsDropdown.style.display = isVisible ? "none" : "block";
    });

    // Zatvori dropdown klikom izvan
    document.addEventListener("click", function () {
      notificationsDropdown.style.display = "none";
    });

    // Označi sve kao pročitano
    const markAllRead = notificationsDropdown.querySelector(".mark-all-read");
    if (markAllRead) {
      markAllRead.addEventListener("click", function (e) {
        e.preventDefault();
        const unreadItems = notificationsDropdown.querySelectorAll(
          ".notification-item.unread",
        );
        unreadItems.forEach((item) => {
          item.classList.remove("unread");
        });

        // Ažuriraj badge
        const badge = notificationButton.querySelector(".notification-badge");
        if (badge) {
          badge.textContent = "0";
        }
      });
    }
  }
}
