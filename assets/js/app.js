/**
 * NS TOURS - Interactive Web Application Logic (Clean & Robust)
 * Features:
 * - Live Multi-Currency Conversion (USD, EUR, GBP, AUD, LKR)
 * - Interactive Transport Fare Calculator
 * - Tour Packages Filter & Dynamic Cards
 * - Rich Itinerary Modal with Timeline
 * - One-Click Pre-populated WhatsApp Booking
 * - FAQ Accordions & Mobile Navigation
 */

const WHATSAPP_PHONE = '94770000000'; // Default phone placeholder

// Currency conversion rates relative to 1 USD
const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  CHF: { symbol: 'Fr', rate: 0.80, label: 'CHF (Fr)' },
  AUD: { symbol: 'A$', rate: 1.52, label: 'AUD (A$)' },
  LKR: { symbol: 'Rs.', rate: 305, label: 'LKR (Rs)' }
};

let currentCurrency = 'EUR'; // Main market is Europe

// Base distances and sedan rates in USD
const ROUTE_DATA = {
  'CMB Airport_Mirissa': { km: 175, time: '2h 15m', usd: 85 },
  'CMB Airport_Galle': { km: 155, time: '1h 55m', usd: 75 },
  'CMB Airport_Bentota': { km: 105, time: '1h 30m', usd: 55 },
  'CMB Airport_Colombo': { km: 35, time: '35m', usd: 28 },
  'CMB Airport_Kandy': { km: 115, time: '3h 00m', usd: 65 },
  'CMB Airport_Sigiriya': { km: 148, time: '3h 30m', usd: 80 },
  'CMB Airport_Ella': { km: 210, time: '4h 30m', usd: 115 },
  'CMB Airport_Yala': { km: 245, time: '4h 00m', usd: 125 },
  'Colombo_Galle': { km: 125, time: '1h 40m', usd: 65 },
  'Galle_Ella': { km: 170, time: '3h 30m', usd: 90 },
  'Kandy_Ella': { km: 135, time: '3h 45m', usd: 75 },
  'Kandy_Sigiriya': { km: 90, time: '2h 15m', usd: 55 }
};

const VEHICLE_RATES = {
  sedan: { label: 'Sedan (1-3 Pax)', factor: 1.0 },
  van: { label: 'KDH Luxury Van (4-8 Pax)', factor: 1.35 },
  suv: { label: 'Premium SUV (1-4 Pax)', factor: 1.50 },
  coach: { label: 'Mini Coach (9-18 Pax)', factor: 2.10 }
};

