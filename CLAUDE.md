# Study site (y1-s1): how to update it

A static site on GitHub Pages (branch `main`, folder `/`), live at https://lmheew.github.io/y1-s1/.

- `/` is `index.html`, the home page, a "today" screen: on top, the soonest exam with a date as a card in its subject's colour (how long is left, its Practice progress, and links to its page, its Practice tab and its night-before sheet; no card once every dated exam is done), and **Pick up where you left off** (the page, tab and card last read on this device, opened at that spot); then the two subject cards side by side, **Exams** (one list of every exam: those to come, soonest first, with their date, subject and Practice progress; the ones without a date in one row; then the ones done), **What's new** as one-line headlines that open to their text (the two newest days and every day that is New show; older days wait behind a button), and a row that opens the offline install help. It is hand-written; update its cards when a subject is added or changes (a card holds the subject's badge, short name and title; the exam list takes each subject's short name from its card). It reads `site.json`, and `study-pages` in localStorage, which the exam pages write (`remember` in `page.js`: each page's name, the view and card or section at the top of the screen, and its Practice got/review/total). The resume link puts the spot in sessionStorage (`study-resume`), and the page jumps there when it opens.
- The CLA1 review (Calculus & Linear Algebra 1) has one page per exam, all built by `src/math/build.mjs`; never edit anything in `math/` by hand.
  - `/math/` (`math/index.html`) is the exam picker: a card per exam in course order (`EXAMS` in `build.mjs`). An exam without notes yet shows "Coming soon" until its first class. Old addresses of the one Math page (`math/#exams` and so on) go on to the Calculus midterm 1 page, with `location.replace`, so Back doesn't loop.
  - `/math/derivatives/` is Calculus midterm 1 (the derivative part, Days 1–12): the content modules in `src/math`.
  - `/math/integrals/` is Calculus midterm 2 (the integral part, 2–20 Nov, exam on 23 Nov): the content modules in `src/math/integrals/`. See "Content (src/math/integrals)" below.
  - `math/assets/` holds what every exam page shares: `math.css` (`page.css`, the calculator, back-to-top and KaTeX), `math.js` (`page.js`, `graphs.js`, back-to-top and the calculator) and the KaTeX fonts. Pages name `math.css` and `math.js` with `?v=` and the first 10 characters of the file's SHA-256, so a device downloads them once per change; each exam page carries only its own notes.
  - Each exam page is an entry in `PAGES` in `build.mjs` (`DERIVATIVES`, `INTEGRALS`), and one `render()` builds them all: its content, its band texts (`lede`), what an empty tab says (`soon`) and its storage keys (`conf`, which `page.js` reads from `<body data-page>`: `store` for practice marks and the open tab, `seen` for its key in `study-seen`, `scores` for mock scores; Calculus midterm 1 keeps `page.js`'s defaults). Practice marks are keyed by problem id, so each page needs its own `store`.
  - A new exam page (Linear Algebra) needs its own content modules, a `PAGES` entry, `page` in its `EXAMS` card and the same `page` in `site.json`, its address in `CORE` in `sw.js` (bump `CACHE`), its `seen` key in `PAGE_KEYS` in `index.html` (so the home page's Math card knows its What's new entries), and a link preview in `og.py`.
- The EP1 review (Engineering Physics 1) is `/physics/`, in a darker blue theme, built by `src/physics/build.mjs` the same way; never edit anything in `physics/` by hand. See "Physics" below.
- Each subject's app bar has a button with the other subject's badge (`subjectSwitch` in `src/shared/icons.mjs`) that opens the other subject's exam picker.
- `src/shared/build-lib.mjs` holds what both builds share (markup, KaTeX, the lock's encryption, the picker's style and script); `src/shared/icons.mjs` the tab bar and button icons.
- The floating calculator (`src/shared/calculator.js` and `calculator.css`) is shared by every subject page. Exam pages get it from `math/assets/`; the private copy (`artifact`) has it inline.
- The back-to-top button (`src/shared/totop.js` and `totop.css`) is on every page. Exam pages get it from `math/assets/` like the calculator. The home page and the exam picker link the two files instead, so they are in `CORE` in `sw.js`.
- `site.json` holds exam dates (and each exam's `page`, once it has one, which the home page links to) and the "What's new" list, for the home page, the picker and the Exams tab. Each news entry has a short `title` (the headline the home page shows) as well as its `text`.
- `sw.js` and `manifest.webmanifest` make the site installable and usable offline.
- The app icon is a picture, and each subject's pages keep their badge in the browser tab. `python3 src/app_icon.py` makes all the icon files; see "App icon" below.
- `404.html` is the page GitHub Pages shows for any address that doesn't exist. It is hand-written in the home page's style, and its links are absolute (`/y1-s1/…`) because it is served at the missing address.
- Link previews (what LINE, Discord and others show when a link is shared): `og-home.png`, `og-math.png` (the exam picker), `og-math-derivatives.png`, `og-math-integrals.png`, `og-physics.png` (the Physics picker) and `og-physics-midterm.png` (1200 × 630) are drawn by `python3 src/og.py` (or `python3 src/og.py og-math.png` for one) and named in each page's `<head>` by their address on the live site (`SITE_URL` in `build-lib.mjs`; written out in `index.html`). Redraw them when a card's text changes, such as when an exam page arrives. Physics cards are drawn in the Physics blue. They use the site's own badges, never the KUAS logo.

## Rules

- **Never commit `src/math/private/`, `src/physics/private/` or the password.** Both folders are git-ignored. The in-class quiz sheets and the past midterm papers exist in the repository only encrypted: `src/math/private.sealed.json` (their source) and each exam page's `locked.json` (`math/derivatives/locked.json`, `math/integrals/locked.json`: what the site opens with the password). `locked.json` also keeps a readable list of the past papers' titles, times and points, so a build without the password can still draw their password panels.
- The password is saved in the user's Claude memory, because they asked for that. Otherwise they give it in chat. Never put it in the repository: not in files, not in commit messages.
- Wording stays non-personal: no "your quizzes", no "from your chats", no student-ID versions.
- Each subject keeps its colour: Math green, Physics the darker blue.
- The course is calculator-free, so answers stay exact (√2/2, ln(7/8), 2 + e).
- Every new answer gets a numeric check in a verify script, and every check must pass before pushing.
- Practice problem ids (`unit.n`) are the keys for saved marks. Append new problems and never renumber. A problem moved to another unit keeps its old id in an `id` field (the Day 9 series problems are `5.1` and `5.2`).
- These are unofficial notes. Never add the KUAS logo.

## Content (src/math)

These modules are the Calculus midterm 1 page (`math/derivatives/`).

- `content.mjs`: units (Summary key ideas and "Watch out" lists), exam-day habits, practice problems.
- Units follow the course schedule (derivative part): one unit per lesson, in schedule order, with `days` ("Day 1 & 2"), `dates` ("8 & 9 Oct"), the schedule's lesson name as `title` (sentence case) and its `quiz` ("Quiz 01") or `null`. Summary tiles show the day, the name and a small quiz line; lessons without a quiz have no quiz line. Unit ids are stable keys, not positions (Day 9, Infinite series, is `u7` and sits before `u5`).
- A lesson without a quiz has no Quizzes entry and stays out of the mocks and the "Quizzes 01–05" span. One that isn't on the midterm also gets a `note` ("Not on the midterm") and an optional `intro`, like Day 12. Quizzes find their unit by `quiz`.
- `followups.mjs`: Follow-up A (same skills, new numbers) and Follow-up B (targets common mistakes) for each quiz. Each is worth 10 pt, like the in-class sheet.
- `extras.mjs`: search tags for the practice problems, the Formulas tab, the exact-values table and the icons.
- `exams.mjs`: the mock midterms (60 min, 60 pt, six questions of 10 pt, one per topic). `pts` lists each part's points. On the page, each question's head shows its number, topic tag and points on one line, like a printed paper, with the `stem` (the instruction) below it.
- `private/past.mjs`: past midterm papers (AY2022 spring, AY2023 fall, and AY2026 fall: this year's Calculus midterm 1, derivative part, six questions like the quizzes), retyped with worked answers, in the same shape as the mocks plus `seg` (the switcher label), `sub` and optional `labels` for parts the paper letters ((a), (1a)). The papers give no time or points, so 60 min and 100 pt are estimates. Checked in `private/verify_past.py`. They show in the Exams tab under "Past midterms", locked with the same password, and work like the mocks once opened.
- `graphs.js`: the interactive graphs. Which unit shows which graph is set by `GRAPHS` in `build.mjs`.
- `private/inclass.mjs`: the in-class sheets, retyped. It exists only after `open`, like everything in `private/`.
- `build.mjs` (with `EXAMS`, the picker's cards), `page.css`, `page.js`.
- Buttons follow one rule (top of the buttons part of `page.css`): the main action of a place is a pill filled with the subject's colour (`.pill`, `.t-go`, `.u-go`; in the Practice overview, Practice session), other actions are clear glass pills (`.linkbtn`, `.t-reset`, Random problem), a toggle or choice is clear glass with a coloured edge and fills when on (`.chip`, Test me, the switchers, the session setup), and the app bar has round glass icon buttons (`.icon-btn`). `check_site.py` checks the main ones share one colour.

Markup inside the strings:

- `$inline$` and `$$display$$` for math. Fractions in inline math are drawn full size (`\displaystyle`) in problems, hints, answers and solutions. The Summary's running text keeps small inline fractions (such as π/2) and puts each key formula full size on its own line as `$$…$$`; stack several with `aligned` or `gathered` so a phone never has to scroll sideways. A `.` or `,` right after longer inline math is drawn inside it, so it can't start a line by itself.
- `**bold**`.
- Lines starting with `- ` are list items, and continuation lines join the item.
- A blank line starts a new block.
- `(2pt×2)` is styled as a point value.

Strings use `String.raw`, so avoid `${` inside them (to keep a formula from breaking across lines, group it with `\mathord{…}`, not a bare `{…}` right after the `$`).

- **Steps.** Solutions open one step at a time. Each paragraph, or each list item, of `sol` is one step, so write a step per block (`**(1)** …`, blank line, `**(2)** …`).
- **New labels.** Give anything new an `added: 'YYYY-MM-DD'` (units, practice problems, formula groups, mocks). It gets a "New" label, and its tab a dot, for up to 14 days, and only until the device has seen it: a tab's dot goes when the tab is opened, and the labels inside it stay for the rest of that visit, then go. Also add a line to `news` in `site.json`. The home page's What's new groups entries by date, with one New label per day, which works the same way. The dates seen are kept in localStorage (`study-seen`, shared by both pages), and the copy taken at the start of a visit is kept in sessionStorage (`study-seen-start`).

## Content (src/math/integrals)

These modules are the Calculus midterm 2 page (`math/integrals/`). They use the same markup as Calculus midterm 1.

- `content.mjs`: units, exam-day habits and practice problems. `extras.mjs`: search tags, the Formulas tab, the interactive graphs (`GRAPHS`, drawn by `graphs.js`; `riemann` is the Riemann-sum graph) and the lesson icons. `followups.mjs`: Follow-up A and B for each in-class quiz, like Calculus midterm 1's. `verify.py`: numeric checks for every answer (practice and follow-ups), Summary claim, formula and the graph (Riemann sums are added up exactly with fractions; every primitive is checked by differentiating it at several points).
- Units follow the course schedule (integral part): the slide gives dates, not day numbers, so every unit has `dates` ("2 & 3 Nov"). A lesson gets `days` and `quiz` once a quiz sheet shows them: Quiz 06 is "Day16 & Day17", so 5 & 6 Nov are Days 16 and 17 and 2 & 3 Nov (the two classes before) Days 14 and 15; Quiz 07 is "Day18 & Day19" (9 & 10 Nov); Quiz 08 is "Day20 & Day21" (12 & 13 Nov). Lessons still to come keep their dates only, and the picker's span stays "2–20 Nov" until every lesson has day numbers (`spanOf`). `starred` marks the lessons with an in-class quiz (the schedule's *).
- 2 & 3 Nov was shortened on 6 Nov (at the user's request: it had grown complicated and isn't what the quizzes ask). It keeps Δx and the sample points, the Riemann sum and its limit, the partial sums, the five steps, the two class examples, signed area and the F(b) − F(a) shortcut; upper and lower sums, the quick way for xᵐ, integrals on [a, b] from ∫₀ᵇ − ∫₀ᵃ and the functions without a primitive formula were cut, with practice 1.4, 1.5, 1.6 and 1.10 and their formula rows. The properties moved to 5 & 6 Nov. The remaining problems keep their old ids in `id`.
- A lesson can run into the next class: 9 Nov began by finishing primitive functions (the inverse trigonometric functions: arcsin, arccos, their derivatives and ∫ 1/√(1 − x²) dx = arcsin x), so that part is in `u2` (its `added` moved to 9 Nov, practice 2.10, formula group `g2c` labelled with u2's day, which the night-before sheet needs). 9 & 10 Nov (`u3`) follow the slides: substitution, the calculation of a definite integral with the limits on the u-axis, rational forms (partial fractions; a square and arctan when the denominator doesn't factor), √(ax + b), u = tan(x/2), and integration by parts. Its practice is the class examples and both exercise sets, plus a "Which method?" drill.
- **Shortcuts** (added 10 Nov at the user's request): tricks from outside the lectures go only in a unit's `tricks` (with `tricksAdded` for its New label), drawn after Watch out as a green "Shortcuts" box that says they are not from the lectures (`.tricks` in `page.css`, `tricksHTML` in `build.mjs`, searchable as "Shortcut — …"), in the formula group `gs` (labelled "Extra · not from the lectures", so the night-before sheet lists it with the values to know) and in practice problems named "Shortcut…" (2.11, 3.14, 3.15, 4.11). The key ideas and Watch out lists still stick to the lectures. Now: u2 (the special triangles for arcsin and arctan values, odd and even functions on [−a, a], half circles), u3 (guess and adjust, making the derivative appear, the cover-up method, which factor to differentiate, the DI table, the King's rule) and u4 (the reduction formula on [0, π/2] in one line, sin² and cos² on a quarter turn, a perfect square under the root of a length, checking an average).
- A wide display formula is split with `aligned` (start a line with `&=`, or `&\quad−` for a long subtraction) so a 390 px phone never scrolls one sideways; Practice and Quizzes solutions count too.
- The whole schedule is in `units` from the start. A lesson not taught yet has `upcoming: true` and only `id`, `dates`, `title` and `starred`: it shows as a greyed-out Summary tile ("Notes after class") and nowhere else. After the class, remove `upcoming`, write its `ideas` and `watch`, and add `added`, practice problems, formulas, tags and checks, as for Calculus midterm 1.
- A lesson pair is one unit over its two days. After the second day, extend its ideas and watch list and move its `added` to that day, so it is New again on devices that saw the first day. A lesson may have more than one formula group (`g1`, `g1b`).
- Practice ids start again at `1.1` here: they live in this page's own store (`cla1-integrals-review`), so they never meet Calculus midterm 1's marks.
- 12 & 13 Nov (`u4`, Application of integration) covers the area between two curves, volumes from slices (cylinder, cone, sphere), solids of revolution with and without a hole, the two types of averages (the slide's f̄ and x̄ with the probability f(x)/P), the length of a curve (a smooth plane curve, from the straight piece Δℓ = Δx√(1 + c²)) and of a circular arc, the reduction formulas for cosⁿ and sinⁿ by parts (Cₙ, Sₙ, and Iₙ on [0, π/2]) and, because Quiz 08 asks it, products of sines and cosines. Its formula groups are `g4` (area and volume), `g4b` (averages and length), `g4c` (powers of sine and cosine) and `g4d` (trig identities for integrals: power-reducing and product to sum, added at the user's request).
- In-class quizzes start with Quiz 06 (5 & 6 Nov); Quiz 07 followed on 10 Nov and Quiz 08 on 13 Nov.
- A quiz handed out on more than one sheet (Quiz 08 came on two, the same three questions with different functions) keeps all its questions in one `qs`, each with `sheet` ('1', '2'). The page puts a "Sheet 1", "Sheet 2" heading where each starts (`.sheet-part`), search names the sheet ("Quiz 08 · Sheet 2 · Q.1"), and the lock panel stays one per quiz, so a build without the password draws the same page. The headings never say which students got which sheet. This page's sheets are retyped in `private/inclass-integrals.mjs` (sealed with the rest of `private/`) and reach the site as `math/integrals/locked.json`, with the same password and salt as Calculus midterm 1's, so one unlock (and "Remember on this device") opens both pages and Physics. Their checks are in `private/verify_inclass.py`, and `leakcheck.mjs` reads them too. The mock part of Exams shows a `soon-box` until the first mock.

## Physics (src/physics)

The EP1 review: `/physics/` is its exam picker (`EXAMS` in `content.mjs`: the midterm, and the final as "Coming soon") and `/physics/midterm/` the midterm page (Chapters 1–8 of Fundamentals of Physics; the exam is on 13 Nov 2026: six questions in 60 minutes).

- The pages run on Math's page script and style (`src/math/page.js` and `page.css`, with the calculator and back-to-top) in Physics colours (`physics.css`). `<body data-page>` gives `page.js` the page's own settings (its storage keys, `physics` in `study-seen`, the search suggestions); Math uses the defaults. The theme is shared: it is kept in Math's store. `physics/assets/` holds `physics.css` and `physics.js`, named by version like Math's; the KaTeX fonts are Math's (`math/assets/fonts`), so build Math first.
- **Summary** (`summary.mjs`, the tab the page opens on): per chapter, each of the book's modules (`modules` in `content.mjs`: number and title, such as 3-1 Vectors and their components) with its key ideas and one worked example (`ex`: `stem`, optional `fig`, `parts`, `answer`, `sol`, marked up like a problem), then the chapter's "Watch out" list; `habits` is the exam-day list. Keep the ideas short; every worked example is checked in `verify_summary.py`.
- **Practice** (`practice.mjs`): each chapter's problems in three tiers (`tier`: `f` Foundation, `a` Application, `x` Advanced; `TIERS`): five Foundation problems for every chapter, and more Application and Advanced ones for the heavier chapters. The Advanced ones are exam-style, of the kinds the exercise days set. A problem is marked up like a practice-set problem, with a `topic` and parts labelled (a), (b) …. Its id, `<chapter>.<position>` (4.11), is the key for its saved mark, so append new problems and never reorder. Checked in `verify_practice.py`.
- **Exams** (`mocks.mjs`): the upcoming exams and three mock midterms in the exam's format, six problems in 60 minutes, following the exercise days' kinds of problems with new set-ups. `pts` per part (the paper gives none: every problem counts 10). Timed, printed and marked like Math's mocks. Checked in `verify_mocks.py`.
- **Past midterms** (`private/past.mjs`, under the mocks in Exams): the 2022 midterm (10 Nov 2022, six problems) and the 2021 one (8 Nov 2021, a proficiency check set as a report, five problems), retyped with worked answers. They are locked with the same password as the exercise days and travel in `physics/midterm/locked.json`, whose readable `past` list draws their password panels without the password. Shaped like the mocks plus `seg`, `sub`, `added` and optional `labels` (the paper's own, such as (a) or 1-1a; '' for a problem that is one question); 60 min and 10 pt a problem are estimates. The file is self-contained, because the build may load it from the sealed copy, where it can't import `exercises.mjs`. Checked in `private/verify_past.py` (every answer, and that each problem's labels, steps and numbers are its own); `leakcheck.mjs` reads them too. Most of their problems are the exercise days' own; their figures (`p21-…`, `p22-…`) are mostly the exercise days' drawings under the paper's captions.
- Practice and the mocks may follow the kinds of problems the exercise days set, never their wording: `leakcheck.mjs` must find nothing.
- **Formulas** (`formulas.mjs`): the special angles (`trig`) and constants, then per chapter each module's formulas as `[name, TeX, stars, note]` (stars: 3 core, 2 key result, 1 supporting) and `extra` rows for helpful results the book doesn't print (tagged Extra). No worked examples here: they belong in Summary. `verify_formulas.py` checks every row, most by evaluating the row's own TeX with numbers from the physics, and fails on a row without a check.
- Quizzes has two groups, each behind a switcher:
  - **Exercise days**: the exercise-day sheets from class (Lectures 15, 19 and 27), retyped with worked answers, in `private/exercises.mjs`. They are locked like Math's in-class sheets, with the same password and salt, so one unlock (and "Remember on this device") opens both subjects. Day 3 is the review sheet before the midterm: every problem on it is one of Days 1 and 2 under a new number (0–7 are Day 1's, 8.1–17 Day 2's). So each problem is written once in `exercises.mjs`, as a function of its number on a sheet (and of its figures), and every day lists them in its own order; `private/verify_exercises.py` checks that Day 3's answers are exactly the checked Day 1 and Day 2 answers, and that every number in a sheet's words (step labels, "Problem 9-3", "Figure 13") is that sheet's own.
  - **Practice sets** A, B and C (`quizzes.mjs`, public): new problems in the exercise days' format: Problem 0, a warm-up of twelve short items (definitions, significant figures, unit vectors, a derivative, scalar or vector), then Problems 1–10 with parts `n-1`, `n-2` …, across Chapters 1–8. They are original problems, not taken from the class sheets or from the earlier practice package (Quizzes 1–13, Tests A–C and a practice midterm, kept outside this repository).
- A problem: `no` ("0", "1.2"), `topic` (the tag, ending with its chapters), `stem`, `fig` (one figure id or a list), `parts`, `labels` (to override `no-1` …, such as `(A)`), `answer` (one per part, or one when there are no parts) and `sol`. The markup is Math's; in a stem or solution, a paragraph followed by `- ` lines in the same block becomes a paragraph and a list (each item one step), and `[[fig:id]]` as a block of its own puts a figure there.
- `figures.mjs`: every figure is an original line drawing in inline SVG (nothing copied from the textbook or the class sheets), in the page's colours so it follows dark mode. `plot()` draws graphs. The exercise days' figures (`d1-…`, `d2-…`, and `d3-…`: Day 2's drawings under the captions Day 3 gives them, made by `again`) and the past midterms' (`p21-…`, `p22-…`) only ever travel in the locked file.
- `verify_sets.py` checks every practice-set answer numerically (with `verify_lib.py`: force sums, step-by-step integration of the motion, work integrals); `private/verify_exercises.py` does the same for the exercise days. `leakcheck.mjs` fails if text, a formula, a figure or a problem id of the exercise days is on a public page (wording the public sources print on purpose, such as a textbook formula, doesn't count).
- Commands: `node src/physics/build.mjs site` (with `SITE_PASSWORD` it re-seals `private/` and rebuilds `physics/midterm/locked.json`; without it, it keeps them), `open` (decrypts into `src/physics/private/`), `seal`, and `rekey` (run it right after Math's `rekey`, with `SITE_PASSWORD` the old password and `NEW_SITE_PASSWORD` the new one).

### A new exercise day (needs the password)

1. `SITE_PASSWORD='…' node src/physics/build.mjs open`.
2. Retype the sheet into `private/exercises.mjs` (draw its figures in `figures.mjs`), and add its checks to `private/verify_exercises.py`. A problem an earlier day already set is reused with the new sheet's number, as Day 3 does, not typed again.
3. `SITE_PASSWORD='…' node src/physics/build.mjs site`, then `node src/physics/leakcheck.mjs` and every check. Add a What's new line (`physics`).
4. Commit and push. `private/` stays out of git.

### A past midterm paper (needs the password)

1. `open`, then add the paper to `private/past.mjs` (newest first) with its checks in `private/verify_past.py`, and its figures in `figures.mjs`.
2. Build with `SITE_PASSWORD`, run `leakcheck.mjs` and every check (`check_site.py` with `SITE_PASSWORD` opens the papers; update its counts), add a What's new line (`physics`), then commit and push.

## Build and check

```sh
node src/math/build.mjs site
node src/physics/build.mjs site
python3 src/math/verify_practice.py && python3 src/math/verify_formulas.py && python3 src/math/verify_followups.py && python3 src/math/verify_mocks.py && node src/math/verify_exact.mjs
python3 src/math/integrals/verify.py
python3 src/physics/verify_sets.py && python3 src/physics/verify_summary.py && python3 src/physics/verify_formulas.py
python3 src/physics/verify_practice.py && python3 src/physics/verify_mocks.py
node src/shared/calculator_test.js
python3 src/check_site.py
python3 src/check_features.py
```

With the private folders open, also run `node src/math/leakcheck.mjs`, `node src/physics/leakcheck.mjs`, `python3 src/math/private/verify_inclass.py`, `python3 src/math/private/verify_past.py`, `python3 src/physics/private/verify_exercises.py` and `python3 src/physics/private/verify_past.py`.

- Without `SITE_PASSWORD`, `site` keeps `math/derivatives/locked.json` as it is. A build with the password and one without write the same pages.
- `check_site.py` runs the pages in Chromium (Playwright): layout on phone and desktop, home → picker → exam page, tabs, search and the locked panels, for Math and Physics. With `SITE_PASSWORD` set it also tests unlocking, and that one remembered password opens both subjects.
- `check_features.py` covers the exam pickers and old addresses, the shared files, the Exams tab, countdowns, mock scoring, step-by-step solutions, Test me, graphs, printing, New labels (per subject on the home page), the home page, the glass look (the wash, which parts blur, the tab bar and its pill), the moves between pages, and offline use. Some of its checks count today's content; update the counts when content changes. New labels last 14 days, so its New-label checks show the pages fixed moments (`set_fixed_time`) when everything they count was new: noon on 11 Nov 2026 for Calculus midterm 1 (from 29 Oct), the home page and the picker, and noon on 13 Nov 2026 for Calculus midterm 2 (its lessons, graph and tab dots). Each moment must keep every item it counts at most 13 days old and none more than a day ahead, so when newer content needs it, add or move a moment for that page rather than one for everything. A What's new day after the 11 Nov moment isn't New there, so that check counts only the days up to 12 Nov. The home page's own checks work the dates out from today (which exams are to come or done, which days are still New), so they keep passing as exams go by.
- KaTeX is vendored, so no network or npm install is needed.

## A new class (no password needed)

1. Extend a unit or add one in `content.mjs`. For a new unit, also add an icon to `UNIT_ICONS` in `extras.mjs`.
2. Add practice problems, formulas and search tags.
3. Add numeric checks for the new answers.
4. Build, run every check, then commit and push.

## A past exam paper (needs the password)

1. `open`, as below, then add the paper to `private/past.mjs` and its checks to `private/verify_past.py`.
2. No public page may use the same functions: `leakcheck.mjs` reads the past papers too. Change a mock or practice problem that does.
3. Build with `SITE_PASSWORD`, run `leakcheck.mjs` and every check (`check_site.py` with `SITE_PASSWORD` opens the papers), then commit and push.

## A new in-class quiz (needs the password)

1. `SITE_PASSWORD='…' node src/math/build.mjs open` decrypts the private sources into `src/math/private/`.
2. Retype the quiz into `private/inclass.mjs` (Calculus midterm 1) or `private/inclass-integrals.mjs` (Calculus midterm 2), and add its checks to `private/verify_inclass.py`.
3. Write Follow-up A and B in `followups.mjs`, with checks in `verify_followups.py` (Calculus midterm 2: `integrals/followups.mjs`, checks in `integrals/verify.py`). Give them `added`.
4. `SITE_PASSWORD='…' node src/math/build.mjs site` re-seals `private/` and rebuilds the page's `locked.json`.
5. Run `node src/math/leakcheck.mjs` and every check. All must pass.
6. Commit and push. `private/` stays out of git.

A few details about the password:

- The build refuses a password that doesn't open the current files. A typo can't lock everyone out.
- Case, spaces and hyphens are ignored, in the build and on the page.
- To change it, run `SITE_PASSWORD='old' NEW_SITE_PASSWORD='new' node src/math/build.mjs rekey`. Devices that chose "Remember on this device" then ask for the new password once.

## The look: frosted glass

Every page is drawn as frosted glass (since 14 Nov 2026, at the user's request: "smooth and modern", glassy). `page.css` holds it for the exam pages and pickers, `physics.css` swaps in the Physics colours, and `index.html` and `404.html` repeat the same tokens by hand.

- **The wash.** A soft wash of four colour patches sits behind the page and stays put while it scrolls (`body::after`, fixed; `--wash-1` to `--wash-4`: greens and blues for Math and the home page, blue through violet to a little green for Physics). Keep it light: `--ink-soft`, `--green-text`, `--amber` and `--warn` must read on every wash colour (4.5 to 1 or better, the dark-mode washes included). They were darkened a little for that; darken a text colour or lighten a wash before making either stronger.
- **Glass that blurs: the bars only.** The app bar, the tab bar, the search sheet, the Practice session's bar and the calculator window blur what scrolls under them (`backdrop-filter`, with `--chrome` as their fill). Nothing that repeats may blur: cards, questions and boxes are see-through panels (`--glass`, a light edge `--glass-edge`, `--glass-shine` and `--glass-shadow`), so a tab with a hundred cards stays as cheap to draw as before. `check_features.py` checks both.
- **Tokens.** `--glass` (a panel), `--glass-2` (a control, or a box inside a panel), `--under` (what lies under a tinted box that sits on the page itself, such as Watch out: it lightens the wash there, and darkens it in dark mode, so the box's text reads), `--tint` (see-through now) and `--tint-solid` (for drawings that must hide what is behind them: `.pfig .body`), `--cutout` (an icon's cut-out on a panel), `--green-line` (a coloured edge) and `--bar-rgb` (the bars' colour: `.sb-edge`, and written as hex in `BAR_COLOURS` in `build-lib.mjs`, in the `theme-color` of `index.html` and `404.html`, and in `manifest.webmanifest`; change them together).
- **The tab bar.** On phones it floats at the bottom, a glass pill (`--tabbar-h` is the room it takes, for the page's bottom padding and the floating buttons), and the page fades into the bars' colour under it (`.tabbar + main::after`), so no half line of text shows around it. The open tab is a filled pill that slides to the tab tapped: `show` in `page.js` sets `--tab-i` (the tab's place in the row) and `.no-tab` (the night-before sheet has no tab), and `.live` switches the glide on after the first view, so the pill starts in place. On wide screens the bar is a strip of glass under the app bar that stays at the top.
- **Titles and labels.** Each view opens on a large title on the page itself (`.band`, with the Japanese name beside it; print gives it a rule below). Small labels are written in sentence case, not in capitals.
- **Print** is plain: white panels with a grey edge, no wash and no shadows (the print part of `page.css` sets the glass tokens to white).

## Moving between pages

- A tap on a link to another page of the site cross-fades to it: a view transition (Safari 18.2+, Chrome and Edge 126+; other browsers open the page as before). The rule that switches it on, `@view-transition { navigation: auto; }` inside a no-reduced-motion query, is a `<style>` at the top of every page's head (`VIEW_TRANSITION` in `build-lib.mjs`, in `HEAD_COMMON`; written out in `index.html` and `404.html`). It must come before any style sheet the page links: the browser gives the move up (and logs "ViewTransition opt-in disabled") if it works out the page's style once without the rule, which happens whenever the fonts' sheet arrives before the page's own. So never move it into `page.css`.
- The subject's badge glides between its places on the two pages. Each place carries `view-transition-name: badge-math` or `badge-physics`: the subject cards on the home page, the app bar's badge and the switch button's badge on a subject's pages (`page.css`; `physics.css` names its two the other way round, so a switch of subject swaps them). A name may be on a page only once, or the browser skips the move. After a tap inside the home page's next-exam card, that card's badge takes the name instead of the subject card's (`.from-next` on `<html>`, set by the home page's script).
- A tab opened by hand (a tab, the brand, Back, the night-before link) fades in, its title rising into place: `openView` in `page.js` adds `.view-in` for the length of the fade. Only the title moves, so a scroll right after the tab opens meets nothing that shifts (the "fling" check). Jumps made from code (search hits, tiles, "Pick up where you left off") go through `show` and appear at once.
- With reduced motion there is none of this. `check_features.py` checks the names, that a move really is a view transition where the browser has them, and the reduced-motion case.

## Practice sessions, the night-before sheet, and phones

- **Practice sessions** (every exam page, `ssSetup` and friends in `page.js`; the setup's markup is `sessionSetup` in `build-lib.mjs`, opened by the overview's **Practice session** button, `practiceButtons`). The setup picks which problems (not marked yet, to review, all), from which lessons or chapters (chips by `punit` id, Math labelled like the rings, Physics by chapter number) and, on Physics, which levels (`TIERS`), and how many (5, 10, 20, all); the choices are kept in the page's store (`st.ss`). A session shuffles them and shows one at a time: the Practice tab gets `.in-session`, which hides everything but the bar (`#sbar`: the count, where the problem is from, End, and Skip, which reads Next once the problem is marked) and the current card (`.s-cur`). The cards are the tab's own, so marks, answers and steps work as everywhere. The end (`#sdone`) counts got / to review / skipped and offers the ones to review again. A search hit into Practice leaves the session.
- **The night-before sheet** (`#night`): a sixth view with no tab, opened from a link card (`nightLink`) in Exams (under the upcoming exams) and Formulas (under Test me), and from the home page. It is lazy like the tabs and has no search entries. Math: the exam-day habits, then each lesson on the midterm (taught, without a `note`) with its formula groups (matched by the group's day label, the first part of `quiz`, to the unit's `days`) and its Watch out list, then the values to know (the exact-values table and the groups of no single lesson, such as Trig without a calculator). Physics: the habits, then each chapter's ★★★ formulas by module with its Watch out list, then the special angles and the ★★★ constants. Print and Back buttons (`nightTools`; Back returns to the tab it was opened from); it is never the tab a page opens on next time (`st.tab` keeps the last real tab, `current` is the view on screen).
- **Phones** (under 640 px): the band is slimmer and its intro shows one line until it is tapped (`page.js` and `PICKER_JS`).
- **The status bar in the Home Screen app** (iOS and iPadOS 26+): the system blurs the page under the status bar unless it finds a fixed, full-width box more than 10 px tall at the top edge. It must be a real element: `body::before` isn't found, and `env(safe-area-inset-top)` is 0 there anyway. Every page starts with one, `.sb-edge` (`SB_EDGE` in `build-lib.mjs`, written out in `index.html` and `404.html`): 12 px, topmost and tap-through, with a background colour that paints nothing (`background-clip: text`). The system fills the status bar with that colour: the bars' own (`--bar-rgb`), without their see-through part. The app bar and the wide screens' tab bar share that colour, so the strip never has to change. `check_features.py` checks it on every page; only a device shows the status bar itself.
- **Search text** (`texPlain` in `build-lib.mjs`): formulas are written the way they look, for the results and their keys: Greek letters and symbols as characters, x², x₀, 10⁻²⁷ and aₙ₊₁ where every character can be raised or lowered (digits, signs, the usual index letters), else ^(…) and _…, fractions as a/b, and limits, sums and integrals with their bounds in brackets (lim(h → 0), ∫(0 to π)). `check_features.py` checks a few.

## Exam dates, What's new, and speed

- **Exam dates.** Fill in `date` (`YYYY-MM-DD`) and `time` (`HH:MM`, Japan time) in `site.json`, then rebuild that subject's pages (the pickers write each date in at build time). Countdowns, sorting and "Done" are worked out in the browser.
- **Last updated.** Every footer gives a date. The home page shows the newest What's new date. An exam page shows the newest of its What's new dates (`math` or `all` entries whose `link` starts with the page's address) and its `added` dates, written at build time (`P.updated` in `build.mjs`, also on its tab bar as `data-updated`, which lets the picker's card know the page has been seen: its `seen` key in `study-seen`, `math` for Calculus midterm 1 and `math-integrals` for midterm 2). The picker shows the newest of all of them. An update that adds no item still moves it once it has a What's new line that links to the page. The home page's Math card is New while any Math entry is new to its page's key (`PAGE_KEYS` in `index.html`; entries that link elsewhere use `math`).
- **Fast first load.** Only the Summary tab is built with the page. Practice, Formulas, Quizzes and Exams travel as text (`<script type="text/x-lazy-html">`, `lazyTab` in `build-lib.mjs`) and are built the first time they open. `page.js` `VIEW_INIT` switches on each tab's features then. Keep new tabs lazy too. `leakcheck.mjs` reads the lazy text as well, on every exam page and the picker.
- **Answers are built when opened.** A worked answer's answer box and steps travel as text too (`solToggle` in `build-lib.mjs`: a `<script class="lazy-sol">` inside the closed `details.sol`), on every page and in the locked files, and are built when it opens (`fillSol` in `page.js`: on the click that opens it, or on `toggle` when code opens it; Print with answers builds a sheet's answers first). The mark and tick buttons come after the text and are built with the tab, since marks and scores are painted on them. Inside a lazy tab these scripts' end tags travel as `<\/script>`, so a script inlined in a page (the private copy) must not contain `</script` either; the build stops if one does. Use `solToggle` for any new kind of answer.
- **A long tab shows before all of it is drawn.** Practice cards, quiz and exam questions, formula rows and Physics Summary modules start with `content-visibility: auto` (the speed part of `page.css`; Physics sizes in `physics.css`), so those away from the screen skip layout at first and the tab shows at once. `drawAll` in `page.js` then draws them for good (`.drawn`) while the page is idle, about 10 ms at a time. Chrome's scroll anchoring holds the reader's place only for cards drawn that way, not for ones the browser draws itself as they come near, so `jumpTo` draws everything above its target first, and a scroll past cards not drawn yet draws them at once. Print draws everything. While skipped, a card clips what overflows it, so the browser checks measure sideways scroll with `content-visibility` off; `check_features.py` also flings to the end of a fresh tab and scrolls back up, which must never jump. With the lazy answers, the Physics midterm's tabs open two to five times faster on a slow phone (Practice about 1.2 s to 0.3 s with the CPU slowed 4×), with the same layout.
- **Shared files.** Styles, scripts and the KaTeX fonts live in `math/assets/`, so they are downloaded once, not with every page; that halved what a visit to Calculus midterm 1 downloads (about 400 KB compressed before, under 200 KB after). The two fonts most formulas need are preloaded. A script in each page's head sets the saved light or dark theme before the first paint (`data-theme-early`, which `page.js` doesn't mistake for a host's theme).
- **Offline.** `sw.js` serves pages and data network-first, with the saved copy when offline; files named with `?v=` (the shared files, `locked.json`) and images and fonts cache-first, keeping only the newest version of each. `CORE` saves the pages, the shared files and the fonts (listed by name) at install, so an exam page opens offline even before its first online visit. Bump `CACHE` in `sw.js` when its `CORE` list changes, and when every page changes at once (a new look), so a device swaps its whole saved copy in one go.

## The floating calculator

- It's a ghost button parked on the left or right edge, bottom left by default. At rest it is a slim tab on its edge (22 of its 44 px show, square against the edge and rounded outside, with a smaller icon whole in what shows), so it covers almost none of the page; it comes out as the round button when it is woken, open, dragged or focused. Drag it anywhere and it glides back to the nearest side; a quick flick throws it across. On the right edge it stays above the back-to-top button.
- The first tap makes it opaque and shows "Tap again to open". A second tap on it opens the calculator. A tap anywhere else, or 4 seconds without one, cancels. Enter on the focused button opens it at once.
- The calculator follows the Windows standard layout, with memory (MC MR M+ M− MS and the M▾ list) and no history. It works with exact fractions, so 1 ÷ 3 × 3 = 1 and 0.1 + 0.2 = 0.3. It shows results the way Windows does: 16 digits, and "1.e+16" style above that. `calculator_test.js` holds the Windows cases; keep them passing.
- The window doesn't block the page. It moves by its title bar and closes with ×, Esc (once it's cleared), or one tap on the button.
- While the page scrolls down, the button tucks into its edge (with the back-to-top button), so neither covers the text being read. Both come back on the way up (after 24 px), near the top, at the end of the page, and after the calculator is used (closed or moved). The button stays put while it is woken, open, dragged or focused. `totop.js` tracks the scroll direction and sets `fab-away` on `<html>`; the calculator sends a `fabshow` event after use.
- It is off while a quiz timer runs, since the course is calculator-free; `page.js` sends a `quiztimer` event.
- It is set up after the page has loaded, so it adds nothing to load time; keep it that way.
- Browser storage: `study-calc-memory` (memory values) and `study-calc-position` (where the button rests).

## Back to top

- A round button in the bottom-right corner, above the tab bar on phones. It is hidden near the top and fades in after about half a screen of scrolling (at least 300 px). A tap scrolls smoothly to the top (at once with reduced motion) and moves keyboard focus to the brand link.
- Like the calculator button, it tucks away while the page scrolls down and comes back on the way up and at the end of the page.
- Footers keep enough bottom padding that the last line ends above the floating buttons.
- A page without a tab bar sets `--totop-bottom`, as the home page and the picker do. The hover and focus colours come from the page's `--bar-active` and `--lime-deep`.

## Side menu (wide screens)

- From 1100 px wide (computers, iPads held sideways), each tab gets a menu on the left that stays in view: the tab's sections (`TOC_SECTIONS` in `page.js`: lessons, Practice units, formula groups, quizzes, and in Exams the mock and past-paper groups with each paper listed), with the one being read highlighted. Narrower screens never show it. The layout widens to 1040 px there, so the text keeps its usual width.
- It is built from each tab's own sections when the tab is built, labelled with their kicker's first part (the day or quiz) and heading, so a new unit or group appears without changes here. A section needs an `id` and an `h2`.
- Jumps (the menu, Summary tiles, search) go through `jumpTo`: it asks `graphs.js` to draw the graphs above the target first (`buildgraphs` event), so the page doesn't grow during the glide, and corrects the position once it settles.

## Printing

- Every mock and past midterm has two buttons under its note: **Print paper** (the questions with room to write under each part and a score line, without answers, timer or buttons) and **Print with answers** (the questions with every answer and all solution steps). `printSheet` in `page.js` marks the sheet `.printing`, the elements around it `.print-path` and the kind in `data-print` on `<html>`; the print part at the end of `page.css` does the rest. The marks go when the page is next used after printing, because an iPhone reports the end of printing while its print sheet is still open.
- The browser's own Print gets the open tab without the app bar, tab bar, search and floating buttons. Printouts always use dark ink on white, also in dark mode.
- Pages break between parts and solution steps, never inside one.
- `check_features.py` checks both kinds of printout with print media emulated.

## App icon

- The app's icon is a picture the user chose: a chibi anime character in a Santa outfit, not one of the site's own drawings. `src/app-icon.png` is the square it was cut to, and `python3 src/app_icon.py` makes every size from it, in the repository root:
  - `apple-touch-icon.png`: the Home Screen icon on an iPhone. Every page names it, so the icon is the same whichever page is added to the Home Screen.
  - `icon-192.png`, `icon-512.png` and `icon-maskable-512.png`: the installed app (`manifest.webmanifest`). In the maskable one the picture sits inside the middle 80%, which Android never cuts off.
  - `favicon.png` and `logo.png`: the home page's browser-tab icon and its logo (`.brand`). The 404 page uses them too.
- Each subject keeps its badge (`SUBJECT_ICONS` in `src/shared/icons.mjs`). The script also writes the badges as the subject pages' tab icons (`favicon-math.svg` and `favicon-physics.svg`, named by `HEAD_COMMON` in `build-lib.mjs`) and as the pictures of the manifest's shortcuts (`icon-math-192.png` and `icon-physics-192.png`). Run it again when a badge changes. The link previews (`og-*.png`) keep the badges too.
- To use a new picture, run `python3 src/app_icon.py picture.jpg left top right bottom`. The four numbers are the crop box in pixels; without them it takes the largest square from the top. Then bump `CACHE` in `sw.js`, because images are served from the saved copy first. An iPhone keeps its Home Screen icon until the site is added to the Home Screen again.
- `check_features.py` checks the tab icon of every page, the files and sizes the manifest names, and the logo.

## A private, unlocked copy

`node src/math/build.mjs artifact out.html` writes one self-contained page with the in-class sheets in plain view. It needs `private/`, or `SITE_PASSWORD`. Never commit that page.

## Publishing

Commit to `main` and push. GitHub Pages redeploys in about a minute.
