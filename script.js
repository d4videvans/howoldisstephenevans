const BIRTH = {
  year: 1943,
  month: 9,
  day: 5,
  hour: 4,
  minute: 0,
  second: 0,
  timeZone: "Europe/London"
};

const MS = {
  second: 1000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
  week: 604_800_000
};

const DAYS_PER_YEAR = 365.2425;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;
const SYNODIC_MONTH_DAYS = 29.530588853;

const PLANETS = {
  mercury: 87.9691,
  venus: 224.701,
  mars: 686.98,
  jupiter: 4332.59,
  saturn: 10759.22
};

const intFmt = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function parts(date, tz) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  const result = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") result[part.type] = Number(part.value);
  }
  return result;
}

function wallToUtc(local, tz) {
  const desired = Date.UTC(
    local.year,
    local.month - 1,
    local.day,
    local.hour ?? 0,
    local.minute ?? 0,
    local.second ?? 0
  );

  let guess = desired;
  for (let i = 0; i < 4; i++) {
    const shown = parts(new Date(guess), tz);
    const shownAsUtc = Date.UTC(
      shown.year,
      shown.month - 1,
      shown.day,
      shown.hour,
      shown.minute,
      shown.second
    );
    const correction = desired - shownAsUtc;
    guess += correction;
    if (correction === 0) break;
  }
  return new Date(guess);
}

const birthInstant = wallToUtc(BIRTH, BIRTH.timeZone);

function anniversary(year) {
  return wallToUtc({
    year,
    month: BIRTH.month,
    day: BIRTH.day,
    hour: BIRTH.hour,
    minute: BIRTH.minute,
    second: BIRTH.second
  }, BIRTH.timeZone);
}

function state(now) {
  const current = parts(now, BIRTH.timeZone);
  let years = current.year - BIRTH.year;
  let last = anniversary(current.year);

  if (now < last) {
    years -= 1;
    last = anniversary(current.year - 1);
  }

  const next = anniversary(BIRTH.year + years + 1);
  const progress = Math.max(
    0,
    Math.min(0.999999999999, (now - last) / (next - last))
  );

  return {
    years,
    last,
    next,
    progress,
    decimal: years + progress
  };
}

function frac(years, progress, denominator) {
  const numerator = Math.floor(progress * denominator + 1e-12);
  return numerator ? `${years} ${numerator}⁄${denominator}` : `${years}`;
}

function fracCard(s, denominator, ageId, countId, label) {
  document.getElementById(ageId).textContent = frac(s.years, s.progress, denominator);
  const completed = s.years * denominator + Math.floor(s.progress * denominator + 1e-12);
  document.getElementById(countId).textContent = `${intFmt.format(completed)} completed ${label}`;
}

function toFixedBase(value, base, places, prefix = "") {
  const digits = "0123456789ABCDEF";
  const integerPart = Math.floor(value);
  let fraction = value - integerPart;
  let result = integerPart.toString(base).toUpperCase() + ".";

  for (let i = 0; i < places; i++) {
    fraction *= base;
    const digit = Math.floor(fraction + Number.EPSILON);
    result += digits[digit];
    fraction -= digit;
  }

  return prefix + result;
}

function breakdown(now, s) {
  let remaining = now - s.last;
  const days = Math.floor(remaining / MS.day);
  remaining -= days * MS.day;
  const hours = Math.floor(remaining / MS.hour);
  remaining -= hours * MS.hour;
  const minutes = Math.floor(remaining / MS.minute);
  remaining -= minutes * MS.minute;
  const seconds = Math.floor(remaining / MS.second);
  return { days, hours, minutes, seconds };
}

function countdown(ms) {
  let remaining = Math.max(0, ms);
  const days = Math.floor(remaining / MS.day);
  remaining -= days * MS.day;
  const hours = Math.floor(remaining / MS.hour);
  remaining -= hours * MS.hour;
  const minutes = Math.floor(remaining / MS.minute);
  remaining -= minutes * MS.minute;
  const seconds = Math.floor(remaining / MS.second);

  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function birthdayText(date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: BIRTH.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short"
  }).format(date);
}

function updateBirthdayMode(now, s) {
  const today = parts(now, BIRTH.timeZone);
  const isBirthday = today.month === BIRTH.month && today.day === BIRTH.day;
  const banner = document.getElementById("birthday-banner");
  const text = document.getElementById("birthday-banner-text");

  document.body.classList.toggle("birthday", isBirthday);
  banner.hidden = !isBirthday;

  if (!isBirthday) return;

  const birthdayMoment = anniversary(today.year);
  text.textContent = now >= birthdayMoment
    ? `Happy birthday, Stephen — ${s.years} years old today.`
    : "Happy birthday, Stephen.";
}

function update() {
  const now = new Date();
  const elapsed = now - birthInstant;
  const s = state(now);
  const b = breakdown(now, s);
  const days = elapsed / MS.day;

  updateBirthdayMode(now, s);

  document.getElementById("hero-years").textContent = intFmt.format(s.years);
  document.getElementById("hero-precise").textContent =
    `${s.years} years, ${b.days} days, ` +
    `${String(b.hours).padStart(2, "0")} hours, ` +
    `${String(b.minutes).padStart(2, "0")} minutes, ` +
    `${String(b.seconds).padStart(2, "0")} seconds`;

  document.getElementById("seconds-live").textContent =
    intFmt.format(Math.floor(elapsed / MS.second));

  fracCard(s, 2, "age-halves", "halves-count", "half-years");
  fracCard(s, 4, "age-quarters", "quarters-count", "quarter-years");
  fracCard(s, 8, "age-eighths", "eighths-count", "eighth-years");
  fracCard(s, 16, "age-sixteenths", "sixteenths-count", "sixteenth-years");

  document.getElementById("decimal-years").textContent = s.decimal.toFixed(10);
  document.getElementById("binary-years").textContent = toFixedBase(s.decimal, 2, 5, "0b");
  document.getElementById("hex-years").textContent = toFixedBase(s.decimal, 16, 5, "0x");
  document.getElementById("decades").textContent = (s.decimal / 10).toFixed(8);
  document.getElementById("months").textContent = (days / DAYS_PER_MONTH).toFixed(5);
  document.getElementById("lunar-months").textContent = (days / SYNODIC_MONTH_DAYS).toFixed(4);
  document.getElementById("dog-years").textContent = (s.decimal * 7).toFixed(6);
  document.getElementById("weeks").textContent = (elapsed / MS.week).toFixed(5);
  document.getElementById("days").textContent = days.toFixed(5);
  document.getElementById("hours").textContent = (elapsed / MS.hour).toFixed(3);
  document.getElementById("minutes").textContent = (elapsed / MS.minute).toFixed(2);
  document.getElementById("seconds").textContent = intFmt.format(Math.floor(elapsed / MS.second));
  document.getElementById("milliseconds").textContent = intFmt.format(elapsed);

  document.getElementById("next-birthday-title").textContent = `Birthday no. ${s.years + 1}`;
  document.getElementById("next-birthday-date").textContent = birthdayText(s.next);
  document.getElementById("countdown").textContent = countdown(s.next - now);

  for (const [planet, orbit] of Object.entries(PLANETS)) {
    document.getElementById(planet).textContent = (days / orbit).toFixed(1);
  }

  document.getElementById("birthdays-completed").textContent = intFmt.format(s.years);
  document.getElementById("birth-time-display").textContent =
    `${String(BIRTH.hour).padStart(2, "0")}:${String(BIRTH.minute).padStart(2, "0")}, ${BIRTH.timeZone}`;
}

update();
setInterval(update, 250);
