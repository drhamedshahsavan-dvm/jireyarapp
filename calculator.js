const numbers = new Intl.NumberFormat('fa-IR', {maximumFractionDigits: 4});
function readNumber(value) {
  const normalized = value.trim()
    .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
    .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
    .replace(/[٬,]/g, '').replace(/٫/g, '.');
  return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
}
function calculate(form) {
  const raw = Object.fromEntries(new FormData(form));
  const weight = readNumber(raw.weight);
  const percent = readNumber(raw.percent);
  const price = readNumber(raw.price);
  if (!Number.isFinite(weight) || weight < 0 || weight > 1e9 ||
      !Number.isFinite(percent) || percent <= 0 || percent > 100 ||
      (raw.price.trim() && (!Number.isFinite(price) || price > 1e12))) {
    return null;
  }
  const fraction = percent / 100;
  return { dry: weight * fraction, water: weight * (1 - fraction),
    unit: raw.price.trim() ? price / fraction : null,
    total: raw.price.trim() ? weight * price : null };
}
for (const form of document.querySelectorAll('[data-calculator]')) {
  const result = form.querySelector('.results');
  const error = form.querySelector('.error');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = calculate(form);
    result.hidden = !values;
    error.hidden = Boolean(values);
    if (!values) return;
    for (const [key, value] of Object.entries(values)) {
      form.querySelector('[data-result="' + key + '"]').textContent =
        value === null ? '—' : numbers.format(value);
    }
  });
}
