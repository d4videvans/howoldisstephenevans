# howoldisstephenevans.uk

A deliberately over-engineered answer to a simple family question.

## What it does

The page shows Stephen Evans's age live, based on:

- Date of birth: **5 September 1943**
- Assumed birth time: **12:00**
- Time zone: **Europe/London**

It includes:

- calendar age
- live age in seconds
- decimal years
- halves, quarters, eighths and sixteenths
- months, weeks, days, hours, minutes and milliseconds
- countdown to the next birthday
- approximate ages in planetary years

The calculations use the browser's historical IANA time-zone data. This matters because wartime UK clock rules differed from modern DST rules.

## Add or replace Stephen's photograph

The site uses `assets/stephen.jpg`.

A portrait image works best. The layout uses `object-fit: cover`, so it crops automatically on desktop and mobile.

## Change the birth time later

Edit the `BIRTH` object at the top of `script.js`:

```js
const BIRTH = {
  year: 1943,
  month: 9,
  day: 5,
  hour: 12,
  minute: 0,
  second: 0,
  timeZone: "Europe/London"
};
```

Commit and push. The site updates on the next deployment.

## Recommended deployment: Cloudflare Pages

The domain is already managed by Cloudflare, so the simplest setup is GitHub as the source repository and Cloudflare Pages for deployment, DNS and TLS.

Connect this repository to a Cloudflare Pages project, use no build command for this plain static site, and attach `howoldisstephenevans.uk` as the custom domain.

## GitHub Pages alternative

A `CNAME` file is also included if you prefer GitHub Pages. Publish `main` from `/ (root)` and set `howoldisstephenevans.uk` as the custom domain.
