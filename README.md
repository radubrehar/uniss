# uniss 🎓

Universal utility-first CSS library for writing less CSS

## Inspiration 💡

[Tahyons](https://tachyons.io/) and [Tailwindcss](https://tailwindcss.com/)

Also, [Rebass](https://rebassjs.org/) which is not a CSS only library, but was a nice inspiration for me 💡.

## Motivation ❤️

Tailwinds and tachyons are nice, but I almost always have to look-up names for css classes (even-more-so with tailwinds).

So I want **UNISS** to be more strict in terms of naming conventions.

## Conventions

CSS class format: `<property-name>=<property-value>[:<hover|active|focus|visited|focus-within>][@<sm|md|lg|xl>]`

That's it! You can use **UNICSS**.

### Examples

`.display=block { display: block }`
`.font-weight=bold { font-weight: bold }`
`.padding=50px { padding: 50px }`
`.width=100% { width: 100% }`

```css
.background=red:hover {
  backround: red; /* applied only on hover */
}
```

```css
.background=blue@lg {
  backround: blue; /* applied starting with large breakpoint */
}
```

```css
.background=orange@lg:hover {
  backround: orange; /* applied starting with large breakpoint, but only on hover */
}
```

## Try it out

```sh
$ npm i
$ npm run dev
```

### THIS IS IN VERY ALPHA STAGE - help is welcomed 💪
