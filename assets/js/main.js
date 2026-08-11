// ==============================
// MENU MOBILE
// ==============================
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('#menu');

menuBtn?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

menu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});


// ==============================
// FORM LEAD
// ==============================
const form = document.querySelector('#form');
const status = document.querySelector('#form-status');
const phoneInput = form?.querySelector('input[name="phone"]');
const phoneError = document.querySelector('#phone-error');


// Google Form Bán Đất Diên Khánh
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSdySWR2u-7mchdOo0Z8sCzxboKQ8VC2a50cgJq2fHVLiVnuiQ/formResponse';

// Mã trường Google Form
const GOOGLE_FORM_FIELDS = {
  name: 'entry.538694916',
  phone: 'entry.364515417',
  interest: 'entry.1631130888'
};


// ==============================
// CHUẨN HÓA SĐT
// ==============================
function normalizeVietnamPhone(value) {
  let digits = (value || '').replace(/\D/g, '');

  // 84xxxxxxxxx -> 0xxxxxxxxx
  if (digits.startsWith('84') && digits.length === 11) {
    digits = '0' + digits.slice(2);
  }

  return digits;
}


// ==============================
// KIỂM TRA SĐT VIỆT NAM
// ==============================
function isValidVietnamMobile(value) {
  return /^0(?:3|5|7|8|9)\d{8}$/.test(
    normalizeVietnamPhone(value)
  );
}


function validatePhone() {
  if (!phoneInput) return true;

  const raw = phoneInput.value.trim();

  if (!raw) {
    phoneInput.setCustomValidity(
      'Vui lòng nhập số điện thoại.'
    );

    if (phoneError) {
      phoneError.textContent =
        'Vui lòng nhập số điện thoại.';
    }

    return false;
  }

  if (!isValidVietnamMobile(raw)) {
    phoneInput.setCustomValidity(
      'Số điện thoại chưa đúng. Vui lòng nhập số di động Việt Nam gồm 10 số, ví dụ 0916858566.'
    );

    if (phoneError) {
      phoneError.textContent =
        'Số điện thoại chưa đúng. Vui lòng kiểm tra lại (ví dụ: 0916 85 85 66).';
    }

    return false;
  }

  phoneInput.setCustomValidity('');

  if (phoneError) {
    phoneError.textContent = '';
  }

  return true;
}


phoneInput?.addEventListener('input', () => {
  phoneInput.setCustomValidity('');

  if (phoneError) {
    phoneError.textContent = '';
  }
});

phoneInput?.addEventListener('blur', validatePhone);


// ==============================
// GỬI TRỰC TIẾP VÀO GOOGLE FORM
// ==============================
form?.addEventListener('submit', e => {
  e.preventDefault();

  const phoneOk = validatePhone();

  if (!phoneOk || !form.reportValidity()) {
    return;
  }

  const name =
    form.elements.name?.value.trim() || '';

  const phone =
    normalizeVietnamPhone(phoneInput.value);

  const interest =
    form.elements.need?.value ||
    'Nhận vị trí & thông tin lô đất';


  // Chuẩn hóa lại SĐT hiển thị trên form
  phoneInput.value = phone;


  const btn = form.querySelector('button');

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Đang gửi...';
  }

  if (status) {
    status.textContent = '';
  }


  // Tạo iframe ẩn để Google Form nhận dữ liệu
  let iframe = document.querySelector(
    '#google-form-target'
  );

  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = 'google-form-target';
    iframe.id = 'google-form-target';
    iframe.style.display = 'none';

    document.body.appendChild(iframe);
  }


  // Tạo form ẩn gửi thẳng vào Google Forms
  const googleForm = document.createElement('form');

  googleForm.action = GOOGLE_FORM_ACTION;
  googleForm.method = 'POST';
  googleForm.target = 'google-form-target';
  googleForm.style.display = 'none';


  const fields = {
    [GOOGLE_FORM_FIELDS.name]: name,
    [GOOGLE_FORM_FIELDS.phone]: phone,
    [GOOGLE_FORM_FIELDS.interest]: interest
  };


  Object.entries(fields).forEach(([fieldName, value]) => {
    const input = document.createElement('input');

    input.type = 'hidden';
    input.name = fieldName;
    input.value = value;

    googleForm.appendChild(input);
  });


  document.body.appendChild(googleForm);

  googleForm.submit();


  // Sau khi gửi request sang Google Form
  setTimeout(() => {
    if (status) {
      status.textContent =
        'Đã gửi thông tin. Cảm ơn chị/anh!';
    }

    form.reset();

    googleForm.remove();

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Gửi yêu cầu';
    }
  }, 900);
});
