# BloxdStudios — voxel-themed showcase site

Plain HTML, CSS and a small bit of JS. No build step, no framework —
open any `.html` file and edit it directly, or host the whole folder
on GitHub Pages / Netlify / any static host.

**On copyright:** this site's illustrations (the isometric blocks and
the blocky character in the hero) are original artwork built with
plain SVG shapes — not Bloxd.io's actual game assets, textures, or
logo. If you want the real Bloxd.io logo somewhere on the site,
check with the Bloxd.io team about usage rights first rather than
copying it in directly.

## Structure

```
index.html              Home page (hero illustration lives here)
projects.html            Builds listing (with Maps/Scripts/Tools/Community filter)
projects/
  project-example.html   One build write-up — duplicate for each new map/script/tool
blog.html                 Devlog listing
blog/
  post-example.html      One devlog post — duplicate for each new post
about.html                 About / Discord contact page
css/style.css              All styling, colors, fonts, light+dark themes, cube art
js/main.js                 Theme toggle, mobile menu, category filter
```

## Renaming the studio

The name "BloxdStudios" appears in the `<a class="logo">` link and
page `<title>` on every page. Find-and-replace "BloxdStudios" across
all `.html` files with your team's real name.

## Adding a new build (map / script / tool)

1. Copy `projects/project-example.html` to `projects/your-build.html`.
2. Edit the title, tag, meta info (role/mode/timeline/status) and body text.
3. Add a new card to `projects.html` (copy one `<a class="card">` block)
   pointing `href` at your new file. Set `data-category` to one of
   `maps`, `scripts`, `tools`, `community` — or add a new category by
   also adding a button in `.filter-bar` with a matching `data-filter`
   value, and a matching `.tag-yourcategory` color rule in `style.css`.
4. Optionally add the same card to the "Featured builds" section on
   `index.html`.

## Adding a new devlog post

1. Copy `blog/post-example.html` to `blog/your-post.html` and edit it.
2. Add a row to `blog.html` (copy one `<li class="post-row">` block).
3. Optionally add it to the "Latest posts" section on `index.html`.

## Colors, fonts and dark mode

Everything lives at the top of `css/style.css`:

- `:root { ... }` — light ("Daytime") mode colors
- `[data-theme="dark"] { ... }` — dark ("Nightfall") mode colors
- `--font-display`, `--font-body`, `--font-mono` — the three typefaces
  in use (Fredoka, Nunito, JetBrains Mono, loaded from Google Fonts)

Change a value once here and it updates across every page. The toggle
button in the top bar switches themes and remembers the visitor's
choice (via `localStorage`) — note that storage may be sandboxed
inside some in-browser previews, but works normally once the site is
actually hosted.

## The hero illustration

The isometric blocks and blocky character in the homepage hero are
hand-drawn SVG, inline inside `index.html`'s `.hero-art` div. Each
block is three `<polygon>` faces (top/left/right) — copy one `<g>`
block, change its `translate(x,y)` position and the three fill
colors, to add more blocks or recolor existing ones.

## Socials

Update the `href` values on the GitHub/Discord/X/YouTube icons in the
`.socials` block near the top of each page (and in the footer of
`index.html`). Swap in more `<a>` blocks with your own SVG icon for
other platforms.
