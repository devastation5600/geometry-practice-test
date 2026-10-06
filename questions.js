/* questions.js — 20-question Congruent Triangles practice test.
   Topics mirror the test-review packet: congruence postulates (SSS,
   SAS, ASA, AAS, HL), CPCTC algebra, perimeter problems, coordinate
   classification, two-column & flowchart proofs, angle relationships
   (linear pairs / vertical angles / exterior angle theorem), and
   rigid-motion transformations.
*/

const QUESTIONS = [

// ---------- 1 ----------
{
  id: 1, topic: "Congruence Postulates", type: "mc",
  prompt: "Look at the tick marks on the two triangles below. Which postulate proves ΔABC ≅ ΔDEF?",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { A:[30,160], B:[130,160], C:[80,50], D:[190,160], E:[290,160], F:[240,50] },
    edges: [
      {from:"A",to:"B",ticks:1}, {from:"B",to:"C",ticks:2}, {from:"A",to:"C",ticks:3},
      {from:"D",to:"E",ticks:1}, {from:"E",to:"F",ticks:2}, {from:"D",to:"F",ticks:3}
    ]
  }),
  choices: ["SSS", "SAS", "ASA", "HL"],
  correct: 0,
  explanation: [
    "All three pairs of sides are marked congruent: AB ≅ DE (1 tick), BC ≅ EF (2 ticks), AC ≅ DF (3 ticks).",
    "No angles are marked at all, so we only have side &ndash; side &ndash; side information.",
    "Three pairs of congruent sides &rarr; <strong>SSS (Side-Side-Side) Postulate</strong>."
  ],
  distractorNotes: {
    1: "SAS needs an <em>angle</em> between two marked sides. Every mark here is a side tick &mdash; there isn't a single angle arc anywhere in the figure, so SAS doesn't fit.",
    2: "ASA needs two marked angles with a side between them. No angles are marked here at all.",
    3: "HL (Hypotenuse-Leg) only applies to <em>right</em> triangles, and neither triangle has a right-angle mark."
  }
},

// ---------- 2 ----------
{
  id: 2, topic: "Congruence Postulates", type: "mc",
  prompt: "ΔXYZ and ΔLMN are marked as shown. Which postulate proves they're congruent?",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { X:[30,160], Y:[130,160], Z:[80,50], L:[190,160], M:[290,160], N:[240,50] },
    edges: [
      {from:"X",to:"Y",ticks:1}, {from:"Y",to:"Z",ticks:2},
      {from:"L",to:"M",ticks:1}, {from:"M",to:"N",ticks:2}
    ],
    angles: [
      {at:"Y", rays:["X","Z"], mark:"arc1"},
      {at:"M", rays:["L","N"], mark:"arc1"}
    ]
  }),
  choices: ["SAS", "ASA", "AAS", "SSA"],
  correct: 0,
  explanation: [
    "XY ≅ LM (1 tick) and YZ ≅ MN (2 ticks) are both marked.",
    "The marked angle is at Y, which sits exactly between sides XY and YZ &mdash; it's the <strong>included angle</strong>.",
    "Two sides with the included angle between them &rarr; <strong>SAS (Side-Angle-Side) Postulate</strong>."
  ],
  distractorNotes: {
    1: "ASA needs <em>two</em> marked angles. Only one angle (at Y/M) is marked here &mdash; the other vertices have no angle arcs.",
    2: "AAS also needs two angles. We only have one angle and two sides, so it can't be AAS.",
    3: "\"SSA\" (side-side-angle, angle not included) isn't a valid congruence shortcut in general &mdash; and it doesn't match this figure anyway, since the marked angle IS included between the two marked sides."
  }
},

// ---------- 3 ----------
{
  id: 3, topic: "Congruence Postulates", type: "mc",
  prompt: "In the diagram, ∠P ≅ ∠S, ∠Q ≅ ∠T, and the side between the marked angles is also congruent. Which postulate applies?",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { P:[30,160], Q:[130,160], R:[80,50], S:[190,160], T:[290,160], U:[240,50] },
    edges: [ {from:"P",to:"Q",ticks:1}, {from:"S",to:"T",ticks:1} ],
    angles: [
      {at:"P", rays:["Q","R"], mark:"arc1"}, {at:"S", rays:["T","U"], mark:"arc1"},
      {at:"Q", rays:["P","R"], mark:"arc2"}, {at:"T", rays:["S","U"], mark:"arc2"}
    ]
  }),
  choices: ["AAS", "ASA", "SAS", "HL"],
  correct: 1,
  explanation: [
    "∠P ≅ ∠S and ∠Q ≅ ∠T are the two marked angles.",
    "Side PQ connects vertices P and Q &mdash; exactly the two angle vertices &mdash; so PQ is the <strong>included side</strong> between the two marked angles.",
    "Two angles with the included side between them &rarr; <strong>ASA (Angle-Side-Angle) Postulate</strong>."
  ],
  distractorNotes: {
    0: "AAS is for when the marked side is <em>not</em> between the two marked angles (it's opposite one of them). Here PQ connects P and Q directly, so it <em>is</em> the included side &mdash; that makes it ASA, not AAS.",
    2: "SAS needs two sides with an angle between them. Here we have two angles with a side between them &mdash; that's the opposite pattern.",
    3: "HL only applies to right triangles; no right angle is marked in this figure."
  }
},

