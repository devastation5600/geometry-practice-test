/* diagrams.js
   Small declarative SVG builder used by questions.js to draw triangle,
   angle, proof, and coordinate-plane figures without hand-coding raw
   SVG path math in every question.
*/

function dSub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
function dLen(v) { return Math.hypot(v[0], v[1]); }
function dUnit(v) { const l = dLen(v) || 1; return [v[0] / l, v[1] / l]; }
function dAdd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
function dScale(v, s) { return [v[0] * s, v[1] * s]; }
function dCross(a, b) { return a[0] * b[1] - a[1] * b[0]; }

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

/* Draws N short tick marks perpendicular to segment p1-p2, centered at
   its midpoint, to mark congruent sides. */
function tickMarks(p1, p2, count) {
  if (!count) return "";
  const dir = dUnit(dSub(p2, p1));
  const perp = [-dir[1], dir[0]];
  const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  const spacing = 6;
  const half = (count - 1) / 2;
  let out = "";
  for (let i = 0; i < count; i++) {
    const offset = (i - half) * spacing;
    const c = dAdd(mid, dScale(dir, offset));
    const a = dAdd(c, dScale(perp, 6));
    const b = dAdd(c, dScale(perp, -6));
    out += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#1d3557" stroke-width="2"/>`;
  }
  return out;
}

/* Draws an angle arc (or right-angle square) at vertex `v`, opening
   toward points p1 and p2. `style` = 'arc1' | 'arc2' | 'right'. */
function angleMark(v, p1, p2, style) {
  const u1 = dUnit(dSub(p1, v));
  const u2 = dUnit(dSub(p2, v));
  if (style === "right") {
    const s = 12;
    const a = dAdd(v, dScale(u1, s));
    const c = dAdd(v, dScale(u2, s));
    const b = dAdd(a, dScale(u2, s));
    return `<polyline points="${a[0].toFixed(1)},${a[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}" fill="none" stroke="#e63946" stroke-width="2"/>`;
  }
  const count = style === "arc2" ? 2 : 1;
  const cross = dCross(u1, u2);
  const sweep = cross > 0 ? 1 : 0;
  let out = "";
  for (let i = 0; i < count; i++) {
    const r = 16 + i * 5;
    const a = dAdd(v, dScale(u1, r));
    const b = dAdd(v, dScale(u2, r));
    out += `<path d="M ${a[0].toFixed(1)} ${a[1].toFixed(1)} A ${r} ${r} 0 0 ${sweep} ${b[0].toFixed(1)} ${b[1].toFixed(1)}" fill="none" stroke="#e9893a" stroke-width="2"/>`;
  }
  return out;
}

function labelAt(p, text, dx = 0, dy = 0, opts = {}) {
  const cls = opts.cls || "";
  const size = opts.size || 13;
  const weight = opts.bold === false ? 400 : 700;
  const color = opts.color || "#1c1c1c";
  return `<text x="${(p[0] + dx).toFixed(1)}" y="${(p[1] + dy).toFixed(1)}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${opts.anchor || "middle"}" font-family="Segoe UI, Arial, sans-serif">${esc(text)}</text>`;
}

/**
 * Generic triangle/figure diagram.
 * spec = {
 *   width, height,
 *   points: { A:[x,y], ... },
 *   edges: [{from,to,ticks,label,labelOffset:[dx,dy]}],
 *   angles: [{at,rays:[p1,p2],mark:'arc1'|'arc2'|'right',label,labelOffset:[dx,dy]}],
 *   extra: [{type:'line'|'dashedLine', from:[x,y]|'A', to:[x,y]|'A'}],
 *   showPoints: true,
 *   pointLabelOffsets: { A:[dx,dy] }
 * }
 */
