/* app.js — rendering, grading, and progress tracking for the practice tests.
   Each section (congruent triangles, centroids) keeps its own questions,
   score, and progress; the tabs in the header switch between them. */

const SECTIONS = [
  {
    key: "tri",
    hash: "triangles",
    title: "Congruent Triangles",
    questions: QUESTIONS,
    intro: "Covers congruence postulates (SSS, SAS, ASA, AAS, HL), CPCTC, coordinate proofs, two-column &amp; flowchart proofs, angle relationships, and transformations."
  },
  {
    key: "cen",
    hash: "centroids",
    title: "Centroids &amp; Medians",
    questions: CENTROID_QUESTIONS,
    intro: "Covers medians, the centroid, the 2 : 1 rule along every median, algebra with centroids, and finding the centroid on the coordinate plane."
  }
];

const state = {
  active: SECTIONS[0],
  // per section, per question: { correct: bool, pickedIndex / pickedSet / values }
  results: { tri: {}, cen: {} }
};

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function qid(sec, q) { return `${sec.key}-${q.id}`; }

function renderTabs() {
  $("#sectionTabs").innerHTML = SECTIONS.map(sec => `
    <button class="section-tab" data-section="${sec.key}" id="tab-${sec.key}">
      <span class="tab-title">${sec.title}</span>
      <span class="tab-count">${sec.questions.length} questions</span>
    </button>
  `).join("");
  $("#sectionTabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-section]");
    if (!btn) return;
    const sec = SECTIONS.find(s => s.key === btn.dataset.section);
    history.replaceState(null, "", `#${sec.hash}`);
    showSection(sec);
  });
}

function renderJumpNav() {
  const sec = state.active;
  $("#jumpNav").innerHTML = sec.questions.map(q => {
    const r = state.results[sec.key][q.id];
    const cls = r ? (r.correct ? "answered" : "wrong") : "";
    return `<button data-jump="${qid(sec, q)}" id="jumpBtn-${qid(sec, q)}" class="${cls}" title="Question ${q.id}: ${q.topic}">${q.id}</button>`;
  }).join("");
}

function fieldRowHTML(sec, q) {
  return `<div class="input-answers">
    ${q.fields.map(f => `
      <div class="input-field">
        <label for="f-${qid(sec, q)}-${f.key}">${f.label}</label>
        <input type="text" inputmode="decimal" id="f-${qid(sec, q)}-${f.key}" autocomplete="off" />
      </div>
    `).join("")}
  </div>`;
}

function choiceRowsHTML(sec, q) {
  const inputType = q.type === "multi" ? "checkbox" : "radio";
  const name = `q-${qid(sec, q)}-choice`;
  return `<div class="choices">
    ${q.choices.map((c, i) => `
      <label class="choice" data-idx="${i}">
        <input type="${inputType}" name="${name}" value="${i}" />
        <span>${c}</span>
      </label>
    `).join("")}
  </div>`;
}

function proofTableHTML(rows) {
  return `<table class="proof-table" style="width:100%;border-collapse:collapse;margin:10px 0 16px;font-size:0.92rem;">
    <thead><tr>
      <th style="text-align:left;border-bottom:2px solid #1d3557;padding:6px 8px;">Statement</th>
      <th style="text-align:left;border-bottom:2px solid #1d3557;padding:6px 8px;">Reason</th>
    </tr></thead>
    <tbody>
      ${rows.map(r => `<tr><td style="padding:6px 8px;border-bottom:1px solid #e3ecf1;">${r[0]}</td><td style="padding:6px 8px;border-bottom:1px solid #e3ecf1;">${r[1]}</td></tr>`).join("")}
    </tbody>
  </table>`;
}

function renderQuestion(sec, q) {
  const card = document.createElement("section");
  card.className = "question-card";
  card.id = `q-${qid(sec, q)}`;

  let bodyHTML = `
    <div class="q-head">
      <span class="q-number">Q${q.id}</span>
      <span class="q-topic">${q.topic}</span>
    </div>
    <p class="q-prompt">${q.prompt}${q.given ? `<span class="given">${q.given}</span>` : ""}</p>
  `;

  if (q.diagram) {
    bodyHTML += `<div class="diagram-wrap">${q.diagram}</div>`;
  }
  if (q.given2table) {
    bodyHTML += proofTableHTML(q.given2table);
  }

  if (q.type === "input") {
    bodyHTML += fieldRowHTML(sec, q);
  } else {
    bodyHTML += choiceRowsHTML(sec, q);
  }

  bodyHTML += `
    <div class="q-actions no-print">
      <button class="btn-check" data-check="${q.id}">Check Answer</button>
      <span class="hint-text" style="font-size:0.82rem;color:#6b7a86;"></span>
    </div>
    <div class="feedback" id="feedback-${qid(sec, q)}"></div>
  `;

  card.innerHTML = bodyHTML;
  return card;
}

