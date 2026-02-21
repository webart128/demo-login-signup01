// OTP تستی (بعداً از بک‌اند میاد)
const CORRECT_OTP = '1234';

// انتخاب فرم‌ها و دکمه‌ها
const phoneForm = document.querySelector('.step-phone');
const codeForm = document.querySelector('.step-code');
const successStep = document.querySelector('.step-success');

const phoneInput = phoneForm.querySelector('#phone');
const phoneBtn = phoneForm.querySelector('.btn-auth');

const otpInputs = codeForm.querySelectorAll('.otp-group input');
const codeBtn = codeForm.querySelector('.btn-auth');

// اعتبارسنجی شماره موبایل ایران
function isValidIranPhone(number) {
    // فقط اعداد، شروع با 09 و 11 رقم دقیق
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(number);
}
  
// فعال شدن دکمه بر اساس شماره صحیح
phoneInput.addEventListener('input', () => {
    // حذف کاراکترهای غیر عددی
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    
    // بررسی Regex
    phoneBtn.disabled = !isValidIranPhone(phoneInput.value);
    });
  

// ارسال شماره → رفتن به Step بعدی
phoneForm.addEventListener('submit', e => {
    e.preventDefault();
  
    if (!isValidIranPhone(phoneInput.value)) {
      showToast('شماره موبایل نامعتبر است', 'error');
      return;
    }
  
    showToast('کد تایید با موفقیت ارسال شد', 'success');
  
    phoneForm.classList.remove('active');
    codeForm.classList.add('active');
    otpInputs[0].focus();
  
    startCountdown(); // شروع تایمر
});

// OTP: حرکت خودکار بین خانه‌ها
otpInputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
        // فقط عدد
        input.value = input.value.replace(/[^0-9]/g, '');
        if(input.value && idx < otpInputs.length -1) {
            otpInputs[idx+1].focus();
        }

        // فعال کردن دکمه اگر همه پر شدن
        codeBtn.disabled = ![...otpInputs].every(i => i.value.length === 1);
    });

    input.addEventListener('keydown', e => {
    if(e.key === 'Backspace' && !input.value && idx > 0) {
        otpInputs[idx-1].focus();
    }
    });
});

// ارسال OTP → موفقیت
codeForm.addEventListener('submit', e => {
    e.preventDefault();
  
    // جمع کردن کد وارد شده
    const enteredOtp = [...otpInputs].map(i => i.value).join('');
  
    // ❌ هیچ عددی وارد نشده
    if (enteredOtp.length === 0) {
      showToast('لطفاً کد تایید را وارد کنید', 'error');
      return;
    }
  
    // ❌ کد ناقص
    if (enteredOtp.length < otpInputs.length) {
      showToast('کد تایید ناقص است', 'error');
      return;
    }
  
    // ❌ کد اشتباه
    if (enteredOtp !== CORRECT_OTP) {
      showToast('کد وارد شده نادرست است', 'error');
      return;
    }
  
    // ✅ کد صحیح
    showToast('ورود با موفقیت انجام شد', 'success');
  
    codeForm.classList.remove('active');
    successStep.classList.add('active');
    setTimeout(() => {
      window.location = "webart.html";
    }, 3000);
  });
  
/* ===============================
   OTP Countdown Timer (MM:SS)
================================ */

let COUNTDOWN_TIME = 120; // ⏱ ثانیه (2:00)
let countdownInterval;

const resendBtn = document.getElementById('resendBtn');
const timerText = document.getElementById('timerText');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
}

function startCountdown() {
  clearInterval(countdownInterval);

  let timeLeft = COUNTDOWN_TIME;
  resendBtn.disabled = true;

  timerText.innerHTML = `
    ارسال مجدد کد تا <strong id="countdown">${formatTime(timeLeft)}</strong>
  `;

  const countdownEl = document.getElementById('countdown');

  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      resendBtn.disabled = false;
      timerText.textContent = 'کد را دریافت نکردید؟';
    }
  }, 1000);
}

/* ارسال مجدد کد */
resendBtn.addEventListener('click', () => {
  // 🔌 اینجا API ارسال مجدد OTP
  console.log('Resend OTP');
  startCountdown();
});

/* ===============================
   Toast Notification System
================================ */

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
  
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
  
    container.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 3300);
}
  