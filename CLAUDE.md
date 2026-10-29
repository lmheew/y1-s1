# Study site (y1-s1): how to update it

A static site on GitHub Pages (branch `main`, folder `/`), live at https://lmheew.github.io/y1-s1/.

- `/` is `index.html`, the home page: subject cards, upcoming exams, what's new, and offline install help. It is hand-written; update its cards when a subject is added or changes. It reads `site.json`.
- `/math/` is the CLA1 review (Calculus & Linear Algebra 1). It is built by `src/math/build.mjs`. Never edit `math/index.html` by hand.
- Physics (Engineering Physics 1) is planned as `/physics/`, in a darker blue theme. Build it only when asked.
- The floating calculator (`src/shared/calculator.js` and `calculator.css`) is shared by every subject page. The build inlines it; a new subject's build should too.
- `site.json` holds exam dates and the "What's new" list, for the home page and the Math page's Exams tab.
- `sw.js` and `manifest.webmanifest` make the site installable and usable offline.

## Rules

- **Never commit `src/math/private/` or the password.** The folder is git-ignored. The in-class quiz sheets exist in the repository only encrypted: `src/math/private.sealed.json` (their source) and `math/locked.json` (what the site opens with the password).
- The password is saved in the user's Claude memory, because they asked for that. Otherwise they give it in chat. Never put it in the repository: not in files, not in commit messages.
- Wording stays non-personal: no "your quizzes", no "from your chats", no student-ID versions.
- The course is calculator-free, so answers stay exact (√2/2, ln(7/8), 2 + e).
- Every new answer gets a numeric check in a verify script, and every check must pass before pushing.
- Practice problem ids (`unit.n`) are the keys for saved marks. Append new problems and never renumber.
- These are unofficial notes. Never add the KUAS logo.

## Content (src/math)

- `content.mjs`: units (Summary key ideas and "Watch out" lists), exam-day habits, practice problems.
- A lesson that no quiz or exam covers (Day 12, the introduction to differential equations) is a unit with `quiz: null`, its `days` and a `note` such as "Not on the midterm", plus an optional `intro`. It shows its day instead of a quiz, has no Quizzes entry, and stays out of the mocks and the "Quizzes 01–05" span. Quizzes find their unit by `quiz`, not by `no`.
- `followups.mjs`: Follow-up A (same skills, new numbers) and Follow-up B (targets common mistakes) for each quiz. Each is worth 10 pt, like the in-class sheet.
- `extras.mjs`: search tags for the practice problems, the Formulas tab, the exact-values table and the icons.
- `exams.mjs`: the mock midterms (60 min, 60 pt, six questions of 10 pt, one per topic). `pts` lists each part's points.
- `graphs.js`: the interactive graphs. Which unit shows which graph is set by `GRAPHS` in `build.mjs`.
- `private/inclass.mjs`: the in-class sheets, retyped. It exists only after `open`.
- `build.mjs` (with the short unit names in `SHORT`), `page.css`, `page.js`.

Markup inside the strings:

- `$inline$` and `$$display$$` for math.
- `**bold**`.
- Lines starting with `- ` are list items, and continuation lines join the item.
- A blank line starts a new block.
- `(2pt×2)` is styled as a point value.

Strings use `String.raw`, so avoid `${` inside them.

- **Steps.** Solutions open one step at a time. Each paragraph, or each list item, of `sol` is one step, so write a step per block (`**(1)** …`, blank line, `**(2)** …`).
- **New labels.** Give anything new an `added: 'YYYY-MM-DD'` (units, practice problems, formula groups, mocks). It gets a "New" label, and its tab a dot, for 14 days. Also add a line to `news` in `site.json`.

## Build and check

```sh
node src/math/build.mjs site
python3 src/math/verify_practice.py && python3 src/math/verify_formulas.py && python3 src/math/verify_followups.py && python3 src/math/verify_mocks.py && node src/math/verify_exact.mjs
node src/shared/calculator_test.js
python3 src/check_site.py
python3 src/check_features.py
```

