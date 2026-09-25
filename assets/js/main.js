/* main.js */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.getElementById("header");
  var navMenu = document.getElementById("nav-menu");
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.querySelectorAll(".nav__link");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  var heroCanvas = document.getElementById("hero-canvas");
  var sections = document.querySelectorAll(".section, .hero");
  var lastActiveElement = null;

  function toggleMenu() {
    if (!navMenu || !navToggle) return;
    var isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));

    var icon = navToggle.querySelector("i");
    if (!icon) return;

    if (isOpen) {
      icon.classList.replace("ri-menu-3-line", "ri-close-line");
      document.body.style.overflow = "hidden";
    } else {
      icon.classList.replace("ri-close-line", "ri-menu-3-line");
      document.body.style.overflow = "";
    }
  }

  if (navToggle) navToggle.addEventListener("click", toggleMenu);

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navMenu && navMenu.classList.contains("open")) toggleMenu();
    });
  });

  var scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        if (header) header.classList.toggle("header--scrolled", window.scrollY > 50);
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;

    var current = "";
    var scrollPos = window.scrollY + 140;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;

    if (atBottom) {
      var lastSection = sections[sections.length - 1];
      if (lastSection) current = lastSection.getAttribute("id") || "";
    } else {
      sections.forEach(function (section) {
        var top = section.getBoundingClientRect().top + window.scrollY;
        var height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = section.getAttribute("id") || "";
        }
      });
    }

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (current && link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  var revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add("revealed"); });
  }

  var statNumbers = document.querySelectorAll(".hero__stat-number[data-target]");

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    var suffix = el.dataset.suffix || "";
    var duration = 1800;
    var startTime = null;
    var useK = target >= 1000;
    var displayTarget = useK ? target / 1000 : target;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * displayTarget);

      el.textContent = (useK ? current + "k" : current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (useK ? displayTarget + "k" : target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      statNumbers.forEach(function (el) { counterObserver.observe(el); });
      statNumbers.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight) {
          animateCounter(el);
          counterObserver.unobserve(el);
        }
      });
    } else {
      statNumbers.forEach(function (el) {
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || "";
        if (!isNaN(target)) {
          el.textContent = (target >= 1000 ? target / 1000 + "k" : target) + suffix;
        }
      });
    }
  }

  var projectCards = document.querySelectorAll("[data-lightbox]");

  function openLightbox(src, altText, triggerEl) {
    if (!lightbox || !lightboxImg || !lightboxClose) return;
    lastActiveElement = triggerEl || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = altText || "Project preview";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    if (!navMenu || !navMenu.classList.contains("open")) {
      document.body.style.overflow = "";
    }
    lightboxImg.src = "";
    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  projectCards.forEach(function (card) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "View larger image");

    var trigger = function () {
      var src = card.dataset.lightbox;
      var img = card.querySelector("img");
      var alt = img ? img.getAttribute("alt") : "";
      if (src) openLightbox(src, alt, card);
    };

    card.addEventListener("click", trigger);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && lightbox.classList.contains("open")) {
        e.preventDefault();
        if (lightboxClose) lightboxClose.focus();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });

  if (heroCanvas && !prefersReducedMotion) {
    var ctx = heroCanvas.getContext("2d");
    var parent = heroCanvas.parentElement;
    var particles = [];
    var particleCount = window.innerWidth < 768 ? 25 : 55;
    var connectionDistance = window.innerWidth < 768 ? 100 : 130;
    var mouse = { x: null, y: null };
    var animFrameId = null;
    var canvasRunning = false;
    var cachedRect = null;
    var resizeTimer = null;

    function resizeCanvas() {
      if (!parent) return;
      var dpr = window.devicePixelRatio || 1;
      var w = parent.offsetWidth;
      var h = parent.offsetHeight;
      heroCanvas.width = w * dpr;
      heroCanvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      cachedRect = heroCanvas.getBoundingClientRect();
    }

    function createParticles() {
      particles = [];
      var w = parent ? parent.offsetWidth : 800;
      var h = parent ? parent.offsetHeight : 600;
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    }

    function drawParticles() {
      if (!parent) return;
      var w = parent.offsetWidth;
      var h = parent.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232, 67, 147, 0.35)";
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            var opacity = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(108, 92, 231, " + opacity + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        if (mouse.x !== null) {
          var mdx = p.x - mouse.x;
          var mdy = p.y - mouse.y;
          var mDist = Math.hypot(mdx, mdy);
          if (mDist < 160) {
            var mOpacity = (1 - mDist / 160) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = "rgba(232, 67, 147, " + mOpacity + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(drawParticles);
    }

    function startCanvas() {
      if (!canvasRunning) {
        canvasRunning = true;
        if (particles.length === 0) {
          resizeCanvas();
          createParticles();
        }
        drawParticles();
      }
    }

    function stopCanvas() {
      if (canvasRunning) {
        canvasRunning = false;
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      }
    }

    if (parent && "IntersectionObserver" in window) {
      var canvasObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          startCanvas();
        } else {
          stopCanvas();
        }
      }, { threshold: 0.1 });
      canvasObserver.observe(parent);
    } else {
      startCanvas();
    }

    if (parent) {
      parent.addEventListener("mousemove", function (e) {
        if (!cachedRect) cachedRect = heroCanvas.getBoundingClientRect();
        mouse.x = e.clientX - cachedRect.left;
        mouse.y = e.clientY - cachedRect.top;
      });

      parent.addEventListener("mouseleave", function () {
        mouse.x = null;
        mouse.y = null;
      });
    }

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        particleCount = window.innerWidth < 768 ? 25 : 55;
        connectionDistance = window.innerWidth < 768 ? 100 : 130;
        resizeCanvas();
        createParticles();
      }, 150);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      if (this.classList.contains("skip-link")) return;

      var targetEl = null;
      try {
        targetEl = document.querySelector(targetId);
      } catch (_) {
        targetEl = document.getElementById(targetId.slice(1));
      }

      if (targetEl) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: "smooth"
        });
      }
    });
  });

  var copyYear = document.querySelector(".footer__copy-year");
  if (copyYear) copyYear.textContent = new Date().getFullYear();

  updateActiveNav();
})();
