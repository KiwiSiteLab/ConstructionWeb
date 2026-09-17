const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu({ restoreFocus = false } = {}) {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = expanded;
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) closeMenu({ restoreFocus: true });
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header') && !mobileNav.hidden) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

// Only enhance below-fold sections: content stays available if JavaScript is unavailable.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-waiting');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('is-waiting');
      observer.observe(element);
    }
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('.is-waiting').forEach(element => element.classList.remove('is-waiting'));
      observer.disconnect();
    }
  });
}

const services = [...document.querySelectorAll('.service-item')];
const serviceImage = document.querySelector('#service-image');
services.forEach(service => service.addEventListener('toggle', () => {
  if (!service.open) return;
  services.forEach(other => { if (other !== service) other.open = false; });
  serviceImage.src = `./images/${service.dataset.image}`;
  serviceImage.alt = service.dataset.alt;
}));

const reviewTrack = document.querySelector('#reviews-track');
const reviewGroupCopy = reviewTrack.firstElementChild.cloneNode(true);
reviewGroupCopy.setAttribute('aria-hidden', 'true');
reviewGroupCopy.inert = true;
reviewTrack.append(reviewGroupCopy);
const pauseButton = document.querySelector('#pause-reviews');
function syncReviewControl(paused) {
  reviewTrack.classList.toggle('is-paused', paused);
  pauseButton.setAttribute('aria-pressed', String(paused));
  pauseButton.querySelector('.pause-label').textContent = paused ? 'Play stories' : 'Pause stories';
  pauseButton.querySelector('.pause-symbol').textContent = paused ? '▷' : 'Ⅱ';
}
syncReviewControl(reducedMotion.matches);
pauseButton.addEventListener('click', () => {
  const paused = !reviewTrack.classList.contains('is-paused');
  // An explicit Play action can opt into this animation without changing system settings.
  if (!paused && reducedMotion.matches) reviewTrack.classList.add('motion-opt-in');
  syncReviewControl(paused);
});
reducedMotion.addEventListener('change', event => {
  reviewTrack.classList.remove('motion-opt-in');
  if (event.matches) syncReviewControl(true);
});

const projects = [
  { file: 'woodland-house.jpg', title: 'Timber & light', alt: 'Contemporary timber and charcoal house set among trees' },
  { file: 'kitchen.jpg', title: 'Space to come together', alt: 'Contemporary white and timber kitchen with a large island' },
  { file: 'deck.jpg', title: 'A little closer to nature', alt: 'Wooden deck opening onto a leafy backyard' },
  { file: 'timber-facade.jpg', title: 'A fresh first impression', alt: 'Modern exterior with timber fencing, a wooden gate and stone cladding' },
];
const gallery = document.querySelector('#gallery');
let activeProject = 0;
let galleryTrigger;
function renderProject(index) {
  activeProject = (index + projects.length) % projects.length;
  const project = projects[activeProject];
  const image = document.querySelector('#gallery-image');
  image.src = `./images/${project.file}`;
  image.alt = project.alt;
  document.querySelector('#gallery-title').textContent = project.title;
  document.querySelector('#gallery-count').textContent = `${activeProject + 1} / ${projects.length}`;
}
document.querySelectorAll('[data-project]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof gallery.showModal !== 'function') return;
  event.preventDefault();
  galleryTrigger = link;
  renderProject(Number(link.dataset.project));
  gallery.showModal();
  document.body.classList.add('modal-open');
  gallery.querySelector('.gallery-close').focus();
}));
gallery.querySelector('.gallery-close').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  galleryTrigger?.focus({ preventScroll: true });
});
gallery.addEventListener('click', event => {
  if (event.target !== gallery) return;
  const bounds = gallery.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) gallery.close();
});
document.querySelector('#gallery-prev').addEventListener('click', () => renderProject(activeProject - 1));
document.querySelector('#gallery-next').addEventListener('click', () => renderProject(activeProject + 1));
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); renderProject(activeProject + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); renderProject(activeProject - 1); }
});
document.querySelector('#year').textContent = new Date().getFullYear();
