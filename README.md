# Congruent Triangles — Practice Test

A 20-question, self-grading practice test covering: triangle congruence
postulates (SSS, SAS, ASA, AAS, HL), CPCTC algebra, perimeter problems,
coordinate-plane triangle classification, two-column & flowchart proofs,
angle relationships (linear pairs, vertical angles, exterior angle
theorem), and rigid-motion transformations.

No build step, no dependencies — just static HTML/CSS/JS.

## Use it locally

Open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Features

- Click **Check Answer** on any question for an immediate right/wrong
  mark, the full worked solution, and — if it's wrong — a note aimed at
  the specific mistake (e.g. a sign error, mixing up which side
  corresponds to which, vertical vs. linear-pair angles, etc.).
- Running score pill + progress bar at the top.
- Number strip to jump to any question; it turns green/red once that
  question has been checked.
- **Finish & Show Summary** gives a score breakdown by topic, so it's
  easy to see which topic needs more review.
- **Print / Save as PDF** uses the browser's print dialog with a
  dedicated print stylesheet (`styles.css`, `@media print` block) —
  choose "Save as PDF" as the destination. It prints exactly what's on
  screen, so you can print it blank to practice on paper, or print it
  after answering to keep a record with every solution.

## Deploying to GitHub Pages

1. Create a new **public** GitHub repository (e.g. `geometry-practice-test`).
2. Push these files to the `main` branch:
   ```
   git init
   git add .
   git commit -m "Congruent triangles practice test"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Build and deployment →
   Source: Deploy from a branch → Branch: main / (root)** → Save.
4. GitHub gives you a URL like
   `https://<username>.github.io/<repo>/` within a minute or two.

## Editing / adding questions

All question content lives in `questions.js` as a plain JavaScript
array — each entry has a prompt, an auto-generated SVG diagram
(built declaratively in `diagrams.js`), answer choices or input
fields, a full worked solution, and notes for common wrong answers.
Add a new object to the `QUESTIONS` array following the same shape to
extend the test; no other file needs to change.
