/**
 * MIRGI MUKTI CAPSULE - INTERACTIVE LANDING PAGE SCRIPT
 * Faithful to original LP functionality with modern interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initIngredientsToggle();
  initFaqAccordion();
  initStickyBar();
  initLiveBuyerToasts();
  initSmoothScroll();
  initFormValidation();
});

/* ==========================================================================
   INGREDIENTS SCROLL TO SECTION
   ========================================================================== */
function initIngredientsToggle() {
  const btn = document.getElementById('toggleIngredientsBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('ingredientsSection');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ==========================================================================
   1. COUNTDOWN TIMER (15 MINUTES LOOPING)
   ========================================================================== */
function initCountdownTimer() {
  const timerEl = document.getElementById('topTimer');
  if (!timerEl) return;

  let totalSeconds = 14 * 60 + 48;

  setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 15 * 60;
    } else {
      totalSeconds--;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

/* ==========================================================================
   2. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-question-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   3. STICKY ACTION BAR
   ========================================================================== */
function initStickyBar() {
  const stickyBar = document.getElementById('stickyBar');
  if (!stickyBar) return;

  function checkScroll() {
    if (window.scrollY > 120) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

/* ==========================================================================
   4. LIVE BUYER NOTIFICATIONS
   ========================================================================== */
const sampleBuyers = [
  { name: 'राकेश शर्मा', city: 'जयपुर' },
  { name: 'सुरेश यादव', city: 'लखनऊ' },
  { name: 'दिलीप पाटिल', city: 'पुणे' },
  { name: 'अमित वर्मा', city: 'इंदौर' },
  { name: 'पूजा जोशी', city: 'देहरादून' },
  { name: 'कुलदीप सिंह', city: 'लुधियाना' },
  { name: 'रविन्द्र चौधरी', city: 'पटना' }
];

let buyerIndex = 0;

function initLiveBuyerToasts() {
  const toast = document.getElementById('liveToast');
  if (!toast) return;

  function showNextToast() {
    const buyer = sampleBuyers[buyerIndex];
    document.getElementById('buyerName').textContent = buyer.name;
    document.getElementById('buyerCity').textContent = buyer.city;

    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 5000);

    buyerIndex = (buyerIndex + 1) % sampleBuyers.length;
  }

  setTimeout(() => {
    showNextToast();
    setInterval(showNextToast, 12000);
  }, 3500);
}

function closeToast() {
  const toast = document.getElementById('liveToast');
  if (toast) toast.classList.remove('active');
}

/* ==========================================================================
   5. SMOOTH SCROLL TO FORM
   ========================================================================== */
function initSmoothScroll() {
  const scrollBtns = document.querySelectorAll('.scroll-to-form');
  const target = document.getElementById('orderFormSection');

  scrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToOrderForm();
    });
  });
}

function scrollToOrderForm() {
  const target = document.getElementById('orderFormSection');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const nameInput = document.getElementById('name');
      if (nameInput) nameInput.focus();
    }, 500);
  }
}

/* ==========================================================================
   FORM INPUT CONSTRAINTS & AUTOFILL PREVENTION
   ========================================================================== */
function initFormValidation() {
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');

  // Disable Chrome autofill popup aggressively
  if (nameInput) {
    nameInput.setAttribute('autocomplete', 'new-password');
    
    // Allow only Hindi letters, English letters, and space
    nameInput.addEventListener('input', function() {
      const filtered = this.value.replace(/[^a-zA-Z\s\u0900-\u097F]/g, '');
      if (this.value !== filtered) {
        this.value = filtered;
      }
    });

    nameInput.addEventListener('keypress', function(e) {
      const char = String.fromCharCode(e.charCode || e.which);
      if (!/[a-zA-Z\s\u0900-\u097F]/.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 13) {
        e.preventDefault();
      }
    });

    nameInput.addEventListener('paste', function(e) {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text') || '';
      const filtered = text.replace(/[^a-zA-Z\s\u0900-\u097F]/g, '');
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = this.value.slice(0, start) + filtered + this.value.slice(end);
      this.setSelectionRange(start + filtered.length, start + filtered.length);
    });
  }

  if (phoneInput) {
    phoneInput.setAttribute('autocomplete', 'new-password');

    // Phone: only digits, must start with 6, 7, 8, or 9, max 10 digits
    phoneInput.addEventListener('input', function() {
      let val = this.value.replace(/\D/g, ''); // keep only numbers

      // If first digit is not 6-9, reject it
      if (val.length > 0 && !/^[6-9]/.test(val)) {
        val = '';
      }

      // Max 10 digits
      if (val.length > 10) {
        val = val.slice(0, 10);
      }

      this.value = val;
    });

    phoneInput.addEventListener('keypress', function(e) {
      const char = String.fromCharCode(e.charCode || e.which);
      // Non-numeric key
      if (!/[0-9]/.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 13) {
        e.preventDefault();
        return;
      }
      // If it's the first digit, reject if not 6-9
      if (this.value.length === 0 && !/[6-9]/.test(char)) {
        e.preventDefault();
        return;
      }
      // Prevent typing more than 10 digits
      if (this.value.length >= 10) {
        e.preventDefault();
      }
    });

    phoneInput.addEventListener('paste', function(e) {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text') || '';
      let digits = text.replace(/\D/g, '');
      if (this.value.length === 0 && digits.length > 0 && !/^[6-9]/.test(digits)) {
        digits = digits.replace(/^[^6-9]+/, '');
      }
      let combined = (this.value + digits).slice(0, 10);
      if (combined.length > 0 && !/^[6-9]/.test(combined)) {
        combined = '';
      }
      this.value = combined;
    });
  }
}

