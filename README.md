# SIGNAL — studio showcase site

Plain HTML, CSS and a small bit of JS. No build step, no framework —
open any `.html` file and edit it directly, or host the whole folder
on GitHub Pages / Netlify / any static host.

## Structure

```
index.html              Home page
projects.html            Projects listing (with category filter)
projects/
  project-example.html   One project article — duplicate for each new project
blog.html                 Blog listing
blog/
  post-example.html      One blog post — duplicate for each new post
about.html                 About / contact page
css/style.css              All styling, colors, fonts, light+dark themes
js/main.js                 Theme toggle, mobile menu, project filter
```

## Renaming the studio

The name "SIGNAL" appears in the `<a class="logo">` link and page
`<title>` on every page. Find-and-replace "SIGNAL" across all `.html`
files with your team's real name.

## Adding a new project

1. Copy `projects/project-example.html` to `projects/your-project.html`.
2. Edit the title, tag, meta info (role/stack/timeline/client) and body text.
3. Add a new card to `projects.html` (copy one `<a class="card">` block)
   pointing `href` at your new file. Set `data-category` to one of
   `web`, `mobile`, `design`, `experiment` — or add a new category by also
   adding a button in `.filter-bar` with a matching `data-filter` value.
4. Optionally add the same card to the "Featured projects" section on
   `index.html`.

## Adding a new blog post

1. Copy `blog/post-example.html` to `blog/your-post.html` and edit it.
2. Add a row to `blog.html` (copy one `<li class="post-row">` block).
3. Optionally add it to the "Latest posts" section on `index.html`.

## Colors, fonts and dark mode

Everything lives at the top of `css/style.css`:

- `:root { ... }` — light mode colors
- `[data-theme="dark"] { ... }` — dark mode colors
- `--font-display`, `--font-body`, `--font-mono` — the three typefaces
  in use (Fraunces, Manrope, IBM Plex Mono, loaded from Google Fonts)

Change a value once here and it updates across every page. The toggle
button in the top bar switches themes and remembers the visitor's
choice (via `localStorage`) — note that storage may be sandboxed
inside some in-browser previews, but works normally once the site is
actually hosted.

## Socials

Update the `href` values on the GitHub/X/Dribbble icons in the
`.socials` block near the top of each page (and in the footer of
`index.html`). Swap in more `<a>` blocks with your own SVG icon for
other platforms.