// ---------- 4 ----------
{
  id: 4, topic: "Congruence Postulates", type: "mc",
  prompt: "In the diagram, ∠D ≅ ∠G and ∠E ≅ ∠H. The congruent side (EF ≅ HI) is opposite ∠D and ∠G. Which postulate applies?",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { D:[30,160], E:[130,160], F:[80,50], G:[190,160], H:[290,160], I:[240,50] },
    edges: [ {from:"E",to:"F",ticks:1}, {from:"H",to:"I",ticks:1} ],
    angles: [
      {at:"D", rays:["E","F"], mark:"arc1"}, {at:"G", rays:["H","I"], mark:"arc1"},
      {at:"E", rays:["D","F"], mark:"arc2"}, {at:"H", rays:["G","I"], mark:"arc2"}
    ]
  }),
  choices: ["ASA", "AAS", "SAS", "SSS"],
  correct: 1,
  explanation: [
    "∠D ≅ ∠G and ∠E ≅ ∠H are the two marked angles.",
    "Side EF connects E and F &mdash; F is not an angle vertex that was marked, so EF is <strong>not</strong> the side between the two marked angles (that would be DE). EF is the non-included side, opposite ∠D/∠G.",
    "Two angles with a <em>non</em>-included side &rarr; <strong>AAS (Angle-Angle-Side) Postulate</strong>."
  ],
  distractorNotes: {
    0: "ASA requires the marked side to sit directly between the two marked angles. The included side here would be DE, but the side that's actually marked is EF &mdash; the non-included side. That's AAS, not ASA.",
    2: "SAS needs two sides and an included angle; here we have two angles and one side, so it's the reverse pattern.",
    3: "SSS needs three marked sides; only one side is marked here."
  }
},

// ---------- 5 ----------
{
  id: 5, topic: "Congruence Postulates", type: "mc",
  prompt: "Both triangles are right triangles. The hypotenuses are marked congruent, and one pair of legs is marked congruent. Which postulate applies?",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { A:[30,50], B:[30,160], C:[130,160], D:[190,50], E:[190,160], F:[290,160] },
    edges: [
      {from:"A",to:"B",ticks:2}, {from:"A",to:"C",ticks:1},
      {from:"D",to:"E",ticks:2}, {from:"D",to:"F",ticks:1}
    ],
    angles: [ {at:"B", rays:["A","C"], mark:"right"}, {at:"E", rays:["D","F"], mark:"right"} ]
  }),
  choices: ["SAS", "ASA", "HL", "AAS"],
  correct: 2,
  explanation: [
    "Both triangles have a right angle (marked at B and E).",
    "The hypotenuses AC and DF are marked congruent (1 tick), and one pair of legs AB and DE are marked congruent (2 ticks).",
    "Right angle + congruent hypotenuse + congruent leg &rarr; <strong>HL (Hypotenuse-Leg) Theorem</strong> &mdash; this shortcut only exists for right triangles."
  ],
  distractorNotes: {
    0: "SAS would need the marked right angle to sit <em>between</em> the two marked congruent sides. Here the right angle is at B, between leg AB and leg BC &mdash; but BC isn't one of the marked congruent sides (the hypotenuse AC is). So the standard SAS pattern doesn't apply; this needs the special right-triangle shortcut, HL.",
    1: "ASA needs two marked angles; only one angle (the right angle) is marked here.",
    3: "AAS needs two marked angles; again, only one angle is marked."
  }
},