- Without `SITE_PASSWORD`, `site` keeps `math/locked.json` as it is.
- `check_site.py` runs the page in Chromium (Playwright): layout on phone and desktop, tabs, search and the locked panels. With `SITE_PASSWORD` set it also tests unlocking.
- `check_features.py` covers the Exams tab, countdowns, mock scoring, step-by-step solutions, Test me, graphs, New labels, the home page and offline use. Some of its checks count today's content; update the counts when content changes.
- KaTeX is vendored, so no network or npm install is needed.

## A new class (no password needed)

1. Extend a unit or add one in `content.mjs`. For a new unit, also add its short name to `SHORT` in `build.mjs` and an icon to `UNIT_ICONS` in `extras.mjs`.
2. Add practice problems, formulas and search tags.
3. Add numeric checks for the new answers.
4. Build, run every check, then commit and push.

## A new in-class quiz (needs the password)

1. `SITE_PASSWORD='…' node src/math/build.mjs open` decrypts the private sources into `src/math/private/`.
2. Retype the quiz into `private/inclass.mjs`, and add its checks to `private/verify_inclass.py`.
3. Write Follow-up A and B in `followups.mjs`, with checks in `verify_followups.py`.
4. `SITE_PASSWORD='…' node src/math/build.mjs site` re-seals `private/` and rebuilds `math/locked.json`.
5. Run `node src/math/leakcheck.mjs` and every check. All must pass.
6. Commit and push. `private/` stays out of git.

A few details about the password:

- The build refuses a password that doesn't open the current files. A typo can't lock everyone out.
- Case, spaces and hyphens are ignored, in the build and on the page.
- To change it, run `SITE_PASSWORD='old' NEW_SITE_PASSWORD='new' node src/math/build.mjs rekey`. Devices that chose "Remember on this device" then ask for the new password once.

## Exam dates, What's new, and speed

- **Exam dates.** Fill in `date` (`YYYY-MM-DD`) and `time` (`HH:MM`, Japan time) in `site.json`, then rebuild the Math page. Countdowns, sorting and "Done" are worked out in the browser.
- **Fast first load.** Only the Summary tab is built with the page. Practice, Formulas, Quizzes and Exams travel as text (`<script type="text/x-lazy-html">`) and are built the first time they open. `page.js` `VIEW_INIT` switches on each tab's features then. Keep new tabs lazy too. `leakcheck.mjs` reads the lazy text as well.
- **Offline.** `sw.js` serves pages and data network-first, with the saved copy when offline, and images and fonts cache-first. Bump `CACHE` in `sw.js` when its `CORE` list changes.

## The floating calculator

- It's a ghost button parked on the left or right edge, bottom left by default. Drag it anywhere and it glides back to the nearest side; a quick flick throws it across.
- The first tap makes it opaque and shows "Tap again to open". A second tap on it opens the calculator. A tap anywhere else, or 4 seconds without one, cancels. Enter on the focused button opens it at once.
- The calculator follows the Windows standard layout, with memory (MC MR M+ M− MS and the M▾ list) and no history. It works with exact fractions, so 1 ÷ 3 × 3 = 1 and 0.1 + 0.2 = 0.3. It shows results the way Windows does: 16 digits, and "1.e+16" style above that. `calculator_test.js` holds the Windows cases; keep them passing.
- The window doesn't block the page. It moves by its title bar and closes with ×, Esc (once it's cleared), or one tap on the button.
- It is off while a quiz timer runs, since the course is calculator-free; `page.js` sends a `quiztimer` event.
- It is set up after the page has loaded, so it adds nothing to load time; keep it that way.
- Browser storage: `study-calc-memory` (memory values) and `study-calc-position` (where the button rests).

## A private, unlocked copy

`node src/math/build.mjs artifact out.html` writes one self-contained page with the in-class sheets in plain view. It needs `private/`, or `SITE_PASSWORD`. Never commit that page.

## Publishing

Commit to `main` and push. GitHub Pages redeploys in about a minute.
