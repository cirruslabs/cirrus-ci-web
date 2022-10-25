# Generating new PNG logos

First, install [librsvg](https://en.wikipedia.org/wiki/Librsvg) (e.g. `brew install librsvg` on macOS with Brew).

Then, open the `logo.svg` in the text editor, change the `stroke="#FAFAFA"` parameter to the color desired and generate a new logo:

```
rsvg-convert logo.svg -o logo-something-new.png
```

## Current logotypes in use

- [`logo-success.png`](logo-success.png) — ![](https://via.placeholder.com/15/8BC34A/000000?text=+) `#8BC34A`
- [`logo-failure.png`](logo-failure.png) — ![](https://via.placeholder.com/15/F44336/000000?text=+) `#F44336`
- [`logo-terminal-lifecycle.png`](logo-terminal-lifecycle.png) — ![](https://via.placeholder.com/15/7B51BD/000000?text=+) `#7B51BD`