// ---------- 6 ----------
{
  id: 6, topic: "CPCTC Algebra", type: "input",
  prompt: "ΔABC ≅ ΔPQR. Use the corresponding angles to solve for x and y.",
  given: "Correspondence: A &harr; P, B &harr; Q, C &harr; R.",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { A:[30,160], B:[130,160], C:[80,50], P:[190,160], Q:[290,160], R:[240,50] },
    angles: [
      {at:"A", rays:["B","C"], mark:"arc1", label:"(4x+10)°", labelOffset:[-14,-12]},
      {at:"B", rays:["A","C"], mark:"arc1", label:"(7y-3)°", labelOffset:[14,-12]},
      {at:"P", rays:["Q","R"], mark:"arc1", label:"58°", labelOffset:[-10,-12]},
      {at:"Q", rays:["P","R"], mark:"arc1", label:"74°", labelOffset:[10,-12]}
    ]
  }),
  fields: [
    { key: "x", label: "x =", accept: [12] },
    { key: "y", label: "y =", accept: [11] }
  ],
  explanation: [
    "∠A corresponds to ∠P (both are the first letter in the congruence statement), so m∠A = m∠P:",
    "4x + 10 = 58 &rarr; 4x = 48 &rarr; <strong>x = 12</strong>",
    "∠B corresponds to ∠Q, so m∠B = m∠Q:",
    "7y &minus; 3 = 74 &rarr; 7y = 77 &rarr; <strong>y = 11</strong>"
  ],
  mistakes: [
    { key: "x", near: 17, note: "It looks like you added 10 instead of subtracting it (4x = 58 + 10 = 68). Since the equation is 4x + 10 = 58, move the +10 to the other side by <em>subtracting</em> 10 from both sides: 4x = 48, so x = 12." },
    { key: "x", near: 14.5, note: "It looks like the +10 got dropped. Keep both sides balanced: 4x + 10 = 58 &rarr; subtract 10 from both sides first (4x = 48), then divide by 4." },
    { key: "y", near: 10.14, note: "It looks like &minus;3 was subtracted again instead of added back. From 7y &minus; 3 = 74, add 3 to both sides: 7y = 77, then y = 11." }
  ]
},

// ---------- 7 ----------
{
  id: 7, topic: "CPCTC Algebra", type: "input",
  prompt: "ΔJKL ≅ ΔMNO. Use the corresponding sides and angles to solve for x and y.",
  given: "Correspondence: J &harr; M, K &harr; N, L &harr; O.",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { J:[30,160], K:[130,160], L:[80,50], M:[190,160], N:[290,160], O:[240,50] },
    edges: [
      {from:"J",to:"K", label:"(2x+5) ft", labelOffset:[0,16]},
      {from:"M",to:"N", label:"21 ft", labelOffset:[0,16]}
    ],
    angles: [
      {at:"L", rays:["J","K"], mark:"arc1", label:"(9y-4)°", labelOffset:[0,-14]},
      {at:"O", rays:["M","N"], mark:"arc1", label:"68°", labelOffset:[0,-14]}
    ]
  }),
  fields: [
    { key: "x", label: "x =", accept: [8] },
    { key: "y", label: "y =", accept: [8] }
  ],
  explanation: [
    "JK corresponds to MN, so JK = MN:",
    "2x + 5 = 21 &rarr; 2x = 16 &rarr; <strong>x = 8</strong>",
    "∠L corresponds to ∠O, so m∠L = m∠O:",
    "9y &minus; 4 = 68 &rarr; 9y = 72 &rarr; <strong>y = 8</strong>"
  ],
  mistakes: [
    { key: "x", near: 10.5, note: "It looks like +5 was ignored. From 2x + 5 = 21, subtract 5 from both sides first: 2x = 16, then divide by 2 to get x = 8." },
    { key: "y", near: 7.56, note: "It looks like &minus;4 was subtracted instead of added. From 9y &minus; 4 = 68, add 4 to both sides: 9y = 72, then y = 8." }
  ]
},

// ---------- 8 ----------
{
  id: 8, topic: "Perimeter & CPCTC", type: "input",
  prompt: "ΔABC ≅ ΔDEF. The perimeter of ΔABC is 150 ft. Find x, then use CPCTC to find DF.",
  given: "AB = 3x ft, BC = (2x + 10) ft, AC = (x + 20) ft. Correspondence: A &harr; D, B &harr; E, C &harr; F.",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { A:[30,160], B:[130,160], C:[80,50], D:[190,160], E:[290,160], F:[240,50] },
    edges: [
      {from:"A",to:"B", label:"3x ft", labelOffset:[0,16]},
      {from:"B",to:"C", label:"(2x+10) ft", labelOffset:[22,-4]},
      {from:"A",to:"C", label:"(x+20) ft", labelOffset:[-22,-4]}
    ]
  }),
  fields: [
    { key: "x", label: "x =", accept: [20] },
    { key: "DF", label: "DF = ___ ft", accept: [40] }
  ],
  explanation: [
    "The three sides of ΔABC must add up to the perimeter:",
    "3x + (2x + 10) + (x + 20) = 150 &rarr; 6x + 30 = 150 &rarr; 6x = 120 &rarr; <strong>x = 20</strong>",
    "AC = x + 20 = 20 + 20 = 40 ft.",
    "AC corresponds to DF (A &harr; D, C &harr; F), so by CPCTC, <strong>DF = 40 ft</strong>."
  ],
  mistakes: [
    { key: "x", near: 15, note: "Double check the perimeter equation &mdash; all three expressions need to be added together: 3x + (2x+10) + (x+20) = 150, which combines to 6x + 30 = 150, not 6x + 30 = 126 or similar. Re-add the x-terms (3x+2x+x=6x) and the constants (10+20=30) carefully." },
    { key: "DF", near: 60, note: "That's the value of AB (3x = 60), not AC. DF corresponds to AC (A&harr;D, C&harr;F) because D and F are the first and third letters, matching A and C. Recompute AC = x + 20." },
    { key: "DF", near: 50, note: "That's the value of BC (2x+10 = 50), not AC. Match letters by position: DF corresponds to AC, not BC. Recompute AC = x + 20 = 40." }
  ]
},

