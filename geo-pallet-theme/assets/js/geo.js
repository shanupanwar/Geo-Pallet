/*
 * Geo Pallet theme runtime.
 * Re-implements, without Elementor, only the front-end behaviours the live
 * geopalletltd.com pages use: entrance animations, nav menu dropdowns + burger,
 * counters, animated headlines, Swiper carousels, toggles/FAQ, YouTube
 * background + video widget, scroll opacity / background parallax, sticky
 * containers, posts "load more", share buttons, gallery, scroll-to-top.
 */
(function () {
  'use strict';

  // Approved 2026-11-22: phone layout up to 1024px (see tools/responsive.rb), so phone settings apply there too.
  var MOBILE = 1024, TABLET = 1024;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var settingsOf = function (el) { try { return JSON.parse(el.getAttribute('data-settings') || '{}'); } catch (e) { return {}; } };
  var device = function () { var w = window.innerWidth; return w <= MOBILE ? 'mobile' : (w <= TABLET ? 'tablet' : 'desktop'); };
  var responsive = function (s, key) {
    var d = device();
    if (d === 'mobile' && s[key + '_mobile'] !== undefined && s[key + '_mobile'] !== '') return s[key + '_mobile'];
    if (d !== 'desktop' && s[key + '_tablet'] !== undefined && s[key + '_tablet'] !== '') return s[key + '_tablet'];
    return s[key];
  };
  var size = function (v, d) { return v && v.size !== undefined && v.size !== '' ? Number(v.size) : d; };
  var onView = function (els, cb, opts) {
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); cb(e.target); } });
    }, opts || { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ---------- 1. Entrance animations (.elementor-invisible) ---------- */
  function initAnimations() {
    var els = $$('.elementor-invisible');
    onView(els, function (el) {
      var s = settingsOf(el);
      var name = responsive(s, '_animation') || responsive(s, 'animation');
      var delay = Number(s._animation_delay || s.animation_delay || 0);
      setTimeout(function () {
        el.classList.remove('elementor-invisible');
        if (name && name !== 'none') el.classList.add('animated', name);
      }, delay);
    }, { threshold: 0 });
  }

  /* ---------- 2. Nav menu: hover dropdowns, burger, stretched dropdown ---------- */
  function initNavMenus() {
    $$('.elementor-widget-nav-menu').forEach(function (widget) {
      // desktop horizontal menu: show nested ul on hover/focus
      $$('.elementor-nav-menu--main li.menu-item-has-children', widget).forEach(function (li) {
        var sub = li.querySelector(':scope > ul'), a = li.querySelector(':scope > a');
        if (!sub) return;
        a.classList.add('has-submenu');
        var nested = li.parentElement.classList.contains('sub-menu');
        var show = function () {
          sub.style.display = 'block'; sub.style.position = 'absolute';
          sub.style.top = nested ? '0' : '100%'; sub.style.left = nested ? '100%' : '0';
          sub.style.width = '12em';
          a.classList.add('highlighted'); a.setAttribute('aria-expanded', 'true');
        };
        var hide = function () { sub.style.display = 'none'; a.classList.remove('highlighted'); a.setAttribute('aria-expanded', 'false'); };
        li.addEventListener('mouseenter', show);
        li.addEventListener('mouseleave', hide);
        li.addEventListener('focusin', show);
        li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) hide(); });
        if (a.getAttribute('href') === '#') a.addEventListener('click', function (e) { e.preventDefault(); });
      });

      // burger + dropdown
      var toggle = widget.querySelector('.elementor-menu-toggle');
      var dropdown = widget.querySelector('.elementor-nav-menu--dropdown.elementor-nav-menu__container');
      if (!toggle || !dropdown) return;
      var stretch = function () {
        if (!widget.classList.contains('elementor-nav-menu--stretch')) return;
        dropdown.style.width = window.innerWidth + 'px';
        dropdown.style.left = '0px';
        var left = dropdown.getBoundingClientRect().left;
        dropdown.style.left = (-left) + 'px';
      };
      var set = function (open) {
        toggle.classList.toggle('elementor-active', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        dropdown.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (open) stretch();
      };
      set(false);
      toggle.addEventListener('click', function () { set(!toggle.classList.contains('elementor-active')); });
      toggle.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); } });
      window.addEventListener('resize', function () { if (toggle.classList.contains('elementor-active')) stretch(); });
      $$('li.menu-item-has-children > a', dropdown).forEach(function (a) {
        a.classList.add('has-submenu');
        a.addEventListener('click', function (e) {
          var sub = a.parentElement.querySelector(':scope > ul');
          if (!sub) return;
          var open = sub.style.display === 'block';
          if (a.getAttribute('href') === '#' || !open) e.preventDefault();
          sub.style.display = open ? 'none' : 'block';
          a.classList.toggle('highlighted', !open);
          a.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
      });
      $$('a[href*="#"]:not([href="#"])', dropdown).forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    });
  }

  /* ---------- 3. Active menu item (live site marks the current page) ---------- */
  function markActiveMenu() {
    var here = location.pathname.replace(/\/+$/, '/') ;
    $$('.elementor-nav-menu a.elementor-item, .elementor-nav-menu a.elementor-sub-item').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('#') > -1) return;
      var path;
      try { path = new URL(href, location.href).pathname.replace(/\/+$/, '/'); } catch (e) { return; }
      if (path === here) {
        a.classList.add('elementor-item-active');
        a.setAttribute('aria-current', 'page');
        var li = a.closest('li'); if (li) li.classList.add('current-menu-item', 'current_page_item');
      }
    });
  }

  /* ---------- 4. Counters ---------- */
  function initCounters() {
    onView($$('.elementor-counter-number'), function (el) {
      var from = Number(el.getAttribute('data-from-value') || 0);
      var to = Number(el.getAttribute('data-to-value') || 0);
      var dur = Number(el.getAttribute('data-duration') || 2000);
      var delim = el.getAttribute('data-delimiter');
      var dec = (String(to).split('.')[1] || '').length;
      var fmt = function (n) {
        var str = n.toFixed(dec);
        if (delim) { var p = str.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, delim); str = p.join('.'); }
        return str;
      };
      var t0 = null;
      var step = function (t) {
        if (!t0) t0 = t;
        var k = Math.min((t - t0) / dur, 1);
        el.textContent = fmt(from + (to - from) * k);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- 5. Animated headlines (rotate clip / typing, highlight) ---------- */
  function initHeadlines() {
    $$('.elementor-widget-animated-headline').forEach(function (w) {
      var s = settingsOf(w);
      var head = w.querySelector('.elementor-headline');
      var dyn = w.querySelector('.elementor-headline-dynamic-wrapper');
      if (!head || !dyn) return;
      if (s.headline_style === 'highlight') {
        if (!dyn.querySelector('svg')) {
          var paths = { circle: 'M325,18C228.7-8.3,118.5,8.3,78,21C22.4,38.4,4.6,54.6,5.6,77.6c1.4,32.4,52.2,54,142.6,63.7 c66.2,7.1,212.2,7.5,273.5-8.3c64.4-16.6,104.3-57.6,33.8-98.2C386.7-4.9,179.4-1.4,126.3,20.7' };
          dyn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none"><path d="' + (paths[s.marker] || paths.circle) + '"></path></svg>');
        }
        onView([w], function () { head.classList.add('e-animated'); });
        return;
      }
      var text = dyn.querySelector('.elementor-headline-dynamic-text');
      if (!text) return;
      var full = text.textContent.trim();
      text.textContent = full;
      if (s.animation_type === 'typing') {
        head.classList.add('elementor-headline-letters');
        dyn.classList.add('elementor-headline-dynamic-wrapper');
        var i = 0;
        text.textContent = '';
        var type = function () {
          if (i <= full.length) { text.textContent = full.slice(0, i++); setTimeout(type, 90); }
          else if (s.loop !== '') setTimeout(function () { i = 0; type(); }, Number(s.rotate_iteration_delay || 2500));
        };
        onView([w], type);
      } else { // clip
        dyn.style.display = 'inline-block'; dyn.style.overflow = 'hidden'; dyn.style.verticalAlign = 'top'; dyn.style.whiteSpace = 'nowrap';
        // If the sentence is longer than the screen line, show it wrapped (no one-line reveal).
        var tooLong = function () {
          if (text.scrollWidth <= head.clientWidth) return false;
          dyn.style.whiteSpace = 'normal'; dyn.style.display = 'inline'; dyn.style.width = ''; dyn.style.overflow = 'visible';
          return true;
        };
        if (tooLong()) return;
        window.addEventListener('resize', function () { if (dyn.style.whiteSpace === 'nowrap') tooLong(); });
        var clip = function () {
          // Long words on narrow screens: the one-line "reveal" would run off the screen, so let the
          // text wrap normally there instead (approved responsive fix, 2026-11-22).
          dyn.style.whiteSpace = 'nowrap'; dyn.style.width = '';
          if (text.scrollWidth > head.clientWidth) {
            dyn.style.whiteSpace = 'normal'; dyn.style.display = 'inline'; dyn.style.width = ''; dyn.style.overflow = 'visible';
            return;
          }
          dyn.style.display = 'inline-block'; dyn.style.overflow = 'hidden';
          var target = text.scrollWidth;
          dyn.style.transition = 'none'; dyn.style.width = '2px';
          requestAnimationFrame(function () { requestAnimationFrame(function () {
            dyn.style.transition = 'width .6s'; dyn.style.width = target + 'px';
          }); });
          if (s.loop === 'yes') setTimeout(clip, Number(s.rotate_iteration_delay || 2500) + 600);
        };
        onView([w], clip);
      }
    });
  }

  /* ---------- 6. Swiper carousels (media + testimonial carousel) ---------- */
  function initCarousels() {
    if (typeof window.Swiper !== 'function') return;
    $$('.elementor-widget-media-carousel, .elementor-widget-testimonial-carousel').forEach(function (w) {
      var el = w.querySelector('.swiper, .swiper-container');
      if (!el) return;
      // Elementor flags the column holding a carousel; its CSS changes the column layout.
      if (w.parentElement && w.parentElement.classList.contains('elementor-widget-wrap')) w.parentElement.classList.add('e-swiper-container');
      var s = settingsOf(w);
      var isMedia = w.classList.contains('elementor-widget-media-carousel');
      var spv = function (k, d) { var v = s[k]; return v !== undefined && v !== '' ? Number(v) : d; };
      var desk = spv('slides_per_view', isMedia ? 3 : 1);
      var tab = spv('slides_per_view_tablet', isMedia ? Math.min(desk, 2) : 1);
      var mob = spv('slides_per_view_mobile', 1);
      var gap = function (k) { return size(s[k], size(s.space_between, 10)); };
      var opts = {
        loop: s.loop === 'yes',
        speed: Number(s.speed || 500),
        slidesPerView: mob, spaceBetween: gap('space_between_mobile'),
        breakpoints: {},
        handleElementorBreakpoints: false
      };
      opts.breakpoints[MOBILE + 1] = { slidesPerView: tab, spaceBetween: gap('space_between_tablet') };
      opts.breakpoints[TABLET + 1] = { slidesPerView: desk, spaceBetween: size(s.space_between, 10) };
      if (s.slides_to_scroll) opts.slidesPerGroup = Number(s.slides_to_scroll);
      if (s.effect && s.effect !== 'slide') opts.effect = s.effect;
      if (s.autoplay === 'yes') opts.autoplay = { delay: Number(s.autoplay_speed || 5000), disableOnInteraction: s.pause_on_interaction === 'yes', pauseOnMouseEnter: s.pause_on_hover === 'yes' };
      var pag = w.querySelector('.swiper-pagination');
      if (pag && s.pagination) opts.pagination = { el: pag, type: s.pagination, clickable: true };
      var next = w.querySelector('.elementor-swiper-button-next'), prev = w.querySelector('.elementor-swiper-button-prev');
      if (next && prev) opts.navigation = { nextEl: next, prevEl: prev };
      new window.Swiper(el, opts);
    });
  }

  /* ---------- 7. Toggles (Elementor) and FAQ (UAEL) ---------- */
  function initToggles() {
    $$('.elementor-toggle .elementor-tab-title').forEach(function (t) {
      var content = document.getElementById(t.getAttribute('aria-controls')) || t.nextElementSibling;
      t.addEventListener('click', function () {
        var open = !t.classList.contains('elementor-active');
        t.classList.toggle('elementor-active', open);
        t.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (content) { content.classList.toggle('elementor-active', open); content.style.display = open ? 'block' : 'none'; }
      });
    });
    $$('.uael-faq-container').forEach(function (c) {
      var accordion = c.getAttribute('data-layout') === 'accordion';
      $$('.uael-accordion-title', c).forEach(function (t) {
        var content = t.nextElementSibling;
        var set = function (title, body, open) {
          title.classList.toggle('uael-title-active', open);
          title.setAttribute('aria-expanded', open ? 'true' : 'false');
          if (body) { body.style.display = open ? 'block' : 'none'; body.classList.toggle('uael-faq-content-active', open); }
        };
        t.addEventListener('click', function () {
          var open = !t.classList.contains('uael-title-active');
          if (accordion) $$('.uael-accordion-title', c).forEach(function (o) { if (o !== t) set(o, o.nextElementSibling, false); });
          set(t, content, open);
        });
        t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } });
      });
    });
  }

  /* ---------- 8. YouTube background video + video widget ---------- */
  function ytId(url) { var m = String(url).match(/(?:youtu\.be\/|embed\/|v=)([\w-]{11})/); return m ? m[1] : null; }
  function initVideos() {
    $$('[data-settings*="background_video_link"]').forEach(function (sec) {
      var s = settingsOf(sec);
      var box = sec.querySelector(':scope > .elementor-background-video-container, :scope > * > .elementor-background-video-container') || sec.querySelector('.elementor-background-video-container');
      var id = ytId(s.background_video_link);
      if (!box || !id || device() !== 'desktop' && s.background_play_on_mobile !== 'yes') return;
      var holder = box.querySelector('.elementor-background-video-embed') || box;
      var src = s.background_video_link.indexOf('/embed/') > -1 ? s.background_video_link
        : 'https://www.youtube.com/embed/' + id + '?autoplay=1&mute=1&loop=1&playlist=' + id + '&controls=0&rel=0&playsinline=1';
      if (s.background_video_start) src += (src.indexOf('?') > -1 ? '&' : '?') + 'start=' + s.background_video_start;
      var f = document.createElement('iframe');
      f.className = 'elementor-background-video-embed';
      f.src = src; f.allow = 'autoplay; encrypted-media'; f.setAttribute('frameborder', '0'); f.setAttribute('title', 'Background video');
      holder.replaceWith(f);
      var fit = function () {
        var w = box.offsetWidth, h = box.offsetHeight, r = 16 / 9;
        var fw = w, fh = w / r; if (fh < h) { fh = h; fw = h * r; }
        f.style.width = fw + 'px'; f.style.height = fh + 'px';
      };
      fit(); window.addEventListener('resize', fit);
    });
    $$('.elementor-widget-video').forEach(function (w) {
      var s = settingsOf(w), id = ytId(s.youtube_url), slot = w.querySelector('.elementor-video');
      if (!id || !slot) return;
      var q = ['rel=0', 'controls=' + (s.controls === 'yes' ? 1 : 0)];
      if (s.autoplay === 'yes') q.push('autoplay=1');
      if (s.mute === 'yes') q.push('mute=1');
      var f = document.createElement('iframe');
      f.className = 'elementor-video'; f.src = 'https://www.youtube.com/embed/' + id + '?' + q.join('&');
      f.setAttribute('frameborder', '0'); f.setAttribute('allowfullscreen', ''); f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.title = 'YouTube video player';
      slot.replaceWith(f);
    });
  }

  /* ---------- 9. Scrolling effects (opacity in-out, background vertical parallax) ---------- */
  function initMotion() {
    var items = [];
    $$('[data-settings*="motion_fx_motion_fx_scrolling"]').forEach(function (el) {
      var s = settingsOf(el);
      if (s.motion_fx_motion_fx_scrolling === 'yes' && s.motion_fx_opacity_effect === 'yes') {
        var r = (s.motion_fx_opacity_range && s.motion_fx_opacity_range.sizes) || {};
        items.push({ el: el, type: 'opacity', start: r.start !== undefined ? r.start : 20, end: r.end !== undefined ? r.end : 80,
          level: size(s.motion_fx_opacity_level, 10), dir: s.motion_fx_opacity_direction || 'out-in' });
      }
      if (s.background_motion_fx_motion_fx_scrolling === 'yes' && s.background_motion_fx_translateY_effect !== '') {
        var bg = getComputedStyle(el).backgroundImage;
        if (!bg || bg === 'none') return;
        var speed = size(s.background_motion_fx_translateY_speed, 4);
        var wrap = document.createElement('div'); wrap.className = 'elementor-motion-effects-container';
        var layer = document.createElement('div'); layer.className = 'elementor-motion-effects-layer';
        var cs = getComputedStyle(el);
        layer.style.cssText = 'background-image:' + bg + ';background-size:' + cs.backgroundSize + ';background-position:' + cs.backgroundPosition + ';background-repeat:' + cs.backgroundRepeat + ';height:' + (100 + speed * 10) + '%;width:100%;position:absolute;top:0;left:0;';
        wrap.appendChild(layer);
        el.classList.add('elementor-motion-effects-element-type-background');
        el.style.backgroundImage = 'none';
        el.insertBefore(wrap, el.firstChild);
        items.push({ el: el, type: 'bg', layer: layer, speed: speed });
      }
    });
    if (!items.length) return;
    var tick = function () {
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        var p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1) * 100; // 0 = entering bottom, 100 = left top
        if (it.type === 'opacity') {
          var min = 1 - it.level / 10, o = 1;
          if (it.dir === 'in-out') {      // fade in until start, fade out after end
            if (p < it.start) o = min + (1 - min) * (p / Math.max(it.start, 1));
            else if (p > it.end) o = 1 - (1 - min) * ((p - it.end) / Math.max(100 - it.end, 1));
          } else if (it.dir === 'out-in') {
            if (p >= it.start && p <= it.end) o = min;
          } else if (it.dir === 'in') o = p < it.start ? min : 1;
          else if (it.dir === 'out') o = p > it.end ? min : 1;
          it.el.style.opacity = o.toFixed(3);
        } else {
          it.layer.style.transform = 'translateY(' + (-(p / 100) * it.speed * 10) + '%)';
        }
      });
    };
    var ticking = false;
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { tick(); ticking = false; }); } }, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  }

  /* ---------- 10. Sticky containers (Elementor Pro "sticky: top") ---------- */
  function initSticky() {
    $$('[data-settings*="\\"sticky\\":\\"top\\""]').forEach(function (el) {
      if (el.closest('[data-elementor-type="header"]')) return; // header handled by she-header.js
      var s = settingsOf(el);
      if ((s.sticky_on || ['desktop', 'tablet', 'mobile']).indexOf(device()) === -1) return;
      el.style.position = 'sticky';
      el.style.top = (Number(s.sticky_offset) || 0) + 'px';
      el.style.zIndex = '99';
    });
  }

  /* ---------- 11. Posts "Load More" (archive/single related posts) ---------- */
  function initLoadMore() {
    $$('.e-load-more-anchor').forEach(function (anchor) {
      var widget = anchor.closest('.elementor-widget');
      var btn = widget && widget.querySelector('.elementor-button-wrapper a, .e-load-more-message + * a, .elementor-button');
      var list = widget && widget.querySelector('.elementor-posts-container');
      if (!btn || !list) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var page = Number(anchor.getAttribute('data-page')) + 1;
        var max = Number(anchor.getAttribute('data-max-page'));
        var next = anchor.getAttribute('data-next-page');
        if (!next || page > max) return;
        widget.classList.add('e-load-more-pagination-loading');
        fetch(next, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var id = widget.getAttribute('data-id');
          var src = doc.querySelector('.elementor-element-' + id + ' .elementor-posts-container');
          if (src) Array.prototype.forEach.call(src.children, function (c) { list.appendChild(c); });
          var nextAnchor = doc.querySelector('.elementor-element-' + id + ' .e-load-more-anchor');
          anchor.setAttribute('data-page', page);
          anchor.setAttribute('data-next-page', nextAnchor ? nextAnchor.getAttribute('data-next-page') : '');
          widget.classList.remove('e-load-more-pagination-loading');
          if (page >= max) widget.classList.add('e-load-more-pagination-end');
        });
      });
    });
  }

  /* ---------- 12. Share buttons ---------- */
  function initShare() {
    var urls = {
      facebook: 'https://www.facebook.com/sharer.php?u={url}',
      twitter: 'https://twitter.com/intent/tweet?text={text}%20{url}',
      x: 'https://twitter.com/intent/tweet?text={text}%20{url}',
      linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={text}',
      pinterest: 'https://www.pinterest.com/pin/create/button/?url={url}&description={text}',
      whatsapp: 'https://api.whatsapp.com/send?text=*{text}*%0A{url}',
      reddit: 'https://reddit.com/submit?url={url}&title={text}',
      telegram: 'https://telegram.me/share/url?url={url}&text={text}',
      email: 'mailto:?subject={text}&body={url}'
    };
    $$('.elementor-share-btn').forEach(function (b) {
      var net = (b.className.match(/elementor-share-btn_([\w-]+)/) || [])[1];
      if (!urls[net]) return;
      b.addEventListener('click', function () {
        var u = urls[net].replace('{url}', encodeURIComponent(location.href)).replace('{text}', encodeURIComponent(document.title));
        if (net === 'email') location.href = u; else window.open(u, '', 'width=600,height=500');
      });
    });
  }

  /* ---------- 13. Elementor Pro gallery (grid layout, as e-gallery computes it) ---------- */
  function initGallery() {
    $$('.elementor-gallery__container').forEach(function (c) {
      var w = c.closest('.elementor-widget'), s = w ? settingsOf(w) : {};
      var ratio = String(s.aspect_ratio || '3:2').split(':');
      var aspect = Number(ratio[1]) / Number(ratio[0]) || (2 / 3);
      var items = $$('.e-gallery-item', c);
      c.classList.add('e-gallery-container', 'e-gallery-grid', 'e-gallery--ltr');
      c.style.setProperty('--animation-duration', '350ms');
      c.style.setProperty('--aspect-ratio', (aspect * 100) + '%');
      items.forEach(function (it) {
        var img = it.querySelector('.e-gallery-image[data-thumbnail]');
        if (img) { img.style.backgroundImage = 'url(' + img.getAttribute('data-thumbnail') + ')'; img.classList.add('e-gallery-image-loaded'); }
      });
      var layout = function () {
        var cols = Number(responsive(s, 'columns')) || 3;
        var gap = size(responsive(s, 'gap'), 10);
        var rows = Math.ceil(items.length / cols);
        c.style.setProperty('--columns', cols);
        c.style.setProperty('--rows', rows);
        c.style.setProperty('--hgap', gap + 'px');
        c.style.setProperty('--vgap', gap + 'px');
        items.forEach(function (it, i) { it.style.setProperty('--column', i % cols); it.style.setProperty('--row', Math.floor(i / cols)); });
        var W = c.clientWidth || 1, colW = (W - gap * (cols - 1)) / cols;
        c.style.setProperty('--container-aspect-ratio', ((colW * aspect * rows + gap * (rows - 1)) / W * 100) + '%');
      };
      layout();
      window.addEventListener('resize', layout);
    });
  }

  /* ---------- 13b. Posts widgets: fixed-ratio thumbnails (Elementor "item ratio" + fit-height) ---------- */
  function initPostThumbs() {
    $$('.elementor-widget-posts .elementor-posts-container, .elementor-widget-archive-posts .elementor-posts-container').forEach(function (list) {
      if (!list.querySelector('.elementor-post__thumbnail')) return;
      list.classList.add('elementor-has-item-ratio');
      var fit = function () {
        $$('.elementor-post__thumbnail', list).forEach(function (t) {
          var img = t.querySelector('img');
          if (!img) return;
          var w = img.naturalWidth || Number(img.getAttribute('width')), h = img.naturalHeight || Number(img.getAttribute('height'));
          if (!w || !h || !t.offsetWidth) return;
          t.classList.toggle('elementor-fit-height', h / w < t.offsetHeight / t.offsetWidth);
        });
      };
      $$('img', list).forEach(function (img) { if (!img.complete) img.addEventListener('load', fit); });
      fit();
      window.addEventListener('resize', fit);
    });
  }

  /* ---------- 14. Elementor e-con background lazy-load flag ---------- */
  function initConLazy() { $$('.e-con.e-parent').forEach(function (c) { c.classList.add('e-lazyloaded'); }); }

  /* ---------- 15. Astra scroll-to-top ---------- */
  function initScrollTop() {
    var btn = document.getElementById('ast-scroll-top');
    if (!btn) return;
    var upd = function () { btn.style.display = window.scrollY > 300 ? 'block' : 'none'; };
    window.addEventListener('scroll', upd, { passive: true }); upd();
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- 16. UAEL posts grid: masonry layout + category filter (BLOGS page) ---------- */
  function initUaelPosts() {
    $$('.elementor-widget-uael-posts').forEach(function (w) {
      var inner = w.querySelector('.uael-post-grid__inner');
      if (!inner) return;
      var items = $$('.uael-post-wrapper', inner);
      var current = '*';
      var layout = function () {
        if (!inner.classList.contains('uael-post-masonry')) return;
        var visible = items.filter(function (it) { return it.style.display !== 'none'; });
        inner.style.position = 'relative';
        var first = visible[0]; if (!first) { inner.style.height = '0px'; return; }
        visible.forEach(function (it) { it.style.position = 'absolute'; });
        var colW = first.offsetWidth, cols = Math.max(1, Math.round(inner.clientWidth / colW));
        var heights = []; for (var i = 0; i < cols; i++) heights.push(0);
        visible.forEach(function (it) {
          var c = heights.indexOf(Math.min.apply(null, heights));
          it.style.left = (c * colW) + 'px'; it.style.top = heights[c] + 'px';
          var cs = getComputedStyle(it); // outer height, like Isotope
          heights[c] += it.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
        });
        inner.style.height = Math.max.apply(null, heights) + 'px';
      };
      var apply = function (filter) {
        current = filter;
        items.forEach(function (it) { it.style.display = filter === '*' || it.matches(filter) ? '' : 'none'; });
        $$('.uael-post__header-filter', w).forEach(function (f) { f.classList.toggle('uael-filter__current', f.getAttribute('data-filter') === filter); });
        var btn = w.querySelector('.uael-filters-dropdown-button');
        var active = w.querySelector('.uael-post__header-filter[data-filter="' + filter + '"]');
        if (btn && active) btn.firstChild.nodeValue = active.textContent;
        layout();
      };
      $$('.uael-post__header-filter', w).forEach(function (f) {
        f.addEventListener('click', function () {
          var sel = f.getAttribute('data-filter');
          try { if (sel !== '*') inner.querySelector(sel); } catch (e) { sel = '[class~="' + sel.slice(1) + '"]'; }
          apply(sel === '*' ? '*' : sel);
          var list = w.querySelector('.uael-filters-dropdown-list'); if (list) list.classList.remove('show-list');
        });
        f.addEventListener('keydown', function (e) { if (e.key === 'Enter') f.click(); });
      });
      var dd = w.querySelector('.uael-filters-dropdown-button');
      if (dd) dd.addEventListener('click', function () { var l = w.querySelector('.uael-filters-dropdown-list'); if (l) l.classList.toggle('show-list'); });
      $$('img', inner).forEach(function (img) { if (!img.complete) img.addEventListener('load', layout); });
      window.addEventListener('resize', layout);
      window.addEventListener('load', layout);
      apply(current);
    });
  }

  /* ---------- 17. Gravity Forms markup: reveal + "GF Collapsible Sections" (inquiry forms) ----------
   * Gravity Forms prints some wrappers hidden until its own script runs; the collapsible-sections
   * plugin then moves each section's fields into its (server-rendered, hidden) body and toggles it. */
  function initGravityMarkup() {
    var $ = window.jQuery;
    $$('.gform_wrapper').forEach(function (wrap) {
      if (wrap.style.display === 'none') wrap.style.display = '';
      var sections = $$('.collapsible-sections-field', wrap);
      if (!sections.length) return;
      var form = wrap.querySelector('form');
      if (form) {
        wrap.className.split(' ').forEach(function (c) {
          if (c && (c.indexOf('cs-theme--') > -1 || c.indexOf('collapsible-sections') > -1)) form.classList.add(c.replace('_wrapper', ''));
        });
      }
      var tabs = '.gfield--type-tabs_break, .gft-pre-tab-section, .gfield--type-tab';
      var until = function (from, sel) { var out = [], n = from.nextElementSibling; while (n && !n.matches(sel)) { out.push(n); n = n.nextElementSibling; } return out; };
      sections.forEach(function (sec, i) {
        var body = sec.nextElementSibling;
        if (!body || !body.classList.contains('collapsible-sections-collapsible-body') || body.querySelector('.gfield')) return;
        if (i === 0) sec.classList.add('collapsible-sections-start-field');
        else if (i === sections.length - 1) sec.classList.add('collapsible-sections-end-field');
        // same as the plugin: stop at the next section or at an end-marker, whichever comes first
        var a = until(body, tabs + ', .collapsible-sections-field'), c = until(body, tabs + ', .collapsible-sections-end-field');
        var move = a.length > c.length ? c : a;
        if (sec.classList.contains('collapsible-sections-description-inside')) {
          var d = sec.querySelector('.gsection_description'); if (d) body.appendChild(d);
        }
        move.forEach(function (m) { body.appendChild(m); });
      });
      if (wrap.classList.contains('collapsible-sections-footer-inside_last_wrapper')) {
        var fields = wrap.querySelector('.gform_fields'), last = fields && fields.lastElementChild, foot = wrap.querySelector('.gform_footer');
        if (last && foot && last.classList.contains('collapsible-sections-collapsible-body')) last.appendChild(foot);
      }
      var single = wrap.classList.contains('collapsible-sections-single-opens_wrapper');
      var slide = function (el, open, done) {
        if ($) { $(el)[open ? 'slideDown' : 'slideUp'](400, done); return; }
        el.style.display = open ? '' : 'none'; if (done) done();
      };
      var setOpen = function (sec, open) {
        var body = wrap.querySelector(sec.getAttribute('data-target'));
        if (!body) return;
        sec.setAttribute('aria-pressed', open ? 'true' : 'false');
        sec.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) { sec.classList.add('collapsible-sections-open'); slide(body, true); }
        else slide(body, false, function () { sec.classList.remove('collapsible-sections-open'); });
      };
      sections.forEach(function (sec) {
        sec.addEventListener('click', function (e) {
          e.preventDefault();
          if (sec.classList.contains('collapsible-sections-disabled') || wrap.classList.contains('collapsible-sections-disabled')) return;
          var body = wrap.querySelector(sec.getAttribute('data-target'));
          if (!body) return;
          var visible = body.offsetParent !== null || getComputedStyle(body).display !== 'none';
          if (visible) { setOpen(sec, false); return; }
          if (single) sections.forEach(function (o) { if (o !== sec && o.classList.contains('collapsible-sections-open')) setOpen(o, false); });
          setOpen(sec, true);
        });
        sec.addEventListener('keypress', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sec.click(); } });
      });
      wrap.classList.add('cs-ready');
    });
  }

  /* ---------- 18. Gravity Forms conditional logic (rules captured from the live forms) ----------
   * window.geoGfLogic[formId] = { logic: { fieldId: { field: { actionType, logicType, rules } } } } */
  function initGravityLogic() {
    var all = window.geoGfLogic || {};
    Object.keys(all).forEach(function (formId) {
      var form = document.getElementById('gform_' + formId);
      var logic = (all[formId] || {}).logic || {};
      if (!form) return;
      var values = function (fieldId) {
        var inputs = $$('[name="input_' + fieldId + '"], [name^="input_' + fieldId + '."]', form);
        var out = [];
        inputs.forEach(function (i) {
          if (i.type === 'checkbox' || i.type === 'radio') { if (i.checked) out.push(i.value); }
          else if (i.tagName === 'SELECT' && i.multiple) { $$('option', i).forEach(function (o) { if (o.selected) out.push(o.value); }); }
          else out.push(i.value);
        });
        return out.length ? out : [''];
      };
      var num = function (v) { var n = parseFloat(String(v).replace(/,/g, '')); return isNaN(n) ? null : n; };
      var test = function (val, op, target) {
        var a = String(val).toLowerCase(), b = String(target).toLowerCase();
        switch (op) {
          case 'is': return a === b;
          case 'isnot': return a !== b;
          case '>': return num(val) !== null && num(target) !== null && num(val) > num(target);
          case '<': return num(val) !== null && num(target) !== null && num(val) < num(target);
          case 'contains': return a.indexOf(b) > -1;
          case 'starts_with': return a.indexOf(b) === 0;
          case 'ends_with': return b === '' || a.slice(-b.length) === b;
          default: return false;
        }
      };
      var ruleMatches = function (r) {
        var vals = values(r.fieldId);
        // "is not" must hold for every selected value; other operators for any of them
        return r.operator === 'isnot' ? vals.every(function (v) { return test(v, 'isnot', r.value); })
          : vals.some(function (v) { return test(v, r.operator, r.value); });
      };
      var apply = function (e) {
        Object.keys(logic).forEach(function (fid) {
          var f = (logic[fid] || {}).field;
          var el = document.getElementById('field_' + formId + '_' + fid);
          if (!f || !el || f.enabled === false) return;
          var rules = f.rules || [];
          var match = f.logicType === 'any' ? rules.some(ruleMatches) : rules.every(ruleMatches);
          var show = f.actionType === 'hide' ? !match : match;
          el.style.display = show ? '' : 'none';
          el.setAttribute('data-conditional-logic', show ? 'visible' : 'hidden');
        });
        fireGf('gform_post_conditional_logic', [Number(formId), null, !e]);
      };
      form.addEventListener('change', apply);
      form.addEventListener('input', apply);
      apply();
    });
  }

  /* Fire the Gravity Forms events the site's custom form code listens to (see gf-hooks-shim.js). */
  function fireGf(name, args) {
    // a failing listener in the site's custom code must not stop the rest of the page setup
    try { if (window.jQuery) window.jQuery(document).trigger(name, args); } catch (e) { if (window.console) console.error(e); }
    try { if (window.gform && typeof window.gform.doAction === 'function') window.gform.doAction.apply(null, [name].concat(args)); } catch (e) { if (window.console) console.error(e); }
  }
  function initGravityRendered() {
    $$('form[id^="gform_"]').forEach(function (f) {
      var id = Number(f.id.replace('gform_', ''));
      if (id) fireGf('gform_post_render', [id, 1]);
    });
  }

  /* ---------- 19. Send website forms by email (see inc/forms.php) ----------
   * Checks required fields, collects "question: answer" pairs with their visible labels,
   * sends them (plus any attached file) and shows the same success message as the live site. */
  function initForms() {
    var cfg = window.geoForms;
    if (!cfg || !window.fetch || !window.FormData) return;
    var openedAt = Math.floor(Date.now() / 1000);
    var SUCCESS = 'Thanks for contacting. Your request has been received.Our team will contact you shortly with details.';
    var NEWS_SUCCESS = 'The form was sent successfully.';
    var text = function (el) { return el ? el.textContent.replace(/\s+/g, ' ').replace(/\(Required\)|\*/g, '').trim() : ''; };
    var hiddenByRules = function (el) {
      var f = el.closest('.gfield');
      return !!f && (f.getAttribute('data-conditional-logic') === 'hidden' || f.classList.contains('gform_hidden') || f.classList.contains('gfield_visibility_hidden'));
    };
    var labelFor = function (input, form) {
      var gf = input.closest('.gfield');
      if (gf) {
        var main = text(gf.querySelector('.gfield_label'));
        var sub = input.closest('.ginput_complex > span, .ginput_complex > div');
        // only add "First"/"Last" etc. when the question really has several boxes
        var many = gf.querySelectorAll('.ginput_complex input:not([type=hidden]), .ginput_complex select').length > 1;
        var subLabel = sub && many ? text(sub.querySelector('label')) : '';
        return (main + (subLabel ? ' - ' + subLabel : '')) || input.getAttribute('placeholder') || input.name;
      }
      var group = input.closest('.elementor-field-group');
      var l = group && group.querySelector('label');
      return text(l) || input.getAttribute('placeholder') || input.getAttribute('aria-label') || input.name;
    };
    var markError = function (input, msg) {
      var gf = input.closest('.gfield');
      if (gf) {
        gf.classList.add('gfield_error');
        if (!gf.querySelector('.validation_message')) gf.insertAdjacentHTML('beforeend', '<div class="gfield_description validation_message gfield_validation_message">' + msg + '</div>');
        var body = gf.closest('.collapsible-sections-collapsible-body');
        if (body && getComputedStyle(body).display === 'none' && body.previousElementSibling) body.previousElementSibling.click();
      } else if (input.reportValidity) { input.setCustomValidity(msg); input.reportValidity(); input.addEventListener('input', function () { input.setCustomValidity(''); }, { once: true }); }
    };
    var clearErrors = function (form) {
      $$('.gfield_error', form).forEach(function (g) { g.classList.remove('gfield_error'); var m = g.querySelector('.validation_message'); if (m) m.remove(); });
    };

    $$('form[data-geo-endpoint]').forEach(function (form) {
      if (form.id === 'multiple_selector_form' || form.getAttribute('name') === 'Pallet selector form') return; // only reloads the page
      var isNews = /subscription/i.test(form.getAttribute('name') || '');
      var isGf = form.id.indexOf('gform_') === 0;
      var hp = document.createElement('input');
      hp.type = 'text'; hp.name = 'geo_hp'; hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true');
      hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
      form.appendChild(hp);
      // Gravity Forms' own button/submit hooks point at code that isn't on the new site
      form.removeAttribute('onsubmit');
      $$('[onclick*="gform"], [onkeypress*="gform"], [onchange*="gform"]', form).forEach(function (b) { ['onclick', 'onkeypress', 'onchange'].forEach(function (a) { if (/gform/.test(b.getAttribute(a) || '')) b.removeAttribute(a); }); });
      // the live forms' submit buttons may be links or "button" types - make them submit
      $$('button[type="button"].gform_button, input[type="button"].gform_button', form).forEach(function (b) { b.addEventListener('click', function () { form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); }); });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        // let the site's own checks (e.g. phone format) run first; they add .custom-error-message
        setTimeout(function () {
          if (form.querySelector('.custom-error-message')) return;
          clearErrors(form);
          var inputs = $$('input, select, textarea', form).filter(function (i) {
            return i.name && !/^(geo_|gform_|is_submit|state_|post_id|form_id|referer_title|queried_id|version_hash)/.test(i.name) && i.type !== 'hidden' && i.type !== 'submit' && i.type !== 'button' && !hiddenByRules(i);
          });
          // required-field check (Gravity Forms marks required with aria-required, Elementor with required)
          var firstBad = null, seen = {};
          inputs.forEach(function (i) {
            var req = i.required || i.getAttribute('aria-required') === 'true';
            if (!req) return;
            var empty;
            if (i.type === 'checkbox' || i.type === 'radio') {
              if (seen[i.name]) return; seen[i.name] = 1;
              empty = !$$('[name="' + i.name + '"]', form).some(function (x) { return x.checked; });
            } else if (i.type === 'file') empty = !i.files.length;
            else empty = !String(i.value).trim();
            if (empty) { markError(i, cfg.messages.required); if (!firstBad) firstBad = i; }
          });
          var big = inputs.filter(function (i) { return i.type === 'file' && i.files[0] && i.files[0].size > cfg.maxUpload; })[0];
          if (big) { markError(big, cfg.messages.tooBig); if (!firstBad) firstBad = big; }
          if (firstBad) { firstBad.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }

          // collect answers with their labels
          var fields = [], email = '', done = {}, fd = new FormData();
          inputs.forEach(function (i) {
            var label = labelFor(i, form), value = '';
            if (i.type === 'file') { if (i.files[0]) fd.append('file_' + i.name, i.files[0]); return; }
            if (i.type === 'checkbox' || i.type === 'radio') {
              var key = i.name.replace(/\.\d+$/, '');
              if (done[key]) return; done[key] = 1;
              value = $$('input', i.closest('.gfield, .elementor-field-group') || form).filter(function (x) { return (x.type === 'checkbox' || x.type === 'radio') && x.checked; })
                .map(function (x) { var l = form.querySelector('label[for="' + x.id + '"]'); return text(l) || x.value; }).join(', ');
            } else if (i.tagName === 'SELECT') {
              value = $$('option', i).filter(function (o) { return o.selected && o.value; }).map(function (o) { return o.textContent.trim(); }).join(', ');
            } else value = String(i.value).trim();
            if (!email && i.type === 'email' && value) email = value;
            if (value) fields.push({ label: label, value: value });
          });
          var gfNames = { 9: 'Quote request', 1: '2-Way Pallet inquiry', 2: '4-Way Pallet inquiry', 4: 'Skid Pallet inquiry', 5: 'Wing Pallet inquiry', 6: 'Block Pallet inquiry', 7: 'Wood Cribbing inquiry' };
          var name = isGf ? (gfNames[form.id.replace('gform_', '')] || 'Quote request') : (form.getAttribute('name') || 'Website form');
          fd.append('action', 'geo_form_submit');
          fd.append('geo_form', name);
          fd.append('geo_kind', isNews ? 'newsletter' : 'enquiry');
          fd.append('geo_page', location.href);
          fd.append('geo_fields', JSON.stringify(fields));
          fd.append('geo_email', email);
          fd.append('geo_hp', hp.value);
          fd.append('geo_t', String(openedAt));

          var btn = form.querySelector('[type="submit"], .gform_button, .elementor-button');
          var btnText = btn && (btn.value || btn.textContent);
          if (btn) { btn.disabled = true; if (btn.tagName === 'INPUT') btn.value = cfg.messages.sending; }
          fetch(cfg.url, { method: 'POST', body: fd, credentials: 'same-origin' })
            .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
            .then(function (res) {
              if (!res || !res.success) throw new Error('send failed');
              var msg = isNews ? NEWS_SUCCESS : SUCCESS;
              if (isGf) {
                var wrap = form.closest('.gform_wrapper');
                var conf = document.createElement('div');
                conf.className = 'gform_confirmation_wrapper';
                conf.innerHTML = '<div class="gform_confirmation_message" role="status">' + msg + '</div>';
                (wrap || form).replaceWith(conf);
                conf.scrollIntoView({ block: 'center', behavior: 'smooth' });
              } else {
                form.reset();
                var old = form.querySelector('.elementor-message'); if (old) old.remove();
                form.insertAdjacentHTML('beforeend', '<div class="elementor-message elementor-message-success" role="alert">' + msg + '</div>');
              }
            })
            .catch(function () {
              var old = form.querySelector('.geo-form-error'); if (old) old.remove();
              form.insertAdjacentHTML('beforeend', '<div class="elementor-message elementor-message-danger geo-form-error" role="alert">' + cfg.messages.error + '</div>');
            })
            .then(function () { if (btn) { btn.disabled = false; if (btn.tagName === 'INPUT') btn.value = btnText; } });
        }, 0);
      });
    });
  }

  /* ---------- 20. Keep enlarged/shifted pictures inside the screen (approved 2026-11-22) ----------
   * Some images use Elementor "transform" effects (scale up, shift sideways). Where that pushes a
   * picture past the screen edge, reduce the scale/shift just enough to fit; otherwise leave it. */
  function initKeepInside() {
    var items = $$('[data-elementor-type="wp-page"] .elementor-widget-image > .elementor-widget-container');
    if (!items.length) return;
    var GAP = 8;
    // CSS "scale" and "translate" are applied on top of the existing effect, so they work however
    // the effect was configured: shrink just enough to fit, then nudge back inside the screen.
    var fit = function () {
      var vw = document.documentElement.clientWidth;
      items.forEach(function (box) {
        box.style.scale = '';
        box.style.translate = '';
        if (!box.offsetParent) return;
        var r = box.getBoundingClientRect();
        if (r.left >= GAP - 1 && r.right <= vw - GAP + 1) return;
        var room = vw - 2 * GAP;
        if (r.width > room) {
          box.style.scale = (room / r.width).toFixed(4);
          r = box.getBoundingClientRect();
        }
        var shift = 0;
        if (r.right > vw - GAP) shift = (vw - GAP) - r.right;
        else if (r.left < GAP) shift = GAP - r.left;
        if (shift) box.style.translate = shift.toFixed(1) + 'px 0';
      });
    };
    var t;
    var later = function () { clearTimeout(t); t = setTimeout(fit, 120); };
    window.addEventListener('resize', later);
    window.addEventListener('load', fit);
    document.addEventListener('animationend', later); // re-check once entrance animations settle
    fit();
  }

  function boot() {
    initKeepInside();
    initForms();
    initGravityMarkup();
    initGravityRendered();
    initGravityLogic();
    initUaelPosts();
    initConLazy(); markActiveMenu(); initNavMenus(); initAnimations(); initCounters(); initHeadlines();
    initCarousels(); initToggles(); initVideos(); initMotion(); initSticky(); initLoadMore(); initShare();
    initGallery(); initPostThumbs(); initScrollTop();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