// Tour Packages Database
const TOURS = [
  {
    id: 'galle-day',
    category: '1day',
    tag: '1-Day Excursion',
    featured: true,
    title: 'Galle Dutch Fort, Turtle Sanctuary & Madu River Safari',
    duration: '1 Day (10-12 Hours)',
    badge: '1-Day Tour',
    image: 'assets/images/galle.jpg',
    basePriceUSD: 65,
    description: 'Explore the UNESCO colonial citadel of Galle, touch baby turtles at Kosgoda conservation project, and take a scenic mangrove boat safari through Madu River.',
    inclusions: ['Private AC Vehicle', 'Fuel & Highway Tolls', 'English Chauffeur Guide', 'Bottled Mineral Water'],
    itinerary: [
      { time: '06:30 AM', title: 'Hotel Pickup', desc: 'Pick up from Colombo, Negombo, or Airport in a luxury air-conditioned vehicle.' },
      { time: '08:30 AM', title: 'Madu River Mangrove Boat Safari', desc: 'Cruise through 64 islands, visit cinnamon processing island, and experience natural fish therapy.' },
      { time: '11:00 AM', title: 'Sea Turtle Conservation Project', desc: 'Learn about protected sea turtle nesting grounds and release hatchlings into the ocean.' },
      { time: '12:30 PM', title: 'Authentic Seafood / Rice & Curry Lunch', desc: 'Enjoy fresh coastal dining along the oceanfront with ocean breeze.' },
      { time: '02:00 PM', title: 'Galle Dutch Fort UNESCO Exploration', desc: 'Guided walk through ramparts, iconic lighthouse, historic clocktower, and charming boutique alleys.' },
      { time: '05:30 PM', title: 'Stilt Fishermen of Koggala & Sunset', desc: 'Witness Sri Lanka traditional stilt fishing at golden hour before comfortable return drive.' }
    ]
  },
  {
    id: 'sigiriya-day',
    category: '1day',
    tag: '1-Day Excursion',
    featured: true,
    title: 'Sigiriya Lion Rock & Dambulla Golden Cave Temple',
    duration: '1 Day (12-14 Hours)',
    badge: '1-Day Tour',
    image: 'assets/images/sigiriya.jpg',
    basePriceUSD: 78,
    description: 'Conquer the 5th-century palace in the sky at Sigiriya and marvel at 150+ ancient Buddha statues inside the sacred Dambulla cave complex.',
    inclusions: ['Private AC Vehicle', 'Expressway Tolls', 'English Chauffeur', 'Village Experience', 'Bottled Water'],
    itinerary: [
      { time: '06:00 AM', title: 'Departure', desc: 'Early pickup for scenic drive towards the central Cultural Triangle.' },
      { time: '09:30 AM', title: 'Sigiriya Rock Fortress Summit', desc: 'Ascend the 1,200 steps past the Mirror Wall and world-famous Sigiriya frescoes to the royal summit.' },
      { time: '01:00 PM', title: 'Traditional Hiriwadunna Village Lunch', desc: 'Authentic Sri Lankan curries cooked in clay pots over wood fires, with a bullock cart & catamaran ride.' },
      { time: '03:30 PM', title: 'Dambulla Golden Cave Temple', desc: 'Visit 5 spectacular cave shrines filled with centuries-old Buddhist murals and gold statues.' },
      { time: '06:00 PM', title: 'Relaxing Return Transfer', desc: 'Comfortable drop-off back at your hotel in Colombo, Negombo, or Kandy.' }
    ]
  },
  {
    id: 'safari-day',
    category: 'safari',
    tag: 'Wildlife & Nature',
    featured: true,
    title: 'Udawalawe Wild Elephant Safari & Transit Home',
    duration: '1 Day (10-12 Hours)',
    badge: 'Safari & Ocean',
    image: 'assets/images/safari.jpg',
    basePriceUSD: 85,
    description: 'Guaranteed wild elephant sightings in open grassland savannah with a private 4x4 open safari jeep and elephant milk-feeding visit.',
    inclusions: ['Private 4x4 Safari Jeep', 'Park Guide/Tracker', 'AC Chauffeur Transfer', 'Cold Drinks & Water'],
    itinerary: [
      { time: '05:30 AM', title: 'South Coast or Colombo Pickup', desc: 'Pickup from Mirissa, Galle, Bentota, or Colombo.' },
      { time: '09:00 AM', title: 'Elephant Transit Home (ETH)', desc: 'Witness orphaned baby elephant calves being bottle-fed by wildlife rangers before rehabilitation.' },
      { time: '10:30 AM', title: 'Private 4x4 Open Safari Game Drive', desc: 'Track massive herds of wild Asian elephants, water buffaloes, spotted deer, crocodiles, and exotic birds.' },
      { time: '02:00 PM', title: 'Tropical Lunch at Lakeview Rest', desc: 'Savor traditional cuisine overlooking the tranquil reservoir.' },
      { time: '04:00 PM', title: 'Return Journey', desc: 'Smooth return transport to your coastal hotel or airport.' }
    ]
  },
  {
    id: 'mirissa-ocean',
    category: 'safari',
    tag: 'Marine Adventure',
    featured: false,
    title: 'Mirissa Blue Whale Cruise & Turtle Snorkeling',
    duration: '1 Day (8-10 Hours)',
    badge: 'Ocean & Marine',
    image: 'assets/images/ocean.jpg',
    basePriceUSD: 70,
    description: 'Cruise the deep blue Indian Ocean to encounter the largest mammal on earth, followed by snorkeling alongside wild sea turtles in Polhena reef.',
    inclusions: ['Luxury Boat Cruise', 'Coast Guard Approved Life Vests', 'Snorkeling Gear', 'Breakfast Onboard'],
    itinerary: [
      { time: '05:45 AM', title: 'Mirissa Harbor Check-in', desc: 'Board the passenger vessel equipped with safety gear and navigation radar.' },
      { time: '06:30 AM', title: 'Sunrise Blue Whale & Dolphin Watching', desc: 'Sail into international whale migration corridors to spot Blue Whales, Bryde whales, and spinner dolphins.' },
      { time: '11:00 AM', title: 'Polhena Sanctuary Turtle Snorkeling', desc: 'Swim in calm lagoon waters with green sea turtles in their natural coral habitat.' },
      { time: '01:30 PM', title: 'Coconut Tree Hill & Beach Lunch', desc: 'Capture the famous curved palm cliff photos and enjoy fresh beachfront refreshments.' }
    ]
  },
  {
    id: 'ella-2day',
    category: '2day',
    tag: '2-Day Escape',
    featured: true,
    title: 'Ella Scenic Train, Little Adam’s Peak & Tea Country',
    duration: '2 Days / 1 Night',
    badge: '2-Day Escapes',
    image: 'assets/images/hero.jpg',
    basePriceUSD: 160,
    description: 'Board the legendary highland blue train across misty viaducts, visit Little Adam’s Peak, witness Nine Arches Bridge, and tour tea factories.',
    inclusions: ['2 Days Dedicated Chauffeur', 'Scenic Train Reserved Tickets', 'All Expressway/Fuel Fees', 'Tea Factory Tasting'],
    itinerary: [
      { time: 'Day 1 - Morning', title: 'Drive to Hill Country via Ramboda Falls', desc: 'Scenic ascent past rolling emerald hills, lush waterfalls, and misty mountain passes.' },
      { time: 'Day 1 - Afternoon', title: 'Nuwara Eliya "Little England" & Tea Estate', desc: 'Walk through colonial architecture, Gregory Lake, and tour an active Ceylon tea factory.' },
      { time: 'Day 1 - Evening', title: 'Scenic Train to Ella', desc: 'Ride the world’s most scenic railway over mountain ridges and tunnels into Ella mountain village.' },
      { time: 'Day 2 - Sunrise', title: 'Nine Arches Bridge & Morning Train', desc: 'Watch the historic train cross the dramatic stone bridge amid lush greenery.' },
      { time: 'Day 2 - Midday', title: 'Hike to Little Adam’s Peak & Ravana Falls', desc: 'Panoramic 360-degree vistas across Ella Gap and cascading Ravana waterfall before return.' }
    ]
  },
  {
    id: 'culture-2day',
    category: '2day',
    tag: '2-Day Escape',
    featured: false,
    title: 'Cultural Triangle & Minneriya Safari 2-Day Tour',
    duration: '2 Days / 1 Night',
    badge: '2-Day Escapes',
    image: 'assets/images/sigiriya.jpg',
    basePriceUSD: 175,
    description: 'Discover the ancient royal kingdoms of Sigiriya, Polonnaruwa, Dambulla cave temple, and an afternoon safari with hundreds of wild elephants.',
    inclusions: ['Private Luxury AC Van/Car', 'Minneriya 4x4 Safari Jeep', 'Licensed Chauffeur Guide', 'Complimentary Water & Wi-Fi'],
    itinerary: [
      { time: 'Day 1 - 07:00 AM', title: 'Colombo/Airport to Dambulla & Sigiriya', desc: 'Visit Dambulla cave murals followed by sunset climb of Pidurangala or Sigiriya Rock.' },
      { time: 'Day 1 - Evening', title: 'Night Stay in Sigiriya Eco Lodge', desc: 'Relax in lush forest surroundings with traditional dinner.' },
      { time: 'Day 2 - 08:30 AM', title: 'Polonnaruwa Ancient Royal Ruins', desc: 'Explore the 12th-century stone palaces and the gigantic Gal Vihara carved rock statues.' },
      { time: 'Day 2 - 02:30 PM', title: 'Minneriya Elephant Gathering Safari', desc: 'Watch large herds of up to 200 elephants congregate around the ancient reservoir.' },
      { time: 'Day 2 - 06:30 PM', title: 'Comfortable Return Transfer', desc: 'Private transfer back to your destination of choice.' }
    ]
  },
  {
    id: 'multiday-5day',
    category: 'multiday',
    tag: 'Signature Expedition',
    featured: true,
    title: '5-Day Classic Ceylon: Heritage, Tea Hills & Safari',
    duration: '5 Days / 4 Nights',
    badge: 'Multi-Day',
    image: 'assets/images/hero.jpg',
    basePriceUSD: 360,
    description: 'The definitive Sri Lanka journey covering Sigiriya rock fortress, Kandy Temple of the Tooth, Nuwara Eliya tea country, Ella blue train, and Yala safari.',
    inclusions: ['5 Days Dedicated Private Chauffeur', 'Unlimited Mileage in AC Vehicle', 'All Fuel, Parking & Highway Tolls', 'Chauffeur Accommodation & Meals'],
    itinerary: [
      { time: 'Day 1', title: 'Airport CMB / Negombo to Sigiriya & Dambulla', desc: 'Welcome at CMB airport, scenic highway transfer, and Dambulla Cave Temple visit.' },
      { time: 'Day 2', title: 'Sigiriya Rock Summit & Kandy Royal Capital', desc: 'Climb Sigiriya fortress, spice garden visit, and evening Kandy Temple of the Sacred Tooth Relic.' },
      { time: 'Day 3', title: 'Kandy to Nuwara Eliya Tea Estates & Waterfalls', desc: 'Royal Botanical Gardens Peradeniya, tea picking experience, and misty colonial high plains.' },
      { time: 'Day 4', title: 'Iconic Ella Blue Train & Nine Arches Bridge', desc: 'Highland train journey, Little Adam’s Peak trek, and transfer down to Yala Safari borders.' },
      { time: 'Day 5', title: 'Yala Leopard Safari & South Coast Drop-off', desc: 'Dawn 4x4 safari in Yala National Park, coastal drive via Mirissa/Galle or return to CMB Airport.' }
    ]
  },
  {
    id: 'multiday-7day',
    category: 'multiday',
    tag: 'Signature Expedition',
    featured: false,
    title: '7-Day Complete Island Grandeur: Rainforest to Reef',
    duration: '7 Days / 6 Nights',
    badge: 'Multi-Day',
    image: 'assets/images/ocean.jpg',
    basePriceUSD: 490,
    description: 'An immersive grand tour: UNESCO cultural triangle, tea country, train journey, wildlife safari, and relaxing tropical beach stay in Mirissa/Bentota.',
    inclusions: ['7 Days Full Vehicle & Chauffeur Service', 'English-speaking Tour Guide', 'All Vehicle Insurance & Tolls', '24/7 WhatsApp Hotline Support'],
    itinerary: [
      { time: 'Day 1', title: 'Arrival CMB -> Negombo Beach & Lagoon', desc: 'Airport greeting and leisure afternoon by the beach.' },
      { time: 'Day 2', title: 'Negombo -> Sigiriya Rock & Village Safari', desc: 'Climb the iconic fortress and experience village lifestyle.' },
      { time: 'Day 3', title: 'Sigiriya -> Kandy Temple of the Tooth', desc: 'Cultural dances, ancient sacred temple, and city walk.' },
      { time: 'Day 4', title: 'Kandy -> Nuwara Eliya & Tea Highlands', desc: 'Visit tea factories, waterfalls, and golf green vistas.' },
      { time: 'Day 5', title: 'Nuwara Eliya -> Ella Scenic Train & Hikes', desc: 'Scenic railway ride, Nine Arch Bridge, and mountain cafes.' },
      { time: 'Day 6', title: 'Ella -> Yala Safari & Mirissa Coast', desc: 'Wildlife safari game drive and transfer to golden ocean shores.' },
      { time: 'Day 7', title: 'Mirissa Whale Watching, Galle Fort -> CMB Airport', desc: 'Ocean cruise, historic Galle Fort walk, and highway transfer to departure flight.' }
    ]
  }
];

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initCurrency();
  initBookingTabs();
  initTransportCalculator();
  renderTourCards('all');
  initTourFilters();
  initToursMegaMenu();
  initFaqAccordion();
  initMobileMenu();
  initHeaderScroll();
  initHeroVideo();
  initScrollAnimations();
  initGallery();
  initGallerySlider();
  initVehicleCards();
  initPlannerForm();
  updateRouteTablePrices();
  updateVehicleCardPrices();
});

