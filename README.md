# y1-s1
Unofficial study notes for KUAS engineering courses (Calculus &amp; Linear Algebra 1, Engineering Physics 1): summaries, practice problems with worked solutions, formula sheets and quiz reviews.

**Website:** https://lmheew.github.io/y1-s1/

| Subject | Page | Status |
| --- | --- | --- |
| Calculus & Linear Algebra 1 (CLA1) | [/math/](https://lmheew.github.io/y1-s1/math/) | Midterm review: Summary, Practice, Formulas, Quizzes |
| Engineering Physics 1 | – | Coming soon |

## What's in the repository

The repository root is the website (GitHub Pages, branch `main`, folder `/`).

- `index.html`: the home page, where you pick a subject.
- `math/index.html`: the CLA1 review. It is built from `src/math/`, so don't edit it by hand.
- `math/locked.json`: the in-class quiz sheets, encrypted. The Quizzes tab opens them with the password.
- `src/math/`: the content (`content.mjs`, `followups.mjs`, `extras.mjs`), the page style and script, the build, and numeric checks for every answer.
- `src/math/private.sealed.json`: the source of the in-class sheets, encrypted.
- `src/check_site.py`: a browser check of the built site.
- `src/vendor/katex/`: KaTeX 0.16.11, used at build time to typeset the math.

How to update the site (a new class, a new quiz, building and checking) is described in [CLAUDE.md](CLAUDE.md).

## Notes

These are personal study notes, not an official Kyoto University of Advanced Science page. The in-class quiz sheets stay private: this repository holds them only in encrypted form. Search engines are asked not to list the site.

Math is typeset with [KaTeX](https://katex.org), MIT License, Copyright (c) 2013-2020 Khan Academy and other contributors. The full license text is in [`src/vendor/katex/LICENSE.txt`](src/vendor/katex/LICENSE.txt).
