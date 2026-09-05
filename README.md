# howoldisstephenevans.uk

A deliberately over-engineered answer to a simple family question.

## What it does

The page shows Stephen Evans's age live, based on:

- Date of birth: **5 September 1943**
- Birth time: **04:00**
- Time zone: **Europe/London**

It includes:

- calendar age
- live age in seconds
- decimal years
- binary and hexadecimal years
- halves, quarters, eighths and sixteenths
- Gregorian and lunar months
- weeks, days, hours, minutes and milliseconds
- traditional dog years
- countdown to the next birthday
- approximate ages in planetary years
- a birthday-day presentation mode

The calculations use the browser's historical IANA time-zone data. This matters because wartime UK clock rules differed from modern DST rules.

## Stephen's photograph

The site uses `assets/stephen.jpg`.

The layout uses `object-fit: cover` with a portrait crop designed around the current image and adapts for desktop and mobile.

## Birth details

The source-of-truth values are in the `BIRTH` object at the top of `script.js`:

```js
const BIRTH = {
  year: 1943,
  month: 9,
  day: 5,
  hour: 4,
  minute: 0,
  second: 0,
  timeZone: "Europe/London"
};
```

## Deployment

The site is deployed from this GitHub repository using Cloudflare Pages and served at:

**https://howoldisstephenevans.uk/**

Pushing to `main` triggers a new deployment automatically.