/* ==========================================================================
   CURRENCY CONVERSION SYSTEM
   ========================================================================== */
function initCurrency() {
  // Header selector (desktop) and mobile-menu selector stay in sync
  const selectors = ['currencySelector', 'currencySelectorMobile']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  selectors.forEach(selector => {
    selector.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      selectors.forEach(other => { other.value = currentCurrency; });
      updateAllPrices();
    });
  });
}

function formatPrice(amountUSD) {
  const curr = CURRENCIES[currentCurrency] || CURRENCIES.USD;
  const converted = Math.round(amountUSD * curr.rate);
  return `${curr.symbol} ${converted.toLocaleString()}`;
}

function updateAllPrices() {
  renderTourCards(getActiveFilter());
  calculateFare();
  updateRouteTablePrices();
  updateVehicleCardPrices();
  renderToursMegaMenu();
}

function updateVehicleCardPrices() {
  document.querySelectorAll('.vehicle-price[data-price-usd]').forEach(el => {
    el.textContent = formatPrice(Number(el.dataset.priceUsd));
  });
}

/* ==========================================================================
   BOOKING TABS
   ========================================================================== */
function initBookingTabs() {
  const tabs = document.querySelectorAll('.booking-tab-item, .booking-tab-btn');
  const panels = document.querySelectorAll('.booking-pane, .booking-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.tab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ==========================================================================
   TRANSPORT CALCULATOR
   ========================================================================== */
function initTransportCalculator() {
  const pickupEl = document.getElementById('calcPickup');
  const dropoffEl = document.getElementById('calcDropoff');
  const vehicleEl = document.getElementById('calcVehicle');
  const dateEl = document.getElementById('calcDate');
  const timeEl = document.getElementById('calcTime');
  const paxEl = document.getElementById('calcPax');
  const bookBtn = document.getElementById('btnBookTransport');

  if (pickupEl) pickupEl.addEventListener('change', calculateFare);
  if (dropoffEl) dropoffEl.addEventListener('change', calculateFare);
  if (vehicleEl) vehicleEl.addEventListener('change', calculateFare);

  if (dateEl) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateEl.value = tomorrow.toISOString().split('T')[0];
  }

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const pickup = pickupEl ? pickupEl.options[pickupEl.selectedIndex].text : '';
      const dropoff = dropoffEl ? dropoffEl.options[dropoffEl.selectedIndex].text : '';
      const vehicle = vehicleEl ? vehicleEl.options[vehicleEl.selectedIndex].text : '';
      const date = dateEl ? dateEl.value : '';
      const time = timeEl ? timeEl.value : '';
      const pax = paxEl ? paxEl.value : '2';
      const quotePrice = document.getElementById('calcQuotePrice').textContent;

      const message = `Hello NS TOURS!\n\nI would like to book a private transfer:\n\n*Pickup:* ${pickup}\n*Drop-off:* ${dropoff}\n*Vehicle:* ${vehicle}\n*Date:* ${date} at ${time || 'Flexible'}\n*Passengers:* ${pax}\n*Estimated Rate:* ${quotePrice}\n\nPlease confirm availability and driver details. Thank you!`;

      openWhatsApp(message);
    });
  }

  calculateFare();
}

