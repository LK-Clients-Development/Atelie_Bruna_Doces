/**
 * /produtos no cliente: busca, filtro por categoria e entrada dos cards.
 *
 * Tudo age sobre o HTML já renderizado no build (`li[data-search]` com o texto normalizado):
 * sem JS a galeria inteira aparece e as categorias são âncoras comuns. Só a normalização da busca
 * vem de src/lib/search.ts; os dados do portfólio NÃO entram neste bundle.
 */
import { matchesTerms, searchTerms } from '../lib/search';

const root = document.querySelector<HTMLElement>('.products-page');

if (root) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const wrap = root.querySelector<HTMLElement>('[data-search-wrap]');
  const form = root.querySelector<HTMLFormElement>('[data-search-form]');
  const input = root.querySelector<HTMLInputElement>('[data-search-input]');
  const status = root.querySelector<HTMLElement>('[data-results]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-reset]');
  const items = [...root.querySelectorAll<HTMLElement>('li[data-search]')];
  const groups = [...root.querySelectorAll<HTMLElement>('[data-group]')];
  const list = root.querySelector<HTMLElement>('[data-rail]');
  const railLinks = [...root.querySelectorAll<HTMLAnchorElement>('[data-rail-link]')];

  let category = 'all';
  let query = '';

  const centerRailItem = (key: string) => {
    const active = railLinks.find((link) => link.dataset.railLink === key);
    if (active && list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2, behavior: reduced.matches ? 'auto' : 'smooth' });
    }
  };

  // ----- entrada dos cards: um observador só, transição CSS (sem GSAP por card) -----
  const reveal = (card: Element) => card.classList.add('is-in');
  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io?.unobserve(entry.target);
          reveal(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    groups.forEach((group) => {
      group.querySelectorAll<HTMLElement>('.pcard').forEach((card, index) => {
        card.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
        io!.observe(card);
      });
    });
  } else {
    root.querySelectorAll('.pcard').forEach(reveal);
  }

  // ----- filtro (categoria + busca) -----
  const apply = () => {
    const terms = searchTerms(query);
    const searching = terms.length > 0;
    let visible = 0;
    items.forEach((item) => {
      const group = item.closest<HTMLElement>('[data-group]');
      const inCategory = category === 'all' || group?.id === category;
      const match = inCategory && matchesTerms(item.dataset.search ?? '', terms);
      item.hidden = !match;
      if (match) {
        visible += 1;
        const card = item.querySelector<HTMLElement>('.pcard');
        card?.classList.add('is-in'); // resultado nunca fica invisível
        card?.style.removeProperty('transition-delay');
      }
    });
    groups.forEach((group) => {
      group.hidden = !group.querySelector('li:not([hidden])');
    });
    railLinks.forEach((link) => {
      if (link.dataset.railLink === category) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    root.toggleAttribute('data-searching', searching);
    const filtered = searching || category !== 'all';
    if (empty) empty.hidden = !(filtered && visible === 0);
    if (status) {
      status.hidden = !filtered || visible === 0;
      const label = visible === 1 ? 'criação' : 'criações';
      const catName = category !== 'all' ? root.querySelector(`#${CSS.escape(category)} .pgroup__title`)?.textContent : null;
      status.textContent = searching
        ? `Resultados para “${query.trim()}”${catName ? ` em ${catName}` : ''}: ${visible} ${label}`
        : catName
          ? `${catName}: ${visible} ${label}`
          : '';
    }
  };

  const clearAll = () => {
    if (input) input.value = '';
    query = '';
    category = 'all';
    apply();
    centerRailItem('all');
  };

  if (wrap && form && input) {
    wrap.hidden = false; // sem JS a busca nem aparece
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      query = input.value;
      apply();
      root.querySelector('.pcatalog__body')?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    });
    input.addEventListener('input', () => {
      query = input.value;
      apply();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && input.value) {
        input.value = '';
        query = '';
        apply();
      }
    });
  }

  resetBtn?.addEventListener('click', () => {
    clearAll();
    input?.focus({ preventScroll: true });
  });

  // categorias = filtro (o visitante explora um portfólio); "Todos" remove o filtro
  railLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      category = link.dataset.railLink ?? 'all';
      apply();
      centerRailItem(category);
      root.querySelector('#catalogo')?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
}
