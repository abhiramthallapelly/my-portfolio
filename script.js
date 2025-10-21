// Set current year
document.getElementById('curYear').textContent = new Date().getFullYear();

// Default to dark theme
const body = document.body;
const stored = localStorage.getItem('theme');
if (stored) body.setAttribute('data-theme', stored);
else body.setAttribute('data-theme', 'dark');

const themeToggle = document.getElementById('themeToggle');
function updateThemeUI(){
  const cur = body.getAttribute('data-theme');
  themeToggle.textContent = cur === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-pressed', String(cur === 'dark'));
}
updateThemeUI();

themeToggle.addEventListener('click', () => {
  const cur = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', cur);
  localStorage.setItem('theme', cur);
  updateThemeUI();
});

// Mobile nav
const navToggle = document.getElementById('navToggle');
const primaryMenu = document.getElementById('primaryMenu');
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  primaryMenu.classList.toggle('open');
});

// Smooth scroll & nav active
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
navLinks.forEach(a => a.addEventListener('click', (e) => {
  e.preventDefault();
  // close mobile menu if open
  if (primaryMenu.classList.contains('open')) {
    primaryMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
  }
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
  setActive(a);
}));

function setActive(link){
  navLinks.forEach(l=>l.classList.remove('active'));
  link.classList.add('active');
}

// Update active on scroll (throttled)
const sections = ['home','projects','skills','about','contact'].map(id => document.getElementById(id));
window.addEventListener('scroll', throttle(()=> {
  const fromTop = window.scrollY + 140;
  let current = sections[0];
  for (const sec of sections){
    if (sec.offsetTop <= fromTop) current = sec;
  }
  const activeLink = document.querySelector(`a[href="#${current.id}"]`);
  if (activeLink) setActive(activeLink);
}, 150));

function throttle(fn, wait){
  let time = Date.now();
  return function(...args){
    if ((time + wait - Date.now()) < 0){
      fn.apply(this,args);
      time = Date.now();
    }
  }
}

// Contact form handler (mailto fallback)
function handleContact(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('formMsg');

  if (!name || !email || !message) {
    status.textContent = 'Please fill all fields.';
    return false;
  }

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const mailto = `mailto:abhiramthallapelli95@gmail.com?subject=${subject}&body=${body}`;
  window.location.href = mailto;

  status.textContent = 'Opening your email app…';
  return false;
}

// Accessibility: keyboard nav
themeToggle.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') themeToggle.click(); });
navToggle.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') navToggle.click(); });
window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 't') themeToggle.click(); });