// ---------- 9 ----------
{
  id: 9, topic: "CPCTC Algebra", type: "input",
  prompt: "ΔABC ≅ ΔXYZ, with AB = 12 ft, AC = 15 ft, and BC = 17 ft. Use CPCTC to find XZ.",
  given: "Correspondence: A &harr; X, B &harr; Y, C &harr; Z.",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { A:[30,160], B:[130,160], C:[80,50], X:[190,160], Y:[290,160], Z:[240,50] },
    edges: [
      {from:"A",to:"B", label:"12 ft", labelOffset:[0,16]},
      {from:"A",to:"C", label:"15 ft", labelOffset:[-16,-4]},
      {from:"B",to:"C", label:"17 ft", labelOffset:[16,-4]}
    ]
  }),
  fields: [ { key: "XZ", label: "XZ = ___ ft", accept: [15] } ],
  explanation: [
    "Match letters by position in the congruence statement: A &harr; X and C &harr; Z, so side AC corresponds to side XZ.",
    "AC = 15 ft, so by CPCTC, <strong>XZ = 15 ft</strong>."
  ],
  mistakes: [
    { key: "XZ", near: 12, note: "That's AB, which corresponds to XY (A&harr;X, B&harr;Y) &mdash; not XZ. For XZ, match A&harr;X and C&harr;Z, which points to side AC = 15 ft." },
    { key: "XZ", near: 17, note: "That's BC, which corresponds to YZ (B&harr;Y, C&harr;Z) &mdash; not XZ. For XZ, you need the side between A and C: AC = 15 ft." }
  ]
},

// ---------- 10 ----------
{
  id: 10, topic: "Coordinate & Conceptual Proof", type: "mc",
  prompt: "C is the midpoint of both AD and BE. Can you prove ΔABC ≅ ΔDEC? If so, which postulate would you use?",
  diagram: buildFigureSVG({
    width: 300, height: 200,
    points: { A:[40,40], B:[260,40], C:[150,100], D:[260,160], E:[40,160] },
    edges: [
      {from:"A",to:"C",ticks:1}, {from:"C",to:"D",ticks:1},
      {from:"B",to:"C",ticks:2}, {from:"C",to:"E",ticks:2},
      {from:"A",to:"B"}, {from:"D",to:"E"}
    ],
    angles: [ {at:"C", rays:["A","B"], mark:"arc1"}, {at:"C", rays:["D","E"], mark:"arc1"} ]
  }),
  choices: ["No &mdash; not enough information", "Yes, by SSS", "Yes, by SAS", "Yes, by ASA"],
  correct: 2,
  explanation: [
    "Since C is the midpoint of AD: AC ≅ DC.",
    "Since C is the midpoint of BE: BC ≅ EC.",
    "∠ACB and ∠DCE are <strong>vertical angles</strong> (formed by the two crossing segments), so ∠ACB ≅ ∠DCE.",
    "Two sides and the included angle between them &rarr; <strong>Yes, by SAS</strong>."
  ],
  distractorNotes: {
    0: "There actually is enough information &mdash; the midpoint facts give two pairs of congruent sides, and vertical angles give a congruent included angle for free.",
    1: "SSS would need a third pair of congruent sides (AB ≅ DE), which isn't given. We only have 2 sides + the vertical angle between them &mdash; that's SAS.",
    3: "ASA needs two angles with a side between them. Here we only have one proven angle pair (the vertical angles); the other two angles aren't marked."
  }
},

// ---------- 11 ----------
{
  id: 11, topic: "Two-Column Proofs", type: "mc",
  prompt: "Fill in the missing reasons for statements 4 and 5 of this proof.",
  given: "Given: PT ≅ RS, QT ≅ QS, Q is the midpoint of PR. Prove: ΔPQT ≅ ΔRQS.",
  diagram: buildFigureSVG({
    width: 300, height: 190,
    points: { P:[30,150], Q:[140,150], R:[250,150], T:[80,40], S:[200,40] },
    edges: [
      {from:"P",to:"Q",ticks:1}, {from:"Q",to:"R",ticks:1},
      {from:"P",to:"T",ticks:2}, {from:"R",to:"S",ticks:2},
      {from:"Q",to:"T",ticks:3}, {from:"Q",to:"S",ticks:3}
    ]
  }),
  given2table: [
    ["1. PT ≅ RS", "Given"],
    ["2. QT ≅ QS", "Given"],
    ["3. Q is the midpoint of PR", "Given"],
    ["4. PQ ≅ QR", "?"],
    ["5. ΔPQT ≅ ΔRQS", "?"]
  ],
  choices: [
    "Reflexive Property; SAS",
    "Definition of Midpoint; SSS",
    "Definition of Midpoint; SAS",
    "Definition of Bisector; ASA"
  ],
  correct: 1,
  explanation: [
    "Statement 4 (PQ ≅ QR) follows directly from \"Q is the midpoint of PR\" &mdash; that's the <strong>Definition of Midpoint</strong> (a midpoint splits a segment into two congruent halves).",
    "By statement 5 we now have three pairs of congruent sides: PT ≅ RS (given), QT ≅ QS (given), and PQ ≅ QR (just proven) &mdash; three sides, no marked angle.",
    "Three congruent sides &rarr; <strong>SSS</strong>."
  ],
  distractorNotes: {
    0: "Reflexive Property is for a side <em>shared</em> by both triangles (the exact same segment used twice). PQ and QR are different segments that happen to be equal because Q is a midpoint &mdash; that's Definition of Midpoint, not Reflexive.",
    2: "We have three pairs of congruent sides here (PT≅RS, QT≅QS, PQ≅QR) and no marked angle at all, so the postulate must be SSS, not SAS.",
    3: "\"Bisector\" usually refers to a bisecting line/ray/angle; here Q is specifically called a <strong>midpoint</strong> of segment PR, so \"Definition of Midpoint\" is the precise reason."
  }
},

