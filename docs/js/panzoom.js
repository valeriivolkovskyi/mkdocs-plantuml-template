(() => {
  "use strict";

  // ---- loader ---------------------------------------------------------------
  let panzoomLoader;
  const loadPanzoom = () => {
    if (window.Panzoom) return Promise.resolve();
    if (panzoomLoader) return panzoomLoader;
    panzoomLoader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/@panzoom/panzoom@4.6.0/dist/panzoom.min.js";
      s.async = true;
      s.onload = () => (window.Panzoom ? resolve() : reject(new Error("Panzoom not available after load")));
      s.onerror = () => reject(new Error("Failed to load Panzoom"));
      document.head.appendChild(s);
    });
    return panzoomLoader;
  };

  // ---- svg helpers ----------------------------------------------------------
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (name, attrs = {}) => {
    const el = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    return el;
  };

  const baseSvg = (className) => {
    const svg = svgEl("svg", {
      xmlns: NS,
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: className
    });
    return svg;
  };

  const iconPlus = () => {
    const svg = baseSvg("lucide lucide-plus");
    svg.append(
        svgEl("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
        svgEl("line", { x1: "12", y1: "5", x2: "12", y2: "19" })
    );
    return svg;
  };

  const iconReset = () => {
    const svg = baseSvg("lucide lucide-rotate-ccw");
    svg.append(
        svgEl("path", { d: "M3 2v6h6" }),
        svgEl("path", { d: "M3.51 15a9 9 0 1 0 2.13-9.36L3 8" })
    );
    return svg;
  };

  const iconMinus = () => {
    const svg = baseSvg("lucide lucide-minus");
    svg.append(svgEl("line", { x1: "5", y1: "12", x2: "19", y2: "12" }));
    return svg;
  };

  // ---- controls -------------------------------------------------------------
  const button = (cls, label, svgFactory) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `icon-button ${cls}`;
    btn.setAttribute("aria-label", label);
    btn.appendChild(svgFactory());
    return btn;
  };

  const createControls = () => {
    const bar = document.createElement("div");
    bar.className = "control";

    const zoomInBtn = button("puml-zoom-in", "Zoom in", iconPlus);
    const zoomResetBtn = button("puml-zoom-reset", "Reset zoom", iconReset);
    const zoomOutBtn = button("puml-zoom-out", "Zoom out", iconMinus);

    bar.append(zoomInBtn, zoomResetBtn, zoomOutBtn);
    return { bar, zoomInBtn, zoomResetBtn, zoomOutBtn };
  };

  // ---- init ---------------------------------------------------------------
  const initContainer = (el) => {
    const { bar, zoomInBtn, zoomResetBtn, zoomOutBtn } = createControls();
    el.parentElement.appendChild(bar)

    const panzoom = window.Panzoom(el, {
      cursor: "move",
      step: 0.15,
      minScale: 0.7,
      animate: false
    });

    const parent = el.parentElement;
    const offsetX = (parent.offsetWidth / 2) - (el.offsetWidth / 2);


    setTimeout(() => panzoom.pan(offsetX, 0))


    zoomInBtn.addEventListener("click", () => panzoom.zoomIn({step: 0.3}));
    zoomOutBtn.addEventListener("click", () => panzoom.zoomOut({step: 0.3}));
    zoomResetBtn.addEventListener("click", () => {panzoom.reset(); panzoom.pan(offsetX, 0)});

    el.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        panzoom.zoomWithWheel(e)
      }
    }, { passive: false });

  };

  const setupPanzoomContainers = () => {
    document.querySelectorAll(".pumlcdg").forEach(initContainer);
  };

  loadPanzoom().then(setupPanzoomContainers).catch((e) => console.error(e));
})();