function calculateFare() {
  const pickupEl = document.getElementById('calcPickup');
  const dropoffEl = document.getElementById('calcDropoff');
  const vehicleEl = document.getElementById('calcVehicle');
  const priceDisplay = document.getElementById('calcQuotePrice');
  const routeMeta = document.getElementById('calcRouteMeta');

  if (!pickupEl || !dropoffEl || !priceDisplay) return;

  const pVal = pickupEl.value;
  const dVal = dropoffEl.value;
  const vVal = vehicleEl ? vehicleEl.value : 'sedan';

  const routeKey1 = `${pVal}_${dVal}`;
  const routeKey2 = `${dVal}_${pVal}`;
  const route = ROUTE_DATA[routeKey1] || ROUTE_DATA[routeKey2];

  let baseUsd = 70;
  let kmText = 'Est. 120 km';
  let timeText = 'Approx 2h 00m';

  if (pVal === dVal) {
    priceDisplay.textContent = formatPrice(25);
    if (routeMeta) routeMeta.textContent = 'Local transfer / within city limits';
    return;
  }

  if (route) {
    baseUsd = route.usd;
    kmText = `${route.km} km`;
    timeText = route.time;
  } else {
    baseUsd = 90;
  }

  const factor = (VEHICLE_RATES[vVal] && VEHICLE_RATES[vVal].factor) || 1.0;
  const totalUsd = Math.round(baseUsd * factor);

  priceDisplay.textContent = formatPrice(totalUsd);
  if (routeMeta) {
    routeMeta.textContent = `${kmText} • ${timeText} • Highway Tolls & Fuel Included`;
  }
}

