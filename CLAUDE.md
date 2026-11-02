# Study site (y1-s1): how to update it

A static site on GitHub Pages (branch `main`, folder `/`), live at https://lmheew.github.io/y1-s1/.

- `/` is `index.html`, the home page: subject cards, upcoming exams, what's new, and offline install help. It is hand-written; update its cards when a subject is added or changes. It reads `site.json`.
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
- `site.json` holds exam dates (and each exam's `page`, once it has one, which the home page links to) and the "What's new" list, for the home page, the picker and the Exams tab.
- `sw.js` and `manifest.webmanifest` make the site installable and usable offline.
- `404.html` is the page GitHub Pages shows for any address that doesn't exist. It is hand-written in the home page's style, and its links are absolute (`/y1-s1/…`) because it is served at the missing address.
- Link previews (what LINE, Discord and others show when a link is shared): `og-home.png`, `og-math.png` (the exam picker), `og-math-derivatives.png`, `og-math-integrals.png`, `og-physics.png` (the Physics picker) and `og-physics-midterm.png` (1200 × 630) are drawn by `python3 src/og.py` (or `python3 src/og.py og-math.png` for one) and named in each page's `<head>` by their address on the live site (`SITE_URL` in `build-lib.mjs`; written out in `index.html`). Redraw them when a card's text changes, such as when an exam page arrives. Physics cards are drawn in the Physics blue. They use the site's own badges, never the KUAS logo.

## Rules

- **Never commit `src/math/private/`, `src/physics/private/` or the password.** Both folders are git-ignored. The in-class quiz sheets and the past midterm papers exist in the repository only encrypted: `src/math/private.sealed.json` (their source) and `math/derivatives/locked.json` (what the site opens with the password). `locked.json` also keeps a readable list of the past papers' titles, times and points, so a build without the password can still draw their password panels.
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
- Buttons follow one rule (top of the buttons part of `page.css`): the main action of a place is a filled green pill (`.pill`, `.t-go`, `.u-go`), other actions are outlined grey pills (`.linkbtn`, `.t-reset`), a toggle or choice is outlined green and fills green when on (`.chip`, Test me, the switchers), and the app bar has plain outlined icon buttons (`.icon-btn`). `check_site.py` checks the main ones share one colour.

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

- `content.mjs`: units, exam-day habits and practice problems. `extras.mjs`: search tags, the Formulas tab, the interactive graphs (`GRAPHS`, drawn by `graphs.js`; `riemann` is the Riemann-sum graph) and the lesson icons. `verify.py`: numeric checks for every answer, Summary claim, formula and the graph (Riemann sums are added up exactly with fractions).
- Units follow the course schedule (integral part): the slide gives dates, not day numbers, so units have `dates` ("2 & 3 Nov") and no `days`; the build then labels lessons by date everywhere. `starred` marks the lessons with an in-class quiz (the schedule's *).
- The whole schedule is in `units` from the start. A lesson not taught yet has `upcoming: true` and only `id`, `dates`, `title` and `starred`: it shows as a greyed-out Summary tile ("Notes after class") and nowhere else. After the class, remove `upcoming`, write its `ideas` and `watch`, and add `added`, practice problems, formulas, tags and checks, as for Calculus midterm 1.
- Practice ids start again at `1.1` here: they live in this page's own store (`cla1-integrals-review`), so they never meet Calculus midterm 1's marks.
- In-class quizzes start on 5 & 6 Nov; until then Quizzes and the mock part of Exams show a `soon-box`. The first quiz sheet will give the quiz number (and maybe the day numbers): add `quiz` (and `days`) to its unit then. Locked sheets for this page aren't wired yet (the build stops if the page lists any): give it its own private module and `math/integrals/locked.json`, with the same password and salt, like Calculus midterm 1's.

## Physics (src/physics)

The EP1 review: `/physics/` is its exam picker (`EXAMS` in `content.mjs`: the midterm, and the final as "Coming soon") and `/physics/midterm/` the midterm page (Chapters 1–8 of Fundamentals of Physics; the exam is on 13 Nov 2026: six questions in 60 minutes).

- The pages run on Math's page script and style (`src/math/page.js` and `page.css`, with the calculator and back-to-top) in Physics colours (`physics.css`). `<body data-page>` gives `page.js` the page's own settings (its storage keys, `physics` in `study-seen`, the search suggestions); Math uses the defaults. The theme is shared: it is kept in Math's store. `physics/assets/` holds `physics.css` and `physics.js`, named by version like Math's; the KaTeX fonts are Math's (`math/assets/fonts`), so build Math first.
- **Summary, Formulas and Quizzes have content.** Practice shows a heading per chapter (`chapters` in `content.mjs`) with a "coming soon" box (`.soon-box`, in Math's `page.css`, shared with Calculus midterm 2), and Exams the upcoming exams with a "mock midterms coming soon" box. Fill them only when asked, the way Math's are.
- **Summary** (`summary.mjs`, the tab the page opens on): per chapter, each of the book's modules (`modules` in `content.mjs`: number and title, such as 3-1 Vectors and their components) with its key ideas and one worked example (`ex`: `stem`, optional `fig`, `parts`, `answer`, `sol`, marked up like a problem), then the chapter's "Watch out" list; `habits` is the exam-day list. Keep the ideas short; every worked example is checked in `verify_summary.py`.
- **Formulas** (`formulas.mjs`): the special angles (`trig`) and constants, then per chapter each module's formulas as `[name, TeX, stars, note]` (stars: 3 core, 2 key result, 1 supporting) and `extra` rows for helpful results the book doesn't print (tagged Extra). No worked examples here: they belong in Summary. `verify_formulas.py` checks every row, most by evaluating the row's own TeX with numbers from the physics, and fails on a row without a check.
- Quizzes has two groups, each behind a switcher:
  - **Exercise days**: the exercise-day sheets from class (Lectures 15 and 19), retyped with worked answers, in `private/exercises.mjs`. They are locked like Math's in-class sheets, with the same password and salt, so one unlock (and "Remember on this device") opens both subjects.
  - **Practice sets** A, B and C (`quizzes.mjs`, public): new problems in the exercise days' format: Problem 0, a warm-up of twelve short items (definitions, significant figures, unit vectors, a derivative, scalar or vector), then Problems 1–10 with parts `n-1`, `n-2` …, across Chapters 1–8. They are original problems, not taken from the class sheets or from the earlier practice package (Quizzes 1–13, Tests A–C and a practice midterm, kept outside this repository).
- A problem: `no` ("0", "1.2"), `topic` (the tag, ending with its chapters), `stem`, `fig` (one figure id or a list), `parts`, `labels` (to override `no-1` …, such as `(A)`), `answer` (one per part, or one when there are no parts) and `sol`. The markup is Math's; in a stem or solution, a paragraph followed by `- ` lines in the same block becomes a paragraph and a list (each item one step), and `[[fig:id]]` as a block of its own puts a figure there.
- `figures.mjs`: every figure is an original line drawing in inline SVG (nothing copied from the textbook or the class sheets), in the page's colours so it follows dark mode. `plot()` draws graphs. The exercise days' figures (`d1-…`, `d2-…`) only ever travel in the locked file.
- `verify_sets.py` checks every practice-set answer numerically (with `verify_lib.py`: force sums, step-by-step integration of the motion, work integrals); `private/verify_exercises.py` does the same for the exercise days. `leakcheck.mjs` fails if text, a formula, a figure or a problem id of the exercise days is on a public page (wording the public sources print on purpose, such as a textbook formula, doesn't count).
- Commands: `node src/physics/build.mjs site` (with `SITE_PASSWORD` it re-seals `private/` and rebuilds `physics/midterm/locked.json`; without it, it keeps them), `open` (decrypts into `src/physics/private/`), `seal`, and `rekey` (run it right after Math's `rekey`, with `SITE_PASSWORD` the old password and `NEW_SITE_PASSWORD` the new one).

### A new exercise day (needs the password)

1. `SITE_PASSWORD='…' node src/physics/build.mjs open`.
2. Retype the sheet into `private/exercises.mjs` (draw its figures in `figures.mjs`), and add its checks to `private/verify_exercises.py`.
3. `SITE_PASSWORD='…' node src/physics/build.mjs site`, then `node src/physics/leakcheck.mjs` and every check. Add a What's new line (`physics`).
4. Commit and push. `private/` stays out of git.

## Build and check

```sh
node src/math/build.mjs site
node src/physics/build.mjs site
python3 src/math/verify_practice.py && python3 src/math/verify_formulas.py && python3 src/math/verify_followups.py && python3 src/math/verify_mocks.py && node src/math/verify_exact.mjs
python3 src/math/integrals/verify.py
python3 src/physics/verify_sets.py && python3 src/physics/verify_summary.py && python3 src/physics/verify_formulas.py
node src/shared/calculator_test.js
python3 src/check_site.py
python3 src/check_features.py
```

With the private folders open, also run `node src/math/leakcheck.mjs`, `node src/physics/leakcheck.mjs`, `python3 src/math/private/verify_inclass.py`, `python3 src/math/private/verify_past.py` and `python3 src/physics/private/verify_exercises.py`.

- Without `SITE_PASSWORD`, `site` keeps `math/derivatives/locked.json` as it is. A build with the password and one without write the same pages.
- `check_site.py` runs the pages in Chromium (Playwright): layout on phone and desktop, home → picker → exam page, tabs, search and the locked panels, for Math and Physics. With `SITE_PASSWORD` set it also tests unlocking, and that one remembered password opens both subjects.
- `check_features.py` covers the exam pickers and old addresses, the shared files, the Exams tab, countdowns, mock scoring, step-by-step solutions, Test me, graphs, printing, New labels (per subject on the home page), the home page and offline use. Some of its checks count today's content; update the counts when content changes.
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
2. Retype the quiz into `private/inclass.mjs`, and add its checks to `private/verify_inclass.py`.
3. Write Follow-up A and B in `followups.mjs`, with checks in `verify_followups.py`.
4. `SITE_PASSWORD='…' node src/math/build.mjs site` re-seals `private/` and rebuilds `math/derivatives/locked.json`.
5. Run `node src/math/leakcheck.mjs` and every check. All must pass.
6. Commit and push. `private/` stays out of git.

A few details about the password:

- The build refuses a password that doesn't open the current files. A typo can't lock everyone out.
- Case, spaces and hyphens are ignored, in the build and on the page.
- To change it, run `SITE_PASSWORD='old' NEW_SITE_PASSWORD='new' node src/math/build.mjs rekey`. Devices that chose "Remember on this device" then ask for the new password once.

## Exam dates, What's new, and speed

- **Exam dates.** Fill in `date` (`YYYY-MM-DD`) and `time` (`HH:MM`, Japan time) in `site.json`, then rebuild that subject's pages (the pickers write each date in at build time). Countdowns, sorting and "Done" are worked out in the browser.
- **Last updated.** Every footer gives a date. The home page shows the newest What's new date. An exam page shows the newest of its What's new dates (`math` or `all` entries whose `link` starts with the page's address) and its `added` dates, written at build time (`P.updated` in `build.mjs`, also on its tab bar as `data-updated`, which lets the picker's card know the page has been seen: its `seen` key in `study-seen`, `math` for Calculus midterm 1 and `math-integrals` for midterm 2). The picker shows the newest of all of them. An update that adds no item still moves it once it has a What's new line that links to the page. The home page's Math card is New while any Math entry is new to its page's key (`PAGE_KEYS` in `index.html`; entries that link elsewhere use `math`).
- **Fast first load.** Only the Summary tab is built with the page. Practice, Formulas, Quizzes and Exams travel as text (`<script type="text/x-lazy-html">`) and are built the first time they open. `page.js` `VIEW_INIT` switches on each tab's features then. Keep new tabs lazy too. `leakcheck.mjs` reads the lazy text as well, on every exam page and the picker.
- **Shared files.** Styles, scripts and the KaTeX fonts live in `math/assets/`, so they are downloaded once, not with every page; that halved what a visit to Calculus midterm 1 downloads (about 400 KB compressed before, under 200 KB after). The two fonts most formulas need are preloaded. A script in each page's head sets the saved light or dark theme before the first paint (`data-theme-early`, which `page.js` doesn't mistake for a host's theme).
- **Offline.** `sw.js` serves pages and data network-first, with the saved copy when offline; files named with `?v=` (the shared files, `locked.json`) and images and fonts cache-first, keeping only the newest version of each. `CORE` saves the pages, the shared files and the fonts (listed by name) at install, so an exam page opens offline even before its first online visit. Bump `CACHE` in `sw.js` when its `CORE` list changes.

## The floating calculator

- It's a ghost button parked on the left or right edge, bottom left by default. Drag it anywhere and it glides back to the nearest side; a quick flick throws it across. On the right edge it stays above the back-to-top button.
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

## A private, unlocked copy

`node src/math/build.mjs artifact out.html` writes one self-contained page with the in-class sheets in plain view. It needs `private/`, or `SITE_PASSWORD`. Never commit that page.

## Publishing

Commit to `main` and push. GitHub Pages redeploys in about a minute.
