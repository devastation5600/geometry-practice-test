/* app.js — rendering, grading, and progress tracking for the quiz */

const state = {
  // per-question: { checked: bool, correct: bool, pickedIndex / pickedSet / values }
  results: {}
};

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function renderJumpNav() {
  const nav = $("#jumpNav");
  nav.innerHTML = QUESTIONS.map(q =>
    `<button data-jump="${q.id}" id="jumpBtn-${q.id}" title="Question ${q.id}: ${q.topic}">${q.id}</button>`
  ).join("");
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-jump]");
    if (!btn) return;
    const el = document.getElementById(`q-${btn.dataset.jump}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function fieldRowHTML(q) {
  return `<div class="input-answers">
    ${q.fields.map(f => `
      <div class="input-field">
        <label for="f-${q.id}-${f.key}">${f.label}</label>
        <input type="text" inputmode="decimal" id="f-${q.id}-${f.key}" autocomplete="off" />
      </div>
    `).join("")}
  </div>`;
}

function choiceRowsHTML(q) {
  const inputType = q.type === "multi" ? "checkbox" : "radio";
  const name = `q-${q.id}-choice`;
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

function renderQuestion(q) {
  const card = document.createElement("section");
  card.className = "question-card";
  card.id = `q-${q.id}`;

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
    bodyHTML += fieldRowHTML(q);
  } else {
    bodyHTML += choiceRowsHTML(q);
  }

  bodyHTML += `
    <div class="q-actions no-print">
      <button class="btn-check" data-check="${q.id}">Check Answer</button>
      <span class="hint-text" style="font-size:0.82rem;color:#6b7a86;"></span>
    </div>
    <div class="feedback" id="feedback-${q.id}"></div>
  `;

  card.innerHTML = bodyHTML;
  return card;
}

function getNumericValue(q, key) {
  const el = document.getElementById(`f-${q.id}-${key}`);
  if (!el) return null;
  const raw = el.value.trim().replace(/[°\s]/g, "");
  if (raw === "") return null;
  const num = parseFloat(raw);
  return isNaN(num) ? null : num;
}

function closeEnough(a, b, tol = 0.05) {
  return Math.abs(a - b) <= tol;
}

function gradeQuestion(q) {
  if (q.type === "mc") {
    const picked = $all(`input[name="q-${q.id}-choice"]`).findIndex(i => i.checked);
    if (picked === -1) return null;
    return { correct: picked === q.correct, pickedIndex: picked };
  }
  if (q.type === "multi") {
    const pickedSet = $all(`input[name="q-${q.id}-choice"]`)
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
      const v = getNumericValue(q, f.key);
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

function renderFeedback(q, result) {
  const box = document.getElementById(`feedback-${q.id}`);
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
    $all(`.choice`, document.getElementById(`q-${q.id}`)).forEach((label, i) => {
      label.classList.remove("correct-pick", "wrong-pick", "reveal-correct");
      if (i === q.correct) label.classList.add("reveal-correct");
      if (i === result.pickedIndex && i !== q.correct) label.classList.add("wrong-pick");
    });
  } else if (q.type === "multi") {
    $all(`.choice`, document.getElementById(`q-${q.id}`)).forEach((label, i) => {
      label.classList.remove("correct-pick", "wrong-pick", "reveal-correct");
      const isCorrectChoice = q.correctSet.includes(i);
      const wasPicked = result.pickedSet.includes(i);
      if (isCorrectChoice) label.classList.add("reveal-correct");
      if (wasPicked && !isCorrectChoice) label.classList.add("wrong-pick");
    });
  } else if (q.type === "input") {
    q.fields.forEach(f => {
      const el = document.getElementById(`f-${q.id}-${f.key}`);
      el.classList.remove("correct", "incorrect");
      el.classList.add(result.fieldStatus[f.key] ? "correct" : "incorrect");
    });
  }
}

function updateJumpBtn(q, result) {
  const btn = document.getElementById(`jumpBtn-${q.id}`);
  btn.classList.remove("answered", "wrong");
  btn.classList.add(result.correct ? "answered" : "wrong");
}

function updateScorePill() {
  const checked = Object.keys(state.results).length;
  const correct = Object.values(state.results).filter(r => r.correct).length;
  $("#scorePill").textContent = checked === 0
    ? "Score: not started"
    : `Score: ${correct} / ${checked} checked correct`;
  $("#progressFill").style.width = `${(checked / QUESTIONS.length) * 100}%`;
  $("#progressLabel").textContent = `${checked} / ${QUESTIONS.length} answered`;
}

function handleCheck(id) {
  const q = QUESTIONS.find(qq => qq.id === id);
  const result = gradeQuestion(q);
  if (!result) {
    const box = document.getElementById(`feedback-${q.id}`);
    box.classList.add("show", "incorrect");
    box.classList.remove("correct");
    box.innerHTML = `<div class="feedback-status">⚠️ Please answer first</div><p>Fill in your answer, then click Check Answer.</p>`;
    return;
  }
  state.results[id] = result;
  renderFeedback(q, result);
  updateJumpBtn(q, result);
  updateScorePill();
}

function renderFinalSummary() {
  const total = QUESTIONS.length;
  const checked = Object.keys(state.results).length;
  const correct = Object.values(state.results).filter(r => r.correct).length;

  const byTopic = {};
  QUESTIONS.forEach(q => {
    byTopic[q.topic] = byTopic[q.topic] || { total: 0, correct: 0, checked: 0 };
    byTopic[q.topic].total++;
    if (state.results[q.id]) {
      byTopic[q.topic].checked++;
      if (state.results[q.id].correct) byTopic[q.topic].correct++;
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

function init() {
  const container = $("#quizContainer");
  QUESTIONS.forEach(q => container.appendChild(renderQuestion(q)));
  renderJumpNav();
  updateScorePill();

  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-check]");
    if (btn) handleCheck(parseInt(btn.dataset.check, 10));
  });

  $("#finishBtn").addEventListener("click", renderFinalSummary);
  $("#printBtn").addEventListener("click", () => window.print());
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Clear all your answers and start over?")) return;
    state.results = {};
    window.location.reload();
  });
}

document.addEventListener("DOMContentLoaded", init);