/* ==========================================================================
   POPULAR ROUTES TABLE
   ========================================================================== */
function updateRouteTablePrices() {
  const rows = document.querySelectorAll('.route-row');
  rows.forEach(row => {
    const usd = parseFloat(row.dataset.usd);
    const priceCell = row.querySelector('.route-price-tag');
    if (usd && priceCell) {
      priceCell.textContent = formatPrice(usd);
    }
  });
}

/* ==========================================================================
   TOUR CARDS & FILTERING
   ========================================================================== */
/* ==========================================================================
   TOURS MEGA MENU (header dropdown)
   ========================================================================== */
function renderToursMegaMenu() {
  const dayList = document.getElementById('megaDayTours');
  const multiList = document.getElementById('megaMultiTours');
  if (!dayList || !multiList) return;

  const item = (tour) => `
    <li>
      <button type="button" class="tours-mega-item" data-tour-id="${tour.id}">
        <span class="mega-item-text">
          <span class="mega-item-title">${tour.title}</span>
          <span class="mega-item-meta">${tour.duration}</span>
        </span>
        <span class="mega-item-price">${formatPrice(tour.basePriceUSD)}</span>
      </button>
    </li>`;

  const isMultiDay = (t) => t.category === '2day' || t.category === 'multiday';
  dayList.innerHTML = TOURS.filter(t => !isMultiDay(t)).map(item).join('');
  multiList.innerHTML = TOURS.filter(isMultiDay).map(item).join('');
}

function initToursMegaMenu() {
  const mega = document.getElementById('toursMega');
  if (!mega) return;

  renderToursMegaMenu();

  mega.addEventListener('click', (e) => {
    // Tour row: open its details popup
    const tourBtn = e.target.closest('.tours-mega-item');
    if (tourBtn) {
      openTourModal(tourBtn.dataset.tourId);
      tourBtn.blur();
      return;
    }

    // Quick filter link: apply the matching filter on the tours section
    const filterLink = e.target.closest('[data-menu-filter]');
    if (filterLink) {
      const pill = document.querySelector(`.filter-pill-btn[data-filter="${filterLink.dataset.menuFilter}"]`);
      if (pill) pill.click();
      filterLink.blur();
    }
  });
}

function getActiveFilter() {
  const activeBtn = document.querySelector('.filter-pill-btn.active, .filter-btn.active');
  return activeBtn ? activeBtn.dataset.filter : 'all';
}

function initTourFilters() {
  const buttons = document.querySelectorAll('.filter-pill-btn, .filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTourCards(btn.dataset.filter);
    });
  });
}

