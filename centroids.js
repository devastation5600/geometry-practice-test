/* centroids.js — 15-question Centroids & Medians practice test.
   Topics mirror the 6.3 "Using/Finding the Centroid" notes: what a
   median is, the centroid as the point where the medians meet, the 2:1
   split along every median (vertex-to-centroid is 2/3 of the median,
   centroid-to-midpoint is 1/3), algebra with the 2:1 rule, and finding
   the centroid on the coordinate plane by averaging the vertices.
*/

/* Triangle with all three medians drawn and the centroid marked.
   names = { A, B, C, D (midpoint of BC), E (midpoint of CA),
             F (midpoint of AB), G (centroid) }
   labels = { "A-G": ["12", dx, dy], ... } — keys are vertex/midpoint
   to centroid pieces, e.g. "A-G", "G-D". */
function centroidFigure(names, labels = {}) {
  const A = [40, 175], B = [300, 175], C = [150, 30];
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const D = mid(B, C), E = mid(C, A), F = mid(A, B);
  const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  const n = names;
  const points = {
    [n.A]: A, [n.B]: B, [n.C]: C, [n.D]: D, [n.E]: E, [n.F]: F, [n.G]: G
  };
  const piece = (from, to) => {
    const key = `${from}-${to}`;
    const edge = { from: n[from], to: n[to] };
    if (labels[key]) {
      edge.label = labels[key][0];
      edge.labelOffset = [labels[key][1] || 0, labels[key][2] || -8];
    }
    return edge;
  };
  return buildFigureSVG({
    width: 340, height: 200,
    points,
    edges: [
      { from: n.A, to: n.F, ticks: 1 }, { from: n.F, to: n.B, ticks: 1 },
      { from: n.B, to: n.D, ticks: 2 }, { from: n.D, to: n.C, ticks: 2 },
      { from: n.C, to: n.E, ticks: 3 }, { from: n.E, to: n.A, ticks: 3 },
      piece("A", "G"), piece("G", "D"),
      piece("B", "G"), piece("G", "E"),
      piece("C", "G"), piece("G", "F")
    ],
    pointLabelOffsets: {
      [n.A]: [-10, 6], [n.B]: [10, 6], [n.C]: [0, -8],
      [n.D]: [10, -4], [n.E]: [-10, -4], [n.F]: [0, 18], [n.G]: [12, 14]
    }
  });
}