function getNumericValue(sec, q, key) {
  const el = document.getElementById(`f-${qid(sec, q)}-${key}`);
  if (!el) return null;
  const raw = el.value.trim().replace(/[°\s]/g, "").replace(/[−–]/g, "-");
  if (raw === "") return null;
  const num = parseFloat(raw);
  return isNaN(num) ? null : num;
}

function closeEnough(a, b, tol = 0.05) {
  return Math.abs(a - b) <= tol;
}

function gradeQuestion(sec, q) {
  if (q.type === "mc") {
    const picked = $all(`input[name="q-${qid(sec, q)}-choice"]`).findIndex(i => i.checked);
    if (picked === -1) return null;
    return { correct: picked === q.correct, pickedIndex: picked };
  }
  if (q.type === "multi") {
    const pickedSet = $all(`input[name="q-${qid(sec, q)}-choice"]`)
      .map((i, idx) => (i.checked ? idx : -1))
      .filter(idx => idx !== -1);
    if (pickedSet.length === 0) return null;
    const correctSet = q.correctSet.slice().sort();
    const same = pickedSet.length === correctSet.length &&
      pickedSet.slice().sort().every((v, i) => v === correctSet[i]);
    return { correct: same, pickedSet };
  }
  if (q.type === "input") {
    const values = {};
    let allFilled = true;
    q.fields.forEach(f => {
      const v = getNumericValue(sec, q, f.key);
      values[f.key] = v;
      if (v === null) allFilled = false;
    });
    if (!allFilled) return null;
    let allCorrect = true;
    const fieldStatus = {};
    q.fields.forEach(f => {
      const ok = f.accept.some(acc => closeEnough(values[f.key], acc));
      fieldStatus[f.key] = ok;
      if (!ok) allCorrect = false;
    });
    return { correct: allCorrect, values, fieldStatus };
  }
  return null;
}

function findMistakeNote(q, key, value) {
  if (!q.mistakes) return null;
  const hit = q.mistakes.find(m => m.key === key && closeEnough(value, m.near, 1.2));
  return hit ? hit.note : null;
}

function renderFeedback(sec, q, result) {
  const box = document.getElementById(`feedback-${qid(sec, q)}`);
  const card = document.getElementById(`q-${qid(sec, q)}`);
  box.classList.remove("show", "correct", "incorrect");
  box.classList.add("show", result.correct ? "correct" : "incorrect");

  let html = `<div class="feedback-status">${result.correct ? "✅ Correct!" : "❌ Not quite"}</div>`;

  if (!result.correct) {
    if (q.type === "mc" && q.distractorNotes && q.distractorNotes[result.pickedIndex] !== undefined) {
      html += `<div class="why-wrong"><strong>Why this answer is off:</strong> ${q.distractorNotes[result.pickedIndex]}</div>`;
    }
    if (q.type === "multi") {
      const missed = q.correctSet.filter(c => !result.pickedSet.includes(c));
      const extra = result.pickedSet.filter(c => !q.correctSet.includes(c));
      let note = "";
      if (extra.length) {
        extra.forEach(idx => {
          if (q.distractorNotes && q.distractorNotes[idx]) note += q.distractorNotes[idx] + " ";
        });
      }
      if (missed.length) {
        note += ` You also missed: ${missed.map(i => `"${q.choices[i]}"`).join(", ")}.`;
      }
      if (note.trim()) html += `<div class="why-wrong"><strong>Why this wasn't fully correct:</strong> ${note}</div>`;
    }
    if (q.type === "input" && result.fieldStatus) {
      Object.keys(result.fieldStatus).forEach(key => {
        if (!result.fieldStatus[key]) {
          const note = findMistakeNote(q, key, result.values[key]);
          if (note) html += `<div class="why-wrong"><strong>About your "${key}" answer:</strong> ${note}</div>`;
        }
      });
    }
  }

  html += `<h4>Full Worked Solution</h4><ol>${q.explanation.map(s => `<li>${s}</li>`).join("")}</ol>`;
  box.innerHTML = html;

  // visually mark choices / inputs
  if (q.type === "mc") {
    $all(`.choice`, card).forEach((label, i) => {
      label.classList.remove("correct-pick", "wrong-pick", "reveal-correct");
      if (i === q.correct) label.classList.add("reveal-correct");
      if (i === result.pickedIndex && i !== q.correct) label.classList.add("wrong-pick");
    });
  } else if (q.type === "multi") {
    $all(`.choice`, card).forEach((label, i) => {
      label.classList.remove("correct-pick", "wrong-pick", "reveal-correct");
      const isCorrectChoice = q.correctSet.includes(i);
      const wasPicked = result.pickedSet.includes(i);
      if (isCorrectChoice) label.classList.add("reveal-correct");
      if (wasPicked && !isCorrectChoice) label.classList.add("wrong-pick");
    });
  } else if (q.type === "input") {
    q.fields.forEach(f => {
      const el = document.getElementById(`f-${qid(sec, q)}-${f.key}`);
      el.classList.remove("correct", "incorrect");
      el.classList.add(result.fieldStatus[f.key] ? "correct" : "incorrect");
    });
  }
}

