/****************************************************
 * YATRI.IN – FRONTEND CORE SCRIPT
 * Author: You
 * Purpose: AI Travel Recommendation + Itinerary
 * Features:
 *  - Multi-language support
 *  - Budget-aware recommendations
 *  - Day-wise itinerary
 *  - Toggleable budget breakdown
 *  - REAL hotel discovery links (no DB)
 ****************************************************/

/* ===============================
   DOM REFERENCES
================================ */
const form = document.getElementById("travelForm");
const resultDiv = document.getElementById("result");
const langSelector = document.getElementById("langSelector");

/* ===============================
   GLOBAL STATE
================================ */
let selectedPlace = "";
let currentBudget = "mid";
let lastItineraryData = null;


  //  HOTEL PRICE LOGIC

const HOTEL_PRICE_RANGE = {
  budget: { min: 500, max: 2000 },
  mid: { min: 2000, max: 4500 },
  luxury: { min: 4500, max: 15000 }
};


/* ===============================
   TRANSLATION DICTIONARY
================================ */
const translations = {
  eng: {
    titleIncredible: "Incredible",
    titleBharat: "Bharat.",
    tagline: "Authentic Indian Journeys. Brewed with Code.",
    plannerTitle: "Travel Configurator",
    labelBudget: "Budget Range",
    labelInterest: "Interest",
    labelType: "Travel Type",
    labelSeason: "Season",
    submitText: "Get Recommendations",
    welcomeTitle: "Ready for Adventure?",
    welcomeMsg: "Fill in the parameters above to generate your customized Indian itinerary.",
    footerText: "Atithi Devo Bhava 🙏 | Made with ❤️ for Bharat",
    wait: "Analyzing Indian Landscapes...",
    noResult: "No destinations found. Try different preferences.",
    aiTitle: "AI Curated Journey",
    backendError: "Backend Connection Failed",
    planTrip: "Click to plan your trip",
    askDays: "How many days do you want to stay?",
    askMembers: "How many members are travelling?",
    askAges: "Enter ages (comma separated)",
    itineraryTitle: "Your Itinerary for",
    seeBudget: "See Day-wise Budget Breakdown",
    hideBudget: "Hide Budget Breakdown",
    hotelsTitle: "Hotels for Your Budget",
    hotelNote: "These are live hotel options based on your selected budget."
  },

  hi: {
    titleIncredible: "अद्भुत",
    titleBharat: "भारत",
    tagline: "प्रामाणिक भारतीय यात्राएँ। कोड से निर्मित।",
    plannerTitle: "यात्रा विन्यास",
    labelBudget: "बजट",
    labelInterest: "रुचि",
    labelType: "यात्रा का प्रकार",
    labelSeason: "मौसम",
    submitText: "खोज प्रारंभ करें",
    welcomeTitle: "क्या आप तैयार हैं?",
    welcomeMsg: "अपनी पसंद भरें और अपनी यात्रा योजना प्राप्त करें।",
    footerText: "अतिथि देवो भवः 🙏 | भारत के लिए ❤️ से बनाया गया",
    wait: "भारतीय स्थलों का विश्लेषण किया जा रहा है...",
    noResult: "कोई स्थान नहीं मिला।",
    aiTitle: "एआई द्वारा चुनी गई यात्रा",
    backendError: "बैकएंड से कनेक्शन नहीं हो पाया",
    planTrip: "यात्रा योजना बनाने के लिए क्लिक करें",
    askDays: "कितने दिन रुकेंगे?",
    askMembers: "कितने लोग यात्रा कर रहे हैं?",
    askAges: "उम्र लिखें (कॉमा से अलग करें)",
    itineraryTitle: "आपकी यात्रा योजना:",
    seeBudget: "दिन-वार बजट देखें",
    hideBudget: "बजट छुपाएँ",
    hotelsTitle: "आपके बजट के होटल",
    hotelNote: "यह लाइव होटल विकल्प हैं"
  },

  mr: {
    titleIncredible: "अद्भुत",
    titleBharat: "भारत",
    tagline: "खऱ्या भारतीय प्रवासाचा अनुभव. कोडने तयार केलेला.",
    plannerTitle: "प्रवास नियोजक",
    labelBudget: "बजेट",
    labelInterest: "आवड",
    labelType: "प्रवास प्रकार",
    labelSeason: "हंगाम",
    submitText: "शिफारसी मिळवा",
    welcomeTitle: "प्रवासासाठी तयार आहात?",
    welcomeMsg: "तुमच्या पसंती भरा आणि प्रवास योजना मिळवा.",
    footerText: "अतिथी देवो भव 🙏 | भारतासाठी ❤️ ने बनवलेले",
    wait: "भारतीय स्थळांचे विश्लेषण सुरू आहे...",
    noResult: "कोणतीही ठिकाणे सापडली नाहीत.",
    aiTitle: "एआयने निवडलेला प्रवास",
    backendError: "बॅकएंड कनेक्शन अयशस्वी",
    planTrip: "प्रवास नियोजनासाठी क्लिक करा",
    askDays: "किती दिवस थांबणार?",
    askMembers: "किती लोक प्रवास करत आहेत?",
    askAges: "वय टाका (कॉमा ने वेगळे)",
    itineraryTitle: "तुमची प्रवास योजना:",
    seeBudget: "बजेट तपशील पहा",
    hideBudget: "बजेट लपवा",
    hotelsTitle: "बजेटनुसार हॉटेल्स",
    hotelNote: "हे रिअल-टाइम हॉटेल पर्याय आहेत"
  },

  gu: {
    titleIncredible: "અદ્ભુત",
    titleBharat: "ભારત",
    tagline: "ખરા ભારતીય પ્રવાસો. કોડથી તૈયાર.",
    plannerTitle: "પ્રવાસ આયોજન",
    labelBudget: "બજેટ",
    labelInterest: "રુચિ",
    labelType: "પ્રવાસ પ્રકાર",
    labelSeason: "ઋતુ",
    submitText: "ભલામણ મેળવો",
    welcomeTitle: "પ્રવાસ માટે તૈયાર?",
    welcomeMsg: "તમારી પસંદગીઓ ભરો અને પ્રવાસ યોજના મેળવો.",
    footerText: "અતિથિ દેવો ભવ 🙏 | ભારત માટે ❤️ સાથે બનાવેલ",
    wait: "ભારતીય સ્થળોનું વિશ્લેષણ ચાલી રહ્યું છે...",
    noResult: "કોઈ સ્થળ મળ્યું નથી.",
    aiTitle: "એઆઈ દ્વારા પસંદ કરાયેલ પ્રવાસ",
    backendError: "બેકએન્ડ જોડાણ નિષ્ફળ",
    planTrip: "પ્રવાસ યોજના માટે ક્લિક કરો",
    askDays: "કેટલા દિવસ રોકાશો?",
    askMembers: "કેટલા લોકો જઈ રહ્યા છે?",
    askAges: "ઉંમર લખો (કોમા દ્વારા)",
    itineraryTitle: "તમારી પ્રવાસ યોજના:",
    seeBudget: "બજેટ જુઓ",
    hideBudget: "બજેટ છુપાવો",
    hotelsTitle: "તમારા બજેટ માટે હોટેલ્સ",
    hotelNote: "લાઈવ હોટેલ વિકલ્પો"
  },

  pa: {
    titleIncredible: "ਅਦਭੁੱਤ",
    titleBharat: "ਭਾਰਤ",
    tagline: "ਅਸਲੀ ਭਾਰਤੀ ਯਾਤਰਾ। ਕੋਡ ਨਾਲ ਤਿਆਰ।",
    plannerTitle: "ਯਾਤਰਾ ਯੋਜਨਾ",
    labelBudget: "ਬਜਟ",
    labelInterest: "ਰੁਚੀ",
    labelType: "ਯਾਤਰਾ ਕਿਸਮ",
    labelSeason: "ਮੌਸਮ",
    submitText: "ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
    welcomeTitle: "ਯਾਤਰਾ ਲਈ ਤਿਆਰ ਹੋ?",
    welcomeMsg: "ਆਪਣੀਆਂ ਪਸੰਦਾਂ ਭਰੋ ਅਤੇ ਯਾਤਰਾ ਯੋਜਨਾ ਬਣਾਓ।",
    footerText: "ਅਤਿਥੀ ਦੇਵੋ ਭਵ 🙏 | ਭਾਰਤ ਲਈ ❤️ ਨਾਲ ਬਣਾਇਆ",
    wait: "ਭਾਰਤੀ ਥਾਵਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
    noResult: "ਕੋਈ ਥਾਂ ਨਹੀਂ ਮਿਲੀ।",
    aiTitle: "ਏਆਈ ਦੁਆਰਾ ਚੁਣੀ ਯਾਤਰਾ",
    backendError: "ਬੈਕਐਂਡ ਕਨੈਕਸ਼ਨ ਫੇਲ੍ਹ",
    planTrip: "ਯਾਤਰਾ ਯੋਜਨਾ ਲਈ ਕਲਿੱਕ ਕਰੋ",
    askDays: "ਕਿੰਨੇ ਦਿਨ ਰਹੋਗੇ?",
    askMembers: "ਕਿੰਨੇ ਲੋਕ ਜਾ ਰਹੇ ਹਨ?",
    askAges: "ਉਮਰ ਦਰਜ ਕਰੋ (ਕਾਮਾ ਨਾਲ)",
    itineraryTitle: "ਤੁਹਾਡੀ ਯਾਤਰਾ ਯੋਜਨਾ:",
    seeBudget: "ਬਜਟ ਵੇਖੋ",
    hideBudget: "ਬਜਟ ਲੁਕਾਓ",
    hotelsTitle: "ਤੁਹਾਡੇ ਬਜਟ ਦੇ ਹੋਟਲ",
    hotelNote: "ਇਹ ਲਾਈਵ ਹੋਟਲ ਲਿੰਕ ਹਨ"
  }
};

