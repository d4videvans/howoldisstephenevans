(() => {
  const $ = (id) => document.getElementById(id);

  function toRoman(n) {
    const table = [
      [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],
      [50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]
    ];
    let value = Math.max(0, Math.floor(n));
    let out = "";
    for (const [amount, numeral] of table) {
      while (value >= amount) { out += numeral; value -= amount; }
    }
    return out || "N";
  }

  function toRomanExtended(n) {
    let value = Math.max(0, Math.floor(n));
    if (value < 4000) return toRoman(value);

    const thousands = Math.floor(value / 1000);
    const remainder = value % 1000;
    return `(${toRomanExtended(thousands)})${remainder ? toRoman(remainder) : ""}`;
  }

  function mayaLongCount(totalDays) {
    let remaining = Math.max(0, Math.floor(totalDays));
    const baktun = Math.floor(remaining / 144000); remaining %= 144000;
    const katun = Math.floor(remaining / 7200); remaining %= 7200;
    const tun = Math.floor(remaining / 360); remaining %= 360;
    const uinal = Math.floor(remaining / 20);
    const kin = remaining % 20;
    return `${baktun}.${katun}.${tun}.${uinal}.${kin}`;
  }

  function toSexagesimal(value, fractionalPlaces = 4) {
    let whole = Math.floor(value);
    let fraction = value - whole;
    const wholeDigits = [];
    do {
      wholeDigits.unshift(whole % 60);
      whole = Math.floor(whole / 60);
    } while (whole > 0);

    const fracDigits = [];
    for (let i = 0; i < fractionalPlaces; i++) {
      fraction *= 60;
      const digit = Math.floor(fraction + Number.EPSILON);
      fracDigits.push(digit);
      fraction -= digit;
    }

    return `${wholeDigits.join(" : ")} ; ${fracDigits.map(n => String(n).padStart(2,"0")).join(" : ")}`;
  }

  function egyptianYears(years) {
    const tens = Math.floor(years / 10);
    const ones = years % 10;
    return `${"𓎆".repeat(tens)}${tens && ones ? "  " : ""}${"𓏺".repeat(ones)}`;
  }

  function mayaDigitMarkup(value) {
    if (value === 0) return '<span class="maya-shell" aria-label="zero">◯</span>';
    const bars = Math.floor(value / 5);
    const dots = value % 5;
    return `<span class="maya-dots">${"●".repeat(dots)}</span><span class="maya-bars">${"━".repeat(bars)}</span>`;
  }

  function renderMayaYears(years) {
    const el = $("maya-years-glyph");
    if (!el) return;
    const high = Math.floor(years / 20);
    const low = years % 20;
    el.innerHTML = `<span class="maya-place">${mayaDigitMarkup(high)}</span><span class="maya-place">${mayaDigitMarkup(low)}</span>`;
    el.setAttribute("aria-label", `${years} in Maya-style base twenty numerals`);
  }

  function updateHistorical() {
    const decimalEl = $("decimal-years");
    const daysEl = $("days");
    const secondsEl = $("seconds");
    if (!decimalEl || !daysEl || !secondsEl) return;

    const decimalYears = Number(decimalEl.textContent.replace(/,/g, ""));
    const totalDays = Number(daysEl.textContent.replace(/,/g, ""));
    const totalSeconds = Number(secondsEl.textContent.replace(/,/g, ""));
    if (!Number.isFinite(decimalYears) || !Number.isFinite(totalDays) || !Number.isFinite(totalSeconds)) return;

    const completedYears = Math.floor(decimalYears);

    $("roman-age").textContent = toRoman(completedYears);
    $("roman-seconds").textContent = toRomanExtended(totalSeconds);
    $("egyptian-age").textContent = egyptianYears(completedYears);
    $("egyptian-explain").textContent = `${Math.floor(completedYears / 10)} tens + ${completedYears % 10} ones`;
    $("mayan-long-count").textContent = mayaLongCount(totalDays);
    $("babylonian-age").textContent = toSexagesimal(decimalYears, 4);
    renderMayaYears(completedYears);
  }

  updateHistorical();
  setInterval(updateHistorical, 1000);
})();
