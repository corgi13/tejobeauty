// Glavni JavaScript za Tejo Nails web stranicu

document.addEventListener("DOMContentLoaded", function () {
  // Mobilna navigacija toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const nav = document.querySelector(".nav ul");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      nav.classList.toggle("active");
    });
  }

  // Inicijalizacija testimonial slidera
  initTestimonialSlider();

  // Smooth scroll za anchor linkove
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

  // Animacije pri scrollanju
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  function checkScroll() {
    animatedElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        el.classList.add("animated");
      }
    });
  }

  // Provjeri inicijalno
  checkScroll();

  // Provjeri pri scrollanju
  window.addEventListener("scroll", checkScroll);
});

/**
 * Inicijalizacija jednostavnog slidera za testimoniale
 */
function initTestimonialSlider() {
  const slider = document.querySelector(".testimonials-slider");
  if (!slider) return;

  const testimonials = slider.querySelectorAll(".testimonial");
  if (testimonials.length <= 1) return;

  let currentIndex = 0;

  // Kreiraj dots navigaciju
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "slider-dots";

  testimonials.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = i === 0 ? "dot active" : "dot";
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  slider.parentNode.appendChild(dotsContainer);

  // Funkcija za promjenu slidea
  function goToSlide(index) {
    if (index < 0) {
      index = testimonials.length - 1;
    } else if (index >= testimonials.length) {
      index = 0;
    }

    const offset = index * testimonials[0].offsetWidth;
    slider.scrollTo({
      left: offset,
      behavior: "smooth",
    });

    // Ažuriraj aktivni dot
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  // Auto-slide
  setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 5000);

  // Zaustavi auto-slide na hover
  slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
  slider.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  });

  // Reagiraj na scroll slidera
  slider.addEventListener("scroll", () => {
    const scrollPosition = slider.scrollLeft;
    const slideWidth = testimonials[0].offsetWidth;
    const newIndex = Math.round(scrollPosition / slideWidth);

    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
  });
}
