/**
 * EventPipe Blog — chart runtime
 * ==============================
 * Paste the two tags below into Webflow's site-wide custom code ONCE
 * (Site Settings → Custom Code → Footer). After that every chart embed is
 * just a `<figure class="ep-chart" data-chart="…" data-config='…'>` with no
 * script of its own.
 *
 * The runtime reads its colors from the *computed* CSS custom properties on
 * each chart element rather than from a hardcoded palette. Three consequences
 * worth knowing:
 *
 *  - Recoloring the blog is a change to blog-embeds.css. Charts pasted months
 *    ago pick it up on the next jsDelivr purge.
 *  - A chart inside a `data-ep-mode="dark"` embed themes itself correctly with
 *    no per-chart configuration.
 *  - Switching the mode at runtime re-renders the chart, because the observer
 *    below watches for exactly that.
 */

export const CHARTJS_CDN = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.js'

/**
 * Plain ES5, no template literals — this is emitted verbatim into a <script>
 * tag, and backticks here would collide with the literal that carries it.
 */
export const CHARTS_RUNTIME = `
(function () {
  if (!window.Chart) { console.warn("[ep-blog] Chart.js not loaded — charts skipped."); return; }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tok(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function palette(el) {
    var out = [];
    for (var i = 1; i <= 6; i++) out.push(tok(el, "--ep-chart-" + i, "#00adb3"));
    return out;
  }

  function alpha(color, a) {
    var h = color.replace("#", "").trim();
    if (h.length !== 6) return color;
    return "rgba(" + parseInt(h.substring(0, 2), 16) + "," + parseInt(h.substring(2, 4), 16) +
      "," + parseInt(h.substring(4, 6), 16) + "," + a + ")";
  }

  // Swatches with breathing room before the label. Chart.js pads boxes, not
  // text, so the gap is prepended to the string.
  function legend(type, font) {
    var base = {
      // Circles for every chart type. MUI X keys line series with a dash, which
      // reads well, but Chart.js sizes the "line" point style from boxHeight
      // rather than boxWidth, so it renders as a ~6px mark that is invisible at
      // legend scale. A consistent visible circle beats a truer invisible dash,
      // and it matches the doughnut legend.
      usePointStyle: true, pointStyle: "circle", boxWidth: 6, boxHeight: 6,
      padding: 16, font: { size: 12, family: font }
    };
    // A doughnut legend keys off slice LABELS, not dataset names, and Chart.js
    // implements that in the doughnut controller own generateLabels override.
    // Calling the global default here bypasses it and prints the series name
    // once instead of naming every slice.
    if (type === "doughnut") return base;
    base.generateLabels = function (chart) {
      var items = window.Chart.defaults.plugins.legend.labels.generateLabels(chart);
      for (var i = 0; i < items.length; i++) items[i].text = "  " + items[i].text;
      return items;
    };
    return base;
  }

  // Thousands separators. An axis reading 45000 where it should read 45,000 is
  // the most obvious tell that a chart was not designed.
  function fmtValue(v, suffix) {
    var s = (typeof v === "number" && isFinite(v)) ? v.toLocaleString("en-US") : String(v);
    return s + (suffix || "");
  }

  function datasets(type, cfg, colors, surface) {
    var series = cfg.series || [];
    var out = [];
    for (var i = 0; i < series.length; i++) {
      var c = series[i].color || colors[i % colors.length];
      if (type === "line") {
        out.push({ label: series[i].label, data: series[i].values, borderColor: c,
          backgroundColor: alpha(c, 0.1), fill: false, tension: 0.4, borderWidth: 2,
          pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: c, pointBorderWidth: 0 });
      } else if (type === "radar") {
        out.push({ label: series[i].label, data: series[i].values, borderColor: c,
          backgroundColor: alpha(c, 0.16), borderWidth: 2, pointBackgroundColor: c, pointRadius: 3 });
      } else if (type === "doughnut") {
        // Separated with the surface colour rather than a stroke, so adjacent
        // slices of similar hue stay distinct without a visible outline.
        out.push({ label: series[i].label, data: series[i].values, backgroundColor: colors,
          borderColor: surface, borderWidth: 2, hoverOffset: 6 });
      } else {
        out.push({ label: series[i].label, data: series[i].values, backgroundColor: c,
          borderRadius: 3, borderSkipped: false, maxBarThickness: 72 });
      }
    }
    return out;
  }

  function scales(type, cfg, el, font) {
    var grid = tok(el, "--ep-chart-grid", "#d2dbe5");
    var label = tok(el, "--ep-chart-label", "#66738f");
    var suffix = cfg.valueSuffix || "";
    if (type === "doughnut") return undefined;
    if (type === "radar") {
      return { r: { grid: { color: grid }, angleLines: { color: grid },
        pointLabels: { color: label, font: { size: 11, family: font } },
        ticks: { display: false }, suggestedMin: cfg.yMin, suggestedMax: cfg.yMax } };
    }
    var value = { min: cfg.yMin, max: cfg.yMax, grid: { color: grid, drawTicks: false },
      border: { display: false },
      ticks: { color: label, font: { size: 11, family: font }, stepSize: cfg.yStep, padding: 8,
        // Unbounded, Chart.js draws ten gridlines where seven read better.
        // Do not lower this: at 6 the line chart is forced onto a coarser
        // scale that overshoots the data (0-15,000 for an 11,200 maximum).
        maxTicksLimit: 8,
        callback: function (v) { return fmtValue(v, suffix); } },
      stacked: !!cfg.stacked };
    var category = { grid: { display: false }, border: { display: true, color: grid },
      ticks: { color: label, font: { size: 12, family: font }, padding: 6 },
      stacked: !!cfg.stacked };
    return cfg.horizontal ? { x: value, y: category } : { x: category, y: value };
  }

  function render(el) {
    var canvas = el.querySelector("canvas");
    if (!canvas) return;
    var type = el.getAttribute("data-chart") || "bar";
    var cfg;
    try { cfg = JSON.parse(el.getAttribute("data-config") || "{}"); }
    catch (e) { console.warn("[ep-blog] bad data-config", el, e); return; }

    if (el.__epChart) { el.__epChart.destroy(); }

    var font = tok(el, "--ep-font-sans", "Inter, sans-serif");
    var colors = palette(el);
    var single = (cfg.series || []).length < 2;

    el.__epChart = new window.Chart(canvas.getContext("2d"), {
      type: type,
      data: { labels: cfg.labels || [], datasets: datasets(type, cfg, colors, tok(el, "--ep-color-surface", "#ffffff")) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduceMotion ? false : { duration: 400 },
        indexAxis: cfg.horizontal && type === "bar" ? "y" : "x",
        interaction: { mode: "index", intersect: false },
        // One series needs no legend — the chart title already names it.
        plugins: {
          legend: (single && type !== "doughnut")
            ? { display: false }
            : { display: true, position: type === "doughnut" ? "right" : "top",
                align: "start", labels: legend(type, font) },
          tooltip: {
            backgroundColor: tok(el, "--ep-chart-tooltip-bg", "#10163e"),
            titleColor: tok(el, "--ep-chart-tooltip-text", "#ffffff"),
            bodyColor: tok(el, "--ep-chart-tooltip-text", "#ffffff"),
            titleFont: { size: 12, family: font, weight: "600" },
            bodyFont: { size: 12, family: font },
            padding: 10, cornerRadius: 4, displayColors: true, boxPadding: 4
          }
        },
        scales: scales(type, cfg, el, font)
      }
    });
  }

  // Draw a chart when it is first about to be seen, not on page load —
  // an article with eight charts should not pay for all eight up front.
  var seen = typeof IntersectionObserver === "function"
    ? new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) { render(entries[i].target); seen.unobserve(entries[i].target); }
        }
      }, { rootMargin: "200px" })
    : null;

  function mount(root) {
    var els = (root || document).querySelectorAll(".ep-chart[data-chart]");
    for (var i = 0; i < els.length; i++) {
      if (els[i].__epMounted) continue;
      els[i].__epMounted = true;
      if (seen) seen.observe(els[i]); else render(els[i]);
    }
  }

  // Re-theme in place when brand or mode flips on any ancestor.
  new MutationObserver(function () {
    var els = document.querySelectorAll(".ep-chart[data-chart]");
    for (var i = 0; i < els.length; i++) if (els[i].__epChart) render(els[i]);
  }).observe(document.documentElement, {
    attributes: true, subtree: true, attributeFilter: ["data-ep-mode", "data-ep-brand"]
  });

  window.epBlogCharts = { mount: mount, render: render };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { mount(); });
  } else { mount(); }
})();
`

/** The exact two tags to paste into Webflow, in order. */
export const CHARTS_RUNTIME_EMBED =
    `<script src="${CHARTJS_CDN}"></script>\n<script>\n${CHARTS_RUNTIME}\n</script>`