const CENTROID_QUESTIONS = [

// ---------- 1 ----------
{
  id: 1, topic: "Vocabulary", type: "mc",
  prompt: "A <strong>median</strong> of a triangle is a segment that connects&hellip;",
  choices: [
    "a vertex to the midpoint of the opposite side",
    "a vertex to the opposite side, meeting it at a right angle",
    "the midpoints of two sides",
    "a vertex to the center of the triangle"
  ],
  correct: 0,
  explanation: [
    "A median always starts at a <strong>vertex</strong> (a corner).",
    "It ends at the <strong>midpoint</strong> of the side across from that vertex &mdash; the point that cuts that side into two equal halves.",
    "Every triangle has exactly three medians, one from each vertex."
  ],
  distractorNotes: {
    1: "That's an <em>altitude</em>. An altitude hits the opposite side at 90°, but it doesn't have to land on the midpoint.",
    2: "That's a <em>midsegment</em>. A median always starts at a vertex, not at a midpoint.",
    3: "\"Center\" is vague &mdash; the median is defined by where it ends: the <em>midpoint of the opposite side</em>."
  }
},

// ---------- 2 ----------
{
  id: 2, topic: "Vocabulary", type: "mc",
  prompt: "The <strong>centroid</strong> of a triangle is the point where the three ______ intersect.",
  choices: ["medians", "altitudes", "angle bisectors", "perpendicular bisectors"],
  correct: 0,
  explanation: [
    "Draw all three medians (vertex &rarr; midpoint of the opposite side).",
    "They always cross at one single point &mdash; that point is the <strong>centroid</strong>.",
    "Fun fact: the centroid is the triangle's balance point. A cardboard triangle balances on a pencil tip placed at its centroid."
  ],
  distractorNotes: {
    1: "Altitudes meet at the <em>orthocenter</em>, not the centroid.",
    2: "Angle bisectors meet at the <em>incenter</em>.",
    3: "Perpendicular bisectors meet at the <em>circumcenter</em>."
  }
},

// ---------- 3 ----------
{
  id: 3, topic: "The 2 : 1 Rule", type: "mc",
  prompt: "G is the centroid of ΔABC. AD, BE, and CF are medians. Which statement is <strong>always</strong> true?",
  diagram: centroidFigure({ A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G" }),
  choices: ["AG = 2 · GD", "AG = GD", "GD = 2 · AG", "AG = ⅓ · AD"],
  correct: 0,
  explanation: [
    "The centroid splits every median into two pieces in a <strong>2 : 1</strong> ratio.",
    "The <strong>long piece</strong> is always the one touching the <strong>vertex</strong> (AG); the <strong>short piece</strong> touches the <strong>midpoint</strong> (GD).",
    "So AG is twice GD: <strong>AG = 2 · GD</strong>. Equivalently, AG = ⅔ · AD and GD = ⅓ · AD."
  ],
  distractorNotes: {
    1: "G is not the midpoint of the median. The vertex side (AG) is twice as long as the midpoint side (GD).",
    2: "This has it backwards. The piece next to the <em>vertex</em> is the long one, so AG = 2 · GD, not the other way around.",
    3: "⅓ is the <em>short</em> piece (GD). The vertex piece AG is ⅔ of the whole median."
  }
},

// ---------- 4 ----------
{
  id: 4, topic: "Vocabulary", type: "multi",
  prompt: "Select <strong>all</strong> statements that are true about the centroid of a triangle.",
  choices: [
    "It is always inside the triangle.",
    "It divides each median so the vertex piece is twice the midpoint piece.",
    "It is the triangle's balance point (center of gravity).",
    "It is the same distance from all three vertices.",
    "For an obtuse triangle, it lands outside the triangle."
  ],
  correctSet: [0, 1, 2],
  explanation: [
    "All three medians run through the inside of the triangle, so the point where they cross is <strong>always inside</strong> &mdash; even for obtuse triangles.",
    "The centroid splits each median <strong>2 : 1</strong>, long piece at the vertex.",
    "It is the triangle's <strong>balance point</strong>.",
    "It is <em>not</em> generally the same distance from all three vertices &mdash; that's the circumcenter."
  ],
  distractorNotes: {
    3: "Being equidistant from all three vertices describes the <em>circumcenter</em>, not the centroid.",
    4: "The centroid never leaves the triangle. (The orthocenter and circumcenter can land outside an obtuse triangle &mdash; the centroid can't.)"
  }
},

// ---------- 5 ----------
{
  id: 5, topic: "The 2 : 1 Rule", type: "input",
  prompt: "G is the centroid of ΔABC and median <strong>AD = 27</strong>. Find AG and GD.",
  diagram: centroidFigure(
    { A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G" },
    { "A-G": ["?", -6, -10], "G-D": ["?", 8, -6] }
  ),
  fields: [
    { key: "AG", label: "AG =", accept: [18] },
    { key: "GD", label: "GD =", accept: [9] }
  ],
  explanation: [
    "The whole median is split into 3 equal parts: 2 parts for AG and 1 part for GD.",
    "One part = 27 ÷ 3 = 9.",
    "<strong>AG = 2 × 9 = 18</strong> and <strong>GD = 9</strong>.",
    "Check: 18 + 9 = 27 ✔ and 18 is twice 9 ✔"
  ],
  mistakes: [
    { key: "AG", near: 13.5, note: "It looks like the median was cut in half. The centroid isn't the midpoint &mdash; split 27 into <em>3</em> parts, and AG gets 2 of them." },
    { key: "GD", near: 13.5, note: "It looks like the median was cut in half. Split 27 into 3 parts; GD (next to the midpoint) gets just 1 part: 9." },
    { key: "AG", near: 9, note: "Those two look swapped. AG touches the <em>vertex</em>, so it's the <em>long</em> piece (18)." },
    { key: "GD", near: 18, note: "Those two look swapped. GD touches the <em>midpoint</em>, so it's the <em>short</em> piece (9)." }
  ]
},

// ---------- 6 ----------
{
  id: 6, topic: "The 2 : 1 Rule", type: "input",
  prompt: "P is the centroid of ΔXYZ, and M is the midpoint of YZ. If <strong>XP = 14</strong>, find PM and the whole median XM.",
  diagram: centroidFigure(
    { A: "X", B: "Y", C: "Z", D: "M", E: "N", F: "L", G: "P" },
    { "A-G": ["14", -6, -10] }
  ),
  fields: [
    { key: "PM", label: "PM =", accept: [7] },
    { key: "XM", label: "XM =", accept: [21] }
  ],
  explanation: [
    "XP is the vertex piece (the long one), so it's twice PM.",
    "PM = 14 ÷ 2 = <strong>7</strong>.",
    "XM = XP + PM = 14 + 7 = <strong>21</strong>."
  ],
  mistakes: [
    { key: "PM", near: 28, note: "PM is the <em>short</em> piece, so divide by 2 instead of multiplying: 14 ÷ 2 = 7." },
    { key: "XM", near: 42, note: "It looks like 14 was multiplied by 3. But 14 is only <em>2</em> of the 3 parts, not 1 part. One part is 7, so the whole median is 3 × 7 = 21." },
    { key: "XM", near: 28, note: "Add the two pieces: XP + PM = 14 + 7 = 21." }
  ]
},

// ---------- 7 ----------
{
  id: 7, topic: "The 2 : 1 Rule", type: "input",
  prompt: "G is the centroid of ΔABC. The short piece of median AD is <strong>GD = 6</strong>. Find AG and AD.",
  diagram: centroidFigure(
    { A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G" },
    { "G-D": ["6", 8, -6] }
  ),
  fields: [
    { key: "AG", label: "AG =", accept: [12] },
    { key: "AD", label: "AD =", accept: [18] }
  ],
  explanation: [
    "GD is 1 part, and AG is 2 parts.",
    "AG = 2 × 6 = <strong>12</strong>.",
    "AD = AG + GD = 12 + 6 = <strong>18</strong> (that's 3 parts: 3 × 6)."
  ],
  mistakes: [
    { key: "AG", near: 3, note: "AG is the <em>long</em> piece next to the vertex, so it's double GD, not half: 2 × 6 = 12." },
    { key: "AD", near: 12, note: "That's just AG. The whole median is AG + GD = 12 + 6 = 18." }
  ]
},

// ---------- 8 ----------
{
  id: 8, topic: "Sides & Medians", type: "input",
  prompt: "Q is the centroid of ΔKLM. N is the midpoint of KL, so MN is a median. If <strong>KL = 30</strong> and <strong>MQ = 16</strong>, find KN, QN, and MN.",
  diagram: centroidFigure(
    { A: "K", B: "L", C: "M", D: "R", E: "S", F: "N", G: "Q" },
    { "C-G": ["16", -12, 0] }
  ),
  fields: [
    { key: "KN", label: "KN =", accept: [15] },
    { key: "QN", label: "QN =", accept: [8] },
    { key: "MN", label: "MN =", accept: [24] }
  ],
  explanation: [
    "N is the <strong>midpoint</strong> of KL, so it cuts the side in half: KN = 30 ÷ 2 = <strong>15</strong>. (Careful &mdash; sides get cut in <em>half</em>; medians get cut <em>2 : 1</em>.)",
    "MQ is the vertex piece of median MN, so QN is half of it: QN = 16 ÷ 2 = <strong>8</strong>.",
    "MN = MQ + QN = 16 + 8 = <strong>24</strong>."
  ],
  mistakes: [
    { key: "KN", near: 30, note: "N is the midpoint of KL, so KN is <em>half</em> of the side: 30 ÷ 2 = 15." },
    { key: "KN", near: 20, note: "The 2 : 1 rule is for <em>medians</em>, not sides. A midpoint cuts its side exactly in half: 30 ÷ 2 = 15." },
    { key: "QN", near: 32, note: "QN is the short piece (next to the midpoint), so it's half of MQ: 16 ÷ 2 = 8." },
    { key: "MN", near: 48, note: "16 is 2 of the 3 parts, not 1 part. One part = 8, so the whole median is 24." }
  ]
},

// ---------- 9 ----------
{
  id: 9, topic: "Sides & Medians", type: "input",
  prompt: "G is the centroid of ΔRST. The medians are RU, SV, and TW. If <strong>RG = 12</strong>, <strong>SG = 10</strong>, and <strong>GW = 4</strong>, find each measure.",
  diagram: centroidFigure(
    { A: "R", B: "S", C: "T", D: "U", E: "V", F: "W", G: "G" },
    { "A-G": ["12", -6, -10], "B-G": ["10", 6, -10], "G-F": ["4", 10, 4] }
  ),
  fields: [
    { key: "GU", label: "GU =", accept: [6] },
    { key: "SV", label: "SV =", accept: [15] },
    { key: "TG", label: "TG =", accept: [8] },
    { key: "TW", label: "TW =", accept: [12] }
  ],
  explanation: [
    "Median RU: RG = 12 is the vertex piece, so GU = 12 ÷ 2 = <strong>6</strong>.",
    "Median SV: SG = 10 is the vertex piece, so GV = 5 and SV = 10 + 5 = <strong>15</strong>.",
    "Median TW: GW = 4 is the midpoint piece, so TG = 2 × 4 = <strong>8</strong> and TW = 8 + 4 = <strong>12</strong>.",
    "Tip: for each median, first figure out whether the number you're given is the <em>vertex</em> piece (long) or the <em>midpoint</em> piece (short)."
  ],
  mistakes: [
    { key: "GU", near: 24, note: "GU touches the midpoint U, so it's the <em>short</em> piece: half of RG, which is 6." },
    { key: "SV", near: 30, note: "SG = 10 is 2 parts, not 1. One part = 5, so SV = 10 + 5 = 15." },
    { key: "TG", near: 2, note: "GW is the short piece, so TG (next to the vertex) is <em>double</em> it: 8." },
    { key: "TW", near: 8, note: "That's TG. The whole median TW = TG + GW = 8 + 4 = 12." }
  ]
},

// ---------- 10 ----------
{
  id: 10, topic: "Algebra with Centroids", type: "input",
  prompt: "G is the centroid of ΔABC, and AD is a median. If <strong>AG = 3x − 2</strong> and <strong>GD = x + 1</strong>, find x and AD.",
  diagram: centroidFigure(
    { A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G" },
    { "A-G": ["3x − 2", 4, -12], "G-D": ["x + 1", -8, -12] }
  ),
  fields: [
    { key: "x", label: "x =", accept: [4] },
    { key: "AD", label: "AD =", accept: [15] }
  ],
  explanation: [
    "The vertex piece is twice the midpoint piece: AG = 2 · GD.",
    "3x − 2 = 2(x + 1) &rarr; 3x − 2 = 2x + 2 &rarr; <strong>x = 4</strong>.",
    "AG = 3(4) − 2 = 10 and GD = 4 + 1 = 5. (10 is twice 5 ✔)",
    "AD = 10 + 5 = <strong>15</strong>."
  ],
  mistakes: [
    { key: "x", near: 1.5, note: "It looks like AG and GD were set <em>equal</em> (3x − 2 = x + 1). They aren't equal &mdash; AG is <em>twice</em> GD, so write 3x − 2 = 2(x + 1)." },
    { key: "AD", near: 10, note: "That's AG. AD is the whole median: AG + GD = 10 + 5 = 15." },
    { key: "AD", near: 5, note: "That's GD. AD is the whole median: AG + GD = 10 + 5 = 15." }
  ]
},

// ---------- 11 ----------
{
  id: 11, topic: "Algebra with Centroids", type: "input",
  prompt: "G is the centroid of ΔABC, and AD is a median. If <strong>GD = x + 3</strong> and the whole median <strong>AD = 5x − 3</strong>, find x and AG.",
  diagram: centroidFigure(
    { A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G" },
    { "G-D": ["x + 3", -8, -12] }
  ),
  given: "AD = 5x − 3 (the whole median from A to D)",
  fields: [
    { key: "x", label: "x =", accept: [6] },
    { key: "AG", label: "AG =", accept: [18] }
  ],
  explanation: [
    "GD is 1 part and the whole median AD is 3 parts, so AD = 3 · GD.",
    "5x − 3 = 3(x + 3) &rarr; 5x − 3 = 3x + 9 &rarr; 2x = 12 &rarr; <strong>x = 6</strong>.",
    "GD = 6 + 3 = 9 and AD = 5(6) − 3 = 27.",
    "AG = AD − GD = 27 − 9 = <strong>18</strong> (twice GD ✔)."
  ],
  mistakes: [
    { key: "x", near: 3, note: "It looks like you used AD = 2 · GD. The <em>whole</em> median is 3 parts, so AD = 3 · GD: 5x − 3 = 3(x + 3)." },
    { key: "AG", near: 27, note: "27 is the whole median AD. AG is only the vertex piece: 27 − 9 = 18." },
    { key: "AG", near: 9, note: "9 is GD, the short piece. AG is twice that: 18." }
  ]
},

// ---------- 12 ----------
{
  id: 12, topic: "Coordinate Plane", type: "input",
  prompt: "Step 1 of finding a centroid by graphing is finding midpoints. Find the midpoint of the side from <strong>D(−6, 1)</strong> to <strong>E(4, 7)</strong>.",
  diagram: buildCoordSVG({
    width: 300, height: 260, xMin: -8, xMax: 8, yMin: -3, yMax: 9,
    points: { D: [-6, 1], E: [4, 7] },
    edges: [{ from: "D", to: "E" }]
  }),
  fields: [
    { key: "x", label: "midpoint x =", accept: [-1] },
    { key: "y", label: "midpoint y =", accept: [4] }
  ],
  explanation: [
    "Midpoint = (average of the x's, average of the y's).",
    "x: (−6 + 4) ÷ 2 = −2 ÷ 2 = <strong>−1</strong>.",
    "y: (1 + 7) ÷ 2 = 8 ÷ 2 = <strong>4</strong>.",
    "The midpoint is <strong>(−1, 4)</strong>."
  ],
  mistakes: [
    { key: "x", near: 5, note: "It looks like you subtracted (4 − (−6) = 10, then ÷ 2). That gives half the <em>distance</em>, not the midpoint. <em>Add</em> the x's: (−6 + 4) ÷ 2 = −1." },
    { key: "y", near: 3, note: "It looks like you subtracted (7 − 1 = 6, then ÷ 2). For a midpoint, <em>add</em> the y's: (1 + 7) ÷ 2 = 4." },
    { key: "x", near: 1, note: "Watch the sign: −6 + 4 = −2, so the midpoint x is −1, not 1." }
  ]
},

// ---------- 13 ----------
{
  id: 13, topic: "Coordinate Plane", type: "input",
  prompt: "Find the coordinates of the centroid of ΔDEF with <strong>D(−6, 1)</strong>, <strong>E(4, 7)</strong>, and <strong>F(5, −2)</strong>.",
  diagram: buildCoordSVG({
    width: 300, height: 260, xMin: -8, xMax: 8, yMin: -4, yMax: 9,
    points: { D: [-6, 1], E: [4, 7], F: [5, -2] },
    edges: [{ from: "D", to: "E" }, { from: "E", to: "F" }, { from: "F", to: "D" }]
  }),
  fields: [
    { key: "x", label: "centroid x =", accept: [1] },
    { key: "y", label: "centroid y =", accept: [2] }
  ],
  explanation: [
    "Shortcut: the centroid is the <strong>average of the three vertices</strong>.",
    "x: (−6 + 4 + 5) ÷ 3 = 3 ÷ 3 = <strong>1</strong>.",
    "y: (1 + 7 + (−2)) ÷ 3 = 6 ÷ 3 = <strong>2</strong>.",
    "The centroid is <strong>(1, 2)</strong>. If you graph two medians (vertex &rarr; midpoint of opposite side), they cross right at (1, 2) &mdash; same answer."
  ],
  mistakes: [
    { key: "x", near: 1.5, note: "There are <em>three</em> vertices, so divide by 3, not 2: 3 ÷ 3 = 1." },
    { key: "y", near: 3, note: "There are <em>three</em> vertices, so divide by 3, not 2: 6 ÷ 3 = 2." },
    { key: "x", near: 3, note: "That's the sum of the x's. Divide by 3 to average them: 3 ÷ 3 = 1." },
    { key: "y", near: 6, note: "That's the sum of the y's. Divide by 3 to average them: 6 ÷ 3 = 2." }
  ]
},

// ---------- 14 ----------
{
  id: 14, topic: "Coordinate Plane", type: "input",
  prompt: "Graph ΔPQR with <strong>P(−9, 3)</strong>, <strong>Q(3, 9)</strong>, and <strong>R(0, −6)</strong>, then find the centroid.",
  diagram: buildCoordSVG({
    width: 300, height: 290, xMin: -10, xMax: 5, yMin: -7, yMax: 10,
    points: { P: [-9, 3], Q: [3, 9], R: [0, -6] },
    edges: [{ from: "P", to: "Q" }, { from: "Q", to: "R" }, { from: "R", to: "P" }]
  }),
  fields: [
    { key: "x", label: "centroid x =", accept: [-2] },
    { key: "y", label: "centroid y =", accept: [2] }
  ],
  explanation: [
    "Average the x's: (−9 + 3 + 0) ÷ 3 = −6 ÷ 3 = <strong>−2</strong>.",
    "Average the y's: (3 + 9 + (−6)) ÷ 3 = 6 ÷ 3 = <strong>2</strong>.",
    "The centroid is <strong>(−2, 2)</strong>.",
    "Graphing check: the midpoint of QR is (1.5, 1.5). The median from P(−9, 3) to (1.5, 1.5) passes through (−2, 2), exactly ⅔ of the way from P."
  ],
  mistakes: [
    { key: "x", near: -3, note: "Divide by 3 (three vertices), not 2: −6 ÷ 3 = −2." },
    { key: "y", near: 3, note: "Divide by 3 (three vertices), not 2: 6 ÷ 3 = 2." },
    { key: "y", near: 6, note: "Remember R's y-coordinate is <em>negative</em> 6: 3 + 9 − 6 = 6, then 6 ÷ 3 = 2." }
  ]
},

// ---------- 15 ----------
{
  id: 15, topic: "Coordinate Plane", type: "input",
  prompt: "<strong>Challenge:</strong> The centroid of ΔABC is <strong>G(3, 1)</strong>. Two vertices are <strong>A(0, 4)</strong> and <strong>B(7, −2)</strong>. Find vertex C.",
  fields: [
    { key: "x", label: "C x =", accept: [2] },
    { key: "y", label: "C y =", accept: [1] }
  ],
  explanation: [
    "Work the average backwards. The x's must average to 3, so they must <em>add up</em> to 3 × 3 = 9.",
    "0 + 7 + x = 9 &rarr; <strong>x = 2</strong>.",
    "The y's must add up to 3 × 1 = 3: 4 + (−2) + y = 3 &rarr; <strong>y = 1</strong>.",
    "C = <strong>(2, 1)</strong>. Check: (0 + 7 + 2) ÷ 3 = 3 ✔ and (4 − 2 + 1) ÷ 3 = 1 ✔"
  ],
  mistakes: [
    { key: "x", near: 9, note: "9 is what all three x's must <em>add up to</em>. Subtract the two you know: 9 − 0 − 7 = 2." },
    { key: "y", near: 3, note: "3 is what all three y's must <em>add up to</em>. Subtract the two you know: 3 − 4 − (−2) = 1." },
    { key: "x", near: -4, note: "Check the setup: 0 + 7 + x = 9, so x = 2." }
  ]
}

];
