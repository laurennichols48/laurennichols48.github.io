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
