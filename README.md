# Lauren Nichols

Personal website for laurennichols.me. Static HTML and CSS, with no build dependencies.

## Files

`dist/index.html` contains the homepage; `dist/cv.html` contains the CV; `dist/projects.html` contains selected projects. Shared styling is in `dist/style.css`. The assets folder holds the chosen graduation photograph and favicon.

## Publishing

Source lives on `main`. GitHub Pages serves the root of `gh-pages`, generated from `dist`.

After committing changes on main, publish with:

```sh
git push origin main
git subtree push --prefix dist origin gh-pages
```

The domain is managed at Squarespace. Its DNS must point to GitHub Pages. Social profiles marked as forthcoming are intentionally not links.

## Search visibility

Every HTML page includes `<meta name="robots" content="noindex">` to request exclusion from search results. Preserve this tag on new pages. Do not block crawling in robots.txt: search engines need to fetch each page to read the tag. The site remains public to anyone with its URL.

## Interactive project charts

`dist/assets/project-data.js` contains public aggregate results: ML subgroup Brier-score differences transcribed from Table 23 (p. 39) of the synthetic-populations report, and all 14 periods from the growth project’s `results/growth_table_5yr.csv`. `dist/explorers.js` renders the attribute selector, growth measure selector, period slider, and accessible data tables. `dist/explorers.css` supplies responsive chart styles. Charts do not request raw records or run model inference.