/* ===============================
   LANGUAGE APPLY
================================ */
function applyLanguage(lang) {
  const t = translations[lang] || translations.eng;
  Object.keys(t).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.textContent = t[key];
  });
}

if (langSelector) {
  langSelector.addEventListener("change", e => applyLanguage(e.target.value));
}
applyLanguage("eng");

/* ===============================
   FORM SUBMIT – RECOMMENDATIONS
================================ */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const lang = langSelector.value || "eng";
  const t = translations[lang];

  currentBudget = document.getElementById("budget").value;

  const userData = {
    budget: currentBudget,
    interest: document.getElementById("interest").value,
    travel_type: document.getElementById("travel_type").value,
    season: document.getElementById("season").value
  };

  resultDiv.innerHTML = `
    <div class="welcome-card">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <h3>${t.wait}</h3>
    </div>
  `;

  try {
    const res = await fetch("http://localhost:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (!data.recommendations?.length) {
      resultDiv.innerHTML = `<div class="welcome-card"><h3>${t.noResult}</h3></div>`;
      return;
    }

    let html = `<h3>${t.aiTitle}</h3>`;

    data.recommendations.forEach(r => {
  html += `
    <div class="result-card clickable" onclick="openTripPlanner('${r.name}')">
      <h4>${r.name}
        <span class="confidence-badge">MATCH_${Math.round(r.match_percentage)}%</span>
      </h4>
      <p>${r.description}</p>

      <!-- 👇 YAHI ADD KARO -->
      <button class="action-btn secondary"
              onclick="event.stopPropagation(); showWhyAI()">
        🤖 Why AI chose this?
      </button>

      <small>👉 ${t.planTrip}</small>
    </div>
  `;
});

    resultDiv.innerHTML = html;

  } catch {
    resultDiv.innerHTML = `<div class="welcome-card"><h3>${t.backendError}</h3></div>`;
  }
});

