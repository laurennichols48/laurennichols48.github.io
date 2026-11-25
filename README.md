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