/* ==========================================================================
   6. EXACT ORIGINAL FORM SUBMISSION: submitForm(event)
   ========================================================================== */
let dotInterval = null;

function submitForm(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const submitBtn = document.getElementById('submitBtn');
  const loadingDiv = document.getElementById('loading');
  const dotAnim = document.getElementById('dotAnim');
  const spinner = document.getElementById('btnSpinner');

  // Validate Name (only letters and space, at least 2 characters)
  const nameVal = nameInput.value.trim();
  if (!nameVal || !/^[a-zA-Z\s\u0900-\u097F]+$/.test(nameVal) || nameVal.length < 2) {
    alert('कृपया नाम में केवल अक्षर (Letters) दर्ज करें।');
    nameInput.focus();
    return false;
  }

  // Validate phone (10 digits starting with 6-9)
  const phoneVal = phoneInput.value.trim();
  if (!/^[6-9][0-9]{9}$/.test(phoneVal)) {
    alert('कृपया 6 से 9 से शुरू होने वाला 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।');
    phoneInput.focus();
    return false;
  }

  // Show loading state (original functionality)
  submitBtn.disabled = true;
  if (spinner) spinner.style.display = 'inline-block';
  if (loadingDiv) loadingDiv.style.display = 'block';

  // Animate dots
  let dots = 1;
  if (dotAnim) {
    dotInterval = setInterval(() => {
      dots = (dots % 3) + 1;
      dotAnim.textContent = '.'.repeat(dots);
    }, 400);
  }

  // Simulate server processing (1.2 seconds)
  setTimeout(() => {
    clearInterval(dotInterval);
    submitBtn.disabled = false;
    if (spinner) spinner.style.display = 'none';
    if (loadingDiv) loadingDiv.style.display = 'none';

    // Update modal
    const randId = 'MM-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('modalCustName').textContent = nameInput.value.trim();
    document.getElementById('modalPhone').textContent = phoneVal;
    document.getElementById('modalOrderId').textContent = randId;

    // Redirect to Thank You Page
    window.location.href = 'thankyou.html';
  }, 1000);

  return false;
}

function closeOrderModal() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) modal.classList.remove('active');
}

/* ==========================================================================
   7. POLICY MODALS
   ========================================================================== */
