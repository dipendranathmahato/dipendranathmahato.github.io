# Website update — Teaching & Summer 2025 Calculus I

Updated from the complete website repository supplied October 2026. The established site templates, colors, existing courses and original PDF notes remain intact.

## Files modified or created

- `teaching.html` — Fall 2026 UTRGV section 805; Fall 2026 mentoring; corrected Summer 2025 instructor, TA session and office-hour details; animated 23-day table modal with three highlighted exams and no note links.
- `courses/calculus-i-summer2025/index.html` — removed duplicated instructor/TA cards; inserted Tulane-themed interactive course introduction and review-of-functions chapters; retained the full original day-by-day handwritten PDF archive below.
- `courses/calculus-i-summer2025/interactive.css` — scoped, responsive Tulane-green academic learning component styles.
- `courses/calculus-i-summer2025/interactive.js` — client-side graph, mapping diagram, number line, grade estimator and question feedback controls.
- `courses/calculus-i-summer2025/schedule.json` — structured copy of the course schedule for future synchronization and upgrades.

## Details used

- MATH 1210: online, Monday–Friday 11:00 AM–12:45 PM, May 27–June 27, 2025.
- Instructor: Dipendranath Mahato (`dmahato@tulane.edu`); **office hours by appointment only**.
- Teaching assistant: Nathaniel T. Vaduthala (`nvaduthala@tulane.edu`); **TA class sessions** Tuesdays and Thursdays, 3:00–4:00 PM. The assistant's office hours are **not supplied** and are not fabricated.
- Midterm 1 June 5, 2025; Midterm 2 June 18, 2025; final exam June 27, 2025. A previously corrupted Midterm 1 date was corrected.
- The original introduction PDF defines 50 participation points: 10 weekly TA attendance, 10 module questions, 20 responses to peer questions, and up to 10 correctness points. Grade weights total 100%.
- Fall 2026 mentoring adds Dragos Gligor and Shazali Abdalla Fadul Adam while preserving all past mentoring records. Areas and affiliations summarized from uploaded screenshots; no mentoring topic or meeting schedule has been invented.

## Quality checks

- Both updated HTML files structurally parsed; interactive JavaScript passed `node --check`.
- Browser interaction tests: show/hide modal, three exam rows, zero notes buttons in modal, mapping toggle, interval endpoint toggle, graph input slider, wrong-answer reasoning, correction feedback, score update.
- All **38 existing handwritten PDF links** in the Summer 2025 course archive resolve to files included in the original uploaded repository. Two legacy filenames had mismatches, now fixed.
- MathJax and shared-site rendering depend on external CDN assets and the actual deployed GitHub Pages site; live deployment hasn't been tested.

## Redundancy observations — no risky global deletion

1. The previous teaching page embedded an entire secondary notes-card schedule inside the popup while the course page already offered the notes. The popup is now a concise table; all original note links remain solely in the course archive.
2. The class-personnel cards appeared on the course page as well as the teaching page. The course page now focuses on policy and learning material; contact details remain with the teaching entry.
3. The large file size is primarily PDFs, not HTML: approximately 158 MB of PDFs in the site, including about 85.6 MB of Summer 2025 Calculus PDFs. No source PDFs were deleted or compressed without authorization.
4. The repository has a root-level `style.css` and an `assets/css/style.css` that differ. Other pages still use the root stylesheet, while the course page uses the assets stylesheet. These were **not merged**, to avoid altering layouts outside this request.
5. Several pages retain similar inline navigation/theme handlers even though header and sidebar markup live in `assets/js/site-template.js`. Moving these handlers to a shared script would be a separate, website-wide refactor.
6. The initial two PDFs (Introduction and 1.1 Review of Functions) have been adapted into full interactive chapters; the remaining 36 PDFs are **preserved, not yet individually transcribed into interactive chapters**.

## How to publish

For the full-repository package, extract the ZIP and replace your existing repository contents with the included root (keeping Git configuration and any local unpublished files). For the lightweight patch, copy files at exactly the listed relative paths; do not remove other files. Commit and push to the GitHub Pages branch.

Course link: `/courses/calculus-i-summer2025/`

The shared `site-template.js`, campus logos, 38 handwritten PDF files and other courses are unchanged. The site must be hosted at its normal root path so absolute `/assets/...` URLs work.
