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
    // A pie/doughnut legend keys off slice LABELS, not dataset names, and
    // Chart.js implements that in the arc controller own generateLabels
    // override. Calling the global default here bypasses it and prints the
    // series name once instead of naming every slice. Must cover BOTH arc
    // types — pie was missed when this was first fixed for doughnut.
    if (type === "doughnut" || type === "pie") return base;
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

  // Our type names describe editorial intent; Chart.js names describe
  // controllers. "area" and "sparkline" are both line controllers configured
  // differently, and a gauge is a half doughnut.
  function controllerFor(type) {
    if (type === "area" || type === "sparkline") return "line";
    if (type === "gauge") return "doughnut";
    // A range bar is an ordinary bar whose data points are [from, to] pairs.
    // Chart.js calls these floating bars and supports them natively, which is
    // why this type needs no plugin and no commercial licence.
    if (type === "range-bar") return "bar";
    return type;
  }

  function isLineFamily(type) {
    return type === "line" || type === "area" || type === "sparkline";
  }

  // Centre readout for gauges. Chart.js has no built-in, and a gauge without
  // its value is just a coloured arc.
  var legendSpacing = {
    id: "epLegendSpacing",
    beforeInit: function (chart) {
      var legend = chart.legend;
      if (!legend || legend.__epPadded) return;
      legend.__epPadded = true;
      var fit = legend.fit;
      legend.fit = function () {
        fit.call(this);
        // Only cushion legends above/below the plot. A right-hand legend (pie,
        // doughnut) is already clear of the drawing area, and padding its
        // height there just shifts it off centre.
        if (this.options.position === "top" || this.options.position === "bottom") {
          this.height += 18;
        }
      };
    }
  };

  var gaugeText = {
    id: "epGaugeText",
    afterDatasetsDraw: function (chart, args, opts) {
      if (!opts || !opts.display) return;
      var ctx = chart.ctx;
      var meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data || !meta.data[0]) return;
      var arc = meta.data[0];
      var cx = arc.x;
      var cy = arc.y;
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = opts.color;
      ctx.font = "600 " + opts.size + "px " + opts.font;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(opts.value, cx, cy - (opts.label ? 10 : 0));
      if (opts.label) {
        ctx.fillStyle = opts.labelColor;
        ctx.font = "400 12px " + opts.font;
        ctx.fillText(opts.label, cx, cy + 9);
      }
      ctx.restore();
    }
  };

  function datasets(type, cfg, colors, surface) {
    var series = cfg.series || [];
    var out = [];
    for (var i = 0; i < series.length; i++) {
      var c = series[i].color || colors[i % colors.length];
      if (type === "gauge") {
        // Two segments: the value, then the remainder drawn in a neutral track.
        var gv = (series[i].values || [0])[0] || 0;
        var gmax = cfg.max || 100;
        out.push({ label: series[i].label, data: [gv, Math.max(gmax - gv, 0)],
          backgroundColor: [c, alpha(c, 0.15)], borderWidth: 0, circumference: 180,
          rotation: 270, cutout: "72%" });
      } else if (type === "range-bar") {
        out.push({ label: series[i].label, data: series[i].values, backgroundColor: c,
          borderRadius: 3, borderSkipped: false, maxBarThickness: 26 });
      } else if (type === "scatter") {
        out.push({ label: series[i].label, data: series[i].values, backgroundColor: c,
          borderColor: c, pointRadius: 5, pointHoverRadius: 7, showLine: false });
      } else if (type === "sparkline") {
        // No axes, no legend, no points — a sparkline is a shape, not a chart.
        out.push({ label: series[i].label, data: series[i].values, borderColor: c,
          backgroundColor: alpha(c, 0.14), fill: true, tension: 0.4, borderWidth: 1.75,
          pointRadius: 0, pointHoverRadius: 3, pointBackgroundColor: c });
      } else if (isLineFamily(type)) {
        var filled = type === "area";
        out.push({ label: series[i].label, data: series[i].values, borderColor: c,
          backgroundColor: alpha(c, filled ? 0.22 : 0.1), fill: filled, tension: 0.4,
          borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: c,
          pointBorderWidth: 0 });
      } else if (type === "radar") {
        out.push({ label: series[i].label, data: series[i].values, borderColor: c,
          backgroundColor: alpha(c, 0.16), borderWidth: 2, pointBackgroundColor: c, pointRadius: 3 });
      } else if (type === "doughnut" || type === "pie") {
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
    // Circular and chrome-free types have no cartesian scales at all.
    if (type === "doughnut" || type === "pie" || type === "gauge") return undefined;
    if (type === "sparkline") {
      return { x: { display: false }, y: { display: false } };
    }
    if (type === "scatter") {
      var axis = function (title) {
        return { type: "linear", grid: { color: grid, drawTicks: false },
          border: { display: false },
          title: title ? { display: true, text: title, color: label,
            font: { size: 11, family: font } } : undefined,
          ticks: { color: label, font: { size: 11, family: font }, padding: 8,
            maxTicksLimit: 8, callback: function (v) { return fmtValue(v, ""); } } };
      };
      return { x: axis(cfg.xLabel), y: axis(cfg.yLabel) };
    }
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

  if (window.Chart && window.Chart.register) { window.Chart.register(gaugeText, legendSpacing); }

  function render(el) {
    var canvas = el.querySelector("canvas");
    if (!canvas) return;
    var type = el.getAttribute("data-chart") || "bar";
    var cfg;
    try { cfg = JSON.parse(el.getAttribute("data-config") || "{}"); }
    catch (e) { console.warn("[ep-blog] bad data-config", el, e); return; }

    if (el.__epChart) { el.__epChart.destroy(); }

    var font = tok(el, "--ep-font-sans", "Inter, sans-serif");
    var colors = (cfg.palette && cfg.palette.length) ? cfg.palette : palette(el);
    var single = (cfg.series || []).length < 2;

    el.__epChart = new window.Chart(canvas.getContext("2d"), {
      type: controllerFor(type),
      data: { labels: cfg.labels || [], datasets: datasets(type, cfg, colors, tok(el, "--ep-color-surface", "#ffffff")) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduceMotion ? false : { duration: 400 },
        // range-bar has to be included here: missing it left the chart
        // vertical AND replaced the category names with indices, because the
        // index axis and the category axis then disagreed about which is which.
        indexAxis: (cfg.horizontal && (type === "bar" || type === "range-bar")) ? "y" : "x",
        interaction: { mode: "index", intersect: false },
        // One series needs no legend — the chart title already names it.
        plugins: {
          epGaugeText: type === "gauge" ? {
            display: true,
            value: fmtValue((((cfg.series || [])[0] || {}).values || [0])[0] || 0, cfg.valueSuffix),
            label: cfg.gaugeLabel || "",
            color: tok(el, "--ep-color-text", "#10163e"),
            labelColor: tok(el, "--ep-chart-label", "#66738f"),
            font: font, size: 30
          } : { display: false },
          legend: (type === "sparkline" || type === "gauge") ? { display: false }
            : (single && type !== "doughnut" && type !== "pie")
            ? { display: false }
            : { display: true, position: (type === "doughnut" || type === "pie") ? "right" : "top",
                align: "start", labels: legend(type, font) },
          tooltip: {
            enabled: type !== "gauge",
            backgroundColor: tok(el, "--ep-chart-tooltip-bg", "#10163e"),
            titleColor: tok(el, "--ep-chart-tooltip-text", "#ffffff"),
            bodyColor: tok(el, "--ep-chart-tooltip-text", "#ffffff"),
            titleFont: { size: 12, family: font, weight: "600" },
            bodyFont: { size: 12, family: font },
            padding: 10, cornerRadius: 4, displayColors: true, boxPadding: 4,
            callbacks: type === "range-bar" ? {
              label: function (ctx) {
                var v = ctx.raw;
                if (!v || v.length !== 2) return ctx.formattedValue;
                var u = cfg.rangeUnit || "";
                return " " + ctx.dataset.label + ": " + fmtValue(v[0], u) + " to " + fmtValue(v[1], u);
              }
            } : undefined
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