const policyData = {
  privacy: {
    title: '🛡️ Privacy Policy',
    body: `
      <p>Mirgi Mukti आपकी personal information की सुरक्षा को सर्वोच्च प्राथमिकता देता है। जब आप order करते हैं तो हम निम्नलिखित जानकारी एकत्र कर सकते हैं:</p>
      <ul class="policy-bullets">
        <li>नाम, मोबाइल नंबर और delivery address</li>
        <li>Payment details (encrypted और secure)</li>
        <li>Order history और purchase records</li>
      </ul>
      <div class="policy-highlight-box">
        <p>आपकी जानकारी किसी third-party को नहीं बेची जाती। इसका उपयोग केवल order processing, customer support और delivery जैसे आवश्यक उद्देश्यों के लिए किया जाता है।</p>
      </div>
      <p>हम उचित security measures का उपयोग करके आपकी जानकारी को सुरक्षित रखने का प्रयास करते हैं।</p>
    `
  },
  terms: {
    title: '📄 Terms & Conditions',
    body: `
      <span class="policy-badge-pill">Please read carefully</span>
      <p>Mirgi Mukti का उपयोग करके आप निम्नलिखित terms से सहमत होते हैं:</p>
      <ul class="policy-bullets">
        <li>Product results व्यक्ति-दर-व्यक्ति अलग हो सकते हैं।</li>
        <li>Product को medical treatment या medical advice का substitute नहीं माना जाना चाहिए।</li>
        <li>18 वर्ष से कम आयु के व्यक्ति guardian consent के बिना order न करें।</li>
        <li>Fake या fraudulent orders के विरुद्ध आवश्यक कार्रवाई की जा सकती है।</li>
        <li>Product images केवल representation के लिए हैं।</li>
      </ul>
      <div class="policy-highlight-box">
        <p>Mirgi Mukti को prices, offers और website terms में आवश्यकतानुसार बदलाव करने का अधिकार है।</p>
      </div>
    `
  },
  shipping: {
    title: '🚚 Shipping Policy',
    body: `
      <span class="policy-badge-pill">Free Delivery All India</span>
      <p>हम पूरे India में shipping उपलब्ध कराने का प्रयास करते हैं। Delivery location और courier service के अनुसार delivery time अलग हो सकता है।</p>
      <ul class="policy-bullets">
        <li>Metro cities: लगभग 3–5 business days</li>
        <li>Tier-2 / Tier-3 cities: लगभग 5–7 business days</li>
        <li>Remote / rural areas: लगभग 7–10 business days</li>
      </ul>
      <div class="policy-highlight-box">
        <p>Order dispatch होने के बाद उपलब्ध होने पर tracking information SMS/WhatsApp के माध्यम से साझा की जा सकती है।</p>
      </div>
      <ul class="policy-bullets">
        <li>Delivery attempt courier partner की policy के अनुसार होगा।</li>
        <li>Incorrect या incomplete address के कारण delivery failure होने पर customer से संपर्क किया जा सकता है।</li>
      </ul>
    `
  },
  cancellation: {
    title: '🔄 Cancellation Policy',
    body: `
      <span class="policy-badge-pill">Easy Cancellation</span>
      <p>आप order dispatch होने से पहले cancellation request कर सकते हैं।</p>
      <ul class="policy-bullets">
        <li>Order dispatch होने के बाद cancellation उपलब्ध न हो सकती है।</li>
        <li>Damaged या wrong product मिलने पर customer support से निर्धारित समय के भीतर संपर्क करें।</li>
        <li>Used products return eligibility के अधीन होंगे।</li>
        <li>Refund applicable होने पर processing time payment provider और banking system पर निर्भर करेगा।</li>
      </ul>
      <div class="policy-highlight-box">
        <p>Return या replacement request के लिए order details और product की condition की जानकारी देना आवश्यक हो सकता है।</p>
      </div>
    `
  },
  legal: {
    title: '⚠️ Legal Disclaimer',
    body: `
      <span class="policy-badge-pill">Important Notice</span>
      <p>Product के संबंध में निम्नलिखित बातें ध्यान में रखें:</p>
      <ul class="policy-bullets">
        <li>Product किसी बीमारी का diagnosis, treatment, cure या prevention करने का दावा नहीं करता।</li>
        <li>Results individual to individual अलग हो सकते हैं।</li>
        <li>Product का उपयोग medical advice का substitute नहीं है।</li>
        <li>किसी existing medical condition में उपयोग करने से पहले qualified healthcare professional से सलाह लें।</li>
        <li>Pregnant या nursing women तथा chronic condition वाले व्यक्ति healthcare professional से consult करें।</li>
      </ul>
      <div class="policy-highlight-box">
        <p>Website पर दिए गए product descriptions, images और testimonials केवल informational/illustrative purposes के लिए हो सकते हैं।</p>
      </div>
      <p>किसी भी medical concern के लिए qualified doctor या healthcare professional से उचित सलाह लें।</p>
    `
  },
  disclaimer: {
    title: '⚠️ Legal Disclaimer',
    body: `
      <span class="policy-badge-pill">Important Notice</span>
      <p>Product के संबंध में निम्नलिखित बातें ध्यान में रखें:</p>
      <ul class="policy-bullets">
        <li>Product किसी बीमारी का diagnosis, treatment, cure या prevention करने का दावा नहीं करता।</li>
        <li>Results individual to individual अलग हो सकते हैं।</li>
        <li>Product का उपयोग medical advice का substitute नहीं है।</li>
        <li>किसी existing medical condition में उपयोग करने से पहले qualified healthcare professional से सलाह लें।</li>
        <li>Pregnant या nursing women तथा chronic condition वाले व्यक्ति healthcare professional से consult करें।</li>
      </ul>
      <div class="policy-highlight-box">
        <p>Website पर दिए गए product descriptions, images और testimonials केवल informational/illustrative purposes के लिए हो सकते हैं।</p>
      </div>
      <p>किसी भी medical concern के लिए qualified doctor या healthcare professional से उचित सलाह लें।</p>
    `
  }
};

function openPolicyModal(type) {
  const modal = document.getElementById('policyModal');
  const title = document.getElementById('policyModalTitle');
  const body = document.getElementById('policyModalBody');

  if (policyData[type]) {
    title.textContent = policyData[type].title;
    body.innerHTML = policyData[type].body;
    modal.classList.add('active');
  }
}

function closePolicyModal() {
  const modal = document.getElementById('policyModal');
  if (modal) modal.classList.remove('active');
}

// Close modals when clicking on background overlay
window.addEventListener('click', (e) => {
  const orderModal = document.getElementById('orderSuccessModal');
  const policyModal = document.getElementById('policyModal');

  if (e.target === orderModal) {
    orderModal.classList.remove('active');
  }
  if (e.target === policyModal) {
    policyModal.classList.remove('active');
  }
});
