(() => {
  'use strict';

  const form = document.querySelector('[data-calculator]');
  if (!form) return;

  const formatter = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 4 });
  const weightField = form.elements.namedItem('weight');
  const percentField = form.elements.namedItem('percent');
  const priceField = form.elements.namedItem('price');
  const fields = [weightField, percentField, priceField];
  const result = form.querySelector('.results');
  const error = form.querySelector('.error');
  const outputs = Object.fromEntries(
    [...form.querySelectorAll('output[data-result]')].map(output => [output.dataset.result, output])
  );

  // Accept Persian, Arabic and ASCII digits. Grouping separators must be in groups of three.
  function readNumber(value) {
    const normalized = value.trim()
      .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
      .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x0660))
      .replace(/٬/g, ',')
      .replace(/٫/g, '.');

    if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(normalized)) {
      return NaN;
    }
    return Number(normalized.replace(/,/g, ''));
  }

  function readField(field, minimum, maximum, optional = false) {
    if (optional && !field.value.trim()) return null;
    const value = readNumber(field.value);
    return Number.isFinite(value) && value >= minimum && value <= maximum ? value : NaN;
  }

  function clearFeedback() {
    result.hidden = true;
    error.textContent = '';
    fields.forEach(field => field.removeAttribute('aria-invalid'));
  }

  form.addEventListener('input', clearFeedback);
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearFeedback();

    const weight = readField(weightField, 0, 1e9);
    const percent = readField(percentField, Number.MIN_VALUE, 100);
    const price = readField(priceField, 0, 1e12, true);
    const values = [weight, percent, price];
    const invalidIndex = values.findIndex(Number.isNaN);
    if (invalidIndex >= 0) {
      const messages = [
        'وزن خوراک باید عددی بین صفر و یک میلیارد کیلوگرم باشد.',
        'درصد ماده خشک باید بیشتر از صفر و حداکثر ۱۰۰ باشد.',
        'قیمت هر کیلو خوراک باید عددی بین صفر و یک تریلیون تومان باشد.'
      ];
      fields[invalidIndex].setAttribute('aria-invalid', 'true');
      error.textContent = messages[invalidIndex];
      fields[invalidIndex].focus();
      return;
    }

    const fraction = percent / 100;
    const dry = weight * fraction;
    const unit = price === null ? null : price / fraction;
    if (fraction === 0 || (unit !== null && !Number.isFinite(unit))) {
      percentField.setAttribute('aria-invalid', 'true');
      error.textContent = 'درصد ماده خشک برای نمایش نتیجه خیلی کوچک است.';
      percentField.focus();
      return;
    }

    const amounts = { dry, water: weight - dry, unit, total: price === null ? null : weight * price };
    for (const [key, value] of Object.entries(amounts)) {
      outputs[key].value = value === null ? '—' : formatter.format(value);
    }
    result.hidden = false;
  });

  form.querySelector('button[type="submit"]').disabled = false;
})();