function updateJumpBtn(sec, q, result) {
  const btn = document.getElementById(`jumpBtn-${qid(sec, q)}`);
  btn.classList.remove("answered", "wrong");
  btn.classList.add(result.correct ? "answered" : "wrong");
}

function updateScorePill() {
  const sec = state.active;
  const results = state.results[sec.key];
  const total = sec.questions.length;
  const checked = Object.keys(results).length;
  const correct = Object.values(results).filter(r => r.correct).length;
  $("#scorePill").textContent = checked === 0
    ? "Score: not started"
    : `Score: ${correct} / ${checked} checked correct`;
  $("#progressFill").style.width = `${(checked / total) * 100}%`;
  $("#progressLabel").textContent = `${checked} / ${total} answered`;
}

function handleCheck(sec, id) {
  const q = sec.questions.find(qq => qq.id === id);
  const result = gradeQuestion(sec, q);
  if (!result) {
    const box = document.getElementById(`feedback-${qid(sec, q)}`);
    box.classList.add("show", "incorrect");
    box.classList.remove("correct");
    box.innerHTML = `<div class="feedback-status">⚠️ Please answer first</div><p>Fill in your answer, then click Check Answer.</p>`;
    return;
  }
  state.results[sec.key][id] = result;
  renderFeedback(sec, q, result);
  updateJumpBtn(sec, q, result);
  updateScorePill();
}

function renderFinalSummary() {
  const sec = state.active;
  const results = state.results[sec.key];
  const total = sec.questions.length;
  const checked = Object.keys(results).length;
  const correct = Object.values(results).filter(r => r.correct).length;

  const byTopic = {};
  sec.questions.forEach(q => {
    byTopic[q.topic] = byTopic[q.topic] || { total: 0, correct: 0, checked: 0 };
    byTopic[q.topic].total++;
    if (results[q.id]) {
      byTopic[q.topic].checked++;
      if (results[q.id].correct) byTopic[q.topic].correct++;
    }
  });

  const pct = checked ? Math.round((correct / checked) * 100) : 0;
  let gradeNote = "Keep going! Check every question to see your full score.";
  if (checked === total) {
    if (pct >= 90) gradeNote = "Outstanding work! This is test-ready. 🎉";
    else if (pct >= 80) gradeNote = "Great job &mdash; review the missed topics below before the real test.";
    else if (pct >= 70) gradeNote = "Solid effort. Revisit the lower-scoring topics below.";
    else gradeNote = "This is exactly what practice tests are for &mdash; review each \"Full Worked Solution\" above, then try again.";
  }

  const summary = $("#finalSummary");
  summary.classList.add("show");
  summary.innerHTML = `
    <div class="summary-title">${sec.title}</div>
    <div class="big-score">${correct} / ${checked || total}</div>
    <div class="grade-note">${checked < total ? `You've checked ${checked} of ${total} questions. ` : ""}${gradeNote}</div>
    <div class="topic-breakdown">
      ${Object.entries(byTopic).map(([topic, s]) => `
        <div class="topic-row"><span>${topic}</span><span>${s.correct} / ${s.checked || s.total}${s.checked < s.total ? " ⏳" : ""}</span></div>
      `).join("")}
    </div>
  `;
  summary.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showSection(sec) {
  state.active = sec;
  SECTIONS.forEach(s => {
    $(`#set-${s.key}`).hidden = s !== sec;
    $(`#tab-${s.key}`).classList.toggle("active", s === sec);
  });
  $("#sectionIntro").innerHTML = sec.intro;
  $("#finalSummary").classList.remove("show");
  document.title = `${sec.title.replace("&amp;", "&")} Practice Test`;
  renderJumpNav();
  updateScorePill();
}

function init() {
  const container = $("#quizContainer");
  SECTIONS.forEach(sec => {
    const set = document.createElement("div");
    set.className = "quiz-set";
    set.id = `set-${sec.key}`;
    sec.questions.forEach(q => set.appendChild(renderQuestion(sec, q)));
    container.appendChild(set);
  });
  renderTabs();

  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-check]");
    if (btn) handleCheck(state.active, parseInt(btn.dataset.check, 10));
  });

  $("#jumpNav").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-jump]");
    if (!btn) return;
    const el = document.getElementById(`q-${btn.dataset.jump}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#finishBtn").addEventListener("click", renderFinalSummary);
  $("#printBtn").addEventListener("click", () => window.print());
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Clear all your answers and start over?")) return;
    window.location.reload();
  });

  const fromHash = SECTIONS.find(s => `#${s.hash}` === window.location.hash);
  showSection(fromHash || SECTIONS[0]);
}

document.addEventListener("DOMContentLoaded", init);
