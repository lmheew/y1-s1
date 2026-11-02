# y1-s1
Unofficial study notes for KUAS engineering courses (Calculus &amp; Linear Algebra 1, Engineering Physics 1): summaries, practice problems with worked solutions, formula sheets and quiz reviews.

**Website:** https://lmheew.github.io/y1-s1/

| Subject | Page | Status |
| --- | --- | --- |
| Calculus & Linear Algebra 1 (CLA1) | [/math/](https://lmheew.github.io/y1-s1/math/) | One page per exam. Calculus midterm 1 (derivatives): Summary, Practice, Formulas, Quizzes, Exams. Calculus midterm 2 (integrals): the lesson schedule, with Summary, Practice and Formulas added after each class. Linear Algebra: coming soon |
| Engineering Physics 1 (EP1) | [/physics/](https://lmheew.github.io/y1-s1/physics/) | One page per exam. Midterm (Chapters 1–8): Summary (every module, each with a worked example), Formulas (every formula of the eight chapters, plus extras), Quizzes (the exercise-day sheets and three practice sets, with worked answers) and Exams. Practice: coming soon |

## What's in the repository

The repository root is the website (GitHub Pages, branch `main`, folder `/`).

- `index.html`: the home page: subjects, upcoming exams with countdowns, what's new, and how to install it.
- `site.json`: exam dates and the "What's new" list.
- `sw.js`, `manifest.webmanifest` and the `icon-*.png` files: offline use and "Add to Home Screen".
- `math/`: the CLA1 review, built from `src/math/`, so don't edit it by hand: `index.html` is the exam picker, `derivatives/` the Calculus midterm 1 page, `integrals/` the Calculus midterm 2 page, and `assets/` the styles, scripts and math fonts the exam pages share.
- `math/derivatives/locked.json`: the in-class quiz sheets and past midterms, encrypted. The Quizzes and Exams tabs open them with the password.
- `src/math/`: the Calculus midterm 1 content (`content.mjs`, `followups.mjs`, `exams.mjs`, `extras.mjs`), the interactive graphs (`graphs.js`), the page style and script, the build, and numeric checks for every answer. `src/math/integrals/` holds the Calculus midterm 2 content (`content.mjs`, `extras.mjs`) and its checks (`verify.py`).
- `src/math/private.sealed.json`: the source of the in-class sheets and past midterms, encrypted.
- `physics/`: the EP1 review, built from `src/physics/` the same way: `index.html` is the exam picker, `midterm/` the midterm page, and `assets/` its shared style and script (it uses Math's math fonts). `physics/midterm/locked.json` holds the exercise-day sheets, encrypted with the same password.
- `src/physics/`: the chapters, summaries, formulas and practice sets (`content.mjs`, `summary.mjs`, `formulas.mjs`, `quizzes.mjs`), the figures (`figures.mjs`, original drawings), the Physics colours, the build, numeric checks for every answer, worked example and formula, and `private.sealed.json`, the encrypted source of the exercise-day sheets.
- `src/shared/`: the floating calculator used on every subject page (with a test of its arithmetic), the back-to-top button used on every page, and what both builds share (`build-lib.mjs`, `icons.mjs`).
- `og-*.png`: the link previews apps show when a page is shared, drawn by `src/og.py`.
- `src/check_site.py` and `src/check_features.py`: browser checks of the built site.
- `src/vendor/katex/`: KaTeX 0.16.11, used at build time to typeset the math.

How to update the site (a new class, a new quiz, building and checking) is described in [CLAUDE.md](CLAUDE.md).

## Notes

These are personal study notes, not an official Kyoto University of Advanced Science page. The in-class quiz and exercise sheets stay private: this repository holds them only in encrypted form. Search engines are asked not to list the site.

Math is typeset with [KaTeX](https://katex.org), MIT License, Copyright (c) 2013-2020 Khan Academy and other contributors. The full license text is in [`src/vendor/katex/LICENSE.txt`](src/vendor/katex/LICENSE.txt).
