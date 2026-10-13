/*! ==========================================================================
   Axis Motion Identity - Runtime JS
   Handles motion interactions, replay sequences, and state transitions
   ========================================================================== */

(function () {
  'use strict';

  // 1. Accessibility: check user preference for reduced motion
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  // 2. Safe DOM selector utility functions
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // 3. Axis core runtime object attached to window
  var Axis = window.Axis = {
    /**
     * Check if user prefers reduced motion
     * @returns {boolean}
     */
    reduced: function () { 
      return mq.matches; 
    },

    /**
     * Main initialization function
     * @param {HTMLElement|Document} root
     */
    init: function (root) {
      root = root || document;

      /* a) Reveal elements on scroll into viewport */
      var els = $$(".ax-reveal", root);
      if (!("IntersectionObserver" in window) || mq.matches) {
        els.forEach(function (e) { e.classList.add("is-in"); });
      } else {
        var io = new IntersectionObserver(function (list) {
          list.forEach(function (x) {
            if (x.isIntersecting) {
              x.target.classList.add("is-in");
              io.unobserve(x.target);
            }
          });
        }, { threshold: 0.25 });

        els.forEach(function (e) { io.observe(e); });
      }

      /* b) Remove clip-path mask after cut animation completes */
      var rootEl = (root === document ? document : root);
      rootEl.addEventListener("animationend", function (e) {
        if (e.animationName === "ax-cut" && e.target && e.target.classList && e.target.classList.contains("ax-cut")) {
          e.target.classList.add("is-done");
        }
      });

      /* c) Button click active feedback */
      rootEl.addEventListener("click", function (e) {
        var b = e.target && e.target.closest && e.target.closest(".ax-btn, .ax-fire");
        if (!b || mq.matches) return;

        b.classList.remove("is-fired");
        void b.offsetWidth;
        b.classList.add("is-fired");
      });
    },

    /**
     * Replay animation sequence for a given element and its children
     * @param {HTMLElement} el
     */
    replay: function (el) {
      if (!el) return;
      var all = [el].concat($$("*", el));

      // 1. Reset animation classes and states
      all.forEach(function (n) {
        n.classList.remove("is-done", "is-fired", "is-play", "is-running");
        if (n.classList.contains("ax-reveal")) n.classList.remove("is-in");
        n.style.animationName = "none";
      });

      // 2. Force browser reflow
      void el.offsetWidth;

      // 3. Restart animations from initial frame
      all.forEach(function (n) {
        n.style.animationName = "";
        if (n.classList.contains("ax-reveal")) {
          requestAnimationFrame(function () {
            n.classList.add("is-in");
          });
        }
      });
    },

    /**
     * Page transition animation using angled sliding planes
     * @param {Function} fn
     */
    go: function (fn) {
      if (typeof fn !== "function") return;
      if (mq.matches) {
        document.body.classList.add("ax-fading");
        setTimeout(function () {
          fn();
          document.body.classList.remove("ax-fading");
        }, 160);
        return;
      }

      var p = document.querySelector(".ax-planes");
      if (!p || p.classList.contains("is-go")) return;

      p.classList.add("is-go");
      setTimeout(fn, 640);

      var planeB = p.querySelector(".b");
      if (planeB) {
        planeB.addEventListener("animationend", function () {
          p.classList.remove("is-go");
        }, { once: true });
      }
    }
  };

  /* --------------------------------------------------------------------------
     4. Component Interactions and Event Handlers
     -------------------------------------------------------------------------- */
  function initInteractions() {
    /* Replay triggers via [data-replay] attribute */
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest && e.target.closest('[data-replay]');
      if (b && b.dataset && b.dataset.replay) {
        var targetEl = $(b.dataset.replay);
        if (targetEl) setTimeout(function () { Axis.replay(targetEl); }, 0);
      }
    });

    /* Replay hero intro button */
    var replayHero = $('#replayHero');
    if (replayHero) {
      replayHero.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(function () {
          var heroEl = $('#hero');
          if (heroEl) Axis.replay(heroEl);
        }, 60);
      });
    }

    /* Fold effect: interactive slash state toggle on link buttons */
    var linkButtons = $$('.cta .ax-btn, .links-stack .ax-btn');
    linkButtons.forEach(function (btn) {
      var slash = btn.querySelector('.ax-slash');
      var state = btn.querySelector('.btn-state');

      // Toggle slash angle between '/' and '\' on user click
      btn.addEventListener('click', function () {
        if (slash) {
          var isBack = slash.classList.toggle('is-back');
          if (state) state.textContent = isBack ? '\\' : '/';
        }
      });
    });

    /* Standalone fold move demo if present */
    var fs = $('#foldSlash'), fst = $('#foldState'), fb = $('#foldBtn');
    if (fb && fs) {
      fb.addEventListener('click', function () {
        var on = fs.classList.toggle('is-back');
        if (fst) fst.innerHTML = on ? 'Committed&nbsp;·&nbsp;\\' : 'Rest&nbsp;·&nbsp;/';
      });
    }

    /* Toggle switch component if present */
    var tg = $('#tg'), tl = $('#tgLabel');
    if (tg) {
      tg.addEventListener('click', function () {
        var on = tg.getAttribute('aria-checked') !== 'true';
        tg.setAttribute('aria-checked', on);
        if (tl) tl.textContent = on ? 'On · \\' : 'Off · /';
      });
    }

    /* Segmented tabs indicator if present */
    var seg = $('#seg');
    if (seg) {
      var ind = seg.querySelector('.ax-ind');
      var tabs = $$('button', seg);
      function place(b) {
        if (!ind || !b) return;
        ind.style.setProperty('--x', b.offsetLeft + 'px');
        ind.style.setProperty('--w', b.offsetWidth + 'px');
      }
      if (tabs.length) place(tabs[0]);
      tabs.forEach(function (b) {
        b.addEventListener('click', function () {
          tabs.forEach(function (t) { t.setAttribute('aria-selected', t === b); });
          place(b);
        });
      });
      window.addEventListener('resize', function () {
        var activeTab = seg.querySelector('[aria-selected=true]');
        if (activeTab) place(activeTab);
      });
    }

    /* Progress bar animation demo if present */
    var pr = $('#prog'), progBtn = $('#progBtn');
    if (progBtn && pr) {
      progBtn.addEventListener('click', function () {
        pr.classList.remove('is-running');
        void pr.offsetWidth;
        if (Axis.reduced()) { pr.style.setProperty('--p', 1); return; }
        pr.classList.add('is-running');
      });
    }

    /* Success checkmark trigger if present */
    var ck = $('.ax-check'), chkBtn = $('#chkBtn');
    if (chkBtn && ck) {
      chkBtn.addEventListener('click', function () {
        ck.classList.remove('is-play');
        void ck.getBoundingClientRect();
        ck.classList.add('is-play');
      });
    }

    /* Fullscreen overlay menu sheet if present */
    var sh = $('#sheet'), menuOpen = $('#menuOpen'), menuOpen2 = $('#menuOpen2'), menuClose = $('#menuClose');
    if (sh) {
      var lastFocus;
      function openMenu() {
        lastFocus = document.activeElement;
        sh.classList.remove('is-closing');
        sh.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (menuClose) setTimeout(function () { menuClose.focus(); }, Axis.reduced() ? 0 : 500);
      }
      function closeMenu() {
        document.body.style.overflow = '';
        if (Axis.reduced()) {
          sh.classList.remove('is-open');
          if (lastFocus) lastFocus.focus();
          return;
        }
        sh.classList.remove('is-open');
        sh.classList.add('is-closing');
        sh.addEventListener('animationend', function () {
          sh.classList.remove('is-closing');
        }, { once: true });
        if (lastFocus) lastFocus.focus();
      }

      if (menuOpen) menuOpen.addEventListener('click', openMenu);
      if (menuOpen2) menuOpen2.addEventListener('click', openMenu);
      if (menuClose) menuClose.addEventListener('click', closeMenu);

      $$('nav a', sh).forEach(function (a) { a.addEventListener('click', closeMenu); });
      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sh.classList.contains('is-open')) closeMenu();
      });
    }

    /* Page transition demo if present */
    var v1 = $('#v1'), v2 = $('#v2'), vn = $('#vName'), goBtn = $('#goBtn');
    if (goBtn && v1 && v2) {
      goBtn.addEventListener('click', function () {
        Axis.go(function () {
          var a = !v1.hidden;
          v1.hidden = a;
          v2.hidden = !a;
          if (vn) vn.textContent = 'modther.com / ' + (a ? 'about' : 'work');
          Axis.replay(a ? v2 : v1);
        });
      });
    }
  }

  // 5. Auto-initialize runtime and protection when DOM is ready
  function initProtection() {
    if (window.Axis) Object.freeze(window.Axis);

    // Disable context menu
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    // Disable developer tools and source view shortcuts
    document.addEventListener("keydown", function (e) {
      var isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      var cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (
        e.key === "F12" ||
        (cmdOrCtrl && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (cmdOrCtrl && (e.key === "U" || e.key === "u")) ||
        (cmdOrCtrl && (e.key === "S" || e.key === "s"))
      ) {
        e.preventDefault();
      }
    });
  }

  function boot() {
    Axis.init();
    initInteractions();
    initProtection();
  }

  if (document.readyState !== "loading") {
    boot();
  } else {
    document.addEventListener("DOMContentLoaded", boot);
  }
})();