// ---------- 12 ----------
{
  id: 12, topic: "Two-Column Proofs", type: "mc",
  prompt: "Fill in the missing reasons for statements 3 and 5 of this proof.",
  given: "Given: CB is a perpendicular bisector of AD. Prove: ΔABC ≅ ΔDBC.",
  diagram: buildFigureSVG({
    width: 280, height: 190,
    points: { A:[30,150], B:[130,150], D:[230,150], C:[130,40] },
    edges: [
      {from:"A",to:"B",ticks:1}, {from:"B",to:"D",ticks:1},
      {from:"A",to:"C"}, {from:"D",to:"C"}, {from:"B",to:"C"}
    ],
    angles: [
      {at:"B", rays:["A","C"], mark:"right"},
      {at:"B", rays:["D","C"], mark:"right"}
    ]
  }),
  given2table: [
    ["1. CB is a perpendicular bisector of AD", "Given"],
    ["2. AB ≅ DB", "Definition of Bisector"],
    ["3. ∠ABC ≅ ∠DBC", "?"],
    ["4. BC ≅ BC", "Reflexive Property"],
    ["5. ΔABC ≅ ΔDBC", "?"]
  ],
  choices: [
    "Vertical Angles; SSS",
    "All right angles are congruent; SAS",
    "Reflexive Property; ASA",
    "Definition of Bisector; SAS"
  ],
  correct: 1,
  explanation: [
    "Because CB is <em>perpendicular</em> to AD, both ∠ABC and ∠DBC are right angles. Since <strong>all right angles are congruent</strong>, ∠ABC ≅ ∠DBC.",
    "Now line up the parts: AB ≅ DB (side), ∠ABC ≅ ∠DBC (the included angle, right between those two sides), BC ≅ BC (side, shared).",
    "Two sides with the included angle &rarr; <strong>SAS</strong>."
  ],
  distractorNotes: {
    0: "∠ABC and ∠DBC aren't formed by two crossing lines meeting at a point away from both segments &mdash; they're two right angles created by a perpendicular segment, so \"all right angles are congruent\" is the precise reason, not vertical angles. And since we have 2 sides + an included angle (not 3 sides), it's SAS, not SSS.",
    2: "Reflexive Property is the reason for BC ≅ BC (statement 4, already given) &mdash; not for the angle in statement 3, which comes from the perpendicular lines forming right angles.",
    3: "\"Definition of Bisector\" was already used in statement 2 to get AB ≅ DB. Statement 3 is about the <em>angle</em>, which comes from the word \"perpendicular,\" not \"bisector.\""
  }
},

