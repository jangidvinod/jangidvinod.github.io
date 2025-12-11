const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navItem = document.querySelectorAll(".nav__item"),
  header = document.getElementById("header");

// open and close menu
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  changeIcon();
});

// close the menu when the user clicks the nav links
navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (navMenu.classList.contains("nav__menu--open")) {
      navMenu.classList.remove("nav__menu--open");
    }
    changeIcon();
  });
});

// Change nav toggle icon
function changeIcon() {
  if (navMenu.classList.contains("nav__menu--open")) {
    navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
  } else {
    navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
  }
}



// header scroll animation
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("header--scroll");
  } else {
    header.classList.remove("header--scroll");
  }
});

// ScrollReveal animations
const sr = ScrollReveal({
  duration: 2000,
  distance: "100px",
  delay: 400,
  reset: false,
});

sr.reveal(".home__content, .about__content");
sr.reveal(".home__img", { origin: "top" });

sr.reveal(
  ".home__info-wrapper, .skills__title, .skills__content, .qualification__name, .qualification__item, .publications__title, .publications__contents, .project__content, .footer__content",
  {
    delay: 500,
    interval: 100,
  }
);

sr.reveal(".experience__footer-text, .contact__content", {
  origin: "left",
});

sr.reveal(".experience__footer .btn, .contact__btn", { origin: "right" });

function openPopup(imageSrc) {
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popup-img");

    popupImg.src = imageSrc;
    popup.style.display = "flex";
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

window.onclick = function(event) {
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popup-img");

    if (event.target === popup) {
        closePopup();
    }
};