/* ===============================
   TRIP PLANNER
================================ */
function openTripPlanner(place) {
  const t = translations[langSelector.value || "eng"];

  const days = prompt(t.askDays, "3");
  if (!days) return;

  const members = prompt(t.askMembers, "2");
  if (!members) return;

  const ages = prompt(t.askAges, "25,30");
  if (!ages) return;

  generateItinerary(place, days, members, ages);
}

/* ===============================
   ITINERARY API
================================ */
async function generateItinerary(place, days, members, ages) {
  const t = translations[langSelector.value || "eng"];

  resultDiv.innerHTML = "<p>🧳 Generating itinerary...</p>";

  const res = await fetch("http://localhost:5000/itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ place, days, members, ages, budget: currentBudget })
  });

  const data = await res.json();
  lastItineraryData = data;
  const totalTripCost = data.itinerary.reduce(
  (sum, day) => sum + day.budget.total,
  0
);

  let itineraryHTML = `
  <h3>${t.itineraryTitle} ${place}</h3>

  <div class="result-card highlight">
    <h4>📊 Estimated Total Trip Cost</h4>
    <p style="font-size:1.2rem; font-weight:800;">
      ₹${totalTripCost.toLocaleString("en-IN")}
    </p>
    <small>Based on ${currentBudget} budget & ${members} travellers</small>
  </div>
`;

  let budgetHTML = "";
  let hotelHTML = "";

  data.itinerary.forEach(day => {
    itineraryHTML += `
      <div class="result-card">
        <h4>Day ${day.day}</h4>
        <p>${day.plan}</p>
      </div>
    `;

    budgetHTML += `
      <div class="result-card">
        <h4>Day ${day.day} (${day.budget.day_type})</h4>
        <p>🏨 Hotel: ₹${day.budget.hotel}</p>
        <p>🍽 Food: ₹${day.budget.food}</p>
        <p>🚕 Travel: ₹${day.budget.travel}</p>
        <p>🎯 Activities: ₹${day.budget.activities}</p>
        <strong>Total: ₹${day.budget.total}</strong>
      </div>
    `;
  });

  const price = HOTEL_PRICE_RANGE[currentBudget] || HOTEL_PRICE_RANGE.mid;


 hotelHTML = `
<div class="result-card">
  <h4>🏨 ${t.hotelsTitle}</h4>
  <p>${t.hotelNote}</p>

  <div class="hotel-links">

    <a class="hotel-link" target="_blank"
       href="https://www.google.com/travel/hotels/${place}?price=${price.min}-${price.max}">
      <div>
        Google Hotels
        <span>₹${price.min} – ₹${price.max} per night</span>
      </div>
      <i class="fa-solid fa-magnifying-glass"></i>
    </a>

    <a class="hotel-link" target="_blank"
       href="https://www.booking.com/searchresults.html?ss=${place}&price_min=${price.min}&price_max=${price.max}">
      <div>
        Booking.com
        <span>Filtered by your budget</span>
      </div>
      <i class="fa-solid fa-hotel"></i>
    </a>

    <a class="hotel-link" target="_blank"
       href="https://www.makemytrip.com/hotels/${place}-hotels.html?checkin=NA&checkout=NA&locusId=CT${place}&priceBucket=${currentBudget}
">
      <div>
        MakeMyTrip
        <span>${currentBudget.toUpperCase()} stays</span>
      </div>
      <i class="fa-solid fa-plane"></i>
    </a>

  </div>
</div>
`;



  itineraryHTML += `
    <button class="action-btn" onclick="toggleBudget(this)">
  <i class="fa-solid fa-wallet"></i>
  ${t.seeBudget}
</button>

    <div id="budgetSection" style="display:none; margin-top:25px;">
      ${budgetHTML}
    </div>

    ${hotelHTML}
  `;

  resultDiv.innerHTML = itineraryHTML;
}

/* ===============================
   BUDGET TOGGLE
================================ */
function toggleBudget(btn) {
  const section = document.getElementById("budgetSection");
  const t = translations[langSelector.value || "eng"];

  if (section.style.display === "none") {
    section.style.display = "block";
    btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> ${t.hideBudget}`;
    btn.classList.add("secondary");
  } else {
    section.style.display = "none";
    btn.innerHTML = `<i class="fa-solid fa-wallet"></i> ${t.seeBudget}`;
    btn.classList.remove("secondary");
  }
}


/* ===============================
   PAGE LOAD
================================ */
window.addEventListener("load", () => {
  setTimeout(() => document.body.classList.add("loaded"), 4100);
});


function showWhyAI() {
  alert(
    "This destination was selected based on:\n" +
    "• Your budget preference\n" +
    "• Travel type compatibility\n" +
    "• Seasonal suitability\n" +
    "• Accessibility & diversity balancing\n\n" +
    "This ensures realistic & personalized travel planning."
  );
}