// ---------- 13 ----------
{
  id: 13, topic: "Flowchart Proofs", type: "mc",
  prompt: "This flowchart proof shows C is the midpoint of AE and the midpoint of BD. Fill in the two missing reasons that lead to the final conclusion.",
  diagram: buildFigureSVG({
    width: 300, height: 200,
    points: { A:[40,40], B:[260,40], C:[150,100], D:[40,160], E:[260,160] },
    edges: [
      {from:"A",to:"C",ticks:1}, {from:"C",to:"E",ticks:1},
      {from:"B",to:"C",ticks:2}, {from:"C",to:"D",ticks:2},
      {from:"A",to:"B"}, {from:"E",to:"D"}
    ],
    angles: [ {at:"C", rays:["A","B"], mark:"arc1"}, {at:"C", rays:["E","D"], mark:"arc1"} ]
  }),
  given2table: [
    ["C is the midpoint of AE (Given)", "&rarr; AC ≅ CE"],
    ["C is the midpoint of BD (Given)", "&rarr; BC ≅ CD"],
    ["∠ACB ≅ ∠ECD", "Reason 1: ?"],
    ["AC ≅ CE, BC ≅ CD, ∠ACB ≅ ∠ECD", "&rarr; ΔACB ≅ ΔECD &mdash; Reason 2: ?"]
  ],
  choices: [
    "Linear Pair; ASA",
    "Vertical Angles; SAS",
    "Vertical Angles; SSS",
    "Reflexive Property; SSS"
  ],
  correct: 1,
  explanation: [
    "∠ACB and ∠ECD are formed by the two segments AE and BD crossing at C, directly across from each other &mdash; that's the definition of <strong>vertical angles</strong>, and vertical angles are always congruent.",
    "Now we have AC ≅ CE (side), ∠ACB ≅ ∠ECD (the included angle), BC ≅ CD (side).",
    "Two sides with the included angle between them &rarr; <strong>SAS</strong>."
  ],
  distractorNotes: {
    0: "A linear pair is two <em>adjacent</em> angles that form a straight line and add to 180°. ∠ACB and ∠ECD are on opposite sides of the intersection, not adjacent &mdash; they're vertical angles instead. There are also only 2 given sides, not 2 given angles, so ASA doesn't fit.",
    2: "The angle reasoning (vertical angles) is right, but we only have 2 sides and 1 included angle here &mdash; not 3 sides &mdash; so the postulate is SAS, not SSS.",
    3: "Reflexive Property is for a segment shared by both triangles. AC/CE and BC/CD are congruent because C is a midpoint, not because they're the same segment reused &mdash; so this calls for Vertical Angles + SAS."
  }
},

// ---------- 14 ----------
{
  id: 14, topic: "Angle Relationships", type: "input",
  prompt: "In ΔABC, side AC is extended beyond C. Find the measure of the exterior angle at C (marked x°).",
  diagram: buildFigureSVG({
    width: 240, height: 190,
    points: { A:[30,165], B:[195,165], C:[150,55] },
    edges: [ {from:"A",to:"B"}, {from:"A",to:"C"}, {from:"B",to:"C"} ],
    extra: [ {from:"C", to:[201.5, 7.8]} ],
    angles: [
      {at:"A", rays:["B","C"], mark:"arc1", label:"35°", labelOffset:[22,-6]},
      {at:"B", rays:["A","C"], mark:"arc1", label:"65°", labelOffset:[-22,-6]},
      {at:"C", rays:["B",[201.5,7.8]], mark:"arc1", label:"x°", labelOffset:[14,6]}
    ]
  }),
  fields: [ { key: "x", label: "x =", accept: [100] } ],
  explanation: [
    "<strong>Exterior Angle Theorem:</strong> an exterior angle of a triangle equals the sum of the two remote (non-adjacent) interior angles.",
    "x = 35 + 65 = <strong>100°</strong>",
    "Check: the interior angle at C = 180 &minus; 35 &minus; 65 = 80°, and the exterior angle is supplementary to it: 180 &minus; 80 = 100°. Same answer either way."
  ],
  mistakes: [
    { key: "x", near: 80, note: "80° is the <em>interior</em> angle at C (180 &minus; 35 &minus; 65 = 80), not the exterior angle. The exterior angle is supplementary to the interior one: 180 &minus; 80 = 100°, which matches 35 + 65." },
    { key: "x", near: 180, note: "Don't just add all the angles to 180 and stop &mdash; that equation finds the <em>interior</em> angle at C (80°), not the exterior one. The exterior angle is the supplement of that: 180 &minus; 80 = 100°." }
  ]
},

// ---------- 15 ----------
{
  id: 15, topic: "Angle Relationships", type: "input",
  prompt: "Two lines intersect. One pair of vertical angles measures (3x + 10)° and (5x - 20)°. Solve for x, then find the angle measure.",
  diagram: buildFigureSVG({
    width: 280, height: 190,
    points: { O:[140,95] },
    extra: [ {from:[20,30], to:[260,160]}, {from:[20,160], to:[260,30]} ],
    angles: [
      {at:"O", rays:[[20,30],[260,30]], mark:"arc1", label:"(3x+10)°", labelOffset:[0,-30]},
      {at:"O", rays:[[260,160],[20,160]], mark:"arc1", label:"(5x-20)°", labelOffset:[0,30]}
    ],
    showPoints: false
  }),
  fields: [
    { key: "x", label: "x =", accept: [15] },
    { key: "angle", label: "angle = ___ °", accept: [55] }
  ],
  explanation: [
    "Vertical angles are always <strong>equal</strong>, so set the expressions equal to each other:",
    "3x + 10 = 5x &minus; 20 &rarr; 30 = 2x &rarr; <strong>x = 15</strong>",
    "Substitute back in: 3(15) + 10 = 45 + 10 = <strong>55°</strong>",
    "Check with the other expression: 5(15) &minus; 20 = 75 &minus; 20 = 55°. ✓ Matches."
  ],
  mistakes: [
    { key: "x", near: 23.75, note: "It looks like the two expressions were added and set equal to 180° (treating them like a linear pair). Vertical angles are formed by two crossing lines directly across from each other &mdash; they're always <em>equal</em>, not supplementary. Set 3x+10 = 5x-20 instead." },
    { key: "angle", near: 45, note: "45 is just 3x by itself without the +10. Once x = 15, plug all the way back in: 3(15) + 10 = 55°." }
  ]
},

