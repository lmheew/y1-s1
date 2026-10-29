# Study site (y1-s1): how to update it

A static site on GitHub Pages (branch `main`, folder `/`), live at https://lmheew.github.io/y1-s1/.

- `/` is `index.html`, the home page: subject cards, upcoming exams, what's new, and offline install help. It is hand-written; update its cards when a subject is added or changes. It reads `site.json`.
- `/math/` is the CLA1 review (Calculus & Linear Algebra 1). It is built by `src/math/build.mjs`. Never edit `math/index.html` by hand.
- Physics (Engineering Physics 1) is planned as `/physics/`, in a darker blue theme. Build it only when asked.
- The floating calculator (`src/shared/calculator.js` and `calculator.css`) is shared by every subject page. The build inlines it; a new subject's build should too.
- The back-to-top button (`src/shared/totop.js` and `totop.css`) is on every page. Subject builds inline it like the calculator. The home page links the two files instead, so they are in `CORE` in `sw.js`.
- `site.json` holds exam dates and the "What's new" list, for the home page and the Math page's Exams tab.
- `sw.js` and `manifest.webmanifest` make the site installable and usable offline.

## Rules

- **Never commit `src/math/private/` or the password.** The folder is git-ignored. The in-class quiz sheets and the past midterm papers exist in the repository only encrypted: `src/math/private.sealed.json` (their source) and `math/locked.json` (what the site opens with the password). `locked.json` also keeps a readable list of the past papers' titles, times and points, so a build without the password can still draw their password panels.
- The password is saved in the user's Claude memory, because they asked for that. Otherwise they give it in chat. Never put it in the repository: not in files, not in commit messages.
- Wording stays non-personal: no "your quizzes", no "from your chats", no student-ID versions.
- The course is calculator-free, so answers stay exact (√2/2, ln(7/8), 2 + e).
- Every new answer gets a numeric check in a verify script, and every check must pass before pushing.
- Practice problem ids (`unit.n`) are the keys for saved marks. Append new problems and never renumber. A problem moved to another unit keeps its old id in an `id` field (the Day 9 series problems are `5.1` and `5.2`).
- These are unofficial notes. Never add the KUAS logo.

## Content (src/math)

- `content.mjs`: units (Summary key ideas and "Watch out" lists), exam-day habits, practice problems.
- Units follow the course schedule (derivative part): one unit per lesson, in schedule order, with `days` ("Day 1 & 2"), `dates` ("8 & 9 Oct"), the schedule's lesson name as `title` (sentence case) and its `quiz` ("Quiz 01") or `null`. Summary tiles show the day, the name and a small quiz line; lessons without a quiz have no quiz line. Unit ids are stable keys, not positions (Day 9, Infinite series, is `u7` and sits before `u5`).
- A lesson without a quiz has no Quizzes entry and stays out of the mocks and the "Quizzes 01–05" span. One that isn't on the midterm also gets a `note` ("Not on the midterm") and an optional `intro`, like Day 12. Quizzes find their unit by `quiz`.
- `followups.mjs`: Follow-up A (same skills, new numbers) and Follow-up B (targets common mistakes) for each quiz. Each is worth 10 pt, like the in-class sheet.
- `extras.mjs`: search tags for the practice problems, the Formulas tab, the exact-values table and the icons.
- `exams.mjs`: the mock midterms (60 min, 60 pt, six questions of 10 pt, one per topic). `pts` lists each part's points. On the page, each question's head shows its number, topic tag and points on one line, like a printed paper, with the `stem` (the instruction) below it.
- `private/past.mjs`: past midterm papers (AY2022 spring, AY2023 fall), retyped with worked answers, in the same shape as the mocks plus `seg` (the switcher label), `sub` and optional `labels` for parts the paper letters ((a), (1a)). The papers give no time or points, so 60 min and 100 pt are estimates. Checked in `private/verify_past.py`. They show in the Exams tab under "Past midterms", locked with the same password, and work like the mocks once opened.
- `graphs.js`: the interactive graphs. Which unit shows which graph is set by `GRAPHS` in `build.mjs`.
- `private/inclass.mjs`: the in-class sheets, retyped. It exists only after `open`, like everything in `private/`.
- `build.mjs` (with the short unit names in `SHORT`), `page.css`, `page.js`.
- Buttons follow one rule (top of the buttons part of `page.css`): the main action of a place is a filled green pill (`.pill`, `.t-go`, `.u-go`), other actions are outlined grey pills (`.linkbtn`, `.t-reset`), a toggle or choice is outlined green and fills green when on (`.chip`, Test me, the switchers), and the app bar has plain outlined icon buttons (`.icon-btn`). `check_site.py` checks the main ones share one colour.

Markup inside the strings:

- `$inline$` and `$$display$$` for math. Fractions in inline math are drawn full size (`\displaystyle`) in problems, hints, answers and solutions. The Summary's running text keeps small inline fractions (such as π/2) and puts each key formula full size on its own line as `$$…$$`; stack several with `aligned` or `gathered` so a phone never has to scroll sideways. A `.` or `,` right after longer inline math is drawn inside it, so it can't start a line by itself.
- `**bold**`.
- Lines starting with `- ` are list items, and continuation lines join the item.
- A blank line starts a new block.
- `(2pt×2)` is styled as a point value.

Strings use `String.raw`, so avoid `${` inside them.

- **Steps.** Solutions open one step at a time. Each paragraph, or each list item, of `sol` is one step, so write a step per block (`**(1)** …`, blank line, `**(2)** …`).
- **New labels.** Give anything new an `added: 'YYYY-MM-DD'` (units, practice problems, formula groups, mocks). It gets a "New" label, and its tab a dot, for up to 14 days, and only until the device has seen it: a tab's dot goes when the tab is opened, and the labels inside it stay for the rest of that visit, then go. Also add a line to `news` in `site.json`. The home page's What's new groups entries by date, with one New label per day, which works the same way. The dates seen are kept in localStorage (`study-seen`, shared by both pages), and the copy taken at the start of a visit is kept in sessionStorage (`study-seen-start`).

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

## A past exam paper (needs the password)

1. `open`, as below, then add the paper to `private/past.mjs` and its checks to `private/verify_past.py`.
2. No public page may use the same functions: `leakcheck.mjs` reads the past papers too. Change a mock or practice problem that does.
3. Build with `SITE_PASSWORD`, run `leakcheck.mjs` and every check (`check_site.py` with `SITE_PASSWORD` opens the papers), then commit and push.

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
- A page without a tab bar sets `--totop-bottom`, as the home page does. The hover and focus colours come from the page's `--bar-active` and `--lime-deep`.

## Printing

- Every mock and past midterm has two buttons under its note: **Print paper** (the questions with room to write under each part and a score line, without answers, timer or buttons) and **Print with answers** (the questions with every answer and all solution steps). `printSheet` in `page.js` marks the sheet `.printing`, the elements around it `.print-path` and the kind in `data-print` on `<html>`; the print part at the end of `page.css` does the rest. The marks go when the page is next used after printing, because an iPhone reports the end of printing while its print sheet is still open.
- The browser's own Print gets the open tab without the app bar, tab bar, search and floating buttons. Printouts always use dark ink on white, also in dark mode.
- Pages break between parts and solution steps, never inside one.
- `check_features.py` checks both kinds of printout with print media emulated.

## A private, unlocked copy

`node src/math/build.mjs artifact out.html` writes one self-contained page with the in-class sheets in plain view. It needs `private/`, or `SITE_PASSWORD`. Never commit that page.

## Publishing

Commit to `main` and push. GitHub Pages redeploys in about a minute.
