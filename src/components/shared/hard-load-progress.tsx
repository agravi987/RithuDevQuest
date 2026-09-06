const HARD_LOAD_SCRIPT = `(function () {
  try {
    if (window.__rithuHardLoadBar) return;
    var bar = document.createElement("div");
    bar.id = "rithu-hard-load-bar";
    bar.setAttribute("aria-hidden", "true");
    bar.style.cssText =
      "position:fixed;top:0;left:0;right:0;height:3px;z-index:190;" +
      "background:linear-gradient(90deg,#6168d8,#34d399,#22d3ee);" +
      "transform-origin:0 50%;opacity:1;transition:opacity .4s ease";
    document.documentElement.appendChild(bar);
    window.__rithuHardLoadBar = bar;

    var width = 0.08;
    var timer = null;
    function tick() {
      var target = Math.min(0.92, width + 0.02 + Math.random() * 0.03);
      width += (target - width) * 0.12;
      bar.style.transform = "scaleX(" + width + ")";
      timer = requestAnimationFrame(tick);
    }
    tick();

    function complete() {
      if (timer) cancelAnimationFrame(timer);
      bar.style.transform = "scaleX(1)";
      bar.style.opacity = "0";
      setTimeout(function () {
        if (bar.parentNode) bar.parentNode.removeChild(bar);
        window.__rithuHardLoadBar = null;
      }, 500);
    }

    if (document.readyState === "complete") complete();
    else window.addEventListener("load", complete, { once: true });
  } catch (e) {}
})();`;

/**
 * Thin top progress bar injected inline so a hard page load never looks dead
 * while server components stream. Removed once the window finishes loading.
 * Client-side navigations are covered by NavigationProgress / RouteLoadingIndicator.
 */
export function HardLoadProgress() {
  return <script dangerouslySetInnerHTML={{ __html: HARD_LOAD_SCRIPT }} />;
}