// ---------- 16 ----------
{
  id: 16, topic: "Angle Relationships", type: "input",
  prompt: "∠1 and ∠2 form a linear pair along the straight line shown. m∠1 = (6x + 12)°, m∠2 = (2x + 8)°. Solve for x, then find m∠1.",
  diagram: buildFigureSVG({
    width: 280, height: 150,
    points: { Bl:[20,120], V:[140,120], Br:[260,120], Rtip:[100,20] },
    edges: [ {from:"Bl",to:"V"}, {from:"V",to:"Br"}, {from:"V",to:"Rtip"} ],
    angles: [
      {at:"V", rays:["Bl","Rtip"], mark:"arc1", label:"∠1", labelOffset:[-26,-14]},
      {at:"V", rays:["Rtip","Br"], mark:"arc2", label:"∠2", labelOffset:[18,-14]}
    ],
    showPoints: false
  }),
  fields: [
    { key: "x", label: "x =", accept: [20] },
    { key: "angle1", label: "m∠1 = ___ °", accept: [132] }
  ],
  explanation: [
    "A linear pair always adds to <strong>180°</strong> (the angles form a straight line):",
    "(6x + 12) + (2x + 8) = 180 &rarr; 8x + 20 = 180 &rarr; 8x = 160 &rarr; <strong>x = 20</strong>",
    "m∠1 = 6(20) + 12 = 120 + 12 = <strong>132°</strong>",
    "Check: m∠2 = 2(20) + 8 = 48°, and 132 + 48 = 180°. ✓"
  ],
  mistakes: [
    { key: "x", near: -1, note: "It looks like the two expressions were set <em>equal</em> to each other (like vertical angles) instead of added to 180° (like a linear pair). A linear pair is two adjacent angles forming a straight line &mdash; they're supplementary, not equal. A negative answer for x is a sign something's set up wrong: use (6x+12) + (2x+8) = 180 instead." },
    { key: "angle1", near: 48, note: "That's m∠2 (2x+8 with x=20), not m∠1. Use the expression for ∠1: 6x + 12 with x = 20." }
  ]
},

// ---------- 17 ----------
{
  id: 17, topic: "Coordinate Classification", type: "mc",
  prompt: "Plot ΔABC with A(0, 0), B(4, 0), and C(0, 4). Use the distance formula and slopes to classify the triangle by its sides AND its angles.",
  diagram: buildCoordSVG({
    width: 300, height: 260, xMin: -1, xMax: 5, yMin: -1, yMax: 5,
    points: { A:[0,0], B:[4,0], C:[0,4] },
    edges: [ {from:"A",to:"B"}, {from:"A",to:"C"}, {from:"B",to:"C"} ]
  }),
  choices: ["Scalene right", "Isosceles right", "Isosceles acute", "Equilateral"],
  correct: 1,
  explanation: [
    "Distance formula, d = &radic;[(x&#8322;&minus;x&#8321;)&sup2; + (y&#8322;&minus;y&#8321;)&sup2;]:",
    "AB = &radic;[(4&minus;0)&sup2; + (0&minus;0)&sup2;] = &radic;16 = 4",
    "AC = &radic;[(0&minus;0)&sup2; + (4&minus;0)&sup2;] = &radic;16 = 4",
    "BC = &radic;[(0&minus;4)&sup2; + (4&minus;0)&sup2;] = &radic;32 = 4&radic;2 &asymp; 5.66",
    "AB = AC &ne; BC &rarr; two sides congruent &rarr; <strong>isosceles</strong>.",
    "Slope of AB = 0 (horizontal); slope of AC is undefined (vertical). A horizontal and a vertical side are perpendicular &rarr; ∠A = 90° &rarr; <strong>right</strong> triangle.",
    "Final classification: <strong>isosceles right triangle</strong>."
  ],
  distractorNotes: {
    0: "The triangle does have a right angle at A, but two sides (AB and AC) are both length 4 &mdash; that makes it isosceles, not scalene (scalene means all three sides are different lengths).",
    2: "Two sides are congruent (isosceles is correct), but the angle at A is 90°, not acute &mdash; AB is horizontal and AC is vertical, so they're perpendicular.",
    3: "Equilateral needs all three sides equal. Here BC = 4&radic;2 &asymp; 5.66, which is longer than AB = AC = 4, so all three sides are not equal."
  }
},