function renderTourCards(filter = 'all') {
  const grid = document.getElementById('toursGrid');
  if (!grid) return;

  const filtered = filter === 'all' 
    ? TOURS 
    : TOURS.filter(t => t.category === filter);

  grid.innerHTML = filtered.map(tour => {
    return `
      <article class="package-card" data-category="${tour.category}">
        <img src="${tour.image}" alt="${tour.title}" class="package-img" loading="lazy">
        <div class="package-shade"></div>
        <div class="package-duration-pill">
          <span>⏱️ ${tour.duration}</span>
        </div>
        ${tour.featured ? '<div class="package-badge-top">Top Pick</div>' : ''}

        <div class="package-body">
          <span class="package-tag">${tour.tag}</span>
          <h3 class="package-title">${tour.title}</h3>
          <div class="package-price-row">
            <span class="price-sub">From</span>
            <span class="price-num">${formatPrice(tour.basePriceUSD)}</span>
            <span class="price-sub">/ person</span>
          </div>

          <div class="package-reveal">
            <div class="package-reveal-inner">
              <p class="package-summary">${tour.description}</p>
              <div class="package-features">
                ${tour.inclusions.map(inc => `<span class="feature-tag">✓ ${inc}</span>`).join('')}
              </div>
              <div class="package-actions">
                <button class="btn-card-details" onclick="openTourModal('${tour.id}')">View Details</button>
                <button class="btn-card-wa" onclick="bookTourWhatsApp('${tour.id}')">
                  <span><svg class="wa-icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg> Book</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('') + CUSTOM_TOUR_CARD;
}

// Always-last card that invites visitors to build their own itinerary
const CUSTOM_TOUR_CARD = `
  <article class="package-card custom-tour-card">
    <div class="custom-tour-inner">
      <span class="custom-tour-icon">🧭</span>
      <span class="package-tag">Tailor-Made</span>
      <h3 class="custom-tour-title">Design Your Own Sri Lanka Journey</h3>
      <p class="custom-tour-text">
        Can't find the perfect trip? Tell us your dates, interests and travel style, and we'll plan a private day-by-day itinerary just for you.
      </p>
      <ul class="custom-tour-points">
        <li>✓ Any length, from 1 day to 3 weeks</li>
        <li>✓ Private vehicle &amp; English-speaking chauffeur</li>
        <li>✓ Free itinerary within 2 hours</li>
      </ul>
      <div class="custom-tour-actions">
        <a href="#planner" class="btn-book-cta">Plan My Trip →</a>
        <button class="btn-card-wa" onclick="openWhatsApp('Hello NS TOURS!\\n\\nI would like a custom Sri Lanka itinerary. Could you help me plan my trip?')">
          <span><svg class="wa-icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg> Ask on WhatsApp</span>
        </button>
      </div>
    </div>
  </article>
`;

/* ==========================================================================
   ITINERARY MODAL
   ========================================================================== */
function openTourModal(tourId) {
  const tour = TOURS.find(t => t.id === tourId);
  if (!tour) return;

  const modal = document.getElementById('tourModal');
  const modalImg = document.getElementById('modalBannerImg');
  const modalTitle = document.getElementById('modalTourTitle');
  const modalCategory = document.getElementById('modalTourCategory');
  const modalDuration = document.getElementById('modalTourDuration');
  const modalPrice = document.getElementById('modalTourPrice');
  const modalTimeline = document.getElementById('modalTimeline');
  const modalInclusions = document.getElementById('modalInclusions');
  const modalBookBtn = document.getElementById('modalBookBtn');

  if (modalImg) modalImg.src = tour.image;
  if (modalTitle) modalTitle.textContent = tour.title;
  if (modalCategory) modalCategory.textContent = tour.tag;
  if (modalDuration) modalDuration.textContent = `⏱️ ${tour.duration}`;
  if (modalPrice) modalPrice.textContent = `${formatPrice(tour.basePriceUSD)} (All-inclusive)`;

  if (modalTimeline) {
    modalTimeline.innerHTML = tour.itinerary.map(step => `
      <div class="timeline-row">
        <span class="timeline-time-badge">${step.time}</span>
        <h4 class="timeline-title-text">${step.title}</h4>
        <p class="timeline-desc-text">${step.desc}</p>
      </div>
    `).join('');
  }

  if (modalInclusions) {
    modalInclusions.innerHTML = tour.inclusions.map(inc => `
      <span class="feature-tag">✓ ${inc}</span>
    `).join('');
  }

  if (modalBookBtn) {
    modalBookBtn.onclick = () => bookTourWhatsApp(tour.id);
  }

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeTourModal() {
  const modal = document.getElementById('tourModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

/* ==========================================================================
   WHATSAPP INTEGRATION
   ========================================================================== */
function bookTourWhatsApp(tourId) {
  const tour = TOURS.find(t => t.id === tourId);
  if (!tour) return;

  const price = formatPrice(tour.basePriceUSD);
  const message = `Hello NS TOURS!\n\nI would like to book this tour package:\n\n*Tour:* ${tour.title}\n*Duration:* ${tour.duration}\n*Price:* From ${price} / person\n\nPlease let me know availability and pickup options. Thank you!`;

  openWhatsApp(message);
}

function initVehicleCards() {
  document.querySelectorAll('.vehicle-box').forEach(card => {
    const book = () => {
      const title = card.querySelector('.vehicle-title')?.textContent.trim() || 'Private Vehicle';
      const model = card.querySelector('.vehicle-sub')?.textContent.trim() || '';
      const route = card.querySelector('.vehicle-fare-footer span')?.textContent.trim() || '';
      const rate = card.querySelector('.vehicle-fare-footer strong')?.textContent.trim() || '';
      const message = `Hello NS TOURS!\n\nI would like to book this vehicle:\n\n*Vehicle:* ${title} (${model})\n*Example Route:* ${route}\n*Rate:* ${rate}\n\nPlease share availability and a quote for my trip. Thank you!`;
      openWhatsApp(message);
    };

    card.addEventListener('click', book);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        book();
      }
    });
  });
}

function openWhatsApp(customText) {
  const encoded = encodeURIComponent(customText);
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encoded}`;
  window.open(url, '_blank');
}

/* ==========================================================================
   CUSTOM PLANNER FORM
   ========================================================================== */
function initPlannerForm() {
  const plannerBtn = document.getElementById('btnSubmitCustomPlan');
  if (!plannerBtn) return;

  plannerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('planName') ? document.getElementById('planName').value : 'Traveler';
    const days = document.getElementById('planDays') ? document.getElementById('planDays').value : '5 Days';
    const vibes = document.getElementById('planVibe') ? document.getElementById('planVibe').value : 'Wildlife & Heritage';
    const guests = document.getElementById('planGuests') ? document.getElementById('planGuests').value : '2 Adults';
    const notes = document.getElementById('planNotes') ? document.getElementById('planNotes').value : 'No special requests';

    const msg = `Hello NS TOURS!\n\nI want to design a *Custom Sri Lanka Tour*:\n\n*Name:* ${name}\n*Duration:* ${days}\n*Preferred Style:* ${vibes}\n*Travelers:* ${guests}\n*Special Interests:* ${notes}\n\nPlease share a recommended custom itinerary and private chauffeur quote. Thank you!`;

    openWhatsApp(msg);
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const cards = document.querySelectorAll('.faq-card, .faq-item');
  cards.forEach(card => {
    const btn = card.querySelector('.faq-q-btn, .faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('active');
        cards.forEach(c => c.classList.remove('active'));
        if (!isOpen) {
          card.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('navMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.textContent = menu.classList.contains('open') ? '✕' : '☰';
      updateHeaderState();
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.textContent = '☰';
        updateHeaderState();
      });
    });
  }
}

/* ==========================================================================
   SCROLL ANIMATIONS
   Elements fade/slide in as they enter the viewport. Classes are added here
   (not in the HTML) so content stays visible if JavaScript fails to load.
   ========================================================================== */
const REVEAL_GROUPS = [
  // [selector, direction, stagger siblings]
  ['.section-head', 'up', false],
  ['.about-media', 'left', false],
  ['.about-content', 'right', false],
  ['.guarantee-item', 'up', true],
  ['.filter-tabs-row', 'up', false],
  ['.booking-card', 'zoom', false],
  ['.fleet-box', 'up', false],
  ['.vehicle-box', 'up', true],
  ['.routes-card-table', 'up', false],
  ['.planner-wrapper', 'up', false],
  ['.review-item', 'up', true],
  ['.faq-card', 'up', true],
  ['.gallery-item', 'up', true],
  ['.gallery-slider', 'up', false],
  ['.gallery-cta', 'up', false],
];

function initScrollAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  REVEAL_GROUPS.forEach(([selector, direction, stagger]) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
      if (direction !== 'up') el.dataset.reveal = direction;
      if (stagger && el.parentElement) {
        const index = Array.from(el.parentElement.children).indexOf(el);
        el.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 0.1}s`);
      }
      observer.observe(el);
    });
  });

  initStatCounters();
}

// Count the About stats up from 0 (e.g. "12,000+") when they scroll into view
function initStatCounters() {
  const stats = document.querySelectorAll('.about-stat strong');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el = entry.target;
      const match = el.textContent.trim().match(/^([\d,]+)(.*)$/);
      if (!match) return;

      const target = parseInt(match[1].replace(/,/g, ''), 10);
      const suffix = match[2];
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  stats.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   GALLERY + LIGHTBOX
   ========================================================================== */
function initGallery() {
  // Any element with data-gallery (home slider or gallery page grid)
  const items = Array.from(document.querySelectorAll('[data-gallery]'));
  const lightbox = document.getElementById('lightbox');
  const media = document.getElementById('lightboxMedia');
  const caption = document.getElementById('lightboxCaption');
  if (!items.length || !lightbox || !media) return;

  let current = 0;
  let lastFocused = null;

  // Video tiles preview on hover (desktop)
  items.filter(item => item.dataset.type === 'video').forEach(item => {
    const video = item.querySelector('video');
    item.addEventListener('mouseenter', () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    });
    item.addEventListener('mouseleave', () => video.pause());
  });

  const show = (index) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    const text = item.querySelector('figcaption')?.textContent || '';

    if (item.dataset.type === 'video') {
      media.innerHTML = `<video src="${item.dataset.src}" autoplay muted loop playsinline controls></video>`;
    } else {
      media.innerHTML = `<img src="${item.dataset.src}" alt="${text}">`;
    }
    caption.textContent = `${text}  ·  ${current + 1} / ${items.length}`;
  };

  const open = (index) => {
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  };

  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    media.innerHTML = '';
    if (lastFocused) lastFocused.focus();
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));

  // Click on the dark backdrop closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Swipe left / right on touch screens
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}

// Home page gallery slider: arrows, swipe, autoplay, focus effect and progress dots
const SLIDER_INTERVAL = 2500;

function initGallerySlider() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const slider = track.closest('.gallery-slider');
  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  const prev = slider.querySelector('.slider-prev');
  const next = slider.querySelector('.slider-next');
  slider.style.setProperty('--slider-interval', `${SLIDER_INTERVAL}ms`);

  // Progress dots, one per slide
  const dots = document.createElement('div');
  dots.className = 'slider-dots';
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
    dot.addEventListener('click', () => {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dots.appendChild(dot);
  });
  slider.after(dots);

  // Focus effect: fully visible slides are "in view"; the first one drives the dots
  const visible = new Set();
  const updateDots = () => {
    const first = slides.findIndex(sl => visible.has(sl));
    Array.from(dots.children).forEach((dot, i) => dot.classList.toggle('active', i === first));
  };

  const focusObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const inView = entry.intersectionRatio >= 0.6;
      entry.target.classList.toggle('in-view', inView);
      if (inView) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    updateDots();
  }, { root: track, threshold: [0, 0.6, 1] });
  slides.forEach(sl => focusObserver.observe(sl));

  const step = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return slides[0] ? slides[0].offsetWidth + gap : track.clientWidth;
  };

  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

  const goNext = () => {
    if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });
    else track.scrollBy({ left: step(), behavior: 'smooth' });
  };

  const goPrev = () => {
    if (track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: -step(), behavior: 'smooth' });
  };

  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);

  // Autoplay (skipped for reduced motion), paused on hover/touch and when off-screen
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let timer = null;
  let inViewport = false;
  const start = () => {
    if (timer || !inViewport) return;
    timer = setInterval(goNext, SLIDER_INTERVAL);
    dots.classList.add('is-playing');
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
    dots.classList.remove('is-playing');
  };

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  track.addEventListener('touchstart', stop, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) start();
      else stop();
    }, { threshold: 0.4 }).observe(slider);
  }
}

/* ==========================================================================
   HERO BACKGROUND VIDEO PLAYLIST
   Two stacked <video> elements: one plays while the other preloads the next
   clip, then they crossfade shortly before the current clip ends.
   ========================================================================== */
function initHeroVideo() {
  const wrap = document.querySelector('.hero-video-wrap');
  if (!wrap) return;

  // Respect users who prefer less motion: keep the static hero image
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const clips = (wrap.dataset.videos || '').split(',').map(c => c.trim()).filter(Boolean);
  const players = Array.from(wrap.querySelectorAll('.hero-video'));
  if (!clips.length || players.length < 2) return;

  const FADE_SECONDS = 1.2;
  let clipIndex = 0;
  let activePlayer = 0;
  let switching = false;

  const play = (video) => {
    video.muted = true;
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  };

  const preloadNext = () => {
    const nextPlayer = players[1 - activePlayer];
    nextPlayer.src = clips[(clipIndex + 1) % clips.length];
    nextPlayer.load();
  };

  const switchClip = () => {
    if (switching) return;
    switching = true;

    const current = players[activePlayer];
    const next = players[1 - activePlayer];

    next.currentTime = 0;
    play(next);
    next.classList.add('is-active');
    current.classList.remove('is-active');

    setTimeout(() => {
      current.pause();
      activePlayer = 1 - activePlayer;
      clipIndex = (clipIndex + 1) % clips.length;
      switching = false;
      preloadNext();
    }, FADE_SECONDS * 1000);
  };

  players.forEach((video, i) => {
    video.addEventListener('timeupdate', () => {
      if (i !== activePlayer || !video.duration) return;
      if (video.duration - video.currentTime <= FADE_SECONDS) switchClip();
    });
    // Safety net in case timeupdate fires too late on a slow device
    video.addEventListener('ended', () => {
      if (i === activePlayer) switchClip();
    });
  });

  players[0].src = clips[0];
  play(players[0]);
  preloadNext();

  // Pause while the hero is off-screen to save battery and CPU
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const current = players[activePlayer];
      if (entry.isIntersecting) play(current);
      else current.pause();
    }).observe(wrap);
  }
}

/* ==========================================================================
   HEADER: TRANSPARENT OVER HERO, SOLID ON SCROLL
   ========================================================================== */
function updateHeaderState() {
  const header = document.querySelector('.main-header');
  const menu = document.getElementById('navMenu');
  if (!header) return;

  const menuOpen = menu && menu.classList.contains('open');
  header.classList.toggle('is-transparent', window.scrollY < 20 && !menuOpen);

  // Floating WhatsApp button appears once the visitor scrolls past most of the hero
  const waFloat = document.querySelector('.wa-float-btn');
  if (waFloat) waFloat.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
}

function initHeaderScroll() {
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}
