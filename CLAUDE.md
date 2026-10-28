# Study site (y1-s1): how to update it

A static site on GitHub Pages (branch `main`, folder `/`), live at https://lmheew.github.io/y1-s1/.

- `/` is `index.html`, the subject picker. It is hand-written; update its cards when a subject is added or changes.
- `/math/` is the CLA1 review (Calculus & Linear Algebra 1). It is built by `src/math/build.mjs`. Never edit `math/index.html` by hand.
- Physics (Engineering Physics 1) is planned as `/physics/`, in a darker blue theme. Build it only when asked.

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
- `followups.mjs`: Follow-up A (same skills, new numbers) and Follow-up B (targets common mistakes) for each quiz. Each is worth 10 pt, like the in-class sheet.
- `extras.mjs`: search tags for the practice problems, the Formulas tab, the exact-values table and the icons.
- `private/inclass.mjs`: the in-class sheets, retyped. It exists only after `open`.
- `build.mjs` (with the short unit names in `SHORT`), `page.css`, `page.js`.

Markup inside the strings:

- `$inline$` and `$$display$$` for math.
- `**bold**`.
- Lines starting with `- ` are list items, and continuation lines join the item.
- A blank line starts a new block.
- `(2pt×2)` is styled as a point value.

Strings use `String.raw`, so avoid `${` inside them.

## Build and check

```sh
node src/math/build.mjs site
python3 src/math/verify_practice.py && python3 src/math/verify_formulas.py && python3 src/math/verify_followups.py && node src/math/verify_exact.mjs
python3 src/check_site.py
```

- Without `SITE_PASSWORD`, `site` keeps `math/locked.json` as it is.
- `check_site.py` runs the page in Chromium (Playwright): layout on phone and desktop, tabs, search and the locked panels. With `SITE_PASSWORD` set it also tests unlocking.
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

## A private, unlocked copy

`node src/math/build.mjs artifact out.html` writes one self-contained page with the in-class sheets in plain view. It needs `private/`, or `SITE_PASSWORD`. Never commit that page.

## Publishing

Commit to `main` and push. GitHub Pages redeploys in about a minute.