// ---------- 18 ----------
{
  id: 18, topic: "Coordinate Classification", type: "mc",
  prompt: "Plot ΔABC with A(1, 1), B(5, 1), and C(5, 4). Classify the triangle by its sides AND its angles.",
  diagram: buildCoordSVG({
    width: 320, height: 260, xMin: -1, xMax: 7, yMin: -1, yMax: 6,
    points: { A:[1,1], B:[5,1], C:[5,4] },
    edges: [ {from:"A",to:"B"}, {from:"A",to:"C"}, {from:"B",to:"C"} ]
  }),
  choices: ["Isosceles obtuse", "Scalene acute", "Scalene right", "Isosceles right"],
  correct: 2,
  explanation: [
    "AB = &radic;[(5&minus;1)&sup2; + (1&minus;1)&sup2;] = &radic;16 = 4",
    "BC = &radic;[(5&minus;5)&sup2; + (4&minus;1)&sup2;] = &radic;9 = 3",
    "AC = &radic;[(5&minus;1)&sup2; + (4&minus;1)&sup2;] = &radic;[16+9] = &radic;25 = 5",
    "All three sides (3, 4, 5) are different &rarr; <strong>scalene</strong>.",
    "Check with the Converse of the Pythagorean Theorem: 3&sup2; + 4&sup2; = 9 + 16 = 25 = 5&sup2; &rarr; it's a <strong>right</strong> triangle (right angle at B, where the horizontal and vertical sides meet).",
    "Final classification: <strong>scalene right triangle</strong> (a 3-4-5 right triangle)."
  ],
  distractorNotes: {
    0: "The side lengths (3, 4, 5) are all different, so this is scalene, not isosceles &mdash; and 3&sup2;+4&sup2;=5&sup2; means it's a right triangle, not obtuse.",
    1: "3&sup2; + 4&sup2; = 5&sup2; is exactly the Pythagorean relationship, which signals a right triangle, not acute.",
    3: "The three side lengths are 3, 4, and 5 &mdash; all different &mdash; so it's scalene, not isosceles, even though it is correctly a right triangle."
  }
},

// ---------- 19 ----------
{
  id: 19, topic: "Transformations", type: "multi",
  prompt: "A rigid transformation maps ΔRST onto ΔUVW (R&harr;U, S&harr;V, T&harr;W). Select every statement that MUST be true.",
  diagram: buildFigureSVG({
    width: 320, height: 190,
    points: { R:[30,160], S:[130,160], T:[80,50], U:[190,160], V:[290,160], W:[240,50] },
    edges: [ {from:"R",to:"S"}, {from:"S",to:"T"}, {from:"R",to:"T"}, {from:"U",to:"V"}, {from:"V",to:"W"}, {from:"U",to:"W"} ],
    extra: [ {from:[150,105], to:[170,105], dashed:true} ]
  }),
  choices: ["RS ≅ VW", "ST ≅ VW", "∠T ≅ ∠W", "ΔTRS ≅ ΔWUV"],
  correctSet: [1, 2, 3],
  explanation: [
    "The correspondence is R&harr;U, S&harr;V, T&harr;W &mdash; match letters by their position.",
    "<strong>RS ≅ VW &mdash; FALSE.</strong> RS corresponds to UV (R&harr;U, S&harr;V), not VW. It's a common trap to match letters that just look similar instead of tracking the actual correspondence.",
    "<strong>ST ≅ VW &mdash; TRUE.</strong> S&harr;V and T&harr;W, so ST corresponds exactly to VW.",
    "<strong>∠T ≅ ∠W &mdash; TRUE.</strong> T&harr;W directly.",
    "<strong>ΔTRS ≅ ΔWUV &mdash; TRUE.</strong> Reordering the letters is fine as long as the correspondence order stays consistent: T&harr;W, R&harr;U, S&harr;V &mdash; which matches the given mapping exactly."
  ],
  distractorNotes: {
    0: "RS corresponds to UV, not VW &mdash; check each letter's partner individually (R&harr;U, S&harr;V) rather than assuming the last two letters pair up."
  }
},

// ---------- 20 ----------
{
  id: 20, topic: "Transformations", type: "multi",
  prompt: "Which transformations always preserve both side lengths and angle measures, so the image is guaranteed to be CONGRUENT to the original figure?",
  choices: ["Translation (slide)", "Reflection (flip)", "Rotation (turn)", "Dilation with scale factor 2"],
  correctSet: [0, 1, 2],
  explanation: [
    "Translations, reflections, and rotations are called <strong>rigid motions (isometries)</strong> &mdash; they only slide, flip, or turn a figure without stretching or shrinking it, so distances and angles never change.",
    "A <strong>dilation</strong> with scale factor 2 doubles every side length, so the image is twice as big as the original. The angles stay the same, but the sides don't &mdash; that makes the figures <em>similar</em>, not congruent (unless the scale factor is exactly 1)."
  ],
  distractorNotes: {
    3: "It's tempting to pick dilation because the shape \"looks the same,\" but congruent figures must match in <em>size</em> too, not just shape. A scale factor of 2 doubles all the side lengths, so the dilated triangle is similar to the original but not congruent to it."
  }
}

];
