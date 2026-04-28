// Declare a global variable for the map instance
  let leafMap = null;

  // Existing scroll event for navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Stats counter animation
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = +el.dataset.target;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  // Trigger counters on viewport
  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.4 });
    statsObserver.observe(statsStrip);
  }

  // FAQ toggle
  function toggleFAQ(btn) {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  }

  // Load Leaflet CSS & JS dynamically and initialize map
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('leaflet-map')) return;

    // Load CSS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel  = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    // Load JS
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.head.appendChild(leafletJS);

    leafletJS.onload = () => {
      // Initialize map and assign to global variable
      leafMap = L.map('leaflet-map', {
        center: [29.9, 31.2],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '\u00a9 OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(leafMap);

      // Custom icon maker
      function makeIcon(color) {
        return L.divIcon({
          className: '',
          html: `<div style="
            width:14px;height:14px;
            border-radius:50%;
            background:${color};
            border:2px solid rgba(255,255,255,0.6);
            box-shadow:0 0 0 4px ${color}44;
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
      }

      // Branch data
      const branches = [
        { name: 'Heliopolis Blood Center', lat: 30.0917, lng: 31.3356, status: 'busy', addr: '89 El-Merghany St, Heliopolis' },
        { name: 'Maadi Medical Center',    lat: 29.9602, lng: 31.2569, status: 'open',     addr: 'Road 9, Maadi, Cairo' },
        { name: 'Alexandria Blood Bank',   lat: 31.2001, lng: 29.9187, status: 'open',     addr: 'Corniche Rd, Alexandria' },
        { name: 'Giza Regional Center',    lat: 30.0561, lng: 31.2132, status: 'critical', addr: 'Dokki, Giza' },
        { name: 'Luxor Donation Hub',      lat: 25.6872, lng: 32.6396, status: 'open',     addr: 'East Luxor, Luxor' },
      ];

      const colorMap = { open: '#4ade80', busy: '#fbbf24', critical: '#f87171' };

      window._mapMarkers = {};
      branches.forEach(b => {
        const marker = L.marker([b.lat, b.lng], { icon: makeIcon(colorMap[b.status]) })
          .addTo(leafMap)
          .bindPopup(`<b>${b.name}</b>${b.addr}`);
        window._mapMarkers[`${b.lat},${b.lng}`] = marker;
      });
    };
  });

  // Fix for map flyTo
  function selectLoc(card, lat, lng) {
    // Remove active class from all
    document.querySelectorAll('.loc-card').forEach(c => c.classList.remove('active'));
    // Add to selected
    card.classList.add('active');

    // Fly map if initialized
    if (leafMap) {
      leafMap.flyTo([lat, lng], 13, { duration: 1 });
    }
  }

  // Filter branches
  let currentFilter = 'all';

  function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.loc-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters(document.querySelector('.loc-search')?.value || '');
  }

  function filterBranches(query) {
    applyFilters(query);
  }

  function applyFilters(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.loc-card').forEach(card => {
      const name   = card.querySelector('.loc-name').textContent.toLowerCase();
      const addr   = card.querySelector('.loc-detail-row').textContent.toLowerCase();
      const status = card.dataset.status;

      const matchQuery  = name.includes(q) || addr.includes(q);
      const matchFilter = currentFilter === 'all' || status === currentFilter;

      card.style.display = (matchQuery && matchFilter) ? '' : 'none';
    });
  }

  // Scroll animations
  const fadeEls = document.querySelectorAll(
    '.type-card, .loc-card, .faq-item, .stat-item, .section-header'
  );

  fadeEls.forEach(el => el.classList.add('fade-up'));

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));