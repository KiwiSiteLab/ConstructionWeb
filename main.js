import { projects } from './portfolio-data.js';
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

const filterButtons = [...document.querySelectorAll('[data-filter]')];
function filterProjects(category) {
  filterButtons.forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  let visible = 0;
  document.querySelectorAll('.portfolio-album').forEach(album => {
    album.hidden = category !== 'all' && album.dataset.category !== category;
    if (!album.hidden) visible++;
  });
  const count = projects.filter(photo => category === 'all' || photo.category === category).length;
  document.querySelector('#portfolio-status').textContent = `${visible} ${visible === 1 ? 'gallery' : 'galleries'} · ${count} photographs`;
  document.querySelector('#renovation-comparison').hidden = category !== 'all' && category !== 'recladding';
}
filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
document.querySelectorAll('[data-select-category]').forEach(link => link.addEventListener('click', () => filterProjects(link.dataset.selectCategory)));

const comparisonTabs = [...document.querySelectorAll('.comparison-tabs [role="tab"]')];
function selectComparison(selected, focus = false) {
  comparisonTabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) selected.focus();
}
comparisonTabs.forEach((tab,index) => {
  tab.addEventListener('click', () => selectComparison(tab));
  tab.addEventListener('keydown', event => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step && !['Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? comparisonTabs.length - 1 : (index + step + comparisonTabs.length) % comparisonTabs.length;
    selectComparison(comparisonTabs[next], true);
  });
});

const gallery = document.querySelector('#gallery');
let albumPhotos = projects;
let activeProject = 0;
let galleryTrigger;
const clarityButton = document.createElement('button');
clarityButton.className = 'gallery-clarity';
clarityButton.hidden = true;
clarityButton.type = 'button';
document.querySelector('#gallery-original').after(clarityButton);
clarityButton.addEventListener('click', () => {
  const photo = albumPhotos[activeProject];
  const enhanced = clarityButton.getAttribute('aria-pressed') !== 'true';
  document.querySelector('#gallery-image').src = `./images/${enhanced ? photo.enhancedFile : photo.file}`;
  clarityButton.setAttribute('aria-pressed', String(enhanced));
  clarityButton.textContent = enhanced ? 'Return to original view' : 'View clarity enhancement';
  document.querySelector('#gallery-caption').textContent = photo.caption + (enhanced ? ' · AI-assisted clarity view. Refer to the original for site details.' : ' · Company-supplied site photograph.');
});
function renderProject(index) {
  activeProject = (index + albumPhotos.length) % albumPhotos.length;
  const project = albumPhotos[activeProject];
  const image = document.querySelector('#gallery-image');
  image.src = `./images/${project.file}`;
  image.alt = project.alt;
  image.width = project.width;
  image.height = project.height;
  document.querySelector('#gallery-title').textContent = project.title;
  document.querySelector('#gallery-caption').textContent = project.caption + (project.enhanced ? ' · Lightly enhanced for clarity; original available below.' : ' · Company-supplied site photograph.');
  document.querySelector('#gallery-count').textContent = `${activeProject + 1} / ${albumPhotos.length}`;
  document.querySelector('#gallery-original').href = './' + encodeURI(project.source);
  clarityButton.hidden = !project.enhancedFile;
  clarityButton.setAttribute('aria-pressed', 'false');
  clarityButton.textContent = 'View clarity enhancement';
  document.querySelectorAll('.gallery-thumb').forEach((button,index) => {
    button.setAttribute('aria-pressed', String(index === activeProject));
  });
}
document.querySelectorAll('[data-photo]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof gallery.showModal !== 'function') return;
  event.preventDefault();
  galleryTrigger = link;
  const selected = projects.find(photo => photo.id === link.dataset.photo);
  albumPhotos = projects.filter(photo => photo.category === selected.category);
  const thumbnails = document.querySelector('#gallery-thumbnails');
  thumbnails.replaceChildren(...albumPhotos.map((photo,index) => {
    const button = document.createElement('button');
    button.className = 'gallery-thumb';
    button.setAttribute('aria-label', `View ${photo.caption}`);
    const image = document.createElement('img');
    image.src = `./images/${photo.thumb}`;
    image.alt = '';
    image.width = photo.width;
    image.height = photo.height;
    button.append(image);
    button.addEventListener('click', () => renderProject(index));
    return button;
  }));
  renderProject(albumPhotos.indexOf(selected));
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
