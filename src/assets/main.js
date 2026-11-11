/* ==========================================================================
   ITmedicus — behaviour
   Progressive enhancement only: every page works without this file.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------- header state */

  var header = document.getElementById('site-header');
  var progress = document.querySelector('.scroll-progress span');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 8);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.width = (pct * 100).toFixed(2) + '%';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* -------------------------------------------------------- mobile drawer */

  var menuToggle = document.querySelector('.menu-toggle');
  var drawer = document.getElementById('mobile-nav');
  var closeBtn = document.querySelector('.menu-close');
  var lastFocus = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.classList.add('is-locked');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    var first = drawer.querySelector('a, button');
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    document.body.classList.remove('is-locked');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
    if (lastFocus && lastFocus !== document.body) lastFocus = null;
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (drawer && drawer.hidden) openDrawer();
      else closeDrawer();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawer && !drawer.hidden) closeDrawer();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && drawer && !drawer.hidden) closeDrawer();
  });

  /* --------------------------------------------------------- reveal on view */

  var revealItems = document.querySelectorAll('.reveal');

  if (revealItems.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) {
        el.classList.add('is-in');
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      revealItems.forEach(function (el) {
        io.observe(el);
      });
    }
  }

  /* ------------------------------------------------------- product filters */

  var filterBar = document.querySelector('[data-filter-bar]');
  var productList = document.querySelector('[data-product-list]');

  if (filterBar && productList) {
    var filterButtons = filterBar.querySelectorAll('.filter-btn');
    var cards = productList.querySelectorAll('.product-card');
    var countEl = document.querySelector('[data-filter-count]');

    function applyFilter(value) {
      var shown = 0;
      cards.forEach(function (card) {
        var audiences = (card.getAttribute('data-audiences') || '').split(/\s+/);
        var match = value === 'all' || audiences.indexOf(value) !== -1;
        card.hidden = !match;
        if (match) {
          shown += 1;
          // Re-play the entrance animation for cards that come back into view.
          card.classList.add('is-in');
        }
      });
      if (countEl) {
        countEl.textContent = shown + (shown === 1 ? ' product' : ' products');
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        applyFilter(btn.getAttribute('data-filter'));
      });
    });

    applyFilter('all');
  }

  /* ------------------------------------------------------------- contact form */

  /*
   * Set FORM_ENDPOINT to a URL that accepts a POST (Formspree, a serverless
   * function, your own API) and the form submits normally with fetch.
   * Left empty, the form validates and then hands the message to the user's
   * email client as a pre-filled mailto — nothing is silently dropped.
   */
  var FORM_ENDPOINT = '';

  var form = document.querySelector('[data-contact-form]');

  if (form) {
    var status = form.querySelector('[data-form-status]');
    var submitBtn = form.querySelector('[type="submit"]');

    var showStatus = function (kind, message) {
      if (!status) return;
      status.className = 'form-status form-status--' + kind + ' is-visible';
      status.innerHTML =
        (kind === 'ok'
          ? '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.5l5 5L20 7"/></svg>'
          : '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.2h.01"/></svg>') +
        '<span>' +
        message +
        '</span>';
      status.setAttribute('role', 'status');
      status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    };

    // Links such as /contact/?type=Partnership preselect the enquiry type.
    var typeSelect = form.querySelector('#enquiryType');
    if (typeSelect) {
      var wanted = new URLSearchParams(window.location.search).get('type');
      if (wanted) {
        var match = Array.prototype.find.call(typeSelect.options, function (option) {
          return option.value.toLowerCase() === wanted.toLowerCase();
        });
        if (match) typeSelect.value = match.value;
      }
    }

    var setError = function (field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      field.setAttribute('aria-invalid', 'true');
      var err = wrap.querySelector('.field-error');
      if (err && message) err.textContent = message;
    };

    var clearError = function (field) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.remove('has-error');
      field.removeAttribute('aria-invalid');
    };

    form.querySelectorAll('.input, .select, .textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        clearError(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) status.className = 'form-status';

      var invalid = [];
      var required = form.querySelectorAll('[required]');

      required.forEach(function (field) {
        var value = field.type === 'checkbox' ? field.checked : field.value.trim();
        clearError(field);

        if (!value) {
          setError(field, field.type === 'checkbox' ? 'Please accept the privacy notice to continue.' : 'This field is required.');
          invalid.push(field);
          return;
        }

        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim())) {
          setError(field, 'Please enter a valid email address, for example name@company.com.');
          invalid.push(field);
        }
      });

      if (invalid.length) {
        showStatus('err', 'Please check the highlighted fields and try again.');
        invalid[0].focus();
        return;
      }

      var data = new FormData(form);
      var name = (data.get('name') || '').toString();
      var email = (data.get('email') || '').toString();
      var org = (data.get('organisation') || '').toString();
      var phone = (data.get('phone') || '').toString();
      var type = (data.get('enquiryType') || '').toString();
      var subject = (data.get('subject') || '').toString();
      var message = (data.get('message') || '').toString();

      if (FORM_ENDPOINT) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            form.reset();
            showStatus('ok', 'Thank you — your message has reached us. Our team will reply to ' + email + '.');
          })
          .catch(function () {
            showStatus('err', 'Something went wrong while sending. Please email us directly at info@itmedicus.com.');
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
          });
        return;
      }

      var body = [
        'Name: ' + name,
        'Work email: ' + email,
        'Organisation / designation: ' + (org || '—'),
        'Phone: ' + (phone || '—'),
        'Enquiry type: ' + (type || '—'),
        '',
        message,
      ].join('\n');

      var href =
        'mailto:info@itmedicus.com?subject=' +
        encodeURIComponent(subject || 'Website enquiry — ' + (type || 'General')) +
        '&body=' +
        encodeURIComponent(body);

      window.location.href = href;

      showStatus(
        'ok',
        'Thank you, ' +
          (name.split(' ')[0] || 'there') +
          '. Your email application is opening with the message ready to send. If nothing happens, write to <a href="mailto:info@itmedicus.com">info@itmedicus.com</a> directly.'
      );
    });
  }

  /* --------------------------------------------------------- count-up stats */

  var counters = document.querySelectorAll('[data-count]');

  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (!isFinite(target) || target <= 0) return;

      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 850;
      var started = null;

      var frame = function (ts) {
        if (started === null) started = ts;
        var p = Math.min(1, (ts - started) / duration);
        // easeOutCubic: fast start, soft landing on the final value
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) window.requestAnimationFrame(frame);
        else el.textContent = target.toFixed(decimals) + suffix;
      };

      window.requestAnimationFrame(frame);
    };

    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (el) {
      if (el.getAttribute('data-count')) countObserver.observe(el);
    });
  }

  /* ------------------------------------------------- card tilt + spotlight */

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover && !reduceMotion) {
    document.querySelectorAll('.product-card-link').forEach(function (card) {
      card.addEventListener(
        'pointermove',
        function (e) {
          var rect = card.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width;
          var py = (e.clientY - rect.top) / rect.height;

          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
          card.style.setProperty('--ry', ((px - 0.5) * 4.4).toFixed(2) + 'deg');
          card.style.setProperty('--rx', ((0.5 - py) * 4.4).toFixed(2) + 'deg');
        },
        { passive: true }
      );

      var reset = function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      };

      card.addEventListener('pointerleave', reset);
      card.addEventListener('blur', reset, true);
    });
  }

  /* ------------------------------------------------------------ misc helpers */

  // Keep the hash target visible after in-page navigation to a service anchor.
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      window.setTimeout(function () {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }, 80);
    }
  }
})();
