# FIX: Visible standalone interactive Calculus I pages

## What was wrong

The deployed Teaching page was updated, but the online course page remained the old version.
The previous full ZIP also contained a single enclosing folder, so extracting it
the wrong way could leave existing files at the repository root unchanged.
In addition, the lessons were sections of one big webpage, not separate pages.

## What this patch delivers

- `teaching.html`: adds two direct interactive-lesson links under Tulane → Summer 2025, alongside the existing Class Notes and Course Details button. Retains updated UTRGV and mentoring information.
- `courses/calculus-i-summer2025/index.html`: an obvious green interactive-lesson hero and two lesson cards at the TOP, above the same 38 original handwritten PDF links.
- `courses/calculus-i-summer2025/lessons/1.0-introduction.html`: standalone introductory lesson with participation/grading policies and weighted grade calculator.
- `courses/calculus-i-summer2025/lessons/1.1-review-of-functions.html`: standalone interactive review, graphs, mapping, interval controls, piecewise function explorer, guided examples, eight graded questions with explanations.
- `courses/calculus-i-summer2025/interactive.css` and `interactive.js`: the shared styles and working interactive behavior.

## RECOMMENDED: Install small PATCH ZIP

1. Open your GitHub Pages repository (dipendranathmahato.github.io).
2. Extract `CALCULUS-INTERACTIVE-FIX-PATCH.zip` to a local folder.
3. Copy the supplied files *into the existing repository root*, retaining their paths.
   For example the new chapter must be located at
   `courses/calculus-i-summer2025/lessons/1.1-review-of-functions.html`
   (not inside any additional nested `dipendranathmahato.github.io-main` folder).
4. Commit and push **all 6 files** to the publishing branch. Wait for GitHub Pages deployment.
5. Hard refresh your website (Ctrl+Shift+R or Cmd+Shift+R).

## Alternative: Full repository ZIP

The new `CALCULUS-INTERACTIVE-FIX-FULL-WEBSITE.zip` has its site files at ZIP root
(`index.html`, `teaching.html`, `courses/`, `assets/`) to avoid the extra-folder problem.
Extract it and commit/push the contents, not the ZIP itself.
Back up newer website edits made since the uploaded repository snapshot.

## Live URLs to test *after publishing*

1. https://www.dipendranathmahato.com/courses/calculus-i-summer2025/
2. https://www.dipendranathmahato.com/courses/calculus-i-summer2025/lessons/1.0-introduction.html
3. https://www.dipendranathmahato.com/courses/calculus-i-summer2025/lessons/1.1-review-of-functions.html

Open either `lessons/...html` URL directly, then scroll to the relevant interactive block.
If the live landing page still shows **Instructor / Teaching Assistants** at the top,
the new `courses/calculus-i-summer2025/index.html` hasn't reached the published site.
If the HTML loads but interactive graphs/buttons fail, confirm `interactive.js` was
uploaded to `courses/calculus-i-summer2025/interactive.js`.
The mathematical formulas require the MathJax CDN to load.

## Verification

- Tested each lesson's HTML, JavaScript controls, and feedback in a local browser environment.
- Preserved all 38 PDF links in the course archive.
- Kept the Tulane university banner and shared academic website layout.
- Existing unrelated website pages left unchanged.

**No files are automatically published by downloading this ZIP.**