function buildFigureSVG(spec) {
  const w = spec.width || 280;
  const h = spec.height || 190;
  const pts = spec.points;
  let edgesSVG = "";
  let ticksSVG = "";
  let edgeLabelsSVG = "";

  (spec.edges || []).forEach((e) => {
    const p1 = pts[e.from];
    const p2 = pts[e.to];
    edgesSVG += `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="#1d3557" stroke-width="2.2"/>`;
    if (e.ticks) ticksSVG += tickMarks(p1, p2, e.ticks);
    if (e.label) {
      const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      const off = e.labelOffset || [0, -8];
      edgeLabelsSVG += labelAt(mid, e.label, off[0], off[1], { size: 12.5 });
    }
  });

  let anglesSVG = "";
  let angleLabelsSVG = "";
  (spec.angles || []).forEach((a) => {
    const v = pts[a.at];
    const p1 = pts[a.rays[0]] || a.rays[0];
    const p2 = pts[a.rays[1]] || a.rays[1];
    anglesSVG += angleMark(v, p1, p2, a.mark || "arc1");
    if (a.label) {
      const off = a.labelOffset || [0, 0];
      angleLabelsSVG += labelAt(v, a.label, off[0], off[1], { size: 12, color: "#e9893a" });
    }
  });

  let extraSVG = "";
  (spec.extra || []).forEach((x) => {
    const from = Array.isArray(x.from) ? x.from : pts[x.from];
    const to = Array.isArray(x.to) ? x.to : pts[x.to];
    const dash = x.dashed ? ' stroke-dasharray="4 3"' : "";
    extraSVG += `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}" stroke="#6b7a86" stroke-width="1.6"${dash}/>`;
  });

  let pointDotsSVG = "";
  let pointLabelsSVG = "";
  if (spec.showPoints !== false) {
    Object.keys(pts).forEach((k) => {
      const p = pts[k];
      pointDotsSVG += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#1d3557"/>`;
      const off = (spec.pointLabelOffsets && spec.pointLabelOffsets[k]) || [0, -8];
      pointLabelsSVG += labelAt(p, k, off[0], off[1], { size: 13.5 });
    });
  }

  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    ${extraSVG}${edgesSVG}${ticksSVG}${anglesSVG}${pointDotsSVG}
    ${edgeLabelsSVG}${angleLabelsSVG}${pointLabelsSVG}
  </svg>`;
}

/**
 * Coordinate-plane diagram for Cartesian triangle classification questions.
 * spec = { width, height, xMin,xMax,yMin,yMax, points:{A:[x,y],...}, edges:[{from,to}] }
 * Internal coords are mapped to pixel space with y flipped so it reads
 * like a normal math graph.
 */
function buildCoordSVG(spec) {
  const w = spec.width || 300;
  const h = spec.height || 300;
  const pad = 26;
  const xMin = spec.xMin, xMax = spec.xMax, yMin = spec.yMin, yMax = spec.yMax;
  const sx = (w - pad * 2) / (xMax - xMin);
  const sy = (h - pad * 2) / (yMax - yMin);
  const px = (x) => pad + (x - xMin) * sx;
  const py = (y) => h - pad - (y - yMin) * sy;

  let grid = "";
  for (let gx = Math.ceil(xMin); gx <= xMax; gx++) {
    grid += `<line x1="${px(gx)}" y1="${pad}" x2="${px(gx)}" y2="${h - pad}" stroke="#e3ecf1" stroke-width="1"/>`;
  }
  for (let gy = Math.ceil(yMin); gy <= yMax; gy++) {
    grid += `<line x1="${pad}" y1="${py(gy)}" x2="${w - pad}" y2="${py(gy)}" stroke="#e3ecf1" stroke-width="1"/>`;
  }
  const axes = `<line x1="${px(xMin)}" y1="${py(0)}" x2="${px(xMax)}" y2="${py(0)}" stroke="#6b7a86" stroke-width="1.4"/>
    <line x1="${px(0)}" y1="${py(yMin)}" x2="${px(0)}" y2="${py(yMax)}" stroke="#6b7a86" stroke-width="1.4"/>`;

  const pts = {};
  Object.keys(spec.points).forEach((k) => (pts[k] = [px(spec.points[k][0]), py(spec.points[k][1])]));

  let edgesSVG = "";
  (spec.edges || []).forEach((e) => {
    const p1 = pts[e.from];
    const p2 = pts[e.to];
    edgesSVG += `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="#1d3557" stroke-width="2.2"/>`;
  });

  let dotsSVG = "";
  let labelsSVG = "";
  Object.keys(pts).forEach((k) => {
    const p = pts[k];
    dotsSVG += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#e63946"/>`;
    const orig = spec.points[k];
    labelsSVG += labelAt(p, `${k}(${orig[0]}, ${orig[1]})`, 4, -8, { size: 11.5, anchor: "start" });
  });

  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    ${grid}${axes}${edgesSVG}${dotsSVG}${labelsSVG}
  </svg>`;
}
