/* ============================================
   EFREI - Département Informatique
   script.js — JavaScript principal
   ============================================ */
 
/* ---- Menu hamburger mobile ---- */
function initMenuMobile() {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav-principal');
  if (!btn || !nav) return;
 
  btn.addEventListener('click', function () {
    const ouvert = nav.classList.toggle('ouvert');
    btn.setAttribute('aria-expanded', ouvert);
  });
 
  // Sur mobile : clic sur un élément parent ouvre/ferme le sous-menu
  document.querySelectorAll('.nav-item > a').forEach(function (lien) {
    lien.addEventListener('click', function (e) {
      if (window.innerWidth <= 680) {
        e.preventDefault();
        const parent = lien.parentElement;
        parent.classList.toggle('ouvert-mobile');
      }
    });
  });
 
  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('ouvert');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}
 
/* ---- Lien actif dans la nav ---- */
function marquerLienActif() {
  const chemin = window.location.pathname;
  const page = chemin.split('/').pop() || 'index.html';
  const dossier = chemin.split('/').slice(-2, -1)[0];
 
  document.querySelectorAll('nav a').forEach(function (lien) {
    const href = lien.getAttribute('href');
    if (!href) return;
    // Correspondance exacte ou dossier parent
    if (href === page || href.includes(dossier + '/') || href.endsWith('/' + page)) {
      lien.classList.add('actif');
      // Marquer aussi le parent si c'est un sous-menu
      const parent = lien.closest('.nav-item');
      if (parent) {
        const parentLien = parent.querySelector(':scope > a');
        if (parentLien) parentLien.classList.add('actif');
      }
    }
  });
}
 
/* ---- Carrousel ---- */
function initCarrousel() {
  const piste  = document.getElementById('carrousel-piste');
  const points = document.querySelectorAll('.point');
  const btnP   = document.getElementById('btn-precedent');
  const btnS   = document.getElementById('btn-suivant');
  if (!piste || !points.length) return;
 
  let idx = 0;
  const total = points.length;
 
  function allerA(i) {
    idx = (i + total) % total;
    piste.style.transform = 'translateX(-' + (idx * 100) + '%)';
    points.forEach(function (p, j) { p.classList.toggle('actif', j === idx); });
  }
 
  if (btnP) btnP.addEventListener('click', function () { allerA(idx - 1); });
  if (btnS) btnS.addEventListener('click', function () { allerA(idx + 1); });
  points.forEach(function (p, i) { p.addEventListener('click', function () { allerA(i); }); });
  setInterval(function () { allerA(idx + 1); }, 5000);
}
 
/* ---- Accordéon ---- */
function initAccordeon() {
  document.querySelectorAll('.accordeon-titre').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const corps = btn.nextElementSibling;
      const estOuvert = btn.classList.contains('ouvert');
 
      document.querySelectorAll('.accordeon-titre.ouvert').forEach(function (autre) {
        autre.classList.remove('ouvert');
        const c = autre.nextElementSibling;
        c.classList.remove('ouvert');
        c.style.maxHeight = null;
      });
 
      if (!estOuvert) {
        btn.classList.add('ouvert');
        corps.classList.add('ouvert');
        corps.style.maxHeight = corps.scrollHeight + 'px';
      }
    });
  });
}
 
/* ---- Validation formulaire contact ---- */
function initFormulaire() {
  const form = document.getElementById('form-contact');
  if (!form) return;
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;
 
    document.querySelectorAll('.erreur-msg').forEach(function (m) { m.classList.remove('visible'); });
    document.querySelectorAll('.invalide').forEach(function (c) { c.classList.remove('invalide'); });
 
    const nom    = document.getElementById('nom');
    const email  = document.getElementById('email');
    const sujet  = document.getElementById('sujet');
    const msg    = document.getElementById('message');
 
    if (nom  && nom.value.trim().length < 2)      { erreur(nom, 'nom-erreur');     ok = false; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { erreur(email,'email-erreur'); ok=false; }
    if (sujet && sujet.value === '')               { erreur(sujet,'sujet-erreur'); ok = false; }
    if (msg   && msg.value.trim().length < 10)    { erreur(msg,  'msg-erreur');    ok = false; }
 
    if (ok) {
      const s = document.getElementById('success-msg');
      if (s) { s.style.display = 'block'; form.reset(); setTimeout(function(){s.style.display='none';}, 4000); }
    }
  });
}
function erreur(champ, id) {
  champ.classList.add('invalide');
  const el = document.getElementById(id);
  if (el) el.classList.add('visible');
}
 
/* ---- Compteurs animés ---- */
function initCompteurs() {
  const elems = document.querySelectorAll('.compteur');
  if (!elems.length || !window.IntersectionObserver) return;
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animerCompteur(e.target); obs.unobserve(e.target); }
    });
  }, {threshold:0.5});
  elems.forEach(function (el) { obs.observe(el); });
}
function animerCompteur(el) {
  const cible = parseInt(el.getAttribute('data-cible'), 10);
  const debut = performance.now();
  const duree = 1400;
  function step(t) {
    const p = Math.min((t - debut) / duree, 1);
    el.textContent = Math.floor(p * cible);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = cible;
  }
  requestAnimationFrame(step);
}
 
/* ---- Animations au scroll ---- */
function initScrollAnim() {
  const elems = document.querySelectorAll('.fd1,.fd2,.fd3,.fd4');
  if (!window.IntersectionObserver) return;
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('fade-in'); obs.unobserve(e.target); }
    });
  }, {threshold:0.12});
  elems.forEach(function (el) { obs.observe(el); });
}
 
/* ---- Recherche tableau enseignants ---- */
function initRecherche() {
  const champ = document.getElementById('recherche-enseignant');
  if (!champ) return;
  champ.addEventListener('input', function () {
    const t = this.value.toLowerCase();
    document.querySelectorAll('#tableau-enseignants tbody tr').forEach(function (tr) {
      tr.style.display = tr.textContent.toLowerCase().includes(t) ? '' : 'none';
    });
  });
}
 
/* ---- Init globale ---- */
document.addEventListener('DOMContentLoaded', function () {
  initMenuMobile();
  marquerLienActif();
  initCarrousel();
  initAccordeon();
  initFormulaire();
  initCompteurs();
  initScrollAnim();
  initRecherche();
});
 