/* Minimal stand-in for the Gravity Forms JS hooks used by the site's custom form code
   (inlined by the build before that code). Events are fired by geo.js. */
(function (w) {
  if (w.gform && w.gform.__geoShim) return;
  var actions = {};
  w.gform = {
    __geoShim: true,
    initializeOnLoaded: function (fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); },
    addAction: function (name, fn) { (actions[name] = actions[name] || []).push(fn); },
    doAction: function (name) { var a = Array.prototype.slice.call(arguments, 1); (actions[name] || []).forEach(function (fn) { fn.apply(null, a); }); },
    addFilter: function () {},
    applyFilters: function (name, value) { return value; },
    utils: { trigger: function () {} }
  };
  w.gf_apply_rules = w.gf_apply_rules || function () {};
  // the form's init code writes number formats into Gravity Forms' global settings object
  w.gf_global = w.gf_global || { number_formats: [], gf_currency_config: { symbol_left: '$', symbol_right: '', thousand_separator: ',', decimal_separator: '.', decimals: 2, code: 'USD' } };
})(window);
